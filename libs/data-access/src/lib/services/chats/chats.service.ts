import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
	Chat,
	groupedMessages,
	LastMessageRes,
	Message
} from '../../interfaces/chats/chats.interface'
import { map, Observable } from 'rxjs'
import { DateTime } from 'luxon'
import { ProfileService } from '../profile/profile.service'
import { ChatWsService } from '../../interfaces/chats/chat-ws-service.interface'
import { ChatWsNativeService } from './chat-ws-native.service'
import { AuthService, Profile } from '@tt/data-access'
import { ChatWSMessage } from '../../interfaces/chats/chat-ws-message.interface'
import {
	isNewMessage,
	isUnreadMessage
} from '../../interfaces/chats/type-guards'
import { ChatWsRxjsService } from './chat-ws-rxjs.service'

@Injectable({
	providedIn: 'root'
})
export class ChatsService {
	http = inject(HttpClient)
	#authService = inject(AuthService)

	me = inject(ProfileService).me

	companion = signal<Profile | undefined>(undefined)

	wsAdapter: ChatWsService = new ChatWsRxjsService()

	activeChatMessages = signal<groupedMessages[]>([])

	unreadMessages = signal<number | null>(null)

	baseApiUrl = '/yt-course/'
	chatsUrl = `${this.baseApiUrl}chat/`
	messageUrl = `${this.baseApiUrl}message/`

	connectWs() {
		return this.wsAdapter.connect({
			url: `${this.baseApiUrl}chat/ws`,
			token: this.#authService.token ?? '',
			handleMessage: this.handleWSMessage
		}) as Observable<ChatWSMessage>
	}

	handleWSMessage = (message: ChatWSMessage) => {
		if (!('action' in message)) return

		if (isUnreadMessage(message)) {
			this.unreadMessages.set(message.data.count)
		}

		if (isNewMessage(message)) {
			const me = this.me()
			const companion = this.companion()
			if (!me || !companion) return

			const newMessageDate = message.data.created_at.replace(' ', 'T')
			const lastMessageDate =
				this.activeChatMessages()[this.activeChatMessages().length - 1].date

			if (
				DateTime.fromISO(lastMessageDate).toFormat('dd.MM.yyyy').toString() ===
				DateTime.fromISO(newMessageDate).toFormat('dd.MM.yyyy').toString()
			) {
				this.activeChatMessages.set([
					...this.activeChatMessages(),
					{
						...this.activeChatMessages()[this.activeChatMessages().length - 1],
						messages: [
							...this.activeChatMessages()[this.activeChatMessages().length - 1]
								.messages,
							{
								id: message.data.id,
								userFromId: message.data.author,
								personalChatId: message.data.chat_id,
								text: message.data.message,
								createdAt: newMessageDate,
								isRead: false,
								user: message.data.author === me.id ? me : companion,
								isMine: message.data.author === me.id
							}
						]
					}

					// ...this.activeChatMessages(),
					// {
					// 	date: this.activeChatMessages()[this.activeChatMessages().length - 1].date,
					// 	messages: [
					// 		...this.activeChatMessages()[this.activeChatMessages().length - 1].messages,
					// 		{
					// 			id: message.data.id,
					// 			userFromId: message.data.author,
					// 			personalChatId: message.data.chat_id,
					// 			text: message.data.message,
					// 			createdAt: newMessageDate,
					// 			isRead: false,
					// 			user: message.data.author === me.id ? me : companion,
					// 			isMine: message.data.author === me.id
					// 		}
					// 	]
					// }

					// ...this.activeChatMessages(),
					// {...this.activeChatMessages()[this.activeChatMessages().length - 1],
					// 	messages: [
					// 		...this.activeChatMessages()[this.activeChatMessages().length - 1].messages,
					// 		{
					// 			id: message.data.id,
					// 			userFromId: message.data.author,
					// 			personalChatId: message.data.chat_id,
					// 			text: message.data.message,
					// 			createdAt: newMessageDate,
					// 			isRead: false,
					// 			user: message.data.author === me.id ? me : companion,
					// 			isMine: message.data.author === me.id
					// 		}
					// 	]
					// }
				])
			} else {
				this.activeChatMessages.set([
					...this.activeChatMessages(),
					{
						date: newMessageDate,
						messages: [
							{
								id: message.data.id,
								userFromId: message.data.author,
								personalChatId: message.data.chat_id,
								text: message.data.message,
								createdAt: newMessageDate,
								isRead: false,
								user: message.data.author === me.id ? me : companion,
								isMine: message.data.author === me.id
							}
						]
					}
				])
			}
		}
	}

	createChat(userId: number) {
		return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {})
	}

	getMyChats() {
		return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`)
	}

	getChatById(chatId: number) {
		return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
			map((chat) => {
				const patchedMessages = chat.messages.map((message) => {
					return {
						...message,
						user:
							chat.userFirst.id === message.userFromId
								? chat.userFirst
								: chat.userSecond,
						isMine: message.userFromId === this.me()!.id
					}
				})

				const groupedPatchedMessages: groupedMessages[] = []
				let messages: Message[] = []

				for (let i = 0, n = 0; i < patchedMessages.length; i++) {
					if (i === 0) {
						messages.push(patchedMessages[i])
						groupedPatchedMessages[n] = {
							date: patchedMessages[i].createdAt,
							messages: messages
						}
					} else {
						if (
							DateTime.fromISO(patchedMessages[i].createdAt)
								.toFormat('dd.MM.yyyy')
								.toString() ===
							DateTime.fromISO(patchedMessages[i - 1].createdAt)
								.toFormat('dd.MM.yyyy')
								.toString()
						) {
							messages.push(patchedMessages[i])
							groupedPatchedMessages[n] = {
								date: patchedMessages[i].createdAt,
								messages: messages
							}
						} else {
							n++
							messages = []
							messages.push(patchedMessages[i])
							groupedPatchedMessages[n] = {
								date: patchedMessages[i].createdAt,
								messages: messages
							}
						}
					}
				}

				this.activeChatMessages.set(groupedPatchedMessages)

				if (chat.userFirst.id === this.me()!.id) {
					this.companion.set(chat.userSecond)
				} else {
					this.companion.set(chat.userFirst)
				}

				return {
					...chat,
					companion:
						chat.userFirst.id === this.me()!.id
							? chat.userSecond
							: chat.userFirst,
					messages: patchedMessages
				}
			})
		)
	}

	// - старый вариант решения отправки сообщений
	sendMessage<Message>(chatId: number, message: string) {
		return this.http.post(
			`${this.messageUrl}send/${chatId}`,
			{},
			{
				params: {
					message
				}
			}
		)
	}
}

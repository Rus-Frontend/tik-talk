import {inject, Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Chat, groupedMessages, LastMessageRes, Message} from "../interfaces/chats.interface";
import {ProfileService} from "./profile.service";
import {map} from "rxjs";
import { DateTime } from "luxon";

@Injectable({
    providedIn: 'root'
})

export class ChatsService {
    http = inject(HttpClient)
    me = inject(ProfileService).me

    activeChatMessages = signal<groupedMessages[]>([])

    baseApiUrl = 'https://icherniakov.ru/yt-course/'
    chatsUrl = `${this.baseApiUrl}chat/`
    messageUrl = `${this.baseApiUrl}message/`

    createChat (userId: number) {
        return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {})
    }

    getMyChats(){
        return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`)
    }

    getChatById(chatId: number) {
        return this.http.get<Chat>(`${this.chatsUrl}${chatId}`)
            .pipe(
                map(chat => {
                    const patchedMessages = chat.messages.map(message => {
                        return {
                            ...message,
                            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
                            isMine: message.userFromId === this.me()!.id
                        }
                    })

                    const groupedPatchedMessages: groupedMessages[] = []
                    let messages: Message[] = []

                    for (let i = 0, n = 0, l = patchedMessages.length; i < l; i++) {

                        if (i === 0) {
                            messages.push(patchedMessages[i])
                            groupedPatchedMessages[n] = {date: patchedMessages[i].createdAt, messages: messages}
                        } else {
                            if (DateTime.fromISO(patchedMessages[i].createdAt).toFormat('dd.MM.yyyy').toString() === DateTime.fromISO(patchedMessages[i-1].createdAt).toFormat('dd.MM.yyyy').toString()) {
                                messages.push(patchedMessages[i])
                                groupedPatchedMessages[n] = {date: patchedMessages[i].createdAt, messages: messages}
                            } else {
                                n++
                                messages = []
                                messages.push(patchedMessages[i])
                                groupedPatchedMessages[n] = {date: patchedMessages[i].createdAt, messages: messages}
                            }
                        }
                    }

                    this.activeChatMessages.set(groupedPatchedMessages)

                    return {
                        ...chat,
                        companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
                        messages: patchedMessages
                    }
                })
            )
    }

    sendMessage<Message>(chatId:number, message: string) {
        return this.http.post(`${this.messageUrl}send/${chatId}`, {}, {
            params: {
                message
            }
        })
    }
 }
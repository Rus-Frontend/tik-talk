import { ChatWSMessage } from './chat-ws-message.interface'
import { Observable } from 'rxjs'

export interface ChatConnectionWSParams {
	url: string,
	token: string,
	handleMessage: (message: ChatWSMessage) => void
}

export interface ChatWsService {
	connect: (params: ChatConnectionWSParams) => void | Observable<ChatWSMessage>
	sendMessage: (text: string, chatId: number) => void
	disconnect: () => void
}
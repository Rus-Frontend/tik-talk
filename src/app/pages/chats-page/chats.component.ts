import {Component, ElementRef, inject, Renderer2} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ChatsListComponent} from "./chats-list/chats-list.component";
import {debounceTime, fromEvent, Subscription} from "rxjs";

@Component({
  selector: 'app-chats-page',
  imports: [
    RouterOutlet,
    ChatsListComponent
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsPageComponent {

}

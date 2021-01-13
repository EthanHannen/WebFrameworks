import { Component, OnInit } from '@angular/core';
import { UserToken } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: Message[] = [];
  newMessage: Message;

  constructor(private userService: UserService, private router: Router, private chatService: ChatService){}

  public ngOnInit() {
    let currentUser: UserToken = this.userService.GetLoggedInUser();
    this.newMessage = new Message();

    if (!currentUser)
      this.router.navigate(['/login', {errorMessage: `You must be logged in to join the chatroom`}]);
    else
    {
      this.newMessage.Username = currentUser.UserData.firstName;
      this.chatService.messageReceived.subscribe((message: Message) => {
        this.messages.push(message);
      })
    }
  }

  public sendMessage()
  {
    this.chatService.SendMessage(this.newMessage);
  }
}
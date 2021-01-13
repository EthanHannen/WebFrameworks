import { EventEmitter, Injectable } from '@angular/core';  
import * as signalR from '@aspnet/signalr';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';  
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';  
  
@Injectable({
  providedIn: "root"
})

export class ChatService {

  private hubConnection: signalR.HubConnection;
  messageReceived = new EventEmitter<Message>();  
  //connectionEstablished = new EventEmitter<Boolean>();  
  
  constructor() {  
    this.buildConnection();  
    //this.registerOnServerEvents();  
    this.startConnection();  
  }  
  
  private buildConnection() {  
    this.hubConnection = new signalR.HubConnectionBuilder()  
      .withUrl('http://localhost:5000/chat')  
      .build();
  }
  
  private startConnection()
  {
      this.hubConnection
      .start()  
      .then(() => {  
        //this.connectionIsEstablished = true;  
        console.log('Hub connection started');  
        this.listen();
      })  
      .catch(err => {  
        console.log(err + 'Error while establishing connection, retrying...');  
        setTimeout(function () { this.startConnection(); }, 3000);  
      });
  }

  public listen() 
  {
    this.hubConnection.on("IncomingMessage", (user: string, message: string) => {
      let newMessage: Message = new Message();
      newMessage.Username = user;
      newMessage.Message = message;
      newMessage.DatePosted = new Date();
      this.messageReceived.emit(newMessage);
    });
  }
  
  public SendMessage(message: Message)
  {
    this.hubConnection.invoke("SendMessage", message.Username, message.Message);
  }
}  
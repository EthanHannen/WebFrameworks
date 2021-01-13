import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { NavHeaderComponent } from './views/nav-header/nav-header.component';
import { RegisterComponent } from './views/register/register.component';
import { PostCurrentComponent } from './views/post-current/post-current.component';
import { PostEditComponent } from './views/post-edit/post-edit.component';
import { PostNewComponent } from './views/post-new/post-new.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './views/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavHeaderComponent,
    RegisterComponent,
    PostCurrentComponent,
    PostEditComponent,
    PostNewComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

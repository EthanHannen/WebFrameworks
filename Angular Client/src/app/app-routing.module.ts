import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthorizationService } from './services/authorization.service';
import { PostNewComponent } from './views/post-new/post-new.component';
import { PostEditComponent } from './views/post-edit/post-edit.component';
import { ChatComponent } from './views/chat/chat.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [AuthorizationService],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'post-new',
    component: PostNewComponent
  },
  {
    path: 'post-edit/:postId',
    component: PostEditComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

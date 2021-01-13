import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserToken } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit {

  currentUser: UserToken = null;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.userService.GetLoggedInUser();
  }

  LogoutUser(): void {
    this.userService.LogOutUser();
    this.currentUser = null;
  }

  LoginUser(user: UserToken): void {
    this.currentUser = user;
  }
}

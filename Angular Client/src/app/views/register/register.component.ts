import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private userService:UserService, private router: Router) { }

  errorMessage:string = '';

  newUser: User;
  ngOnInit(): void {
    this.newUser = new User();
  }
  title: "Register";

  CreateNewUser() {
    if (this.newUser.userId === '')
      this.errorMessage = 'Invalid username';
    else if (this.newUser.firstName === '')
      this.errorMessage = 'Invalid first name';
    else if (this.newUser.lastName === '')
      this.errorMessage = 'Invalid last name';
    else if (this.newUser.emailAddress === '')
      this.errorMessage = 'Invalid email';
    else if (this.newUser.password === '')
      this.errorMessage = 'Invalid password';
    else
    {
      this.userService.CreateNewUser(this.newUser).subscribe((returnedUser)=> {
        console.log(returnedUser);
        this.errorMessage = '';
        this.router.navigate(['/login']);
      }, (error)=>{
        console.log(error);
        this.errorMessage = error.statusText;
      });
    }
  }
}
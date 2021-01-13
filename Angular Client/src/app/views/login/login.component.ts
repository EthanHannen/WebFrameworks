import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = 'Login';
  loginUserId = '';
  loginPassword = '';
  errorMessage = '';

  constructor(private userService:UserService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let isError = this.route.snapshot.paramMap.get('errorMessage');
    if(isError)
      this.errorMessage = isError;
  }

  LoginUser() {
    if (this.loginUserId === '')
      this.errorMessage = 'Invalid username';
    else if (this.loginPassword === '')
      this.errorMessage = 'Invalid password';
    else
    {
      this.userService.LoginUser(this.loginUserId, this.loginPassword).subscribe((res)=> {
        this.userService.SetLoggedInUser(res.token);
        this.router.navigate(['/home']);
      }, err => {
        this.errorMessage = err.error.message;
      });
    }
  }

}

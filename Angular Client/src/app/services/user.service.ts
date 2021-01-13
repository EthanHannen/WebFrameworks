import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { User, UserToken } from 'src/app/models/user.model';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

// Professor Gomez's UserService methods - thanks!
export class UserService {

  @Output() UserStateChanged = new EventEmitter<boolean>();
  constructor(private http: HttpClient) { }

  LoginUser(userId: string, password: string): Observable<UserToken>
  {
    return this.http.get<UserToken>(`${environment.BASE_URL}/Users/${userId}/${password}`);
  }

  SetLoggedInUser(currentToken: string): void
  {
      const decodedToken = jwt_decode<UserToken>(currentToken);
      console.log(decodedToken);
      const userToken = new UserToken();
      userToken.UserData = decodedToken.UserData;
      userToken.iat = decodedToken.iat;
      userToken.exp = decodedToken.exp;
      userToken.sub = decodedToken.sub;
      userToken.token = currentToken;
      localStorage.setItem('authtoken', JSON.stringify(userToken));
      this.UserStateChanged.emit(true);
  }

  LogOutUser(): void
  {
    localStorage.removeItem('authtoken');
    this.UserStateChanged.emit(false);
  }

  GetLoggedInUser(): UserToken | null
  {
    const authToken = localStorage.getItem('authtoken');
    if (authToken !== null) {
      const currentToken = new UserToken();
      Object.assign(currentToken, JSON.parse(authToken));
      return currentToken;
    }
    else {
      return null;
    }
  }

  CreateNewUser(user: User): Observable<User>
  {
    return this.http.post<User>(`${environment.BASE_URL}/Users`, user);
  }
}


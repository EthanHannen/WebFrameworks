import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserToken } from '../models/user.model';

@Injectable({
    providedIn: 'root'
  })

export class PostService {
  
    BASE_URL = environment.BASE_URL;
    constructor(private http: HttpClient, private userService: UserService) { }
    
    GetPost(postID: number): Observable<Post>
    {
        return this.http.get<Post>(`${this.BASE_URL}/Posts/${postID}`);
    }

    GetPosts(): Observable<Post[]>
    {
        return this.http.get<Post[]>(`${this.BASE_URL}/Posts`);
    }

    CreatePost(post: Post): Observable<any>
    {
        let currentUser: UserToken = this.userService.GetLoggedInUser();
        return this.http.post(`${this.BASE_URL}/Posts`, post, {headers: new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`)});
    }

    UpdatePost(post: Post): Observable<any>
    {
        let currentUser: UserToken = this.userService.GetLoggedInUser();
        return this.http.patch(`${this.BASE_URL}/Posts/${post.postId}`, post, {headers: new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`)});
    }

    DeletePost(post: Post): Observable<any>
    {
        let currentUser: UserToken = this.userService.GetLoggedInUser();
        return this.http.delete(`${this.BASE_URL}/Posts/${post.postId}`, {headers: new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`)});
    }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserToken } from 'src/app/models/user.model';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private postService: PostService) {}

  currentUser: UserToken = null;
  posts: Post[] = [];

  ngOnInit(): void {
    this.postService.GetPosts().subscribe((res) => {
      res.forEach(p => {p.createdDate = new Date(p.createdDate); p.lastUpdated = new Date(p.lastUpdated)});
      this.posts.push.apply(this.posts, res);
      //this.posts.reverse(); SEEMS TO BE WORKING FROM BACKEND
    });
    this.currentUser = this.userService.GetLoggedInUser();
  }

  RemovePost(pid: number): void
  {
    this.posts.splice(this.posts.findIndex(p => p.postId === pid));
  }
}
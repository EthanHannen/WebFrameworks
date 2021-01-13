import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { UserToken } from 'src/app/models/user.model';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit {

  newPost: Post;
  message: string = '';

  constructor(private postService: PostService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    let currentUser: UserToken = this.userService.GetLoggedInUser();

    if (!currentUser)
      this.router.navigate(['/login', {errorMessage: `You must be logged in to create a post`}]);
    else
      this.newPost = new Post();
  }

  CreatePost(): void
  {
    if (this.newPost.title === '')
      this.message = "You must have a title";
    else if (this.newPost.content === '')
      this.message = "You must provide content";
    else
    {
      this.postService.CreatePost(this.newPost).subscribe((res) => {
        this.router.navigate(['/home']);
      }, err => {
        this.message = err.error.message;
      });
    }
  }

}

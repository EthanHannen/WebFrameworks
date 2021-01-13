import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { UserToken } from 'src/app/models/user.model';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  existingPost: Post;
  existingPostID: number;
  message: string = '';

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    let currentUser: UserToken = this.userService.GetLoggedInUser();

    if (!currentUser)
      this.router.navigate(['/login', {errorMessage: `You must be logged in to edit a post`}]);
    else
    {
      this.existingPost = new Post();
      this.existingPostID = +this.route.snapshot.paramMap.get('postId');
  
      if (this.existingPostID > 0)
      {
        this.postService.GetPost(this.existingPostID).subscribe((post) => {
          this.existingPost = post;
        }, err => {
          this.message = err.error.message;
        });
      }
    }
  }

  SavePost()
  {
    this.postService.UpdatePost(this.existingPost).subscribe((ok) => {
      this.router.navigate(['/home']);
    }, err => {
      this.message = err.error.message;
    });
  }
}

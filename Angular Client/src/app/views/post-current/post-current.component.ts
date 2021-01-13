import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { UserToken } from 'src/app/models/user.model';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-current',
  templateUrl: './post-current.component.html',
  styleUrls: ['./post-current.component.css']
})
export class PostCurrentComponent implements OnInit {

  @Input() post: Post;
  @Output() ItemDeleted = new EventEmitter<number>();

  currentUser: UserToken;

  constructor(private userService: UserService, private router: Router, private postService: PostService) {}

  ngOnInit(): void {
    this.currentUser = this.userService.GetLoggedInUser();
    this.userService.UserStateChanged.subscribe((loggedIn) => {
      this.currentUser = this.userService.GetLoggedInUser();
    });
  }

  DeletePost(): void
  {
    if (confirm('Are you absolutely sure you want to delete this post?')){
      this.postService.DeletePost(this.post).subscribe((res) => {
        this.ItemDeleted.emit(this.post.postId);
      }, (err) => {
        alert(`Could not delete post. Reason: ${err.error.message}`);
      });
    }
  }

  GoToCreatePost(): void
  {
    this.router.navigate(['/post-new']);
  }

}

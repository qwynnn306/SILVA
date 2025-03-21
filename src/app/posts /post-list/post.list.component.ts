import { Input, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post.list.component.html',
  styleUrls: ['./post.list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub!: Subscription;
  isLoading = true; 

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true; 
    this.postsService.getPosts();

    this.postsSub = this.postsService.getPostUpdatedListener().subscribe((posts: Post[]) => {
      setTimeout(() => {
        this.posts = posts;
        this.isLoading = false; 
      }, 1000); 
    });
  }

  onDelete(postId: string) {
    this.isLoading = true; 
  
    this.postsService.deletePost(postId).subscribe(() => { 
      setTimeout(() => {
        this.postsService.getPosts(); 
        this.isLoading = false; 
      }, 1000); 
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
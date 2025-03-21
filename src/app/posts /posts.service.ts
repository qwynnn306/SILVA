import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        this.http.get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
            .pipe(
                map((postData) => {
                    return postData.posts.map((post: any) => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id
                        };
                    });
                })
            )
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string): Observable<{ _id: string; title: string; content: string }> {
        return this.http.get<{ _id: string; title: string; content: string }>(
            "http://localhost:3000/api/posts/" + id
        );
    }

    addPost(title: string, content: string) {
        const post: Post = { id: null, title: title, content: content };
        return this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
          .pipe(map(responseData => {
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
          }));
      }
      
        
    

      updatePost(id: string, title: string, content: string) {
        const post: Post = { id: id, title: title, content: content };
        return this.http.put("http://localhost:3000/api/posts/" + id, post)
          .pipe(map(() => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
          }));
      }
      

    deletePost(postId: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + postId).pipe(
          map(() => {
            this.posts = this.posts.filter(post => post.id !== postId); // ✅ Remove post from local array
            this.postsUpdated.next([...this.posts]); // ✅ Emit updated posts list
          })
        );
      }
}
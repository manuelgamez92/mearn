"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var PostsService = /** @class */ (function () {
    function PostsService(http) {
        this.http = http;
        this.posts = [];
        this.postsUpdated = new rxjs_1.Subject();
    }
    PostsService.prototype.getPosts = function () {
        var _this = this;
        this.http.get('http://localhost:3000/api/posts')
            .pipe(operators_1.map(function (postData) {
            return postData.posts.map(function (post) {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
            .subscribe(function (transformedPosts) {
            _this.posts = transformedPosts;
            _this.postsUpdated.next(_this.posts.slice());
        });
    };
    PostsService.prototype.getPostUpdateListener = function () {
        return this.postsUpdated.asObservable();
    };
    PostsService.prototype.addPost = function (title, content) {
        var _this = this;
        var post = { id: null, title: title, content: content };
        this.http.post('http://localhost:3000/api/posts', post)
            .subscribe(function (responseData) {
            var id = responseData.postId;
            post.id = id;
            console.log(responseData.message);
            _this.posts.push(post);
            _this.postsUpdated.next(_this.posts.slice());
        });
    };
    PostsService.prototype.getPost = function (id) {
        return this.http.get("http://localhost:3000/api/posts/" + id);
    };
    PostsService.prototype.updatePost = function (id, title, content) {
        var _this = this;
        var post = { id: id, title: title, content: content };
        this.http.put("http://localhost:3000/api/posts/" + id, post)
            .subscribe(function (response) {
            var updatedPosts = _this.posts.slice();
            var oldPostIndex = updatedPosts.findIndex(function (p) { return p.id === post.id; });
            updatedPosts[oldPostIndex] = post;
            _this.posts = updatedPosts;
            _this.postsUpdated.next(_this.posts.slice());
        });
    };
    PostsService.prototype.deletePost = function (postId) {
        var _this = this;
        this.http.delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(function () {
            var updatedPosts = _this.posts.filter(function (post) { return post.id !== postId; });
            _this.posts = updatedPosts;
            _this.postsUpdated.next(_this.posts.slice());
        });
    };
    PostsService = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], PostsService);
    return PostsService;
}());
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map
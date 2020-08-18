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
var posts_service_1 = require("../posts.service");
var router_1 = require("@angular/router");
var PostCreateComponent = /** @class */ (function () {
    function PostCreateComponent(postsService, route) {
        this.postsService = postsService;
        this.route = route;
        this.enteredTitle = "";
        this.enteredContent = "";
        this.mode = 'create';
    }
    PostCreateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.paramMap.subscribe(function (paramMap) {
            if (paramMap.has('postId')) {
                _this.mode = 'edit';
                _this.postId = paramMap.get('postId');
                _this.postsService.getPost(_this.postId).subscribe(function (postData) {
                    _this.post = { id: postData._id, title: postData.title, content: postData.content };
                });
            }
            else {
                _this.mode = 'create';
                _this.postId = null;
            }
        });
    };
    PostCreateComponent.prototype.onAddPost = function (form) {
        if (form.invalid) {
            return;
        }
        if (this.mode === 'create') {
            this.postsService.addPost(form.value.title, form.value.content);
        }
        else {
            this.postsService.updatePost(this.postId, form.value.title, form.value.content);
        }
        form.resetForm();
    };
    PostCreateComponent = __decorate([
        core_1.Component({
            selector: "app-post-create",
            templateUrl: "./post-create.component.html",
            styleUrls: ["./post-create.component.css"]
        }),
        __metadata("design:paramtypes", [posts_service_1.PostsService, router_1.ActivatedRoute])
    ], PostCreateComponent);
    return PostCreateComponent;
}());
exports.PostCreateComponent = PostCreateComponent;
//# sourceMappingURL=post-create.component.js.map
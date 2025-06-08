import {Profile} from './profile.interface';
import {InputSignal} from "@angular/core";

export interface PostCreateDto {
    title: string;
    content: string;
    authorId: number;
}

export interface Post {
        id: number;
        title: string;
        communityId: 0,
        content: string;
        author: Profile;
        images: string[];
        createdAt: string;
        updatedAt: string;
        comments: PostComment[];
}

export interface PostComment {
    id: number;
    text: string;
    author: {
        id: 0;
        username: string;
        avatarUrl: string;
        subscribersAmount: 0;
    };
    postId: number;
    commentId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CommentCreateDto {
    text: string;
    authorId: number;
    postId: number;
}
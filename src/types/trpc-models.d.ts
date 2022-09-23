import { Comment, Post, User } from "@prisma/client";

export type PostFull = Post & {
  user: UserShort;
  comments: CommentFull[];
};

export type UserShort = {
  name: string;
  id: string;
};

export interface UserFull extends Omit<User, "password"> {
  posts: Post[];
  comments: Comment[];
  likedPosts: UsersLikedPosts[];
  likedComments: UserLikesComments[];
}

export type CommentFull = Comment & { user: UserShort };

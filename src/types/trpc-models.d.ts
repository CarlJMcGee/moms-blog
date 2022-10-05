import { Comment, Post, User } from "@prisma/client";

export type PostFull = Post & {
  user: UserShort;
  comments: CommentFull[];
  _count: {
    userLikes: number;
  };
};

export type UserShort = {
  name: string;
  id: string;
  image: string;
};

export interface UserFull extends Omit<User, "password"> {
  posts: Post[];
  comments: Comment[];
  likedPosts: UsersLikedPosts[];
  likedComments: UserLikesComments[];
}

export type CommentFull = Comment & { user: UserShort };

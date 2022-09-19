import { Comment, Post } from "@prisma/client";

export type PostFull = Post & {
  user: UserShort;
  comments: CommentFull[];
};

export type UserShort = {
  name: string;
  id: string;
};

export type CommentFull = Comment & { user: UserShort };

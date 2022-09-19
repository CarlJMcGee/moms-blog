import { Comment, Post, User } from "@prisma/client";
import { Session } from "next-auth";
import * as React from "react";
import { PostFull } from "../../types/trpc-models";
import { trpc } from "../../utils/trpc";

export interface IPostCardProps {
  post: PostFull | undefined;
  sess: Session | null;
}

const PostCard = ({ post, sess }: IPostCardProps) => {
  // query
  const { data: user, isLoading: userLoading } = trpc.useQuery(["user.me"]);

  if (!post) {
    return <h2>Post not found</h2>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold">{post.title}</h3>
      <h4 className="text-sm">{`Says ${post.user.name}`}</h4>
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt={`post ${post.title} image`} />}
      {post.comments.map((comment) => (
        <div key={comment.id}>
          <h4 className="font-semibold">{comment.user.name}</h4>
          <p className="text-xs">{comment.createdAt.toLocaleDateString()}</p>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostCard;

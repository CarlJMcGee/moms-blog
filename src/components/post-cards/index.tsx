import * as React from "react";
import { Session } from "next-auth";
import { PostFull, UserFull } from "../../types/trpc-models";
import { trpc } from "../../utils/trpc";
import { Card, Image, Text, Title, Button, Group } from "@mantine/core";

export interface IPostCardProps {
  post: PostFull | undefined;
  sess: Session | null;
}

const PostCard = ({ post, sess }: IPostCardProps) => {
  // query
  let user = undefined;
  if (sess?.user) {
    const { data, isLoading: userLoading } = trpc.useQuery(["user.me"]);
    user = data || ({} as UserFull);
  }

  if (!post) {
    return <h2>Post not found</h2>;
  }

  return (
    <Card shadow={"xl"} p="lg" withBorder className="w-96 m-5">
      <Card.Section>
        <Title order={2} className="px-3 pt-3">
          {post.title}
        </Title>
        <Text
          size={"lg"}
          weight=""
          className="px-3"
        >{`Says ${post.user.name}`}</Text>
      </Card.Section>
      <Group position="center" mt={"lg"} mb={"xs"}>
        <Text size={"md"} weight="lighter">
          {post.content}
        </Text>
      </Group>
      {post.image && (
        <Card.Section>
          <Image src={post.image} alt={`post ${post.title} image`} />
        </Card.Section>
      )}
      {post.comments.map((comment) => (
        <div key={comment.id}>
          <h4 className="font-semibold">{comment.user.name}</h4>
          <p className="text-xs">{comment.createdAt.toLocaleDateString()}</p>
          <p>{comment.content}</p>
        </div>
      ))}
    </Card>
  );
};

export default PostCard;

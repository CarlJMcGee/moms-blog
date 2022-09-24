import * as React from "react";
import { Session } from "next-auth";
import { PostFull, UserFull } from "../../types/trpc-models";
import { trpc } from "../../utils/trpc";
import {
  Card,
  Image,
  Text,
  Title,
  Button,
  Group,
  Accordion,
  Input,
  ActionIcon,
} from "@mantine/core";
import { IconSquareArrowRight } from "@tabler/icons";

export interface IPostCardProps {
  post: PostFull | undefined;
  sess: Session | null;
}

const PostCard = ({ post, sess }: IPostCardProps) => {
  const utils = trpc.useContext();

  // state
  const [comment, setComment] = React.useState("");
  // query
  let user = undefined;
  if (sess?.user) {
    const { data, isLoading: userLoading } = trpc.useQuery(["user.me"]);
    user = data || ({} as UserFull);
  }

  // mutations
  const { mutate: addComment } = trpc.useMutation(["comment.add"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
    },
  });

  if (!post) {
    return <h2>Post not found</h2>;
  }

  // handler
  const commentHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addComment({ content: comment, postId: post.id });
  };

  return (
    <Card shadow={"xl"} p="lg" withBorder className="w-96 m-5">
      {/* title and user */}
      <Card.Section>
        <Title order={2} className="px-3 pt-3">
          {post.title}
        </Title>
        <Text
          size={"lg"}
          weight=""
          className="px-5"
        >{`Says ${post.user.name}`}</Text>
      </Card.Section>

      {/* post content and image */}
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

      {/* comment section */}
      <Card.Section withBorder>
        <Accordion>
          <Accordion.Item value="comments">
            <Accordion.Control className="m-1">Thoughts:</Accordion.Control>
            <Accordion.Panel>
              {/* add comment form */}
              {sess?.user ? (
                <form onSubmit={commentHandler}>
                  <Group position="left">
                    <Input
                      placeholder="Thoughts..."
                      className="pl-0"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setComment(e.target.value)
                      }
                    />
                    <ActionIcon
                      type="submit"
                      variant="light"
                      color={"grape"}
                      size="lg"
                    >
                      <IconSquareArrowRight size={30} />
                    </ActionIcon>
                  </Group>
                </form>
              ) : (
                <Text size={"sm"}>Log in to leave your thoughts</Text>
              )}
              {/* comments */}
              {post.comments.map((comment) => (
                <div key={comment.id} className="m-3">
                  <h4 className="font-semibold">{comment.user.name}</h4>
                  <p className="text-xs">
                    {comment.createdAt.toLocaleDateString()}
                  </p>
                  <p>{comment.content}</p>
                </div>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card.Section>
    </Card>
  );
};

export default PostCard;

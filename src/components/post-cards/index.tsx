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
  Spoiler,
  Paper,
} from "@mantine/core";
import { IconSquareArrowRight, IconStar } from "@tabler/icons";
import moment from "moment";

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
    setComment("");
  };

  // wibbly wobbly timey wimey
  const postTime = moment(post.comments[0]?.createdAt).fromNow();
  const commentTime = (date: Date | undefined) => moment(date).fromNow();

  return (
    <Card shadow={"xl"} p="lg" withBorder className="w-96 m-5">
      {/* title and user */}
      <Card.Section>
        <Title order={2} className="px-3 pt-3">
          {post.title}
        </Title>
        <Group position="apart">
          <div>
            <Text
              size={"lg"}
              weight=""
              className="px-5"
            >{`Says ${post.user.name}`}</Text>
            <Text size={"sm"} className="px-5">
              {postTime}
            </Text>
          </div>
          <ActionIcon color={"yellow"} size={"lg"} mr="lg" variant="filled">
            <IconStar size={34} color="#e7bc27" />
          </ActionIcon>
        </Group>
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
        <Spoiler
          maxHeight={120}
          showLabel="See more Comments"
          hideLabel="Hide"
          m={"sm"}
        >
          {/* add comment form */}
          {sess?.user ? (
            <form onSubmit={commentHandler}>
              <Group position="left">
                <Input
                  placeholder="Comment..."
                  className=""
                  value={comment}
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
            <Text size={"sm"} m="xs" color={"cyan"}>
              Log in to leave your thoughts
            </Text>
          )}
          {/* comments */}
          {post.comments.map((comment) => (
            <Paper
              shadow={"md"}
              p="xs"
              radius={"md"}
              withBorder
              key={comment.id}
              className="my-4"
            >
              <h4 className="font-semibold">
                {comment.user.name}{" "}
                <span className="text-xs">
                  {commentTime(comment.createdAt)}
                </span>
              </h4>

              <p>{comment.content}</p>
            </Paper>
          ))}
        </Spoiler>
      </Card.Section>
    </Card>
  );
};

export default PostCard;

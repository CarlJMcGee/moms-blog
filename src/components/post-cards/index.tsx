import * as React from "react";
import { Session } from "next-auth";
import { PostFull } from "../../types/trpc-models";
import { trpc } from "../../utils/trpc";
import {
  Card,
  Image,
  Text,
  Title,
  Group,
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
  const { data: user, isLoading: userLoading } = trpc.useQuery(["user.me"]);

  // mutations
  const { mutate: addComment } = trpc.useMutation(["comment.add"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
    },
  });
  const { mutate: likePost } = trpc.useMutation(["post.addLike"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
      utils.invalidateQueries(["user.me"]);
    },
  });
  const { mutate: unlikePost } = trpc.useMutation(["post.removeLike"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
      utils.invalidateQueries(["user.me"]);
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
  const likePostHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    e.preventDefault();

    likePost({ postId: postId });
  };
  const unlikePostHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    e.preventDefault();

    unlikePost({ postId: postId });
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
          <Group mx={15}>
            {post._count.userLikes <= 0 ? (
              ""
            ) : (
              <Text color={"violet"} size={"lg"} weight="bold">
                {`${post._count.userLikes} Likes`}
              </Text>
            )}{" "}
            {!sess?.user ? (
              ""
            ) : user?.likedPosts.find(
                (likedPost) => likedPost.postId === post.id
              ) ? (
              <ActionIcon
                color={"yellow"}
                size={"lg"}
                mr="lg"
                variant="transparent"
                className="bg-yellow-500"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  unlikePostHandler(e, post.id)
                }
              >
                <IconStar size={34} color="#fff" />
              </ActionIcon>
            ) : (
              <ActionIcon
                color={"yellow"}
                size={"lg"}
                mr="lg"
                variant="filled"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  likePostHandler(e, post.id)
                }
              >
                <IconStar size={34} color="#e7bc27" />
              </ActionIcon>
            )}
          </Group>
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
          maxHeight={150}
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

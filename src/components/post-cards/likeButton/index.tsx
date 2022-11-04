import { ActionIcon, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons";
import { Session } from "next-auth";
import React, { useState } from "react";
import { PostFull } from "../../../types/trpc-models";
import { trpc } from "../../../utils/trpc";

export interface ILikeButtonProps {
  sess: Session | null;
  post: PostFull | null;
}

export default function LikeButton({ sess, post }: ILikeButtonProps) {
  if (!post) {
    return <h3>Error no post found</h3>;
  }

  const utils = trpc.useContext();

  // query
  const { data: user, isLoading: userLoading } = trpc.useQuery(["user.me"]);
  const userLikesSet = new Set(user?.likedPosts.map((like) => like.postId));

  //state
  const [liked, setLike] = useState(userLikesSet.has(post?.id));

  //mutations
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

  // handlers
  const likePostHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    e.preventDefault();

    setLike(true);
    userLikesSet.add(postId);
    likePost({ postId: postId });
  };
  const unlikePostHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    e.preventDefault();

    setLike(false);
    userLikesSet.delete(postId);
    unlikePost({ postId: postId });
  };

  return (
    <>
      {!sess?.user ? (
        "" // if not logged in, don't render like button
      ) : liked ? (
        <ActionIcon // render filled button icon
          color={"yellow"}
          size={"lg"}
          variant="transparent"
          className="bg-palette-blue-light"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            unlikePostHandler(e, post.id)
          }
        >
          <IconStar size={34} color="#fff" />
        </ActionIcon>
      ) : (
        <ActionIcon // else render standard icon
          color={"cyan"}
          size={"lg"}
          mr="lg"
          variant="filled"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            likePostHandler(e, post.id)
          }
        >
          <IconStar size={34} color="#7BDFF2" />
        </ActionIcon>
      )}{" "}
      {post._count.userLikes <= 0 ? (
        "" // if no likes render no like count
      ) : (
        <Text color={"cyan"} size={"lg"} weight="bold">
          {`${post._count.userLikes} Likes`}
        </Text>
      )}
    </>
  );
}

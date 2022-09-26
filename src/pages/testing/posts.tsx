import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { comment } from "postcss";
import * as React from "react";
import { util } from "zod/lib/helpers/util";
import { trpc } from "../../utils/trpc";

export interface IPostTestingProps {}

const PostTesting: NextPage = (props: IPostTestingProps) => {
  const utils = trpc.useContext();

  //state
  const [postInfo, setPostInfo] = React.useState({
    title: "",
    content: "",
    imgLink: "",
  });
  const [postUpdate, setPostUpdate] = React.useState({
    title: "",
    content: "",
    imgLink: "",
    postId: "",
  });
  const [commentBody, setCommentInfo] = React.useState("");
  const commentInput = React.useRef<HTMLInputElement>(null);
  const { data: sess } = useSession();

  // query
  const { data: posts, isLoading: gettingPosts } = trpc.useQuery([
    "post.getAll",
  ]);
  const { data: me } = trpc.useQuery(["user.me"]);

  // mutation
  const { mutate: addPost, data: newPost } = trpc.useMutation(["post.new"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
    },
  });
  const { mutate: addLike } = trpc.useMutation(["post.addLike"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
    },
  });
  const { mutate: removeLike } = trpc.useMutation(["post.removeLike"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
    },
  });
  const { mutate: addComment } = trpc.useMutation(["comment.add"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
    },
  });

  // handlers
  const createPostHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addPost({ ...postInfo });

    setPostInfo({ title: "", content: "", imgLink: "" });
  };
  const likePostHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    e.preventDefault();

    addLike({ postId: postId });
  };
  const unlikePostHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    e.preventDefault();

    removeLike({ postId: postId });
  };
  const addCommentHandler = (
    e: React.FormEvent<HTMLElement>,
    postId: string
  ) => {
    e.preventDefault();

    addComment({ postId: postId, content: commentBody });
  };

  return (
    <div>
      <Head>
        <title>Testing for Post data</title>
      </Head>

      {gettingPosts ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h2 className="text-3xl">All Posts</h2>
          <ul className="flex">
            {posts?.map((post) => (
              <li key={post.id} className="border-4 m-2 p-4">
                <h3 className="font-bold text-xl">
                  {post.title}{" "}
                  {post.user.id === sess?.user?.id && (
                    <button className="bg-slate-300 m-2 p-1 font-normal text-sm">
                      Update
                    </button>
                  )}
                </h3>

                <h4>Says {post.user.name}</h4>
                <p>
                  {post._count.userLikes ?? "0"} Likes{" "}
                  {sess?.user &&
                    sess?.user?.id !== post.userId &&
                    (me?.likedPosts.find((post) => post.postId) ? (
                      <button
                        className="bg-blue-300 m-2 p-1"
                        onClick={(e) => unlikePostHandler(e, post.id)}
                      >
                        Unlike
                      </button>
                    ) : (
                      <button
                        className="bg-blue-300 m-2 p-1"
                        onClick={(e) => likePostHandler(e, post.id)}
                      >
                        Like
                      </button>
                    ))}
                </p>
                <p>{post.content}</p>
                {post.image ? <img width={"350px"} src={post.image} /> : ""}
                <h4 className="font-semibold ">Thoughts?</h4>
                <form onSubmit={(e) => addCommentHandler(e, post.id)}>
                  <input
                    className="bg-slate-300 m-2, p-1"
                    type="text"
                    placeholder="Comment"
                    onChange={(e) => setCommentInfo(e.target.value)}
                    ref={commentInput}
                  />
                  <button type="submit" className="bg-slate-300 m-2 p-1">
                    Post
                  </button>
                </form>
                {post?.comments[0] ? (
                  <>
                    {post.comments.map((comment) => (
                      <p key={comment.id}>
                        <span className="font-semibold">
                          {comment.user.name}:
                        </span>{" "}
                        {comment.content}
                      </p>
                    ))}
                  </>
                ) : (
                  ""
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <br />

      {sess?.user ? (
        <>
          <h3 className="text-3xl">Create Post</h3>
          <form onSubmit={createPostHandler}>
            <input
              type="text"
              placeholder="Title"
              className="bg-slate-300 m-2 p-1"
              value={postInfo.title}
              onChange={(e) =>
                setPostInfo({ ...postInfo, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Body"
              className="bg-slate-300 m-2 p-1"
              value={postInfo.content}
              onChange={(e) =>
                setPostInfo({ ...postInfo, content: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Image Link"
              className="bg-slate-300 m-2 p-1"
              value={postInfo.imgLink}
              onChange={(e) =>
                setPostInfo({ ...postInfo, imgLink: e.target.value })
              }
            />
            <button type="submit" className="bg-slate-300 m-2 px-2 py-1">
              Post!
            </button>
          </form>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default PostTesting;

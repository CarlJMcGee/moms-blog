import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import * as React from "react";
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
  const { data: sess } = useSession();

  // query
  const { data: posts, isLoading: gettingPosts } = trpc.useQuery([
    "post.getAll",
  ]);

  // mutation
  const { mutate: addPost, data: newPost } = trpc.useMutation(["post.new"], {
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
                <h3 className="font-bold">{post.title}</h3>
                <p>{post.content}</p>
                {post.image ? <img width={"350px"} src={post.image} /> : ""}
                {post?.comments[0] ? (
                  <p>
                    <span className="font-bold">
                      {post.comments[0].user.name}:{" "}
                    </span>
                    {post.comments[0].content}
                  </p>
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

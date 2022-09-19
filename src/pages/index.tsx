import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import PostCard from "../components/post-cards";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // state
  const { data: sess } = useSession();

  // queries
  const { data: posts, isLoading: postsLoading } = trpc.useQuery([
    "post.getAll",
  ]);

  if (postsLoading) {
    return <h1>Loading...</h1>;
  }

  if (!posts) {
    return <h1 className="text-4xl">No posts found</h1>;
  }

  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content={`Words of "wisdom" daily`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="box-border">
        <h1 className="text-4xl font-bold text-center">Blog v0.1</h1>
        <div className="text-center my-3 border-4 w-1/2 mx-auto">
          <h3 className="text-2xl font-semibold">{posts[0]?.title}</h3>
          <h4>{posts[0]?.user.name}</h4>
          <p>Says {posts[0]?.content}</p>
          {posts[0]?.image && (
            <img src={posts[0].image} alt={`Top post image`} width="500px" />
          )}
        </div>

        <br />

        <ol className="flex flex-col items-center">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} sess={sess} />
          ))}
          {/* {posts.map((post) => (
            <li key={post.id} className="mx-2 my-4 p-3 border-4 shrink w-1/3">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <h4 className="">{`Says ${post.userSafe.name}`}</h4>
              <p>{post.content}</p>
              {post.image && (
                <img src={post.image} alt={`post ${post.title} image`} />
              )}
              {post.commentsSafe.map((comment) => (
                <>
                  <h4 className="font-semibold">{comment.userSafe.name}</h4>
                  <p className="text-xs">
                    {comment.createdAt.toLocaleDateString()}
                  </p>
                  <p>{comment.content}</p>
                </>
              ))}
            </li>
          ))} */}
        </ol>
      </main>
    </>
  );
};

export default Home;

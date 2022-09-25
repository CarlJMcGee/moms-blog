import { Box, Button, Group } from "@mantine/core";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Header from "../components/header";
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
        <title>Sanity Adjacent</title>
        <meta name="description" content={`Words of "wisdom" daily`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="box-border">
        <Header sess={sess} />

        <ol className="flex flex-col items-center">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} sess={sess} />
          ))}
        </ol>

        <Button className="bg-sky-700 fixed bottom-10 left-3 w-1/4">
          New Thought
        </Button>
      </main>
    </>
  );
};

export default Home;

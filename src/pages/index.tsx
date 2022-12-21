import { Button, Drawer, Group, Paper, Skeleton, Stack } from "@mantine/core";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import Header from "../components/header";
import PostCard from "../components/post-cards";
import PostForm from "../components/postForm";
import { useChannel } from "../utils/pusherStore";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const utils = trpc.useContext();
  // state
  const { data: sess } = useSession();
  const { data: user, isLoading: userLoading } = trpc.useQuery(["user.me"]);
  const [postOpen, setPostOpen] = useState(false);

  // queries
  const { data: posts, isLoading: postsLoading } = trpc.useQuery([
    "post.getAll",
  ]);

  // pusher
  const { BindEvent } = useChannel("main");
  useEffect(() => {
    BindEvent("added_post", () => {
      utils.invalidateQueries("post.getAll");
    });
    BindEvent("added_comment", () => {
      utils.invalidateQueries("post.getAll");
    });
    BindEvent("liked_post", () => {
      utils.invalidateQueries("post.getAll");
    });
    BindEvent("unliked_post", () => {
      utils.invalidateQueries("post.getAll");
    });
    BindEvent("updated_info", () => {
      utils.invalidateQueries("user.me");
      utils.invalidateQueries("post.getAll");
    });
  }, []);

  if (postsLoading) {
    return (
      <>
        <Header sess={sess} />
        <Group position="center" mt={100}>
          <Stack>
            <Paper
              shadow={"md"}
              radius={"sm"}
              p={"md"}
              withBorder
              className="w-96 m-5"
            >
              <Stack>
                <Skeleton height={10} width={300} mt={6} />
                <Skeleton height={10} width={150} mt={6} />
                <Skeleton height={10} width={350} mt={6} />
                <Skeleton height={10} width={350} mt={6} />
                <Skeleton height={300} width={350} my={20} />
                <Skeleton height={10} width={300} mt={6} />
                <Skeleton height={10} width={200} mt={6} />
                <Skeleton height={10} width={300} mt={6} />
                <Skeleton height={10} width={300} mt={6} />
              </Stack>
            </Paper>
            <Paper
              shadow={"md"}
              radius={"sm"}
              p={"md"}
              withBorder
              className="w-96 m-5"
            >
              <Stack>
                <Skeleton height={10} width={300} mt={6} />
                <Skeleton height={10} width={150} mt={6} />
                <Skeleton height={10} width={350} mt={6} />
                <Skeleton height={10} width={350} mt={6} />
                <Skeleton height={300} width={350} my={20} />
                <Skeleton height={10} width={300} mt={6} />
                <Skeleton height={10} width={200} mt={6} />
                <Skeleton height={10} width={300} mt={6} />
                <Skeleton height={10} width={300} mt={6} />
              </Stack>
            </Paper>
          </Stack>
        </Group>
      </>
    );
  }

  if (!posts) {
    return <h1 className="text-4xl">No posts found</h1>;
  }

  return (
    <>
      <Head>
        <title>Sanity Adjacent - Homepage</title>
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
        {user && user.canPost && (
          <Button
            className="bg-sky-700 fixed bottom-10 left-5 w-1/4 p-0"
            onClick={() => setPostOpen(true)}
          >
            New Thought
          </Button>
        )}{" "}
        <Drawer
          opened={postOpen}
          onClose={() => setPostOpen(false)}
          title="New Thought"
          position="bottom"
          padding={"xl"}
          size={"75%"}
        >
          <PostForm setOpen={setPostOpen} />
        </Drawer>
      </main>
    </>
  );
};

export default Home;

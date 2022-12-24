import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export const PostSkelly = () => {
  return (
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
  );
};

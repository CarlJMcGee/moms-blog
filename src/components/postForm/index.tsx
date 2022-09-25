import * as React from "react";
import { Box, Button, Drawer, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { trpc } from "../../utils/trpc";

export interface IPostFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostForm({ setOpen }: IPostFormProps) {
  const utils = trpc.useContext();
  const postForm = useForm({
    initialValues: {
      title: "",
      content: "",
    },
    validate: {
      title: (input) => (input === "" ? "Must have a title" : null),
      content: (input) => (input === "" ? "Must have a Body" : null),
    },
    validateInputOnBlur: true,
  });

  const { mutate: addPost } = trpc.useMutation(["post.new"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
      setOpen(false);
    },
  });

  return (
    <Box>
      <form onSubmit={postForm.onSubmit((values) => addPost({ ...values }))}>
        <TextInput
          my={"sm"}
          label="Title"
          placeholder="Title"
          {...postForm.getInputProps("title")}
        />
        <Textarea
          my={"sm"}
          label="Body"
          placeholder="What are you thinking about..."
          {...postForm.getInputProps("content")}
        />
        <Group position="center" grow={true}>
          <Button
            type="submit"
            my={"lg"}
            className="bg-violet-700"
            color={"violet"}
          >
            Share your thought with the world
          </Button>
        </Group>
      </form>
    </Box>
  );
}

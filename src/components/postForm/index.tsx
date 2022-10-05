import * as React from "react";
import { Box, Button, Drawer, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { trpc } from "../../utils/trpc";

export interface IPostFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostForm({ setOpen }: IPostFormProps) {
  const utils = trpc.useContext();
  const titleVal = /^[a-z0-9$@$!%*?&_]{1,50}$/i;
  const contentVal = /^[a-z0-9$@$!%*?&_]{1,254}$/i;
  const postForm = useForm({
    initialValues: {
      title: "",
      content: "",
    },
    validate: {
      title: (input) =>
        !titleVal.test(input)
          ? "Must have a title no longer than 50 characters"
          : null,
      content: (input) =>
        !contentVal.test(input)
          ? "Must have a Body no longer than 254 characters"
          : null,
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

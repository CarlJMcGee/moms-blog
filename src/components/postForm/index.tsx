import * as React from "react";
import { Box, Button, Drawer, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export interface IPostFormProps {}

export default function PostForm(props: IPostFormProps) {
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

  return (
    <Box>
      <form>
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
          <Button my={"lg"} className="bg-violet-700" color={"violet"}>
            Share your thought with the world
          </Button>
        </Group>
      </form>
    </Box>
  );
}

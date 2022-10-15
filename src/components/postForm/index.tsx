import * as React from "react";
import {
  Box,
  Button,
  FileButton,
  Group,
  Image,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { trpc } from "../../utils/trpc";
import { ImgbbRes } from "../../types/imageUpload";

export interface IPostFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostForm({ setOpen }: IPostFormProps) {
  const utils = trpc.useContext();

  // state
  const [selectedFile, setFile] = React.useState<File | null>(null);

  // RegExp
  const titleVal = /^[a-z0-9$@$!%*?&_. ]{1,50}$/i;
  const contentVal = /^[a-z0-9$@$!%*?&_. ]{1,254}$/i;
  const postForm = useForm({
    initialValues: {
      title: "",
      content: "",
      imageSrc: "",
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

  // mutation
  const { mutate: addPost } = trpc.useMutation(["post.new"], {
    onSuccess() {
      utils.invalidateQueries(["post.getAll"]);
      setOpen(false);
    },
  });

  // handlers
  const uploadPicHandler = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      return;
    }

    const body = new FormData();
    body.append("image", selectedFile);

    try {
      const req = await fetch(
        `https://api.imgbb.com/1/upload?&name=${selectedFile.name}&key=dd9e796ad2397d60fca82af89819101b`,
        {
          method: `POST`,
          body: body,
        }
      );
      const res: ImgbbRes = await req.json();

      const {
        data: { image },
      } = res;
      postForm.setFieldValue("imageSrc", image.url);
    } catch (err) {
      if (err) console.error(err);
    }
  };

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
        {selectedFile && (
          <>
            <Image
              src={URL.createObjectURL(selectedFile)}
              width={150}
              alt={selectedFile.name}
            />
            <Text size={"xs"} mt={"sm"}>
              {selectedFile.name}
            </Text>
          </>
        )}
        <Group position="left">
          <div>
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => (
                <Button
                  {...props}
                  color="violet"
                  className="bg-violet-700"
                  mt={"md"}
                >
                  Select Picture
                </Button>
              )}
            </FileButton>
          </div>
          {selectedFile && (
            <Button
              color={postForm.values.imageSrc === "" ? "violet" : "lime"}
              className={
                postForm.values.imageSrc === ""
                  ? "bg-purple-500"
                  : "bg-palette-green-light"
              }
              mt={"md"}
              onClick={uploadPicHandler}
            >
              Upload
            </Button>
          )}
        </Group>
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

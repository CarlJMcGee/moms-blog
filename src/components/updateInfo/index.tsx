import {
  Button,
  FileButton,
  Modal,
  Text,
  TextInput,
  Group,
  Stack,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import * as React from "react";
import { ImgbbRes } from "../../types/imageUpload";
import { trpc } from "../../utils/trpc";

export interface IUpdateInfoFormProps {
  updateField: "name" | "pfp";
  openned: boolean;
  setOpenned: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateInfoForm({
  updateField,
  openned,
  setOpenned,
}: IUpdateInfoFormProps) {
  const utils = trpc.useContext();
  // state
  const [selectedFile, setFile] = React.useState<File | null>(null);
  const [imageSrc, setImage] = React.useState("");

  const { mutate: updateName } = trpc.useMutation(["user.updateName"], {
    onSuccess() {
      utils.invalidateQueries(["user.me"]);
      utils.invalidateQueries(["post.getAll"]);
    },
  });
  const { mutate: updatePfp } = trpc.useMutation(["user.updatePfp"], {
    onSuccess() {
      utils.invalidateQueries(["user.me"]);
      utils.invalidateQueries(["post.getAll"]);
    },
  });

  // RegExp
  const nameVal = /^[a-z0-9$@$!%*?&_]{3,15}$/i;

  const updateForm = useForm({
    initialValues: {
      name: "",
      imageSrc: "",
    },
    validate: {
      name: (input) =>
        !nameVal.test(input)
          ? `Username must be at least 3 characters with no spaces`
          : null,
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
      updateForm.setFieldValue("imageSrc", image.url);
    } catch (err) {
      if (err) console.error(err);
    }
  };

  const updateNameHandler = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (updateForm.values.name === "") {
      return;
    }

    updateName({ name: updateForm.values.name });
    updateForm.reset;
    setOpenned(false);
  };

  const updatePfpHandler = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (updateForm.values.imageSrc === "") {
      return;
    }

    updatePfp({ imageSrc: updateForm.values.imageSrc });
    updateForm.reset;
    setOpenned(false);
  };

  console.log(updateForm.values);

  return (
    <>
      <Modal
        opened={openned}
        onClose={() => {
          setOpenned(false);
          setFile(null);
          updateForm.reset;
        }}
        title={`Update ${updateField}`}
      >
        <div>
          {updateField === "name" && (
            <form onSubmit={updateNameHandler}>
              <TextInput
                label="Username"
                withAsterisk
                {...updateForm.getInputProps("name")}
              />
              <Button
                type="submit"
                size="sm"
                mt={"md"}
                fullWidth
                color={"violet"}
                className="bg-violet-700"
              >
                Update
              </Button>
            </form>
          )}
          {updateField === "pfp" && (
            <form onSubmit={updatePfpHandler}>
              <Stack align={"center"}>
                {selectedFile && (
                  <>
                    <Image
                      src={URL.createObjectURL(selectedFile)}
                      width={150}
                    />
                    <Text size={"xs"} mt={"sm"}>
                      {selectedFile.name}
                    </Text>
                  </>
                )}
                <Group position="left">
                  <div>
                    <FileButton
                      onChange={setFile}
                      accept="image/png,image/jpeg"
                    >
                      {(props) => (
                        <Button
                          {...props}
                          color="violet"
                          className="bg-violet-700"
                        >
                          Select Picture
                        </Button>
                      )}
                    </FileButton>
                  </div>
                  {selectedFile && (
                    <Button
                      color={
                        updateForm.values.imageSrc === "" ? "violet" : "lime"
                      }
                      className={
                        updateForm.values.imageSrc === ""
                          ? "bg-purple-500"
                          : "bg-palette-green-light"
                      }
                      onClick={uploadPicHandler}
                    >
                      Upload
                    </Button>
                  )}
                </Group>
                {updateForm.values.imageSrc !== "" && (
                  <Button
                    type="submit"
                    fullWidth
                    color={"violet"}
                    className="bg-violet-700"
                  >
                    Update
                  </Button>
                )}
              </Stack>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}

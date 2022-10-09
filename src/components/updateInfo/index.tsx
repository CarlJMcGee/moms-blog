import {
  Button,
  FileButton,
  Modal,
  Text,
  TextInput,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import * as React from "react";
import { ImgbbRes } from "../../types/imageUpload";

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
  // state
  const [selectedFile, setFile] = React.useState<File | null>(null);
  const [imageSrc, setImage] = React.useState("");

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
      setImage(image.url);
    } catch (err) {
      if (err) console.error(err);
    }
  };

  return (
    <>
      <Modal
        opened={openned}
        onClose={() => setOpenned(false)}
        title={`Update ${updateField}`}
      >
        <form>
          {updateField === "name" && (
            <TextInput
              label="Username"
              withAsterisk
              {...updateForm.getInputProps("name")}
            />
          )}
          {updateField === "pfp" && (
            <Group>
              {selectedFile && (
                <Text size={"xs"} mt={"sm"}>
                  {selectedFile.name}
                </Text>
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
                    color={imageSrc === "" ? "violet" : "lime"}
                    className={
                      imageSrc === ""
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
            </Group>
          )}
        </form>
      </Modal>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Box, Button, FileButton, Group, TextInput, Text } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { signIn } from "next-auth/react";
import { ImgbbRes } from "../../types/imageUpload";

export default function SignupForm() {
  // state
  const [selectedFile, setFile] = useState<File | null>(null);

  // regEx
  const nameVal = /^[a-z0-9$@$!%*?&_]{3,15}$/i;
  const emailVal = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
  const passVal =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,24}$/;

  // form options
  const signupForm = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passConfirm: "",
      imageSrc: "",
    },
    validateInputOnBlur: true,
    validate: {
      username: (input) =>
        !nameVal.test(input)
          ? `Username must be at least 3 characters with no spaces`
          : null,
      email: (input) =>
        emailVal.test(input) ? null : `Please enter a valid email`,
      password: (input) =>
        passVal.test(input)
          ? null
          : `Must be 6-24 characters and contain one uppercase, lowercase, special character, and number`,
      passConfirm: (input, { password }) =>
        password === input ? null : `Passwords do not match`,
    },
  });

  //mutations
  const { mutate: addUser, error: addUserError } = trpc.useMutation(
    ["user.addUser"],
    {
      onSuccess() {
        signIn("credentials", {
          email: signupForm.values.email,
          password: signupForm.values.password,
        });
      },
    }
  );

  // hanlder
  const createUserHandler = (values: typeof signupForm.values) => {
    try {
      addUser({ ...values });
    } catch (err) {
      if (addUserError) console.error(addUserError);
    }
  };
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
          method: "POST",
          body: body,
        }
      );
      const res: ImgbbRes = await req.json();

      const {
        data: { image },
      } = res;
      signupForm.setFieldValue("imageSrc", image.url);
    } catch (err) {
      if (err) console.error(err);
    }
  };

  if (selectedFile) {
    console.log(selectedFile);
  }
  console.log(signupForm.values);

  return (
    <Box>
      <form onSubmit={signupForm.onSubmit(createUserHandler)}>
        <TextInput
          placeholder="Name"
          label="Username"
          withAsterisk
          {...signupForm.getInputProps("username")}
        />
        <TextInput
          placeholder="example@email.com"
          label="Email"
          withAsterisk
          {...signupForm.getInputProps("email")}
        />
        <Group position="center" grow={true} spacing={"sm"}>
          <TextInput
            type="password"
            placeholder="******"
            label="Password"
            withAsterisk
            {...signupForm.getInputProps("password")}
          />
          <TextInput
            type="password"
            placeholder="******"
            label="Confirm Password"
            withAsterisk
            {...signupForm.getInputProps("passConfirm")}
          />
        </Group>
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
              color={signupForm.values.imageSrc === "" ? "violet" : "lime"}
              className={
                signupForm.values.imageSrc === ""
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
            mt={"md"}
            className="bg-violet-500"
            color={"violet"}
            type="submit"
          >
            Sign Up
          </Button>
        </Group>
      </form>
    </Box>
  );
}

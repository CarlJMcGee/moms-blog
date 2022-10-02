import * as React from "react";
import { useForm } from "@mantine/form";
import { Box, Button, Group, TextInput } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { signIn } from "next-auth/react";

export interface ISignupFormProps {}

export default function SignupForm(props: ISignupFormProps) {
  const nameVal = /^[a-z0-9$@$!%*?&_]{3,15}$/i;
  const emailVal = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;
  const passVal =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,24}$/;
  const signupForm = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passConfirm: "",
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

  const { mutate: addUser } = trpc.useMutation(["user.addUser"], {
    onSuccess() {
      signIn("credentials", {
        email: signupForm.values.email,
        password: signupForm.values.password,
      });
    },
  });

  return (
    <Box>
      <form
        onSubmit={signupForm.onSubmit(({ username, email, password }) =>
          addUser({ username: username, email: email, password: password })
        )}
      >
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

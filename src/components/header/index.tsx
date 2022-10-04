import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  Group,
  HoverCard,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import SignupForm from "../signupForm";

export interface IHeaderProps {
  sess: Session | null;
}

export default function Header({ sess }: IHeaderProps) {
  const [drawerOpened, setDrawer] = React.useState(false);

  // not logged in
  if (!sess?.user) {
    return (
      <>
        <Box>
          <Group position="apart" className="m-5">
            <Title>Sanity Adjacent</Title>
            <Group position="center" className="mx-10">
              <Button
                variant="filled"
                color={"violet"}
                className="bg-purple-700"
                onClick={() => signIn()}
              >
                Log in
              </Button>
              <Button
                variant="filled"
                color={"violet"}
                className="bg-purple-700"
                onClick={() => setDrawer(true)}
              >
                Sign Up
              </Button>
            </Group>
          </Group>
        </Box>

        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawer(false)}
          title="Register"
          padding={"xl"}
          size="xl"
          position="top"
        >
          <SignupForm />
        </Drawer>
      </>
    );
  }

  // logged in
  return (
    <Box>
      <Group position="apart" className="m-5">
        <Title>Sanity Adjacent</Title>
        <Group position="center" className="mx-10">
          <HoverCard width={150} position="bottom">
            <HoverCard.Target>
              <UnstyledButton>
                <Group position="apart">
                  <Avatar src={sess.user.image} radius={"lg"} size={"md"} />
                  <Text className="text-pallete-grey-dark">
                    {sess?.user?.name}
                  </Text>
                </Group>
              </UnstyledButton>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Group position="center">
                <Button
                  variant="filled"
                  color={"violet"}
                  className="bg-purple-700"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </Group>
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>
      </Group>
    </Box>
  );
}

import * as React from "react";
import {
  Box,
  Button,
  Drawer,
  Group,
  HoverCard,
  Text,
  Title,
} from "@mantine/core";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import SignupForm from "../signupForm";

export interface IHeaderProps {
  sess: Session | null;
}

export default function Header({ sess }: IHeaderProps) {
  const [drawerOpened, setDrawer] = React.useState(false);

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

  return (
    <Box>
      <Group position="apart" className="m-5">
        <Title>Sanity Adjacent</Title>
        <Group position="center" className="mx-10">
          <HoverCard width={150} position="bottom">
            <HoverCard.Target>
              <Button
                variant="filled"
                color={"violet"}
                className="bg-purple-700"
              >
                {sess?.user?.name}
              </Button>
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

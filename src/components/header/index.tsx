import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  Group,
  Image,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import SignupForm from "../signupForm";
import { IconChevronDown } from "@tabler/icons";
import { trpc } from "../../utils/trpc";
import UpdateInfoForm from "../updateInfo";
import logo from "./assets/sanity-adjacent-logo-template.webp";

export interface IHeaderProps {
  sess: Session | null;
}

export default function Header({ sess }: IHeaderProps) {
  const { data: me, isLoading: meLoading } = trpc.useQuery(["user.me"]);

  const [drawerOpened, setDrawer] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [updateField, setUpdateField] = React.useState<"name" | "pfp">("name");

  // handler
  const updateModalHandler = (
    e: React.MouseEvent<HTMLElement>,
    field: "name" | "pfp"
  ) => {
    e.preventDefault();

    setUpdateField(field);
    setUpdateOpen(true);
  };

  // not logged in
  if (!sess?.user) {
    return (
      <>
        <Box>
          <Group position="center" className="m-5">
            <Image
              src={logo.src}
              width={200}
              mx={"100"}
              alt={`sanity adjacent logo`}
            />
            <Button
              variant="filled"
              color={"cyan"}
              className="bg-palette-blue-dark"
              onClick={() => signIn()}
            >
              Log in
            </Button>
            <Button
              variant="filled"
              color={"cyan"}
              className="bg-palette-blue-dark"
              onClick={() => setDrawer(true)}
            >
              Sign Up
            </Button>
          </Group>
        </Box>

        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawer(false)}
          title="Register"
          padding={"xl"}
          size={"75%"}
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
      <Group position="center" className="m-5">
        <Image src={logo.src} width={200} mx={"100"} />
        <Group position="center" className="mx-10">
          <Menu
            shadow={"lg"}
            width={200}
            position="bottom"
            closeOnClickOutside
            trigger={window.innerWidth >= 1024 ? "hover" : "click"}
          >
            <Menu.Target>
              <UnstyledButton>
                <Group position="apart">
                  <Avatar src={me?.image} radius={"lg"} size={"md"} />
                  <Text size={25} className="text-palette-grey-dark font-bold">
                    {me?.name}
                  </Text>
                  <IconChevronDown />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                color={"green"}
                className="text-center"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  updateModalHandler(e, "name")
                }
              >
                Change Username
              </Menu.Item>
              <Menu.Item
                color={"green"}
                className="text-center"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  updateModalHandler(e, "pfp")
                }
              >
                Change
                <br />
                Profile Picture
              </Menu.Item>
              <Menu.Item
                color={"cyan"}
                className="text-center"
                onClick={() => signOut()}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
      <UpdateInfoForm
        updateField={updateField}
        openned={updateOpen}
        setOpenned={setUpdateOpen}
      />
    </Box>
  );
}

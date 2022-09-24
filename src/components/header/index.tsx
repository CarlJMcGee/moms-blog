import * as React from "react";
import { Box, Group, Text, Title } from "@mantine/core";

export interface IHeaderProps {}

export default function Header(props: IHeaderProps) {
  return (
    <div>
      <Group position="apart" className="m-5">
        <Title>Sanity Adjacent</Title>
        <Group position="center" className="mx-4">
          <Text>Username</Text>
        </Group>
      </Group>
    </div>
  );
}

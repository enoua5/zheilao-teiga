import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import {
    ActionIcon,
    AppShell,
    AppShellHeader,
    AppShellMain,
    AppShellNavbar,
    ButtonGroup,
    ColorSchemeScript,
    createTheme,
    Group,
    MantineProvider,
    NavLink,
    Stack,
    Text,
} from "@mantine/core";
import { Ballpen, BrandGithub, Home as IconHome } from "tabler-icons-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: {
        template: "%s | ZT",
        default: "Zheilao Teiga",
    },
    description: "Zheilao Teiga information archive",
};

const theme = createTheme({});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ColorSchemeScript defaultColorScheme="auto" />
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <AppShell
                        header={{ height: "5em" }}
                        navbar={{ breakpoint: "xs", width: "25ch" }}
                        padding="sm"
                    >
                        <AppShellHeader>
                            <Group
                                h="100%"
                                align="center"
                                px="xl"
                                justify="space-between"
                            >
                                <Text size="xl">Zheilao Teiga</Text>
                                <ButtonGroup>
                                    <ActionIcon
                                        component={Link}
                                        href="https://github.com/enoua5/zheilao-teiga"
                                        target="_blank"
                                        variant="default"
                                        color="black"
                                        size="lg"
                                    >
                                        <BrandGithub />
                                    </ActionIcon>
                                </ButtonGroup>
                            </Group>
                        </AppShellHeader>
                        <AppShellNavbar>
                            <Stack gap={0}>
                                <NavLink
                                    component={Link}
                                    label="Home"
                                    href="/"
                                    leftSection={<IconHome />}
                                />
                                <NavLink
                                    component={Link}
                                    label="Tezago text renderer"
                                    href="/text-rendering"
                                    leftSection={<Ballpen />}
                                />
                            </Stack>
                        </AppShellNavbar>
                        <AppShellMain>{children}</AppShellMain>
                    </AppShell>
                </MantineProvider>
            </body>
        </html>
    );
}

import { Stack, Title } from "@mantine/core";
import { Metadata } from "next";
import TezagoTextRenderTool from "./render-tool";

export const metadata: Metadata = {
    title: "Tezago text renderer",
};

export default function TextRenderingPage() {
    return (
        <Stack>
            <Title>Tezago text rendering tool</Title>
            <TezagoTextRenderTool />
        </Stack>
    );
}

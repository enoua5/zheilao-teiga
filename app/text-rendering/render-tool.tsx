"use client";

import TezagoText from "@/component/text-render/tezago-text";
import { Box, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

export default function TezagoTextRenderTool() {
    const [text, setText] = useState("");

    return (
        <Stack>
            <Box>
                <TezagoText text={text} />
            </Box>
            <TextInput
                label="Text to render"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </Stack>
    );
}

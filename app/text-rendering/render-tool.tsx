"use client";

import TezagoText from "@/component/text-render/tezago-text";
import { Box, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

export default function TezagoTextRenderTool() {
    const [text, setText] = useState("");

    return (
        <Stack>
            <Box>
                Test <TezagoText text={text} line_thickness={1.5} char_height={256} />
            </Box>
            <TextInput
                label="Text to render"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </Stack>
    );
}

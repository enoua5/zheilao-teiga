"use client";

import TezagoText from "@/component/text-render/tezago-text";
import { Stack, TextInput } from "@mantine/core";
import { useState } from "react";

export default function TezagoTextRenderTool() {
    const [text, setText] = useState("");

    return (
        <Stack>
            <TezagoText text={text} />
            <TextInput
                label="Text to render"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </Stack>
    );
}

"use client";

import React, {
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { renderTezago, TezagoRenderOptions } from "./render-tezago";
import { useComputedColorScheme } from "@mantine/core";

export interface TezagoTextProps extends TezagoRenderOptions {
    text: string;
}

/**
 * Tezago text-rendering box
 */
export default function TezagoText({ text, ...options }: TezagoTextProps) {
    const image_ref: RefObject<HTMLImageElement | null> = useRef(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const dark_mode = useComputedColorScheme('light') == "dark";
    const color = options.color ?? dark_mode ? "white" : "black";

    useEffect(() => setCanvas(document.createElement("canvas")), []);

    const renderImageRef = useCallback(
        (image: HTMLImageElement | null) => {
            image_ref.current = image;
            if (image && canvas) {
                renderTezago(
                    canvas,
                    text,
                    {
                        ...options,
                        color,
                    }
                );
                image.src = canvas.toDataURL();
                image.alt = text;
            }
        },
        [canvas, options, text]
    );

    useEffect(() => {
        renderImageRef(image_ref.current);
    }, [renderImageRef]);

    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={renderImageRef} src="#" alt="" />;
}

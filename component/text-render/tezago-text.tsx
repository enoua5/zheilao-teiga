"use client";

import React, {
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { renderTezago } from "./render-tezago";

export interface TezagoTextProps {
    text: string;
}

/**
 * Tezago text-rendering box
 */
export default function TezagoText({ text }: TezagoTextProps) {
    const image_ref: RefObject<HTMLImageElement | null> = useRef(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

    useEffect(() => setCanvas(document.createElement("canvas")), []);

    const renderImageRef = useCallback(
        (image: HTMLImageElement | null) => {
            image_ref.current = image;
            if (image && canvas) {
                renderTezago(canvas, text);
                image.src = canvas.toDataURL();
                image.alt = text;
            }
        },
        [canvas, text]
    );

    useEffect(() => {
        renderImageRef(image_ref.current);
    }, [renderImageRef]);

    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={renderImageRef} src="#" alt="" />;
}

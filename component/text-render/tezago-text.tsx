"use client";

import React, { RefObject, useCallback, useEffect, useRef } from "react";
import { renderTezago } from "./render-tezago";

export interface TezagoTextProps {
    text: string;
}

/**
 * Tezago text-rendering box
 */
export default function TezagoText({ text }: TezagoTextProps) {
    const canvas_ref: RefObject<HTMLCanvasElement | null> = useRef(null);

    const renderCanvasRef = useCallback(
        (canvas: HTMLCanvasElement | null) => {
            canvas_ref.current = canvas;
            if (canvas) {
                renderTezago(canvas, text);
            }
        },
        [text]
    );

    useEffect(() => {
        renderCanvasRef(canvas_ref.current);
    }, [renderCanvasRef]);

    return <canvas ref={renderCanvasRef}></canvas>;
}

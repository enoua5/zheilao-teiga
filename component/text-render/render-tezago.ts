import { parseTezago, TezagoCharacter } from "./parse-tezago";
import tezago_path_builder from "./paths";

export interface TezagoRenderOptions {
    char_height?: number;
    char_width?: number;
    syllable_spacing?: number;
    word_spacing?: number;
    line_thickness?: number;
    color?: string;
}

function drawCharTo(
    ctx: CanvasRenderingContext2D,
    char_info: TezagoCharacter,
    bounding_box: { x: number; y: number; width: number; height: number }
) {
    try {
        ctx.save();
        const path = tezago_path_builder.getPathForSyllable(char_info);
        // Move to where we want the shape drawn
        ctx.translate(bounding_box.x, bounding_box.y);
        // Scale it so our 10x25 character is the width and height we want
        ctx.scale(bounding_box.width / 10, bounding_box.height / 25);
        // Go ahead and draw it!
        ctx.stroke(path);
        // ctx.rect(bounding_box.x, bounding_box.y, bounding_box.width, bounding_box.height);
        // ctx.stroke();
    } finally {
        ctx.restore();
    }
}

export function renderTezago(
    canvas: HTMLCanvasElement,
    text: string,
    options?: TezagoRenderOptions
): void {
    // Get our drawing context
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    // Resolve variables
    const char_height =
        options?.char_height ??
        (options?.char_width ? options.char_width * 2.5 : 90);
    const char_width = options?.char_width ?? char_height / 2;
    const syllable_spacing = options?.syllable_spacing ?? char_width * 0.2;
    const word_spacing = options?.word_spacing ?? syllable_spacing * 5;
    const line_thickness = options?.line_thickness ?? 1;
    const padding = line_thickness * 2;

    // Parse the text and size the canvas based on how much room we'll need
    const text_info = parseTezago(text);

    const total_word_gaps = Math.max(0, text_info.length - 1);
    const total_syllables = text_info.reduce(
        (acc, value) => acc + value.syllables.length,
        0
    );
    const total_syllable_gaps = text_info.reduce(
        (acc, value) => acc + Math.max(0, value.syllables.length - 1),
        0
    );

    const total_width =
        total_syllables * char_width +
        total_syllable_gaps * syllable_spacing +
        total_word_gaps * word_spacing;

    canvas.height = char_height + 2 * padding;
    canvas.width = total_width + 2 * padding;

    // Time to start drawing

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = line_thickness;
    ctx.strokeStyle = options?.color ?? "black";
    // ctx.lineCap = "square"
    ctx.lineCap = "round";
    // ctx.lineCap = "butt"

    // We'll iterate through it, keeping track of where we're drawing each character
    let x_pos = padding;
    for (const word of text_info) {
        for (const char of word.syllables) {
            drawCharTo(ctx, char, {
                x: x_pos,
                y: padding,
                width: char_width,
                height: char_height,
            });

            x_pos += char_width + syllable_spacing;
        }
        // couldn't be bothered to do fence-post correctly here.
        x_pos -= syllable_spacing;
        x_pos += word_spacing;
    }
}

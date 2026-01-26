import { parseTezago } from "./parse-tezago";

export interface TezagoRenderOptions {
    char_height?: number;
    char_width?: number;
    syllable_spacing?: number;
    word_spacing?: number;
}

export function renderTezago(
    canvas: HTMLCanvasElement,
    text: string,
    options?: TezagoRenderOptions
): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    const text_info = parseTezago(text);

    const char_height =
        options?.char_height ??
        (options?.char_width ? options.char_width * 2.5 : 90);
    const char_width = options?.char_width ?? char_height / 2.5;
    const syllable_spacing = options?.syllable_spacing ?? char_width * 0.1;
    const word_spacing = options?.word_spacing ?? syllable_spacing * 5;

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
        total_word_gaps * word_spacing +
        // margins
        2 * syllable_spacing;

    canvas.height = char_height;
    canvas.width = total_width;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "50px serif";
    ctx.strokeText(text, 0, 50);
}

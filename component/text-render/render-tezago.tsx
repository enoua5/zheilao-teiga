export function renderTezago(canvas: HTMLCanvasElement, text: string): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "50px serif";
    ctx.strokeText(text, 0, 50);
}

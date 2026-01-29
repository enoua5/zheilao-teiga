// Consonant test string: fafyaf hahyah kakyak lalyal nanyan papyap sasyas tatyat cacyac yayyay

import {
    TezagoCharacter,
    TezagoSyllable,
    TezagoUnvoicedConsonant,
    TezagoVowel,
} from "./parse-tezago";

const full_char_data: Map<string, undefined | (() => Path2D)> = new Map(
    Object.entries({
        TE: (): Path2D => {
            const path = new Path2D();
            const { top, bottom, left, right, middle } = getConsonantPointInfo(
                0,
                1,
                true
            );
            path.moveTo(left, top);
            path.lineTo(right, top);
            path.bezierCurveTo(
                right,
                top * 0.6 + bottom * 0.4,
                left,
                top * 0.4 + bottom * 0.6,
                left,
                bottom
            );
            path.moveTo(middle, top * 0.5 + bottom * 0.5);
            path.bezierCurveTo(
                middle,
                top * 0.4 + bottom * 0.6,
                middle,
                bottom,
                right,
                bottom
            );
            return path;
        },
        TO: (): Path2D => {
            const path = new Path2D();

            const { top: real_top } = getConsonantPointInfo(0, 1, true);

            const { top, bottom, left, right, middle } = getVowelPointInfo(
                0,
                1,
                false
            );

            const touch_x = left * 0.65 + right * 0.35;
            const y_inflect = top * 0.5 + bottom * 0.5;
            const tail_inflect_x = left * 0.3 + right * 0.7;
            const tail_inflect_y = top * 0.3 + bottom * 0.7;

            path.moveTo(left, real_top);
            path.lineTo(right, real_top);
            path.bezierCurveTo(middle, bottom, right, bottom, touch_x, bottom);
            path.bezierCurveTo(
                left * 0.6 + right * 0.4,
                bottom,
                left,
                bottom * 0.9 + top * 0.1,
                left,
                y_inflect
            );
            path.bezierCurveTo(
                left,
                bottom * 0.4 + top * 0.6,
                middle * 0.1 + left * 0.9,
                top,
                middle,
                top
            );
            path.bezierCurveTo(
                right,
                top,
                middle,
                y_inflect,
                tail_inflect_x,
                tail_inflect_y
            );
            path.bezierCurveTo(right, bottom, middle, y_inflect, right, bottom);
            return path;
        },
    })
);

const full_consonant_data: Map<
    string,
    undefined | ((full_height: boolean) => Path2D)
> = new Map(
    Object.entries({
        TS: function (full_height: boolean): Path2D {
            const { top, bottom, left, right } = getConsonantPointInfo(
                0,
                1,
                full_height
            );
            const bar_offset = (right - left) * 0.2;
            const bar_height = (top + bottom) * 0.5;
            const path = new Path2D();
            path.moveTo(left, top);
            path.lineTo(right, top);
            path.lineTo(right, bottom);
            path.moveTo(left + bar_offset, bar_height);
            path.lineTo(right - bar_offset, bar_height);
            return path;
        },
    })
);

const full_vowel_data: Map<
    string,
    undefined | ((full_height: boolean) => Path2D)
> = new Map(
    Object.entries({
        EI: (full_height: boolean): Path2D => {
            const path = new Path2D();
            const { top, bottom, left, right, middle } = getVowelPointInfo(
                0,
                1,
                full_height
            );
            const line_offset = 2;

            path.moveTo(middle - line_offset, top);
            path.bezierCurveTo(
                middle - line_offset,
                top * 0.4 + bottom * 0.6,
                left,
                bottom,
                left,
                bottom
            );
            path.moveTo(middle, top);
            path.lineTo(middle, bottom);
            path.moveTo(middle + line_offset, top);
            path.bezierCurveTo(
                middle + line_offset,
                top * 0.4 + bottom * 0.6,
                right,
                bottom,
                right,
                bottom
            );
            return path;
        },
        AO: (full_height: boolean): Path2D => {
            const { top, bottom, left, right, middle } = getVowelPointInfo(
                0,
                1,
                full_height
            );
            const y_middle = top * 0.5 + bottom * 0.5;
            const path = new Path2D();
            path.moveTo(left, top);
            path.lineTo(left, bottom);
            path.moveTo(left, top);
            path.lineTo(right, top);
            path.bezierCurveTo(right, y_middle, right, bottom, middle, bottom);
            path.bezierCurveTo(left, bottom, left, top, middle, y_middle);
            path.lineTo(right, bottom);
            return path;
        },
    })
);

function getConsonantPointInfo(
    part_number: number,
    total_parts: number,
    full_height: boolean
): {
    top: number;
    bottom: number;
    left: number;
    right: number;
    middle: number;
} {
    const top = 5;
    const bottom = full_height ? 25 : 15;
    const left = (10 * part_number) / total_parts;
    const right = (10 * (part_number + 1)) / total_parts;
    const middle = (right + left) / 2;
    return { top, bottom, left, right, middle };
}

const consonant_part_data: Record<
    TezagoUnvoicedConsonant,
    (part_number: number, total_parts: number, full_height: boolean) => Path2D
> = {
    F: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );

        const path = new Path2D();
        path.moveTo(middle, top);
        path.bezierCurveTo(
            middle,
            (top + bottom) * 0.6,
            left,
            bottom,
            left,
            bottom
        );
        path.moveTo(middle, top);
        path.bezierCurveTo(
            middle,
            (top + bottom) * 0.6,
            right,
            bottom,
            right,
            bottom
        );
        // circle
        const circle = new Path2D();
        circle.arc(
            middle,
            top * 0.22 + bottom * 0.78,
            1.2 / total_parts,
            0,
            Math.PI * 2
        );
        path.addPath(circle);
        return path;
    },
    H: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );

        const path = new Path2D();
        path.moveTo(middle, top);
        path.bezierCurveTo(
            middle,
            top * 0.4 + bottom * 0.6,
            left,
            bottom,
            left,
            bottom
        );
        path.moveTo(middle, top);
        path.bezierCurveTo(
            middle,
            top * 0.4 + bottom * 0.6,
            right,
            bottom,
            right,
            bottom
        );
        return path;
    },
    K: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const path = new Path2D();
        path.arc(
            middle,
            (top + bottom) / 2,
            (right - left) * 0.35,
            0,
            Math.PI * 2
        );
        return path;
    },
    L: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const bar_height = (top + bottom) * 0.5;
        const line_offset = (middle - left) * 0.4;
        const path = new Path2D();
        path.moveTo(middle - line_offset, top);
        path.lineTo(middle - line_offset, bottom);
        path.moveTo(middle + line_offset, top);
        path.lineTo(middle + line_offset, bottom);
        path.moveTo(left, bar_height);
        path.lineTo(right, bar_height);
        return path;
    },
    N: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const bar_height = (top + bottom) * 0.5;
        const path = new Path2D();
        path.moveTo(middle, top);
        path.lineTo(middle, bottom);
        path.moveTo(left, bar_height);
        path.lineTo(right, bar_height);
        return path;
    },
    P: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const path = new Path2D();
        const drop_point = top * 0.7 + bottom * 0.3;
        const circle_top = drop_point * 0.9 + bottom * 0.1;
        const circle_middle = (circle_top + bottom) / 2;

        path.moveTo(left, top);
        path.bezierCurveTo(
            left,
            drop_point,
            middle,
            drop_point,
            middle,
            drop_point
        );
        path.bezierCurveTo(right, drop_point, right, top, right, top);
        path.moveTo(middle, drop_point);
        path.ellipse(
            middle,
            circle_middle,
            circle_middle - circle_top,
            middle - left,
            Math.PI * 1.5,
            0,
            Math.PI * 2
        );
        return path;
    },
    S: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const bar_height = (top + bottom) * 0.5;
        const path = new Path2D();
        path.moveTo(left, bar_height);
        path.lineTo(right, bar_height);
        return path;
    },
    T: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const path = new Path2D();
        path.moveTo(left, top);
        path.lineTo(right, top);
        path.lineTo(right, bottom);
        return path;
    },
    C: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );

        const y_middle = (top + bottom) / 2;
        const letter_top = top * 0.5 + y_middle * 0.5;
        const letter_bottom = bottom * 0.5 + y_middle * 0.5;
        const letter_left = left * 0.7 + middle * 0.3;
        const letter_right = right * 0.7 + middle * 0.3;

        const path = new Path2D();
        path.moveTo(middle, letter_top);
        path.lineTo(letter_left, y_middle);
        path.moveTo(letter_right, y_middle);
        path.lineTo(middle, letter_bottom);
        return path;
    },
    Y: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getConsonantPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const path = new Path2D();
        if (part_number == 0) {
            const letter_top = top * 0.8 + bottom * 0.2;
            const letter_bottom = top * 0.2 + bottom * 0.8;
            path.moveTo(middle, letter_top);
            path.lineTo(middle, letter_bottom);
        } else {
            const letter_top = top * 0.8 + bottom * 0.2;
            const letter_bottom = top * 0.4 + bottom * 0.6;
            path.moveTo(right, letter_top);
            path.lineTo(left * 0.8 + right * 0.2, letter_bottom);
        }
        return path;
    },
};

function getVowelPointInfo(
    part_number: number,
    total_parts: number,
    full_height: boolean
): {
    top: number;
    bottom: number;
    left: number;
    right: number;
    middle: number;
} {
    const top = full_height ? 5 : 15;
    const bottom = 25;
    const left = (10 * part_number) / total_parts;
    const right = (10 * (part_number + 1)) / total_parts;
    const middle = (right + left) / 2;
    return { top, bottom, left, right, middle };
}

const vowel_part_data: Record<
    TezagoVowel,
    (part_number: number, total_parts: number, full_height: boolean) => Path2D
> = {
    A: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right } = getVowelPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const path = new Path2D();
        path.moveTo(left, top);
        path.lineTo(right, top);
        path.lineTo(right, bottom);
        return path;
    },
    Æ: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right } = getVowelPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const path = new Path2D();
        path.moveTo(left, top);
        path.lineTo(right, top);
        path.moveTo(left, top);
        path.lineTo(left, bottom);
        return path;
    },
    E: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getVowelPointInfo(
            part_number,
            total_parts,
            full_height
        );

        const path = new Path2D();
        path.moveTo(middle, top);
        path.bezierCurveTo(
            middle,
            top * 0.4 + bottom * 0.6,
            left,
            bottom,
            left,
            bottom
        );
        path.moveTo(middle, top);
        path.bezierCurveTo(
            middle,
            top * 0.4 + bottom * 0.6,
            right,
            bottom,
            right,
            bottom
        );
        return path;
    },
    I: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right } = getVowelPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const path = new Path2D();
        path.moveTo(left, top);
        path.lineTo(right, top);
        path.moveTo(left, top);
        path.lineTo(left, bottom);
        path.lineTo(right, bottom);
        return path;
    },
    O: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right, middle } = getVowelPointInfo(
            part_number,
            total_parts,
            full_height
        );

        const touch_x = left * 0.65 + right * 0.35;
        const y_inflect = top * 0.5 + bottom * 0.5;
        const tail_inflect_x = left * 0.3 + right * 0.7;
        const tail_inflect_y = top * 0.3 + bottom * 0.7;

        const path = new Path2D();
        path.moveTo(middle, top);
        path.bezierCurveTo(
            middle,
            y_inflect,
            middle,
            y_inflect,
            middle,
            y_inflect
        );
        path.bezierCurveTo(middle, bottom, middle, bottom, touch_x, bottom);
        path.bezierCurveTo(
            left * 0.6 + right * 0.4,
            bottom,
            left,
            bottom * 0.9 + top * 0.1,
            left,
            y_inflect
        );
        path.bezierCurveTo(
            left,
            bottom * 0.4 + top * 0.6,
            middle * 0.1 + left * 0.9,
            top,
            middle,
            top
        );
        path.bezierCurveTo(
            right,
            top,
            middle,
            y_inflect,
            tail_inflect_x,
            tail_inflect_y
        );
        path.bezierCurveTo(right, bottom, middle, y_inflect, right, bottom);
        return path;
    },
    U: function (
        part_number: number,
        total_parts: number,
        full_height: boolean
    ): Path2D {
        const { top, bottom, left, right } = getVowelPointInfo(
            part_number,
            total_parts,
            full_height
        );
        const path = new Path2D();
        path.moveTo(left, top);
        path.lineTo(right, top);
        path.lineTo(right, bottom);
        path.moveTo(left, bottom);
        path.lineTo(right, bottom);
        return path;
    },
};

function getYPath(full_height: boolean): Path2D {
    const { top, bottom, left, right } = getConsonantPointInfo(
        0,
        1,
        full_height
    );
    const path = new Path2D();
    const letter_top = top * 0.7 + bottom * 0.3;
    const letter_bottom = top * 0.3 + bottom * 0.7;
    path.moveTo(right * 1.2 + left * -0.2, letter_top);
    path.lineTo(left * 0.2 + right * 0.8, letter_bottom);
    return path;
}

class TezagoPathBuilder {
    drawTofu() {
        const path = new Path2D();
        path.rect(0, 0, 10, 25);
        return path;
    }

    drawVoicingMark() {
        const path = new Path2D();
        path.arc(5, 2, 1.5, 0, Math.PI * 2);
        return path;
    }

    getConsonantPath(char: TezagoSyllable): Path2D {
        const full_height = char.vowel_base_parts.length == 0;

        const full_consonant = char.consonant_base_parts.join("");
        const full_consonent_path =
            full_consonant_data.get(full_consonant)?.(full_height);
        if (full_consonent_path) {
            return full_consonent_path;
        }

        const path = new Path2D();

        const base_parts = [...char.consonant_base_parts];
        let y_mark = false;
        if (base_parts.length > 1 && base_parts[base_parts.length - 1] == "Y") {
            y_mark = true;
            base_parts.splice(-1);
        }

        for (
            let part_number = 0;
            part_number < base_parts.length;
            part_number++
        ) {
            const part = base_parts[part_number];
            path.addPath(
                consonant_part_data[part](
                    part_number,
                    base_parts.length,
                    full_height
                )
            );
        }

        if (y_mark) {
            path.addPath(getYPath(full_height));
        }

        return path;
    }

    getVowelPath(char: TezagoSyllable): Path2D {
        const full_height = char.consonant_base_parts.length == 0;

        const full_vowel = char.vowel_base_parts.join("");
        const full_vowel_path = full_vowel_data.get(full_vowel)?.(full_height);
        if (full_vowel_path) {
            return full_vowel_path;
        }

        const path = new Path2D();
        for (
            let part_number = 0;
            part_number < char.vowel_base_parts.length;
            part_number++
        ) {
            const part = char.vowel_base_parts[part_number];
            path.addPath(
                vowel_part_data[part](
                    part_number,
                    char.vowel_base_parts.length,
                    full_height
                )
            );
        }
        return path;
    }

    getBasePath(char: TezagoSyllable): Path2D {
        const full_char_text =
            char.consonant_base_parts.join("") + char.vowel_base_parts.join("");
        const full_char_path = full_char_data.get(full_char_text)?.();
        if (full_char_path) {
            return full_char_path;
        }

        const path = new Path2D();
        path.addPath(this.getConsonantPath(char));
        path.addPath(this.getVowelPath(char));
        return path;
    }

    /** Paths are returned with the assumption of being 10x25 */
    getPathForSyllable(char: TezagoCharacter): Path2D {
        if (!char.parsable) {
            return this.drawTofu();
        }

        const path = new Path2D();
        if (char.voiced) {
            path.addPath(this.drawVoicingMark());
        }

        path.addPath(this.getBasePath(char));

        return path;
    }
}

const tezago_path_builder = new TezagoPathBuilder();
export default tezago_path_builder;

export type TezagoUnvoicedConsonant =
    | "F"
    | "H"
    | "K"
    | "L"
    | "N"
    | "P"
    | "S"
    | "T"
    | "C"
    | "Y";
export type TezagoVoicedConsonant =
    | "V"
    | "'"
    | "G"
    | "R"
    | "M"
    | "B"
    | "Z"
    | "D"
    | "X"
    | "W";
export type TezagoConsonant = TezagoUnvoicedConsonant | TezagoVoicedConsonant;
export type TezagoVowel = "A" | "E" | "I" | "O" | "U";

export interface TezagoSyllable {
    parsable: true;
    raw: string;
    raw_consonant: string;
    raw_vowel: string;

    consonant_base_parts: TezagoUnvoicedConsonant[];
    voiced: boolean;
    vowel_base_parts: TezagoVowel[];
}

export interface UnparseableTezagoWordPart {
    parsable: false;
    raw: string;
}

export interface TezagoWord {
    syllables: (TezagoSyllable | UnparseableTezagoWordPart)[];
}

const allowed_unvoiced_consonant: Set<TezagoUnvoicedConsonant> = new Set([
    "F",
    "H",
    "K",
    "L",
    "N",
    "P",
    "S",
    "T",
    "C",
    "Y",
]);
const allowed_voiced_consonant: Set<TezagoVoicedConsonant> = new Set([
    "V",
    "'",
    "G",
    "R",
    "M",
    "B",
    "Z",
    "D",
    "X",
    "W",
]);
const allowed_consonant: Set<TezagoConsonant> = allowed_voiced_consonant.union(
    allowed_unvoiced_consonant
);
const allowed_vwl = new Set<TezagoVowel>(["A", "E", "I", "O", "U"]);

function isVoicedConsonant(char: string): char is TezagoVoicedConsonant {
    return (allowed_voiced_consonant as Set<string>).has(char);
}

function isConsonant(char: string): char is TezagoConsonant {
    return (allowed_consonant as Set<string>).has(char);
}

function isVowel(char: string): char is TezagoVowel {
    return (allowed_vwl as Set<string>).has(char);
}

const VOICED_TO_UNVOICED: {
    [c in TezagoVoicedConsonant]: TezagoUnvoicedConsonant;
} = {
    V: "F",
    "'": "H",
    G: "K",
    R: "L",
    M: "N",
    B: "P",
    Z: "S",
    D: "T",
    X: "C",
    W: "Y",
};

/**
 * Parse standard Tezago text input into a render-ready form
 *
 * Consonants
 * - F / V
 * - H / '
 * - K / G
 * - L / R
 * - N / M
 * - P / B
 * - S / Z
 * - T / D
 * - C / X (sh / zh)
 * - Y / W
 *
 * Consonant blends
 * - FY / VW
 * - HY / 'W
 * - KY / GW
 * - NY / MW
 * - PY / BW
 * - SY / ZW
 * - TY / DW
 * - CY / XW
 * - TS / DZ
 * - TC / DX
 * - TSY / DZW
 * - TCY / DXW
 *
 * Vowels
 * - A
 * - E
 * - I
 * - O
 * - U
 * - EI
 * - IU
 * - AI
 * - AO
 */
export function parseTezago(text: string): TezagoWord[] {
    const parsed_parts: TezagoWord[] = [];

    let scanning_for_parsable = false;
    let raw_syllable = "";
    let raw_consonant = "";
    let raw_vowel = "";
    let consonant_base_parts: TezagoSyllable["consonant_base_parts"] = [];
    let vowel_base_parts: TezagoSyllable["vowel_base_parts"] = [];
    let voiced = false;
    let word_syllables: (TezagoSyllable | UnparseableTezagoWordPart)[] = [];

    function startNewSyllable() {
        if (raw_syllable) {
            if (scanning_for_parsable) {
                word_syllables.push({
                    parsable: false,
                    raw: raw_syllable,
                });
            } else {
                word_syllables.push({
                    parsable: true,
                    raw: raw_syllable,
                    raw_consonant,
                    raw_vowel,
                    consonant_base_parts,
                    vowel_base_parts,
                    voiced,
                });
            }
        }
        scanning_for_parsable = false;
        raw_syllable = "";
        raw_consonant = "";
        raw_vowel = "";
        consonant_base_parts = [];
        vowel_base_parts = [];
        voiced = false;
    }

    function startNewWord() {
        startNewSyllable();
        if (word_syllables.length) {
            parsed_parts.push({ syllables: word_syllables });
        }
        word_syllables = [];
    }

    for (const c of text) {
        const c_upper = c.toUpperCase();

        if (isConsonant(c_upper)) {
            if (scanning_for_parsable || raw_vowel) {
                startNewSyllable();
            }
            raw_syllable += c;
            raw_consonant += c;

            if (isVoicedConsonant(c_upper)) {
                voiced = true;
                consonant_base_parts.push(VOICED_TO_UNVOICED[c_upper]);
            } else {
                consonant_base_parts.push(c_upper);
            }
        } else if (isVowel(c_upper)) {
            if (scanning_for_parsable) {
                startNewSyllable();
            }
            raw_syllable += c;
            raw_vowel += c;
            vowel_base_parts.push(c_upper);
        } else if (c_upper === " ") {
            startNewWord();
        } else {
            scanning_for_parsable = true;
            raw_syllable += c;
        }
    }

    startNewWord();
    return parsed_parts;
}

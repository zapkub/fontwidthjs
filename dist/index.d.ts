/**
 * Font input type - can be Buffer, ArrayBuffer, or base64 string
 */
export type FontInput = any | ArrayBuffer | string;
/**
 * Options for calculating font size
 */
export interface CalculateFontSizeOptions {
    minFontSize?: number;
    maxFontSize?: number;
    precision?: number;
}
/**
 * Result of font size calculation
 */
export interface FontSizeResult {
    fontSize: number;
    actualWidth: number;
    maxWidth: number;
}
/**
 * Calculate the optimal font size to fit text within maximum width
 *
 * @param text - The text string to measure
 * @param maxWidth - Maximum width in pixels
 * @param fontInput - Font file as Buffer, ArrayBuffer, or base64 string
 * @param options - Optional configuration
 * @returns Font size result object
 */
export declare function calculateFontSize(text: string, maxWidth: number, fontInput: FontInput, options?: CalculateFontSizeOptions): FontSizeResult;
export declare function helloWorld(): string;
export default calculateFontSize;
//# sourceMappingURL=index.d.ts.map
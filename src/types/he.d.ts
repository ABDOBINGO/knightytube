declare module 'he' {
  interface HEOptions {
    strict?: boolean;
    allowUnsafeSymbols?: boolean;
  }

  export function decode(text: string, options?: HEOptions): string;
  export function encode(text: string, options?: HEOptions): string;
  export function escape(text: string): string;
  export function unescape(text: string): string;
}
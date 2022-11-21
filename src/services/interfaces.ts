export interface TranslationRequest {
  source: string;
  from_lang?: string;
  to_lang?: string;
  translator?: string;
}
export interface Translation {
  lang: string;
  translated: string;
  translator: string;
}

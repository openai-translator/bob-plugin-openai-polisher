import { Language } from "./lang";
import { LanguagePrompt } from "./types";

export const HTTP_ERROR_CODES = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "请求过于频繁，请慢一点。OpenAI 对您在 API 上的请求实施速率限制。或是您的 API credits 已超支，需要充值。好消息是您仍然可以使用官方的 Web 端聊天页面",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required"
} as const;

export type HttpErrorCode = keyof typeof HTTP_ERROR_CODES;

export const DEFAULT_PROMPT = {
  simplicity: "Revise the following sentences to make them more clear, concise, and coherent.",
  detailed: ". Please note that you need to list the changes and briefly explain why",
} as const;

export const languageMapping: Partial<Record<Language, LanguagePrompt>> = {
  "zh-Hant": {
    prompt: "潤色此句",
    detailed: "。請列出修改項目，並簡述修改原因",
  },
  "zh-Hans": {
    prompt: "润色此句",
    detailed: "。请注意要列出更改以及简要解释一下为什么这么修改",
  },
  "ja": {
    prompt: "この文章を装飾する",
    detailed: "。変更点をリストアップし、なぜそのように変更したかを簡単に説明することに注意してください",
  },
  "ru": {
    prompt: "Переформулируйте следующие предложения, чтобы они стали более ясными, краткими и связными",
    detailed: ". Пожалуйста, обратите внимание на необходимость перечисления изменений и краткого объяснения причин таких изменений",
  },
  "wyw": {
    prompt: "润色此句古文",
    detailed: "。请注意要列出更改以及简要解释一下为什么这么修改",
  },
  "yue": {
    prompt: "潤色呢句粵語",
    detailed: "。記住要列出修改嘅內容同簡單解釋下點解要做呢啲更改",
  },
};

//@ts-check

var lang = require("./lang.js");
var ChatGPTModels = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0301",
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-32k",
    "gpt-4-32k-0314",
];
var HttpErrorCodes = {
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "407": "Proxy Authentication Required",
    "408": "Request Timeout",
    "409": "Conflict",
    "410": "Gone",
    "411": "Length Required",
    "412": "Precondition Failed",
    "413": "Payload Too Large",
    "414": "URI Too Long",
    "415": "Unsupported Media Type",
    "416": "Range Not Satisfiable",
    "417": "Expectation Failed",
    "418": "I'm a teapot",
    "421": "Misdirected Request",
    "422": "Unprocessable Entity",
    "423": "Locked",
    "424": "Failed Dependency",
    "425": "Too Early",
    "426": "Upgrade Required",
    "428": "Precondition Required",
    "429": "Too Many Requests",
    "431": "Request Header Fields Too Large",
    "451": "Unavailable For Legal Reasons",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout",
    "505": "HTTP Version Not Supported",
    "506": "Variant Also Negotiates",
    "507": "Insufficient Storage",
    "508": "Loop Detected",
    "510": "Not Extended",
    "511": "Network Authentication Required"
};

/**
 * @param {string}  url
 * @returns {string} 
*/
function ensureHttpsAndNoTrailingSlash(url) {
    const hasProtocol = /^[a-z]+:\/\//i.test(url);
    const modifiedUrl = hasProtocol ? url : 'https://' + url;

    return modifiedUrl.endsWith('/') ? modifiedUrl.slice(0, -1) : modifiedUrl;
}

/**
 * @param {boolean} isAzureServiceProvider - Indicates if the service provider is Azure.
 * @param {string} apiKey - The authentication API key.
 * @returns {{
*   "Content-Type": string;
*   "api-key"?: string;
*   "Authorization"?: string;
* }} The header object.
*/
function buildHeader(isAzureServiceProvider, apiKey) {
    return {
        "Content-Type": "application/json",
        [isAzureServiceProvider ? "api-key" : "Authorization"]: isAzureServiceProvider ? apiKey : `Bearer ${apiKey}`
    };
}

/**
 * @param {string} basePrompt
 * @param {"simplicity" | "detailed"} polishingMode
 * @param {Bob.TranslateQuery} query
 * @returns {string}
 */
function generateSystemPrompt(basePrompt, polishingMode, query) {
    const isDetailedPolishingMode = polishingMode === "detailed";
    const languageMapping = {
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
            detailed:
            ". Пожалуйста, обратите внимание на необходимость перечисления изменений и краткого объяснения причин таких изменений",
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

    const defaultMessage =
        "Revise the following sentences to make them more clear, concise, and coherent.";
    let systemPrompt = basePrompt || defaultMessage;

    if (isDetailedPolishingMode) {
        systemPrompt += ". Please note that you need to list the changes and briefly explain why";
    }

    if (Object.prototype.hasOwnProperty.call(languageMapping, query.detectFrom)) {
        systemPrompt = basePrompt || languageMapping[query.detectFrom].prompt;
        if (isDetailedPolishingMode) {
        systemPrompt += languageMapping[query.detectFrom].detailed;
        }
    }

    return systemPrompt;
}

/**
 * @param {string} prompt
 * @param {Bob.TranslateQuery} query
 * @returns {string}
*/
function replacePromptKeywords(prompt, query) {
    if (!prompt) return prompt;
    return prompt.replace("$text", query.text)
        .replace("$sourceLang", query.detectFrom)
        .replace("$targetLang", query.detectTo);
}

/**
 * @param {typeof ChatGPTModels[number]} model
 * @param {boolean} isChatGPTModel
 * @param {Bob.TranslateQuery} query
 * @returns {{ 
 *  model: typeof ChatGPTModels[number];
 *  temperature: number;
 *  max_tokens: number;
 *  top_p: number;
 *  frequency_penalty: number;
 *  presence_penalty: number;
 *  messages?: {
 *    role: "system" | "user";
 *    content: string;
 *  }[];
 *  prompt?: string;
 * }}
*/
function buildRequestBody(model, isChatGPTModel, query) {
    const { customSystemPrompt, customUserPrompt, polishingMode } = $option;
    
    const systemPrompt = generateSystemPrompt(replacePromptKeywords(customSystemPrompt, query), polishingMode, query);
    const userPrompt = customUserPrompt ? `${replacePromptKeywords(customUserPrompt, query)}:\n\n"${query.text}"` : query.text;

    const standardBody = {
        model,
        stream: true,
        temperature: 0.2,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
    };

    if (isChatGPTModel) {
        return {
            ...standardBody,
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
        };
    }
    return {
        ...standardBody,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
    };
}

/**
 * @param {Bob.TranslateQuery} query
 * @param {Bob.HttpResponse} result
 * @returns {void}
*/
function handleError(query, result) {
    const { statusCode } = result.response;
    const reason = (statusCode >= 400 && statusCode < 500) ? "param" : "api";
    query.onCompletion({
        error: {
            type: reason,
            message: `接口响应错误 - ${HttpErrorCodes[statusCode]}`,
            addtion: JSON.stringify(result),
        },
    });
}

/**
 * @param {Bob.TranslateQuery} query
 * @param {boolean} isChatGPTModel
 * @param {string} targetText
 * @param {string} textFromResponse
 * @returns {string}
*/
function handleResponse(query, isChatGPTModel, targetText, textFromResponse) {
    if (textFromResponse !== '[DONE]') {
        try {
            const dataObj = JSON.parse(textFromResponse);
            const { choices } = dataObj;
            if (!choices || choices.length === 0) {
                query.onCompletion({
                    error: {
                        type: "api",
                        message: "接口未返回结果",
                        addtion: textFromResponse,
                    },
                });
                return targetText;
            }

            const content = isChatGPTModel ? choices[0].delta.content : choices[0].text;
            if (content !== undefined) {
                targetText += content;
                query.onStream({
                    result: {
                        from: query.detectFrom,
                        to: query.detectTo,
                        toParagraphs: [targetText],
                    },
                });
            }
        } catch (err) {
            query.onCompletion({
                error: {
                    type: err._type || "param",
                    message: err._message || "Failed to parse JSON",
                    addtion: err._addition,
                },
            });
        }
    }
    return targetText;
}

/**
 * @type {Bob.Translate}
 */
function translate(query, completion) {
    if (!lang.langMap.get(query.detectTo)) {
        completion({
            error: {
                type: "unsupportLanguage",
                message: "不支持该语种",
                addtion: "不支持该语种",
            },
        });
    }

    const { model, apiKeys, apiUrl, deploymentName } = $option;

    if (!apiKeys) {
        completion({
            error: {
                type: "secretKey",
                message: "配置错误 - 请确保您在插件配置中填入了正确的 API Keys",
                addtion: "请在插件配置中填写 API Keys",
            },
        });
    }
    const trimmedApiKeys = apiKeys.endsWith(",") ? apiKeys.slice(0, -1) : apiKeys;
    const apiKeySelection = trimmedApiKeys.split(",").map(key => key.trim());
    const apiKey = apiKeySelection[Math.floor(Math.random() * apiKeySelection.length)];

    const modifiedApiUrl = ensureHttpsAndNoTrailingSlash(apiUrl || "https://api.openai.com");
    
    const isChatGPTModel = ChatGPTModels.includes(model);
    const isAzureServiceProvider = modifiedApiUrl.includes("openai.azure.com");
    let apiUrlPath = isChatGPTModel ? "/v1/chat/completions" : "/v1/completions";
    
    if (isAzureServiceProvider) {
        if (deploymentName) {
            apiUrlPath = `/openai/deployments/${deploymentName}`;
            apiUrlPath += isChatGPTModel ? "/chat/completions?api-version=2023-03-15-preview" : "/completions?api-version=2022-12-01";
        } else {
            completion({
                error: {
                    type: "secretKey",
                    message: "配置错误 - 未填写 Deployment Name",
                    addtion: "请在插件配置中填写 Deployment Name",
                },
            });
        } 
    }

    const header = buildHeader(isAzureServiceProvider, apiKey);
    const body = buildRequestBody(model, isChatGPTModel, query);

    let targetText = ""; // 初始化拼接结果变量
    let buffer = ""; // 新增 buffer 变量
    (async () => {
        await $http.streamRequest({
            method: "POST",
            url: modifiedApiUrl + apiUrlPath,
            header,
            body,
            cancelSignal: query.cancelSignal,
            streamHandler: (streamData) => {
                if (streamData.text.includes("Invalid token")) {
                    query.onCompletion({
                        error: {
                            type: "secretKey",
                            message: "配置错误 - 请确保您在插件配置中填入了正确的 API Keys",
                            addtion: "请在插件配置中填写正确的 API Keys",
                        },
                    });
                } else {
                    // 将新的数据添加到缓冲变量中
                    buffer += streamData.text;
                    // 检查缓冲变量是否包含一个完整的消息
                    while (true) {
                        const match = buffer.match(/data: (.*?})\n/);
                        if (match) {
                            // 如果是一个完整的消息，处理它并从缓冲变量中移除
                            const textFromResponse = match[1].trim();
                            targetText = handleResponse(query, isChatGPTModel, targetText, textFromResponse);
                            buffer = buffer.slice(match[0].length);
                        } else {
                            // 如果没有完整的消息，等待更多的数据
                            break;
                        }
                    }
                }
            },
            handler: (result) => {
                if (result.response.statusCode >= 400) {
                    handleError(query, result);
                } else {
                    query.onCompletion({
                        result: {
                            from: query.detectFrom,
                            to: query.detectTo,
                            toParagraphs: [targetText],
                        },
                    });
                }
            }
        });
    })().catch((err) => {
        completion({
            error: {
                type: err._type || "unknown",
                message: err._message || "未知错误",
                addtion: err._addition,
            },
        });
    });
}

function supportLanguages() {
    return lang.supportLanguages.map(([standardLang]) => standardLang);
}

exports.supportLanguages = supportLanguages;
exports.translate = translate;
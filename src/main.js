var lang = require("./lang.js");

function supportLanguages() {
    return lang.supportLanguages.map(([standardLang]) => standardLang);
}

function translate(query, completion) {
    const ChatGPTModels = ["gpt-3.5-turbo", "gpt-3.5-turbo-0301"];
    const api_keys = $option.api_keys.split(",").map((key) => key.trim());
    const api_key = api_keys[Math.floor(Math.random() * api_keys.length)];
    const header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
    };
    const detailedPolishingMode = $option.polishing_mode === "detailed";
    let prompt =
        "Revise the following sentences to make them more clear, concise, and coherent";
    if (detailedPolishingMode) {
        prompt = `${prompt}. Please note that you need to list the changes and briefly explain why`;
    }
    switch (query.detectFrom) {
        case "zh-Hant":
        case "zh-Hans":
            prompt = "润色此句";
            if (detailedPolishingMode) {
                prompt = `${prompt}。请注意要列出更改以及简要解释一下为什么这么修改`;
            }
            break;
        case "ja":
            prompt = "この文章を装飾する";
            if (detailedPolishingMode) {
                prompt = `${prompt}。変更点をリストアップし、なぜそのように変更したかを簡単に説明することに注意してください`;
            }
            break;
        case "ru":
            prompt =
                "Переформулируйте следующие предложения, чтобы они стали более ясными, краткими и связными";
            if (detailedPolishingMode) {
                prompt = `${prompt}. Пожалуйста, обратите внимание на необходимость перечисления изменений и краткого объяснения причин таких изменений`;
            }
            break;
        case "wyw":
            prompt = "润色此句古文";
            if (detailedPolishingMode) {
                prompt = `${prompt}。请注意要列出更改以及简要解释一下为什么这么修改`;
            }
            break;
        case "yue":
            prompt = "潤色呢句粵語";
            if (detailedPolishingMode) {
                prompt = `${prompt}。記住要列出修改嘅內容同簡單解釋下點解要做呢啲更改`;
            }
            break;
    }
    const body = {
        model: $option.model,
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
    };
    const isChatGPTModel = ChatGPTModels.indexOf($option.model) > -1;
    if (isChatGPTModel) {
        body.messages = [
            { role: "system", content: prompt },
            { role: "user", content: query.text },
        ];
    } else {
        body.prompt = `${prompt}:\n\n${query.text} =>`;
    }
    (async () => {
        const resp = await $http.request({
            method: "POST",
            url:
                $option.api_url +
                (isChatGPTModel ? "/v1/chat/completions" : "/v1/completions"),
            header,
            body,
        });

        if (resp.error) {
            const { statusCode } = resp.response;
            let reason;
            if (statusCode >= 400 && statusCode < 500) {
                reason = "param";
            } else {
                reason = "api";
            }
            completion({
                error: {
                    type: reason,
                    message: `接口响应错误 - ${resp.data.error.message}`,
                    addition: JSON.stringify(resp),
                },
            });
        } else {
            const { choices } = resp.data;
            if (!choices || choices.length === 0) {
                completion({
                    error: {
                        type: "api",
                        message: "接口未返回结果",
                    },
                });
                return;
            }
            if (isChatGPTModel) {
                targetTxt = choices[0].message.content.trim();
            } else {
                targetTxt = choices[0].text.trim();
            }
            completion({
                result: {
                    from: query.detectFrom,
                    to: query.detectTo,
                    toParagraphs: targetTxt.split("\n"),
                },
            });
        }
    })().catch((err) => {
        completion({
            error: {
                type: err._type || "unknown",
                message: err._message || "未知错误",
                addition: err._addition,
            },
        });
    });
}

exports.supportLanguages = supportLanguages;
exports.translate = translate;

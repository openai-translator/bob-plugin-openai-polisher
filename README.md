<h4 align="right">
  <strong>简体中文</strong> | <a href="https://github.com/openai-translator/bob-plugin-openai-polisher/blob/main/docs/README_EN.md">English</a>
</h4>

<div>
  <h1 align="center">OpenAI Polisher Bob Plugin</h1>
  <p align="center">
    <a href="https://github.com/openai-translator/bob-plugin-openai-polisher/releases" target="_blank">
        <img src="https://github.com/openai-translator/bob-plugin-openai-polisher/actions/workflows/release.yaml/badge.svg" alt="release">
    </a>
    <a href="https://github.com/openai-translator/bob-plugin-openai-polisher/releases">
        <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/openai-translator/bob-plugin-openai-polisher?style=flat">
    </a>
    <a href="https://github.com/openai-translator/bob-plugin-openai-polisher/releases">
        <img alt="GitHub Repo stars" src="https://img.shields.io/badge/OpenAI-Bob-brightgreen?style=flat">
    </a>
    <a href="https://github.com/openai-translator/bob-plugin-openai-polisher/releases">
        <img alt="GitHub Repo stars" src="https://img.shields.io/badge/Langurage-JavaScript-brightgreen?style=flat&color=blue">
    </a>
  </p>
</div>


> **Note**
>
> 重要更新：非 macOS 用户可以使用我开发的基于 ChatGPT API 的划词翻译浏览器插件（支持语法润色） [openai-translator](https://github.com/yetone/openai-translator) 以解燃眉之急。

## 演示

![demo](https://user-images.githubusercontent.com/1206493/222710761-bbd5ce10-2b12-42c0-abfa-5a3152157cb2.gif)

## 简介

ChatGPT 向我们展示了 GPT 模型的伟大之处，所以我使用 ChatGPT 的 API 实现了这个用来给语言润色和语法纠错的 Bob 插件，效果拔群！完美替代 Grammarly!

## 使用方法

1. 安装 [Bob](https://bobtranslate.com/guide/#%E5%AE%89%E8%A3%85)，一款 macOS 平台的翻译和 OCR 软件；[openai-translator.bobplugin](https://github.com/yetone/bob-plugin-openai-translator/releases/latest) >= **1.0.0** 以后默认开启流式输出，需要 Bob 版本 >= **1.8.0**

2. 下载此插件: [openai-polisher.bobplugin](https://github.com/yetone/bob-plugin-openai-polisher/releases)

3. 安装此插件:
  ![安装步骤](https://user-images.githubusercontent.com/1206493/222712959-4a4b27e2-b129-408a-a8af-24a3a89df2dd.gif)

4. 去 [OpenAI](https://platform.openai.com/account/api-keys) 获取你的 API KEY

5. 把 API KEY 填入 Bob 偏好设置 > 服务 > 此插件配置界面的 API KEY 的输入框中
  ![设置步骤](https://user-images.githubusercontent.com/1206493/222712982-5c5598b0-8560-422f-837f-3ffd08a39f81.gif)

6. 安装 [PopClip](https://bobtranslate.com/guide/integration/popclip.html) 实现划词后鼠标附近出现悬浮图标
  ![PopClip](https://user-images.githubusercontent.com/1206493/219933584-d0c2b6cf-8fa0-40a6-858f-8f4bf05f38ef.gif)

## 感谢

我这只是个小小的 Bob 插件，强大的是 Bob 本身，向它的开发者 [ripperhe](https://github.com/ripperhe) 致敬！

### 请作者喝一杯咖啡

<div align="center">
  <img height="360" src="https://user-images.githubusercontent.com/1206493/220753437-90e4039c-d95f-4b6a-9a08-b3d6de13211f.png" />
  <img height="360" src="https://user-images.githubusercontent.com/1206493/220756036-d9ac4512-0375-4a32-8c2e-8697021058a2.png" />
</div>

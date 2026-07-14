---
id: integrations-index
slug: /developer-manual/integrations
title: 連携
sidebar_label: 連携
sidebar_position: 8
last_updated: 2026-07-14
---

# 連携

このセクションは、公式コネクタを **使って** QA ZERO のデータを別の
システムへ移したい人のためのものです — コネクタを作る人のためでは
ありません。（自分のコネクタを作る・配布したい場合は
[拡張](../extending/index.md)を参照してください。）

## 利用可能なコネクタ

- **[MCP サーバー](./mcp.md)** — Claude Desktop などの
  [Model Context Protocol](https://modelcontextprotocol.io) クライアント
  をつなぎ、AI が QAL であなたの分析データを問い合わせられるように
  します。読み取り専用で、人間が使うのと同じ `/guide` と `/query`
  エンドポイントの上で動きます。

## ロードマップ

- **BigQuery コネクタ** *(予定)* — QAL クエリ結果とマテリアルを
  Google BigQuery へエクスポートし、ウェアハウス化と下流の BI に
  使います。

ロードマップの項目は出荷済み機能ではありません。コネクタが利用可能に
なると、その使い方ガイドがここに現れ、API の
[アップデート履歴](../api/2026-05-11/changelog.md)で告知されます。

## 生の API を使いたい場合

コネクタが行うことはすべて、REST API に対して直接実行することも
できます:

- **[API リファレンス](../api/index.md)** — `/guide` と `/query`
  エンドポイント。
- **[マテリアル](../api/materials/index.md)** — 取り出せるデータ面。
- **[AI 向け — インストラクションと仕様](../for-ai/index.md)** —
  これを自分で AI / MCP クライアントに組み込むなら、機械可読仕様。

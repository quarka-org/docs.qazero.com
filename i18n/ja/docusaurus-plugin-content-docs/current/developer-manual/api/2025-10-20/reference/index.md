---
id: reference-index-2025-10-20
title: API リファレンス
sidebar_position: 1
---

# API リファレンス

このセクションは実行レイヤーです。`/guide`, `/query`, 認証、エラーレスポンスの厳密な形が書いてあります。クライアントコードを直接書く場合(AI を介さない場合)は、ここが一番役に立ちます。

概念的な話やメンタルモデルを探しているなら、**[Concepts](../concepts/)** に戻ってください。AI クライアント経由で使う場合、AI に必要なのは **[AI Instructions](../ai/README.md)** と YAML 仕様書だけで、このページ群は不要です。

## このセクションの内容

- **[認証](./authentication.md)** — 認証情報の取得と送信方法。
- **[`/guide`](./guide.md)** — ディスカバリエンドポイント。現在有効な仕様、機能フラグ、`tracking_id` 一覧を返します。
- **[`/query`](./query.md)** — 実行エンドポイント。QAL クエリを受け取り、行データを返します。
- **[エラー](./errors.md)** — 正式なエラーコード一覧とその意味。
- **[サンプル](./examples.md)** — 実際に動かせる end-to-end curl サンプル。

---
id: reference-authentication-2025-10-20
title: 認証
sidebar_position: 2
---

# 認証

QA ZERO の両エンドポイント (`/guide`, `/query`) は **WordPress アプリケーションパスワード** による認証が必須です。OAuth フローも API キーダッシュボードもありません — 認証情報は標準の WordPress ユーザー管理画面から発行します。

## 認証情報の取得

1. QA ZERO を動かしている WordPress 管理画面にログイン。
2. **ユーザー → プロフィール** へ (または管理者が他ユーザーを編集するなら ユーザー → (対象ユーザー) )。
3. **アプリケーションパスワード** セクションまでスクロール。
4. 名前を入れて (`mcp-client`, `my-ai-agent` など) **新しいアプリケーションパスワードを追加** をクリック。
5. WordPress は生成されたパスワードを **1回だけ** 表示する。その場で必ずコピーする — あとから取り出せない。

認証情報は `(username, application_password)` のペアになります。

## 認証情報の送信

両エンドポイントは標準の WordPress Basic Auth ヘッダを受け付けます。

```
Authorization: Basic base64(username:application_password)
```

たいていの HTTP クライアントは `username` / `password` タプルを渡すと自動でこのヘッダを付けます。

### curl

```bash
curl -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  "https://example.com/wp-json/qa-platform/guide?version=2025-10-20"
```

アプリケーションパスワードに含まれる空白はパスワードの一部です — 削除しないでください。

### Python (requests)

```python
import requests
r = requests.get(
    "https://example.com/wp-json/qa-platform/guide",
    params={"version": "2025-10-20"},
    auth=("admin", "xxxx xxxx xxxx xxxx xxxx xxxx"),
)
```

### Node (fetch)

```js
const auth = Buffer.from("admin:xxxx xxxx xxxx xxxx xxxx xxxx").toString("base64");
const res = await fetch(
  "https://example.com/wp-json/qa-platform/guide?version=2025-10-20",
  { headers: { Authorization: `Basic ${auth}` } }
);
```

## 必要なユーザー権限

アプリケーションパスワードを持つ WordPress ユーザーは、クエリ対象の tracking_id の分析データを閲覧できる権限を持っている必要があります。実際には:

- `administrator` ロール → フルアクセス。
- 他のロール → サイト依存。サイトの管理者に確認してください。

QA ZERO は WordPress 標準のロール/権限システムに信頼を置いており、独自の権限層を追加していません。

## 認証情報の衛生管理

- **クライアントごとに別のアプリケーションパスワードを発行** してください。1つを2つのサービスで使い回さないこと。WordPress では片方だけ失効させることができます。
- 漏洩が疑われたら即ローテーション。失効は即時反映。
- アプリケーションパスワードをリポジトリにコミットしないでください。シークレットストア (Keychain, 1Password, `.envrc` 経由の環境変数等) を使ってください。

## 次に読むページ

- **[`/guide` リファレンス](./guide.md)** — 最初に呼ぶエンドポイント。
- **[`/query` リファレンス](./query.md)** — QAL クエリの送信方法。
- **[エラー](./errors.md)** — 認証関連のエラーコード (`401 E_UNAUTHORIZED`, `403 E_FORBIDDEN`)。

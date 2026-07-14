---
id: integrations-mcp
slug: /developer-manual/integrations/mcp
title: MCP サーバー
sidebar_label: MCP サーバー
sidebar_position: 1
last_updated: 2026-07-14
description: Claude Desktop などの MCP クライアントを QA ZERO につなぎ、AI が QAL であなたの分析データを問い合わせられるようにします。
---

# MCP サーバー — Claude Desktop と AI クライアント

**QA ZERO MCP サーバー** は、AI クライアント — Claude Desktop や、
[Model Context Protocol](https://modelcontextprotocol.io) を話す任意の
ホスト — が QA ZERO の REST API を通じてあなたの分析データを読める
ようにする、小さな公式コネクタです。サイトを指定すれば、AI が自然な
言葉で質問し、コネクタがそれを安全な [QAL](../concepts/what-is-qal.md)
クエリへ変換します。

AI にデータベースを渡すわけではありません。人間が使うのと同じ
`/guide` と `/query` エンドポイントの上に、読み取り専用のツールを
ちょうど2つだけ公開します。それ以外は何も開きません。

:::note 対象読者
コネクタをそのまま **使って** AI に QA ZERO のデータを読ませたい方の
ためのページです。自分で MCP ラッパーや別種のコネクタを作りたい場合
は、代わりに [拡張](../extending/index.md) を参照してください。
:::

## AI に渡されるもの

サーバーは2つのツールを登録します。いつ呼ぶかは AI が判断します。あなた
は AI に話しかけるだけです。

| ツール | 役割 |
|------|--------------|
| `qa_get_guide` | ライブ仕様を取得します: 利用可能なマテリアル、`since` 日付付きの機能フラグ、問い合わせできる `tracking_id` の一覧。AI はサーバーが何をサポートするかを知るために **最初に** これを呼びます。 |
| `qa_execute_query` | QAL クエリを1つ実行し、行と `meta` の件数を返します。AI は `qa_get_guide` が伝えた内容からクエリを組み立てます。 |

`qa_get_guide` はサーバーのライブな `features` マップを返すため、コネクタ
はあなたのサーバーのバージョンがサポートする内容を自動的に反映します
— 対応機能の一覧を手で編集する必要はありません。

## はじめる前に

- AI クライアントを動かすマシンに **Node.js 18 以上**。
- プラグインが有効で、REST API に到達できる **QA ZERO サイト**。
- コネクタが認証に使うアカウントの **WordPress アプリケーション
  パスワード**。wp-admin の **ユーザー → プロフィール → アプリケーション
  パスワード** で作成し（例: `Claude MCP` という名前）、生成された値を
  スペースごとコピーします。

:::tip 最小権限
メインの管理者アカウントではなく、必要な権限だけを持つ専用の
WordPress ユーザーを使ってください。
:::

## インストール

コネクタはオープンソースとして
**[quarka-org/qa-platform-mcp](https://github.com/quarka-org/qa-platform-mcp)**
（Apache-2.0）で公開されています。クローンしてビルドします:

```bash
git clone https://github.com/quarka-org/qa-platform-mcp.git
cd qa-platform-mcp
npm install
npm run build
```

これで `dist/index.js` が生成されます。これが AI クライアントから実行
されるファイルです。次のステップで必要になるので、その絶対パスを
控えておいてください。

:::note npm パッケージ
`npx` による一行インストールは予定していますが、まだ npm レジストリ
には公開されていません。公開されるまでは上のクローン＆ビルド手順を
使ってください。パッケージが出荷されたら、このページを `npx` 形式で
更新します。
:::

## Claude Desktop の設定

Claude Desktop の設定ファイルを開き、`qa-platform` サーバーのエントリ
を追加します。

| OS | 設定ファイル |
|----|-------------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

```json
{
  "mcpServers": {
    "qa-platform": {
      "command": "node",
      "args": ["/absolute/path/to/qa-platform-mcp/dist/index.js"],
      "env": {
        "QA_PLATFORM_ENDPOINT": "https://your-site.com/wp-json",
        "QA_PLATFORM_USERNAME": "your-username",
        "QA_PLATFORM_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

保存したら Claude Desktop を再起動します。`qa-platform` のツールが
クライアントに表示されるはずです。

### エンドポイントを正しく指定する

`QA_PLATFORM_ENDPOINT` は、REST ルートの **直前まで** のベース URL です。
コネクタが `/qa-platform/guide/` と `/qa-platform/query/` を自分で連結
するため、ベースの形が WordPress の REST 受け口と一致している必要が
あります。どちらの形を使うかは、サイトのパーマリンク設定によって
決まります:

- **パーマリンク有効（一般的な本番環境）** — `wp-json` 形式を使います:

  ```
  https://your-site.com/wp-json
  ```

- **パーマリンク無効（一部のローカル環境など）** — `?rest_route=`
  形式を使います:

  ```
  https://your-site.com/index.php?rest_route=
  ```

`https://your-site.com/` のような素のドメインは **動きません** —
WordPress が通常の HTML ページとして返してしまい、コネクタがそこから
JSON を解析できないためです。

HTTPS が必須です。

### 任意の設定

| 変数 | 用途 | デフォルト |
|----------|---------|---------|
| `QA_PLATFORM_API_VERSION` | 特定の API バージョンに固定します。未設定なら常に `latest` を要求します。 | `latest` |
| `QA_PLATFORM_CACHE_TTL` | guide レスポンスをキャッシュする時間（ミリ秒）。 | `300000`（5分） |
| `LOG_LEVEL` | `error`、`warn`、`info`、`debug`。 | `info` |

## 動作確認

Claude Desktop で、まず guide が必要になる質問をしてみます:

> QA ZERO で私のサイトについて何がわかりますか？

AI は `qa_get_guide` を呼び、あなたのサイトの `tracking_id`、利用可能な
データ期間、問い合わせできる内容を返してくるはずです。続けて実際の
クエリを試します:

> 直近のページビューを10件見せて。

正常な往復は次のようになります: `qa_get_guide` → AI が QAL クエリを
組み立てる → `qa_execute_query` → AI が行を整形して見せる。あなたが
自分でクエリを書くことはありません。

## トラブルシューティング

**ツールが表示されない。** 設定 JSON が正しいか確認し
（`cat <file> | jq .`）、`node --version` が 18 以上か確認し、
`dist/index.js` へのパスが正しく絶対パスになっているか確認し、Claude
Desktop を再起動してください。

**`Authentication failed`。** アプリケーションパスワード（スペース
ごとコピーされ、まだ有効であること）とユーザー名を再確認してください。
エンドポイントが HTTPS か確認してください。

**`404` / `rest_no_route`。** エンドポイントのベースが違います。
`<endpoint>/qa-platform/guide/` をブラウザで直接開いてみてください —
JSON ではなく HTML が返るなら、上記の `wp-json` と `?rest_route=` 形式
を切り替えてください。QA ZERO プラグインが有効かも確認します。

**クエリがタイムアウトする。** 時間範囲を狭めるか、`limit` を小さく
します。長期間にわたる広すぎるクエリが原因であることが多いです。

**もっと詳しく見たい。** `env` ブロックに `"LOG_LEVEL": "debug"` を
設定し、クライアントの MCP ログを見てください（macOS の場合:
`~/Library/Logs/Claude/mcp*.log`）。

## セキュリティ上の注意

- `claude_desktop_config.json` は秘密情報として扱ってください —
  アプリケーションパスワードを含みます。コミットしないでください。
  パーミッションを制限します（macOS/Linux では `chmod 600`）。
- アプリケーションパスワードは定期的にローテーションし、マシンを
  紛失した場合は wp-admin から失効させてください。
- エンドポイントは必ず HTTPS を使ってください。

## 関連

- **[AI 向け — インストラクションと仕様](../for-ai/index.md)** —
  コネクタが `qa_get_guide` を通じて配信する機械可読仕様。人間が読んでも
  役に立ちます。
- **[API リファレンス](../api/index.md)** — コネクタがラップしている
  `/guide` と `/query` エンドポイント。自分で直接呼びたい場合はこちら。
- **[QAL とは](../concepts/what-is-qal.md)** — AI があなたに代わって
  組み立てるクエリ言語。

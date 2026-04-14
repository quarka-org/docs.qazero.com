---
id: material-gsc-2025-10-20
title: gsc
sidebar_position: 4
---

# `gsc` — Google Search Console データ

`gsc` は Google Search Console データを `(ページ, クエリ, 日, 検索面)` の粒度で公開します。1行 = 1検索クエリが、あなたのサイトの1ページを、ある日、ある検索面 (web / image / video) で、誰かに表示したこと。

このマテリアルは **オーガニック検索** についての質問に使います: どのクエリがトラフィックを連れてくるか、どのページが何で順位付けされているか、CTR が意外に低いのはどこか、順位が上がっているか下がっているか。検索についての質問でないなら `gsc` は使わないでください — 粒度が広く、JOIN コストが高いです。

## サンプル行

手作りサンプル。`page_id` だけを ID として表示しています (GSC には per-impression / per-session 識別子がありません)。フルスキーマは [`ai/materials.yaml`](../ai/materials.yaml) にあります。

| page_id | query                          | search_type | clicks | impressions | ctr    | position |
|--------:|--------------------------------|:-----------:|-------:|------------:|-------:|---------:|
| 1042    | `best manual coffee grinder`    | web         |    142 |       3,210 | 4.42%  |     4.8  |
| 1042    | `hario slim review`             | web         |     98 |         410 | 23.90% |     2.1  |
| 1042    | `coffee grinder under 50`       | web         |      6 |       1,880 | 0.32%  |     9.4  |
| 1088    | `hario slim`                    | web         |    312 |         720 | 43.33% |     1.3  |
| 1088    | `hario slim vs porlex`          | web         |     18 |         150 | 12.00% |     3.7  |
| 1201    | `v60 brewing ratio`             | web         |    480 |       2,100 | 22.86% |     2.4  |
| 1201    | `how to use v60`                | web         |    210 |       9,800 | 2.14%  |     6.9  |

一目で読み取れる物語:

- **`page_id 1042`** は狭いクエリ (`hario slim review`、CTR 23.9%、順位 2.1) でよく効いているが、広いクエリ (`coffee grinder under 50`、CTR 0.32%、順位 9.4) は弱い。典型的なロングテール物語: ニッチで刈り取り、ブロードで漏れる。
- **`page_id 1088`** は商品ページ。ブランドクエリ (`hario slim`) は順位 1.3 / CTR 43% — 期待通り。一方で比較クエリ (`hario slim vs porlex`) は順位 3.7 / CTR 12% のみ。比較意図がうまく拾えていない、注意すべきコンテンツギャップ。
- **`page_id 1201`** は `v60 brewing ratio` ではよく効いているが (順位 2.4、CTR 22.9%)、`how to use v60` では弱い (順位 6.9、CTR 2.1%)。同じページ、2つのクエリ、全然違うパフォーマンス — ページの title / H1 が広いクエリの意図に合っていない、と強く示唆している。

## サンプルが省いているカラム

- **`query_id`** — キーワードテーブルへの外部キー整数。読みたいなら `keyword` を、効率的なフィルタに使うなら `query_id` を。
- **`position_x100`** — 生で保存されている順位 (×100)。サンプルに出している `position` はデコード済みの float。
- **`position_weighted`** — インプレッション加重順位計算用の virtual カラム。
- **`url`**, **`title`**, **`page_type`**, **`page_fetch_status`** — マスター解決カラム (`page_id` 経由)。URL を得るだけのために `allpv` を JOIN しなくて済む。

全リストは [`ai/materials.yaml`](../ai/materials.yaml)。

## ⚠️ JOIN 注意

`gsc` は `allpv` と `page_id` 上で **N:M** の関係を持ちます。

> 1ページに対して GSC 行が数十〜数百ある (多クエリ × 多日)。フィルタなしで `gsc` を `allpv` に JOIN すると行数が爆発します (例: 100ページビュー × 150キーワード日 = 15,000行)。

**`gsc` は必ずフィルタしてから JOIN してください。** 典型的なフィルタは `keyword` 上、`search_type` 上、または全体クエリの時間窓より狭い日付範囲。

## `gsc` に向いた最初の質問

- 「ブログにクリックを連れてくる検索クエリ上位は?」
- 「インプレッションは多いが CTR が低いページは? (title / snippet を書き直すべき)」
- 「狙っていないのに順位が付いているクエリは?」
- 「ブランドクエリ vs 非ブランドクエリの平均順位は?」
- 「月ごとに順位が落ちているのはどこ?」

## 次に読むページ

- **[`allpv`](./allpv.md)** — JOIN するページビュー単位のデータ。
- **[`/query` リファレンス](../reference/query.md)**。

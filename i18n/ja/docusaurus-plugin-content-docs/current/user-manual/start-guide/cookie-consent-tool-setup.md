---
id: cookie-consent-tool-setup
title: Cookie同意ツールとの連携（スクリプト設置）
sidebar_position: 5
---

# Cookie同意ツールとの連携（スクリプト設置）

## このページについて

このページでは、サイトで Cookie 同意ツール（Cookie バナー等）を利用している場合の  
QA ZERO との連携方法について説明します。

Cookie 同意ツールを利用していない場合は、  
このページの作業は不要です。


---

## なぜこの連携（スクリプト設置）が必要なのか

QA ZERO では、サイト訪問者が Cookie の利用に同意しているかどうかに応じて、  
計測の動作を切り替えています。

そのため、Cookie 同意ツールを利用しているサイトでは、  
同意／拒否のタイミングで QA ZERO に通知を送るための  
JavaScript スクリプト（同意連携スクリプト）の設置が必要です。


---

## スクリプトの設置と順序

同意連携スクリプトは、  
Cookie 同意ツールおよび ZERO のタグとの読み込み順を意識して設置してください。

---

### 1. Cookie 同意ツールとの関係

同意連携スクリプトは、  
**Cookie 同意ツール本体が読み込まれた後に実行される必要があります。**

そのため、ツールが指定する  
「同意状態が確定したタイミング（コールバック関数やイベント）」の中に記述してください。

---

### 2. ZERO タグ同士の順序

ZERO に関するタグは、次の順番で設置します。

1. **計測タグ（先）**
2. **同意連携スクリプト（後）**


同意連携スクリプトでは  
`qahmz_pub.cookieConsent()` という JavaScript 関数を呼び出します。

この関数は計測タグ内で定義されるため、  
計測タグを先に読み込んでおく必要があります。

順序が逆になると、  
関数が未定義の状態で実行され、エラーが発生する可能性があります。

---

## 同意連携スクリプトで行うこと

同意連携スクリプトでは、  
Cookie 同意ツールが示す同意状態に応じて  
以下の JavaScript を呼び出すように実装します。

- 同意したとき  
  `qahmz_pub.cookieConsent(true);`

- 拒否したとき  
  `qahmz_pub.cookieConsent(false);`

---

## 実装イメージ（サンプル）

以下は **実装例（サンプル）** です。  
実際の実装では、**お使いの Cookie 同意ツールの仕様に合わせて**コードを記述してください。


### 1) 同意状態を表す値を直接参照できる場合

* 変数名（例：`consentStatus`）  
* 同意／拒否を表す値（例：`"accepted"` / `"rejected"`）    
は、お使いの Cookie 同意ツールの仕様に基づいて適切に実装してください。

```html
<script>
if (consentStatus === "accepted") {
  qahmz_pub.cookieConsent(true);
} else if (consentStatus === "rejected") {
  qahmz_pub.cookieConsent(false);
}
</script>
```


### 2) コールバック関数の引数として同意状態が渡される場合

コールバック内で `qahmz_pub.cookieConsent()` を呼び出します。

* コールバック関数名（例：`onCookieConsentChange`）  
* 引数の形式（`true/false` なのか、文字列なのか）    
は、お使いの Cookie 同意ツールの仕様に基づいて適切に実装してください。

```html
<script>
window.onCookieConsentChange = function(consent) {
  qahmz_pub.cookieConsent(consent);
};
</script>
```


### 3) イベントとして同意状態が通知される場合

イベントリスナー内で `qahmz_pub.cookieConsent()` を呼び出します。

* イベント名（例：`cookieConsent`）  
* イベントオブジェクトの構造（例：`e.detail.agreed`）    
は、お使いの Cookie 同意ツールの仕様に基づいて適切に実装してください。

```html
<script>
window.addEventListener('cookieConsent', function(e) {
  qahmz_pub.cookieConsent(e.detail.agreed);
});
</script>
```


※ 同意状態の取得方法（変数名・値・コールバック名・イベント名など）は、  
**必ずお使いの Cookie 同意ツールの仕様をご確認のうえ実装してください。**



---

## 次に行うこと

- スクリプト設置後、実際のサイトで「同意／拒否」の操作を行い、想定どおりに動作するか確認してください。
- 計測タグの設置がまだの場合は、**「計測タグの設置」ページを先に** 確認してください。



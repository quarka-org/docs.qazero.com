---
id: cookie-consent-tool-setup
title: Cookie同意ツールとの連携（スクリプトタグの設置）
sidebar_position: 5
---

# Cookie同意ツールとの連携（スクリプトタグの設置）

## このページについて

このページでは、サイトで Cookie 同意ツール（Cookie バナー等）を利用している場合の  
QA ZERO との連携方法について説明します。

Cookie 同意ツールを利用していない場合は、  
このページの作業は不要です。


---

## なぜこの連携（スクリプトタグの設置）が必要なのか

QA ZERO では、サイト訪問者が Cookie の利用に同意しているかどうかに応じて、  
計測方法（Cookieを使った計測か使わない計測か）を切り替えることができます。

そのため、Cookie 同意ツールを利用しているサイトでは、  
**サイト訪問者の Cookie 同意／拒否の結果を QA ZERO に通知するための**  
スクリプトタグ（HTML の `<script>` 〜 `</script>`）の設置が必要です。  
ここではこのスクリプトタグを「**Cookie同意連携タグ**」 と呼びます。


---

## スクリプトタグの設置と順序

Cookie同意連携タグは、  
Cookie 同意ツールおよび ZERO のタグとの読み込み順を意識して設置してください。

---

### 1. Cookie 同意ツールとの関係

Cookie同意連携タグは、  
**Cookie 同意ツール本体が読み込まれた後に実行される必要があります。**

そのため、ツールが指定する  
「同意状態が確定したタイミング（コールバック関数やイベント）」の中に記述してください。

---

### 2. ZERO タグ同士の順序

ZERO に関するタグは、次の順番で設置します。

1. **Cookie 同意連携タグ（先）**
2. **計測タグ（後）**

この順序にすることで、 Cookie 同意／拒否の状態を踏まえて計測を開始できます。

---

## Cookie同意連携タグで行うこと

連携処理では、ZERO のオブジェクト `qahmz` と `qahmz_pub` を用います。  
そのため、Cookie同意連携タグの冒頭では、まず以下の宣言を行ってください。

```html
<script>
var qahmz = qahmz || {};
var qahmz_pub = qahmz_pub || {};
</script>
```

そのうえで、サイト側で実装する内容は次の 2 点です。

1. Cookie同意状態の調査（リピーター向け）  
2. Cookie 同意ツールのコールバック／イベントでの通知  

---

### 1. Cookie同意状態の調査（リピーター向け）

過去に同意済みのサイト訪問者には、同意済みを示す Cookie が保存されています。  
この Cookie の有無を確認します。

```html
<script>
if (document.cookie.indexOf("qa_cookieConsent=true") !== -1) {
  qahmz.cookieConsentObject = true;
}
</script>
```

---

### 2. Cookie 同意ツールのコールバック／イベントでの通知

Cookie 同意ツールのコールバック／イベント内で、  
サイト訪問者の同意状態に応じて以下を呼び出します。

- **同意したとき**  
  ```js
  qahmz.cookieConsentObject = true;
  qahmz_pub.cookieConsent(true);
  ```

- **拒否したとき**  
  ```js
  qahmz_pub.cookieConsent(false);
  ```

---

## 実装イメージ（サンプル）

以下は **実装例（サンプル）** です。  
実際の実装では、**お使いの Cookie 同意ツールの仕様に合わせて**コードを記述してください。


### 1) コールバック関数の引数として同意状態が渡される場合

コールバック内で `qahmz.cookieConsentObject` のセットおよび `qahmz_pub.cookieConsent()` を呼び出します。

* コールバック関数名（例：`onCookieConsentChange`）  
* 引数の形式（`true/false` なのか、文字列なのか）    
は、お使いの Cookie 同意ツールの仕様に基づいて適切に実装してください。

```html
<!-- ① Cookie同意連携タグ -->
<script>
var qahmz = qahmz || {};
var qahmz_pub = qahmz_pub || {};

// リピーター: 過去の同意 Cookie が残っていれば宣言
if (document.cookie.indexOf("qa_cookieConsent=true") !== -1) {
  qahmz.cookieConsentObject = true;
}

// Cookie同意ツールのコールバック
window.onCookieConsentChange = function(consent) {
  if (consent) {
    qahmz.cookieConsentObject = true;
    qahmz_pub.cookieConsent && qahmz_pub.cookieConsent(true);
  } else {
    qahmz_pub.cookieConsent && qahmz_pub.cookieConsent(false);
  }
};
</script>

<!-- ② 計測タグをここに貼り付け -->
```


### 2) イベントとして同意状態が通知される場合

イベントリスナー内で `qahmz.cookieConsentObject` のセットおよび `qahmz_pub.cookieConsent()` を呼び出します。

* イベント名（例：`cookieConsent`）  
* イベントオブジェクトの構造（例：`e.detail.agreed`）    
は、お使いの Cookie 同意ツールの仕様に基づいて適切に実装してください。

```html
<!-- ① Cookie同意連携タグ -->
<script>
var qahmz = qahmz || {};
var qahmz_pub = qahmz_pub || {};

// リピーター: 過去の同意 Cookie が残っていれば宣言
if (document.cookie.indexOf("qa_cookieConsent=true") !== -1) {
  qahmz.cookieConsentObject = true;
}

// Cookie同意ツールのイベント
window.addEventListener('cookieConsent', function(e) {
  if (e.detail.agreed) {
    qahmz.cookieConsentObject = true;
    qahmz_pub.cookieConsent && qahmz_pub.cookieConsent(true);
  } else {
    qahmz_pub.cookieConsent && qahmz_pub.cookieConsent(false);
  }
});
</script>

<!-- ② 計測タグをここに貼り付け -->
```


※ 同意状態の取得方法（コールバック関数名・イベント名など）は、  
**必ずお使いの Cookie 同意ツールの仕様をご確認のうえ実装してください。**



---

## 次に行うこと

- タグの具体的な設置方法（GTM を使った貼り付け方を含む）は、[「計測タグの設置」ページ](./tracking-tag-setup.md) を確認してください。
- スクリプトタグの設置後、実際のサイトで「同意／拒否」の操作を行い、想定どおりに動作するか確認してください。



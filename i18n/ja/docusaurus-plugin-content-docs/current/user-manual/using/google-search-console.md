---
sidebar_position: 100
title: Google Search Console 連携
---

# Google Search Console 連携

このページでは、QA ZEROと「Google Search Console API」を連携する方法について説明します。  
連携を完了すると、AIレポートの「SEOレポート」にSearch Consoleのデータが反映されます。今後、活用できる機能が増えていく予定です。  

---

## 注意点・事前準備

作業を始める前に、以下の点を確認してください。  
   
- 推奨ブラウザは **Google Chrome** のみです（Safari・Firefox・Edge では不具合が生じる場合があります）  
- **Google Search Console に登録済みの Google アカウント**で Chrome を開いてください  
- 異なるアカウントでは連携できません  
   
また、作業中に QA ZERO 管理画面から**「リダイレクト URI」**をコピーして使用します。  
あらかじめ管理画面の「設定」→「Google連携」を開いておくとスムーズです。  

![GSC連携 image1](/img/google-search-console/google-search-console_01.png)

---


## 設定手順

### 1. Google Cloud プロジェクトの作成

1.	[Google Cloud Resource Manager](https://console.cloud.google.com/cloud-resource-manager) にアクセスします。  
2.	「**＋プロジェクト作成**」をクリックします。  
![GSC連携 image2](/img/google-search-console/google-search-console_02.png)

3.	任意の名前、組織、場所を入力し、「**作成**」をクリックします。  
入力値は初期設定のものでも構いません。組織の選択項目がない場合は入力不要です。  
![GSC連携 image3](/img/google-search-console/google-search-console_03.png)

### 2. Google Search Console API を有効化

1.	左上の三本線メニューをクリックします。  

2.	「**APIとサービス**」→「**ライブラリ**」を選択します。  
![GSC連携 image4](/img/google-search-console/google-search-console_04.png)

3.	検索窓に「**search console**」と入力します。  
![GSC連携 image5](/img/google-search-console/google-search-console_05.png)

4.	「**Google Search Console API**」をクリックします。  
![GSC連携 image6](/img/google-search-console/google-search-console_06.png)

5.	「**有効にする**」をクリックします。  
![GSC連携 image7](/img/google-search-console/google-search-console_07.png) 
 

### 3. OAuth 同意画面を設定

1. 前手順で「有効にする」をクリックすると、以下の画面が表示されます。  
左メニューの「**OAuth 同意画面**」をクリックします。  
![GSC連携 image8](/img/google-search-console/google-search-console_08.png)

2. 「**開始**」をクリックします。

![GSC連携 image9](/img/google-search-console/google-search-console_09.png)

3. 以下を入力し、「**次へ**」をクリックします。  
- アプリ名: 任意の名前（例：QA ZERO など）  
- ユーザーサポートメール: プルダウンから自分のメールアドレスを選択  
![GSC連携 image10](/img/google-search-console/google-search-console_10.png)

4. 「**外部**」を選択し、「**次へ**」をクリックします。  
![GSC連携 image11](/img/google-search-console/google-search-console_11.png)

5.	以下を入力し、「**次へ**」をクリックします。  
- 連絡先情報: プルダウンから自分のメールアドレスを選択  
![GSC連携 image12](/img/google-search-console/google-search-console_12.png)

6.	チェックを入れて、「**作成**」をクリックします。  
![GSC連携 image13](/img/google-search-console/google-search-console_13.png)


### 4. OAuth 2.0 クライアント ID を作成する

1.	前手順で「作成」をクリックすると、以下の画面が表示されます。  
「**OAuth クライアントを作成**」をクリックします。  
![GSC連携 image14](/img/google-search-console/google-search-console_14.png)

2.	アプリケーションの種類で「**ウェブアプリケーション**」を選択します。
![GSC連携 image15](/img/google-search-console/google-search-console_15.png)

3.	以下を入力し、「**作成**」をクリックします。  
- 名前: 任意の名前  
- 承認済みのリダイレクト URI: 「**＋URI を追加**」をクリックし、QA ZERO 管理画面からコピーした「**リダイレクト URI**」を貼り付けます。  
![GSC連携 image16](/img/google-search-console/google-search-console_16.png)

4.	表示される「**クライアント ID**」と「**クライアントシークレット**」を控えておきます。  
![GSC連携 image17](/img/google-search-console/google-search-console_17.png)


### 5. 公開ステータスに変更する

1.	左メニューの「**対象**」をクリックします。  
「**アプリを公開**」をクリックし、公開ステータスを本番環境に変更します。  
![GSC連携 image18](/img/google-search-console/google-search-console_18.png)

2.	確認ダイアログが表示されたら「**確認**」をクリックします。  
![GSC連携 image19](/img/google-search-console/google-search-console_19.png)  
 

### 6. QA ZERO に設定を入力する

1.	QA ZERO の管理画面で「設定」→「Google連携」を開きます。  
手順4でコピーした「**クライアントID**」と「**クライアントシークレット**」を入力し、「**認証する**」をクリックします。  
![GSC連携 image20](/img/google-search-console/google-search-console_20.png)  
   
※　コピーを忘れた場合は「APIとサービス」→「認証情報」の「OAuth 2.0 クライアント ID」から確認できます。  
![GSC連携 image21](/img/google-search-console/google-search-console_21.png)  

2.	Googleメッセージウィンドウ「アカウントの選択」が表示されます。  
見たいデータ（Google Search Console）と紐づいているGoogleアカウントを選択します。

※ Google Search Console と連携する場合、一般的にはアカウントの権限は「フル」または「オーナー」のどちらでも問題ないことを確認していますが、Google CloudなどGoogleにおいて特別な設定をしている場合はこの限りではありません。必要な権限を保持しているか必ずご確認ください。  
![GSC連携 image22](/img/google-search-console/google-search-console_22.png)  

3.	アクセス許可の画面で「**続行**」をクリックします。  
![GSC連携 image23](/img/google-search-console/google-search-console_23.png)    
   
※場合によっては、途中で警告メッセージなどが表示されることがあります。  
　ページ下部のトラブルシューティングを参照してください。


### 7. 連携完了

QA ZERO管理画面に「Google API の連携に成功しました。」と表示されれば完了です。  
   
翌日から Google Search Console のデータ取得が開始されます。  
一度連携すると、再度認証する必要はありません。  

---


## トラブルシューティング

### 「このアプリは Google で確認されていません」と表示された場合

自分で作成したアプリを自分で使うため、Googleによる確認はなくても問題ありません。  
1\.	画面左下の「**詳細**」をクリックします。  
2\.	「**（サイトドメイン）（安全ではないページ）に移動**」をクリックして続行します。  
 ![GSC連携 image24](/img/google-search-console/google-search-console_24.png)  


### 「アクセスできる情報を選択」が表示された場合

必要なサービスのみ（Search Console）を選択して進めます。  

※下記キャプチャは参考画像ですので実際と異なることがあります。  
 ![GSC連携参考 image25](/img/google-search-console/google-search-console_25.png)  


### 「Google APIの連携に失敗しました。」と表示された場合

可能性のある原因は以下の通りです。

* アクセストークンの期限切れ  
  一度画面を閉じ、時間を置いてから再度管理画面を確認すると、エラーメッセージが解消され、連携に成功していることがあります。1日ほど様子を見てみてください。  
  ※ 画面を閉じずにページの再読み込みを行うと、Google APIの仕様上リダイレクトURLの関係で「連携エラー」となり、認証をやり直す必要があります。  
* OAuth 2.0の設定の不備  
  Google CloudプロジェクトのOAuth 2.0設定に誤りがある可能性があります。設定内容を再確認してください。

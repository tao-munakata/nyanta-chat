# にゃんこ先生チャット デモ配布版セットアップ

このフォルダは、にゃんこ先生チャットのデモ用配布パッケージです。Dockerが入っているUbuntuサーバ、VPS、またはDocker対応環境で起動できます。

## 必要なもの

- Docker
- Docker Compose
- Anthropic APIキー

APIキーが未設定でも画面操作はできますが、AIリアクションは固定文にフォールバックします。

## 起動手順

圧縮ファイルをサーバへ置いて展開します。

```bash
tar xzf nyanko-chat-demo-*.tar.gz
cd nyanko-chat
```

環境変数ファイルを作ります。

```bash
cp .env.example .env
```

`.env` を編集します。

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DB_PATH=./data/nyanko.db
```

起動します。

```bash
mkdir -p data
docker compose up -d --build
```

ブラウザで開きます。

```text
http://サーバのIPまたはドメイン:3001/nyanko
```

## 停止

```bash
docker compose down
```

## 更新

新しい配布パッケージを受け取ったら、既存の `data/` と `.env` を残してコードを入れ替え、再ビルドします。

```bash
docker compose up -d --build
```

## データ保存場所

回答データはSQLiteで保存されます。

```text
./data/nyanko.db
```

この `data/` フォルダを削除すると、保存済み回答も消えます。

## よく使うコマンド

```bash
docker compose logs -f
docker compose ps
docker compose restart
docker compose down
docker compose up -d --build
```


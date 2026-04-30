# デプロイ手順

## 前提

VPSはDocker Composeで運用します。アプリはNext.js standalone buildで起動し、SQLiteデータは `./data` に永続化します。

## 必要ファイル

```text
.env
docker-compose.yml
Dockerfile
data/
```

`.env` には以下を設定します。

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DB_PATH=./data/nyanta.db
BASE_PATH=/nyanta
HOST_PORT=3001
```

## 初回デプロイ

```bash
git clone https://github.com/tao-munakata/nyanta-chat.git
cd nyanta-chat
cp .env.example .env
```

`.env` を編集してAPIキーを設定します。

```bash
mkdir -p data
docker compose up -d --build
docker compose logs -f
```

## 更新デプロイ

```bash
cd nyanta-chat
git pull
docker compose up -d --build
docker compose logs -f
```

## デモ配布パッケージで渡す場合

開発マシンで配布用の圧縮ファイルを作成します。

```bash
./scripts/make-demo-package.sh
```

サーバ側では圧縮ファイルを展開し、同梱の `DEMO_SETUP.md` に従って起動します。

```bash
tar xzf nyanta-chat-demo-*.tar.gz
cd nyanta-chat
cp .env.example .env
mkdir -p data
docker compose up -d --build
```

## 停止

```bash
docker compose down
```

## 確認URL

compose設定ではホスト側 `3001` 番に公開します。

```text
http://<server-host>:3001/nyanta
http://<server-host>:3001/nyanta/medical
http://<server-host>:3001/nyanta/smalltalk
http://<server-host>:3001/nyanta/mood
http://<server-host>:3001/nyanta/secret

# BASE_PATH=/ の場合
http://<server-host>:3001/
http://<server-host>:3001/medical
http://<server-host>:3001/smalltalk
http://<server-host>:3001/mood
http://<server-host>:3001/secret
```

`BASE_PATH` を `/` にするとルートドメインでサービス一覧と4サービスを個別URLで動かせます。

## 注意点

- `data/` はSQLiteの永続データなので削除しない
- `.env` はGitHubへpushしない
- 本番反映前にUbuntu環境でDocker起動確認を行う
- APIキーを変更した場合はコンテナを再作成する

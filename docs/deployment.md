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

## 停止

```bash
docker compose down
```

## 確認URL

compose設定ではホスト側 `3001` 番に公開します。

```text
http://<server-host>:3001/nyanta
```

リバースプロキシを使う場合も、アプリ側のbasePathは `/nyanta` です。

## 注意点

- `data/` はSQLiteの永続データなので削除しない
- `.env` はGitHubへpushしない
- 本番反映前にUbuntu環境でDocker起動確認を行う
- APIキーを変更した場合はコンテナを再作成する

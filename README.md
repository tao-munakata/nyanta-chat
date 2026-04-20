# nyanta-chat

にゃん太先生の問診チャットです。訪問診療・在宅医療の初回相談に向けて、利用者がチャット形式で問診項目を入力し、最後に回答まとめを保存できるNext.jsアプリです。

## 構成

- Framework: Next.js App Router
- UI: React / Tailwind CSS
- Database: SQLite (`better-sqlite3`)
- AI reaction: Anthropic Claude API
- Runtime: Docker / Node.js
- Production path: `/nyanta`

## 主な機能

- 問診質問25問、7カテゴリ
- テキスト、日付、選択肢、写真入力
- Claudeによる短い猫語リアクション
- セッション作成、回答保存、完了処理
- 回答まとめ画面
- 1つ前の質問へ戻るボタン
- 保存用ボタン

## 開発環境の役割

```text
MacBook Air
  移動中の軽い編集、仕様整理、Git操作、Codex作業

Ubuntu mini PC
  Dockerでの本格開発、動作確認、テスト、ビルド確認

VPS
  Docker Composeによる本番運用

GitHub
  コード共有、履歴管理、ブランチ運用

NotebookLM
  README、docs、仕様メモ、開発履歴を読み込ませる知識ベース
```

## 初期設定

環境変数ファイルを作成します。

```bash
cp .env.example .env
```

`.env` にAnthropic APIキーを設定します。

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DB_PATH=./data/nyanta.db
```

## ローカル開発

Node.js/npmが使える環境では以下で起動します。

```bash
npm install
npm run dev
```

ブラウザで開くURL:

```text
http://localhost:3000/nyanta
```

## Dockerでの起動

UbuntuまたはVPSではDocker Composeで起動します。

```bash
docker compose up -d --build
```

ログ確認:

```bash
docker compose logs -f
```

停止:

```bash
docker compose down
```

現在の `docker-compose.yml` はホスト側 `3001` 番ポートをコンテナの `3000` 番へ割り当てます。

```text
http://localhost:3001/nyanta
```

## VPSデプロイ

VPS上でリポジトリをpullし、Docker Composeで再ビルドします。

```bash
git pull
docker compose up -d --build
docker compose logs -f
```

SQLiteのデータは `./data` に永続化します。VPSではこのディレクトリを削除しないように注意してください。

## Git運用

推奨ブランチ:

```text
main        本番安定版
develop     開発統合
feature/*   機能追加
fix/*       不具合修正
```

基本の流れ:

```bash
git switch -c feature/feature-name
git add .
git commit -m "feat: 機能概要"
git push -u origin feature/feature-name
```

本番反映は `main` にマージ後、VPSでpullしてDockerを再起動します。

## よく使うコマンド

```bash
npm run dev
npm run build
npm test
npm run lint
docker compose up -d --build
docker compose logs -f
docker compose down
git status
git log --oneline --decorate -n 20
```

## ドキュメント

- `docs/development-policy.md`: 開発方針
- `docs/deployment.md`: デプロイ手順
- `docs/changelog.md`: 変更履歴
- `docs/feature-ideas.md`: 今後の機能案

NotebookLMにはREADMEと `docs/` 配下を読み込ませる運用を想定しています。

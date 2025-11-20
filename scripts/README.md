# セットアップスクリプト

## Supabaseセットアップ

このスクリプトは、Supabase CLIを使ってプロジェクトを自動的にセットアップします。

### 使い方

```bash
chmod +x scripts/setup-supabase.sh
./scripts/setup-supabase.sh
```

### スクリプトが実行すること

1. ✅ Supabase CLIのインストール確認
2. ✅ Supabaseプロジェクトの初期化
3. ✅ マイグレーションファイルの準備
4. ✅ Supabaseへのログイン
5. ✅ プロジェクトの作成またはリンク
6. ✅ データベーススキーマの適用
7. ✅ 環境変数（.env）の自動設定

### 必要なもの

- Node.js 18以上
- npm
- Supabaseアカウント（スクリプト実行中に作成可能）

### トラブルシューティング

#### "supabase: command not found"

```bash
npm install -g supabase
```

#### マイグレーションが失敗する

手動で適用：
```bash
supabase db push
```

#### 環境変数が正しく設定されない

Supabaseダッシュボードから手動で取得：
https://supabase.com/dashboard/project/_/settings/api

`.env`ファイルに以下を記載：
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

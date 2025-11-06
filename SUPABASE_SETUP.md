# Supabase セットアップ手順

このドキュメントでは、RSSリーダーアプリで使用するSupabaseプロジェクトのセットアップ手順を説明します。

## 1. Supabaseアカウント作成

1. [Supabase](https://supabase.com) にアクセス
2. "Start your project" をクリックしてアカウント作成
3. GitHubアカウントでサインアップ推奨

## 2. 新規プロジェクト作成

1. ダッシュボードで "New Project" をクリック
2. 以下の情報を入力：
   - **Name**: `rss-reader`（任意の名前）
   - **Database Password**: 強力なパスワードを設定（保存しておく）
   - **Region**: `Northeast Asia (Tokyo)` を選択（日本から近い）
   - **Pricing Plan**: `Free` を選択

3. "Create new project" をクリック
4. プロジェクトの準備が完了するまで1-2分待つ

## 3. データベースマイグレーション実行

1. Supabaseダッシュボードで左メニューから **SQL Editor** を選択
2. "New query" をクリック
3. プロジェクトの `supabase/migrations/20250101000000_initial_schema.sql` の内容をコピー＆ペースト
4. "Run" ボタンをクリックして実行
5. 成功メッセージが表示されることを確認

## 4. 認証設定

1. 左メニューから **Authentication** > **Providers** を選択
2. **Email** プロバイダーを有効化
   - "Email" をクリック
   - "Enable Email provider" をONにする
   - "Confirm email" はOFFのままでOK（開発用）
   - "Save" をクリック

### オプション: Googleログイン設定

より便利にするためGoogleログインも設定可能：

1. **Google** プロバイダーをクリック
2. Google Cloud Consoleで認証情報を作成
3. Client IDとClient Secretを入力
4. "Save" をクリック

## 5. API キーの取得

1. 左メニューから **Settings** > **API** を選択
2. 以下の情報をメモ：
   - **Project URL** (`https://xxxxx.supabase.co` の形式)
   - **anon public** キー（`eyJ...` で始まる長い文字列）

## 6. 環境変数の設定

### ローカル開発環境

1. プロジェクトルートで `.env` ファイルを作成：

```bash
cp .env.example .env
```

2. `.env` ファイルを編集して、取得した値を設定：

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercelデプロイ時

1. Vercelのプロジェクト設定で **Settings** > **Environment Variables** を開く
2. 以下の環境変数を追加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. "Production", "Preview", "Development" すべてにチェック
4. "Save" をクリック

## 7. Row Level Security (RLS) の確認

マイグレーションで自動的にRLSポリシーが設定されていることを確認：

1. 左メニューから **Authentication** > **Policies** を選択
2. 各テーブルに以下のポリシーが設定されていることを確認：
   - `feeds`: 全員が閲覧可能
   - `articles`: 全員が閲覧可能
   - `user_feeds`: ユーザーごとに自分のデータのみアクセス可能
   - `read_articles`: ユーザーごとに自分のデータのみアクセス可能

## 8. テストデータの投入（オプション）

開発用にテストデータを投入する場合：

```sql
-- SQL Editorで実行
INSERT INTO feeds (url, title, description, site_url)
VALUES
  ('https://example.com/feed.xml', 'Example Feed', 'Test feed', 'https://example.com');
```

## トラブルシューティング

### マイグレーションが失敗する

- SQL Editorでエラーメッセージを確認
- `uuid-ossp` 拡張が有効化されているか確認
- 既存のテーブルと競合していないか確認

### 認証がうまくいかない

- Supabase URLとAPIキーが正しいか確認
- `.env` ファイルが正しく読み込まれているか確認（Viteを再起動）
- ブラウザのコンソールでエラーメッセージを確認

### RLSエラーが出る

- ユーザーがログインしているか確認
- RLSポリシーが正しく設定されているか確認
- `auth.uid()` が正しく動作しているか確認

## 次のステップ

セットアップ完了後、アプリケーションを起動：

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いて動作確認してください。

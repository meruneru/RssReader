#!/bin/bash

# RSS Reader - Supabase Setup Script
# このスクリプトはSupabase CLIを使ってプロジェクトをセットアップします

set -e  # エラーで停止

echo "=================================================="
echo "  RSS Reader - Supabase Setup"
echo "=================================================="
echo ""

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Supabase CLIのインストール確認
echo -e "${YELLOW}Step 1: Supabase CLIのインストール確認${NC}"
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLIがインストールされていません。インストールします..."
    npm install -g supabase
    echo -e "${GREEN}✓ Supabase CLIをインストールしました${NC}"
else
    echo -e "${GREEN}✓ Supabase CLIは既にインストールされています${NC}"
fi
echo ""

# Step 2: Supabaseプロジェクトの初期化
echo -e "${YELLOW}Step 2: Supabaseプロジェクトの初期化${NC}"
if [ ! -d ".supabase" ]; then
    echo "Supabaseプロジェクトを初期化します..."
    supabase init
    echo -e "${GREEN}✓ Supabaseプロジェクトを初期化しました${NC}"
else
    echo -e "${GREEN}✓ Supabaseプロジェクトは既に初期化されています${NC}"
fi
echo ""

# Step 3: マイグレーションファイルの準備
echo -e "${YELLOW}Step 3: マイグレーションファイルの準備${NC}"

# 既存のマイグレーションファイルをSupabase CLI形式に移動
if [ -f "supabase/migrations/20250101000000_initial_schema.sql" ]; then
    # .supabaseディレクトリにコピー
    mkdir -p .supabase/migrations
    if [ ! -f ".supabase/migrations/20250101000000_initial_schema.sql" ]; then
        cp supabase/migrations/20250101000000_initial_schema.sql .supabase/migrations/
        echo -e "${GREEN}✓ マイグレーションファイルをコピーしました${NC}"
    else
        echo -e "${GREEN}✓ マイグレーションファイルは既に存在します${NC}"
    fi
else
    echo -e "${RED}✗ マイグレーションファイルが見つかりません${NC}"
    exit 1
fi
echo ""

# Step 4: ログイン案内
echo -e "${YELLOW}Step 4: Supabaseにログイン${NC}"
echo "ブラウザが開きます。Supabaseアカウントでログインしてください。"
echo "アカウントがない場合は、サインアップしてください（無料）。"
echo ""
read -p "準備ができたらEnterキーを押してください..."

supabase login

echo -e "${GREEN}✓ ログインしました${NC}"
echo ""

# Step 5: プロジェクト選択
echo -e "${YELLOW}Step 5: Supabaseプロジェクトの選択${NC}"
echo ""
echo "以下の2つのオプションがあります:"
echo "  1) 既存のプロジェクトにリンク"
echo "  2) 新しいプロジェクトを作成"
echo ""
read -p "選択してください (1 または 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "既存のプロジェクト一覧:"
    supabase projects list
    echo ""
    read -p "プロジェクトのReference IDを入力してください: " project_ref
    supabase link --project-ref "$project_ref"
    echo -e "${GREEN}✓ プロジェクトにリンクしました${NC}"
elif [ "$choice" = "2" ]; then
    echo ""
    read -p "新しいプロジェクト名を入力してください (例: rss-reader): " project_name
    read -p "データベースパスワードを入力してください (強力なパスワード): " db_password
    read -p "リージョンを選択してください (例: ap-northeast-1 for Tokyo): " region

    supabase projects create "$project_name" --org-id default --db-password "$db_password" --region "$region"

    # 作成したプロジェクトにリンク
    echo "プロジェクトが作成されました。リンクしています..."
    sleep 3
    project_ref=$(supabase projects list | grep "$project_name" | awk '{print $3}')
    supabase link --project-ref "$project_ref"
    echo -e "${GREEN}✓ 新しいプロジェクトを作成してリンクしました${NC}"
else
    echo -e "${RED}✗ 無効な選択です${NC}"
    exit 1
fi
echo ""

# Step 6: マイグレーションの適用
echo -e "${YELLOW}Step 6: データベースマイグレーションの適用${NC}"
echo "データベーススキーマを適用します..."

# リモートデータベースに適用
supabase db push

echo -e "${GREEN}✓ マイグレーションを適用しました${NC}"
echo ""

# Step 7: 環境変数の取得と設定
echo -e "${YELLOW}Step 7: 環境変数の設定${NC}"

# プロジェクト情報を取得
project_url=$(supabase status | grep "API URL" | awk '{print $3}')
anon_key=$(supabase status | grep "anon key" | awk '{print $3}')

if [ -z "$project_url" ] || [ -z "$anon_key" ]; then
    echo "プロジェクト情報を自動取得できませんでした。"
    echo "Supabaseダッシュボードから手動で取得してください:"
    echo "https://supabase.com/dashboard/project/_/settings/api"
    echo ""
    read -p "Project URLを入力してください: " project_url
    read -p "Anon Keyを入力してください: " anon_key
fi

# .envファイルの作成
if [ ! -f ".env" ]; then
    cat > .env << EOF
VITE_SUPABASE_URL=$project_url
VITE_SUPABASE_ANON_KEY=$anon_key
EOF
    echo -e "${GREEN}✓ .envファイルを作成しました${NC}"
else
    echo -e "${YELLOW}! .envファイルは既に存在します${NC}"
    echo "以下の内容で更新してください:"
    echo ""
    echo "VITE_SUPABASE_URL=$project_url"
    echo "VITE_SUPABASE_ANON_KEY=$anon_key"
    echo ""
    read -p ".envファイルを上書きしますか? (y/n): " overwrite
    if [ "$overwrite" = "y" ]; then
        cat > .env << EOF
VITE_SUPABASE_URL=$project_url
VITE_SUPABASE_ANON_KEY=$anon_key
EOF
        echo -e "${GREEN}✓ .envファイルを更新しました${NC}"
    fi
fi
echo ""

# 完了
echo "=================================================="
echo -e "${GREEN}✓ セットアップが完了しました！${NC}"
echo "=================================================="
echo ""
echo "次のステップ:"
echo "  1. 開発サーバーを起動: npm run dev"
echo "  2. ブラウザで http://localhost:5173 を開く"
echo "  3. サインアップしてログイン"
echo ""
echo "Supabaseダッシュボード:"
echo "  https://supabase.com/dashboard"
echo ""

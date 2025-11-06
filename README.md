# RSS Reader

モダンなWebベースのRSSリーダーアプリケーション。スマートフォン対応で、デバイス間でシームレスに同期します。

## 特徴

- **クロスデバイス対応**: PC・スマートフォンどちらからでもアクセス可能
- **リアルタイム同期**: Supabaseによるデバイス間の自動同期
- **強力な検索機能**: 過去の記事を含む全文検索
- **オフライン対応**: PWA対応で快適な閲覧体験
- **モダンなUI**: Tailwind CSSによるレスポンシブデザイン

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **スタイリング**: Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **デプロイ**: Vercel
- **ルーティング**: React Router

## プロジェクト構成

```
RssReader/
├── src/
│   ├── components/     # Reactコンポーネント
│   ├── pages/          # ページコンポーネント
│   ├── lib/            # ライブラリ設定（Supabase等）
│   ├── hooks/          # カスタムフック
│   ├── types/          # TypeScript型定義
│   ├── utils/          # ユーティリティ関数
│   ├── App.tsx         # メインアプリケーション
│   └── main.tsx        # エントリーポイント
├── supabase/
│   └── migrations/     # データベースマイグレーション
├── public/             # 静的ファイル
└── dist/               # ビルド出力（自動生成）
```

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- Supabaseアカウント

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/RssReader.git
cd RssReader
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseのセットアップ

詳細は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を参照してください。

簡単な手順：
1. [Supabase](https://supabase.com) でプロジェクト作成
2. `supabase/migrations/20250101000000_initial_schema.sql` を実行
3. Project URLとAnon Keyを取得

### 4. 環境変数の設定

```bash
cp .env.example .env
```

`.env` ファイルを編集：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

## ビルド

本番用ビルド：

```bash
npm run build
```

ビルド結果のプレビュー：

```bash
npm run preview
```

## Vercelへのデプロイ

### 初回デプロイ

1. [Vercel](https://vercel.com) でアカウント作成
2. GitHubリポジトリを接続
3. 環境変数を設定：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. "Deploy" をクリック

### 自動デプロイ

`main` ブランチへのプッシュで自動的にデプロイされます。

## データベース構造

### テーブル

- **feeds**: RSSフィードの情報
- **articles**: フィードから取得した記事
- **user_feeds**: ユーザーが購読しているフィード
- **read_articles**: ユーザーの既読状態

詳細は `supabase/migrations/20250101000000_initial_schema.sql` を参照。

## 開発ロードマップ

### Phase 1: 基本機能 ✓
- [x] プロジェクトセットアップ
- [x] データベーススキーマ設計
- [x] Supabase統合
- [ ] ユーザー認証機能
- [ ] フィード登録・表示
- [ ] 記事一覧表示

### Phase 2: コア機能
- [ ] 記事詳細表示
- [ ] 既読/未読管理
- [ ] 検索機能
- [ ] フォルダ/カテゴリ管理

### Phase 3: 拡張機能
- [ ] PWA対応
- [ ] オフライン対応
- [ ] 通知機能
- [ ] エクスポート/インポート
- [ ] ダークモード

## トラブルシューティング

### ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### Supabase接続エラー

- `.env` ファイルが正しく設定されているか確認
- Supabase URLとAPIキーが正しいか確認
- 開発サーバーを再起動

### 型エラー

```bash
# TypeScriptの型チェック
npm run build
```

## ライセンス

MIT

## 貢献

プルリクエスト歓迎です！大きな変更の場合は、まずissueで議論してください。

## サポート

問題が発生した場合は、[GitHub Issues](https://github.com/yourusername/RssReader/issues) で報告してください。

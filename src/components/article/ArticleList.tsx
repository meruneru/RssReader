import { ArticleCard } from './ArticleCard'
import type { ArticleWithFeed } from '../../types/database'

interface ArticleListProps {
  articles: ArticleWithFeed[]
  onArticleClick: (article: ArticleWithFeed) => void
  loading?: boolean
  emptyMessage?: string
}

export function ArticleList({
  articles,
  onArticleClick,
  loading = false,
  emptyMessage = '記事がありません',
}: ArticleListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="mx-auto w-16 h-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          description={article.description || undefined}
          feedTitle={article.feed.title || article.feed.url}
          publishedAt={article.published_at || undefined}
          isRead={article.is_read}
          onClick={() => onArticleClick(article)}
        />
      ))}
    </div>
  )
}

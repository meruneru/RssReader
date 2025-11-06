import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { ArticleWithFeed } from '../../types/database'

interface ArticleDetailProps {
  article: ArticleWithFeed | null
  isOpen: boolean
  onClose: () => void
  onMarkAsRead?: (articleId: string) => void
}

export function ArticleDetail({ article, isOpen, onClose, onMarkAsRead }: ArticleDetailProps) {
  if (!article) return null

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleMarkAsRead = () => {
    if (!article.is_read) {
      onMarkAsRead?.(article.id)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Article header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
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
              <span>{article.feed.title || article.feed.url}</span>
            </div>

            {article.author && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{article.author}</span>
                </div>
              </>
            )}

            {article.published_at && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{formatDate(article.published_at)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Article content */}
        <div className="prose max-w-none mb-6">
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : article.description ? (
            <div dangerouslySetInnerHTML={{ __html: article.description }} />
          ) : (
            <p className="text-gray-600">本文がありません</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={() => window.open(article.link, '_blank')}
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            元記事を開く
          </Button>

          {!article.is_read && (
            <Button variant="outline" onClick={handleMarkAsRead}>
              既読にする
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

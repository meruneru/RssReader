import { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { ArticleList } from '../components/article/ArticleList'
import { ArticleDetail } from '../components/article/ArticleDetail'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import type { ArticleWithFeed } from '../types/database'

// Mock data for now - will be replaced with real data from hooks
const mockArticles: ArticleWithFeed[] = [
  {
    id: '1',
    feed_id: '1',
    guid: 'article-1',
    title: 'React 19の新機能について',
    link: 'https://example.com/react-19',
    description: 'React 19では、use APIやServer Componentsなど、多くの新機能が追加されました。',
    content: '<p>React 19では、use APIやServer Componentsなど、多くの新機能が追加されました。</p>',
    author: '山田太郎',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    feed: {
      id: '1',
      url: 'https://example.com/feed',
      title: 'Tech News',
      description: null,
      site_url: null,
      last_fetched_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_read: false,
  },
  {
    id: '2',
    feed_id: '2',
    guid: 'article-2',
    title: 'Tailwind CSSの新しいパターン',
    link: 'https://example.com/tailwind',
    description: '最近のプロジェクトで使える、Tailwind CSSの便利なパターンを紹介します。',
    content: null,
    author: null,
    published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    feed: {
      id: '2',
      url: 'https://example.com/feed2',
      title: 'Web Dev Blog',
      description: null,
      site_url: null,
      last_fetched_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_read: false,
  },
  {
    id: '3',
    feed_id: '1',
    guid: 'article-3',
    title: 'TypeScriptの型安全性を高める方法',
    link: 'https://example.com/typescript',
    description: 'TypeScriptで型安全なコードを書くためのベストプラクティス',
    content: null,
    author: '佐藤花子',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    feed: {
      id: '1',
      url: 'https://example.com/feed',
      title: 'Tech News',
      description: null,
      site_url: null,
      last_fetched_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    is_read: true,
  },
]

export function HomePage() {
  const [articles] = useState<ArticleWithFeed[]>(mockArticles)
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithFeed | null>(null)
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false)
  const [newFeedUrl, setNewFeedUrl] = useState('')

  const handleArticleClick = (article: ArticleWithFeed) => {
    setSelectedArticle(article)
  }

  const handleCloseDetail = () => {
    setSelectedArticle(null)
  }

  const handleMarkAsRead = (articleId: string) => {
    console.log('Mark as read:', articleId)
    // Will be implemented with real Supabase mutation
  }

  const handleAddFeed = () => {
    console.log('Add feed:', newFeedUrl)
    // Will be implemented with real Supabase mutation
    setNewFeedUrl('')
    setIsAddFeedModalOpen(false)
  }

  return (
    <>
      <AppLayout
        onSearchChange={(query) => console.log('Search:', query)}
        onFeedSelect={(feedId) => console.log('Feed selected:', feedId)}
        onAddFeedClick={() => setIsAddFeedModalOpen(true)}
      >
        <div className="max-w-4xl mx-auto p-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">すべての記事</h2>
            <p className="text-sm text-gray-600">
              {articles.filter((a) => !a.is_read).length}件の未読記事
            </p>
          </div>

          <ArticleList
            articles={articles}
            onArticleClick={handleArticleClick}
            loading={false}
          />
        </div>
      </AppLayout>

      <ArticleDetail
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={handleCloseDetail}
        onMarkAsRead={handleMarkAsRead}
      />

      <Modal
        isOpen={isAddFeedModalOpen}
        onClose={() => setIsAddFeedModalOpen(false)}
        title="フィードを追加"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="feedUrl" className="block text-sm font-medium text-gray-700 mb-1">
              フィードURL
            </label>
            <input
              id="feedUrl"
              type="url"
              placeholder="https://example.com/feed.xml"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddFeedModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleAddFeed} disabled={!newFeedUrl}>
              追加
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

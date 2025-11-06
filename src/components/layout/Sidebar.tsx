import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onFeedSelect?: (feedId: string | null) => void
  onAddFeedClick?: () => void
}

export function Sidebar({ isOpen, onClose, onFeedSelect, onAddFeedClick }: SidebarProps) {
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null)

  const handleFeedClick = (feedId: string | null) => {
    setSelectedFeed(feedId)
    onFeedSelect?.(feedId)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  // Sample data - will be replaced with real data from hooks
  const feeds = [
    { id: '1', title: 'Tech News', unreadCount: 5 },
    { id: '2', title: 'Web Dev Blog', unreadCount: 12 },
    { id: '3', title: 'React Updates', unreadCount: 3 },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">フィード</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* All feeds */}
            <button
              onClick={() => handleFeedClick(null)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-md text-left
                ${
                  selectedFeed === null
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="font-medium">すべて</span>
              </div>
            </button>

            {/* Feed list */}
            <div className="space-y-1">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                購読中
              </h3>
              {feeds.map((feed) => (
                <button
                  key={feed.id}
                  onClick={() => handleFeedClick(feed.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-md text-left
                    ${
                      selectedFeed === feed.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="truncate">{feed.title}</span>
                  {feed.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {feed.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Add feed button */}
            <button
              onClick={onAddFeedClick}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-blue-600 hover:bg-blue-50 font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>フィードを追加</span>
            </button>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>設定</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

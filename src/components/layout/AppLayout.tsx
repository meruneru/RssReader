import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  onSearchChange?: (query: string) => void
  onFeedSelect?: (feedId: string | null) => void
  onAddFeedClick?: () => void
}

export function AppLayout({
  children,
  onSearchChange,
  onFeedSelect,
  onAddFeedClick,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onSearchChange={onSearchChange}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onFeedSelect={onFeedSelect}
          onAddFeedClick={onAddFeedClick}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

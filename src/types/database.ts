export interface Feed {
  id: string
  url: string
  title: string | null
  description: string | null
  site_url: string | null
  last_fetched_at: string | null
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  feed_id: string
  guid: string
  title: string
  link: string
  description: string | null
  content: string | null
  author: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface UserFeed {
  id: string
  user_id: string
  feed_id: string
  custom_title: string | null
  folder: string | null
  created_at: string
}

export interface ReadArticle {
  id: string
  user_id: string
  article_id: string
  read_at: string
}

export interface ArticleWithFeed extends Article {
  feed: Feed
  is_read: boolean
}

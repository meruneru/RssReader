-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Feeds table: Store RSS feed information
CREATE TABLE feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  site_url TEXT,
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table: Store individual articles from feeds
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  guid TEXT NOT NULL, -- Unique identifier from RSS feed
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feed_id, guid)
);

-- User feeds table: Track which feeds each user subscribes to
CREATE TABLE user_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  custom_title TEXT, -- Allow users to rename feeds
  folder TEXT, -- Allow users to organize feeds into folders
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feed_id)
);

-- Read articles table: Track which articles each user has read
CREATE TABLE read_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_articles_feed_id ON articles(feed_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_user_feeds_user_id ON user_feeds(user_id);
CREATE INDEX idx_read_articles_user_id ON read_articles(user_id);
CREATE INDEX idx_read_articles_article_id ON read_articles(article_id);

-- Create full-text search index for articles
CREATE INDEX idx_articles_search ON articles USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, ''))
);

-- Enable Row Level Security (RLS)
ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE read_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feeds
-- Anyone can read feeds (since they're public RSS feeds)
CREATE POLICY "Feeds are viewable by everyone"
  ON feeds FOR SELECT
  USING (true);

-- RLS Policies for articles
-- Anyone can read articles
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

-- RLS Policies for user_feeds
-- Users can only see their own subscriptions
CREATE POLICY "Users can view own feed subscriptions"
  ON user_feeds FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own feed subscriptions"
  ON user_feeds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete own feed subscriptions"
  ON user_feeds FOR DELETE
  USING (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own feed subscriptions"
  ON user_feeds FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for read_articles
-- Users can only see their own read status
CREATE POLICY "Users can view own read articles"
  ON read_articles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can mark articles as read
CREATE POLICY "Users can insert own read articles"
  ON read_articles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own read markers
CREATE POLICY "Users can delete own read articles"
  ON read_articles FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_feeds_updated_at
  BEFORE UPDATE ON feeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

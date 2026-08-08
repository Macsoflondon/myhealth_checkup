CREATE TABLE public.provider_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id text NOT NULL,
  provider_name text NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  url text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'Wellness',
  published_at date NOT NULL,
  source_type text NOT NULL DEFAULT 'atom',
  source_url text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT provider_blog_posts_url_key UNIQUE (url)
);

CREATE INDEX provider_blog_posts_published_idx ON public.provider_blog_posts (published_at DESC);
CREATE INDEX provider_blog_posts_provider_idx ON public.provider_blog_posts (provider_id);
CREATE INDEX provider_blog_posts_category_idx ON public.provider_blog_posts (category);

GRANT SELECT ON public.provider_blog_posts TO anon;
GRANT SELECT ON public.provider_blog_posts TO authenticated;
GRANT ALL ON public.provider_blog_posts TO service_role;

ALTER TABLE public.provider_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read provider blog posts"
  ON public.provider_blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER update_provider_blog_posts_updated_at
  BEFORE UPDATE ON public.provider_blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
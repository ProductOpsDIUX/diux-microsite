// Types shared by server + client code. Kept hand-rolled (rather than
// generated) so the admin and the public site agree on shape regardless
// of when the schema was last introspected.

export type Pillar = { title: string; body: string };
export type Stat = { value: string; label: string };

export interface HomeContent {
  id: 'home';
  hero_eyebrow: string;
  hero_h1_prefix: string;
  hero_h1_rotator: string[];
  hero_h1_suffix: string;
  hero_sub: string;
  pillars: Pillar[];
  mission_eyebrow: string;
  mission_lines: string[];
  stats: Stat[];
  updated_at: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  year: string;
  client: string;
  category: string;
  tags: string[];
  hero_image: string | null;
  body: string;
  featured: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  topic: string;
  body_html: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  linkedin_url: string | null;
  is_leadership: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  og_image: string | null;
  updated_at: string;
}

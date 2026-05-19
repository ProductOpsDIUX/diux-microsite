import 'server-only';
import { getPublicClient, getServiceClient } from '@/lib/supabase/server';
import type { HomeContent } from '@/lib/supabase/types';

const DEFAULTS: HomeContent = {
  id: 'home',
  hero_eyebrow: '// Index v3 · 2026.05',
  hero_h1_prefix: 'Designing the',
  hero_h1_rotator: ['instruments', 'decisions', 'interfaces', 'outcomes'],
  hero_h1_suffix: 'of modern defence.',
  hero_sub:
    'DI & UX is a multidisciplinary design practice embedded inside defence technology. We craft mission-grade software, AI-enabled workflows, and the decision tools the people on the line actually trust.',
  pillars: [
    { title: 'Command Centre Experience', body: 'Designing and optimising operational experiences for command centre users. Adaptive to the mission and intuitive to the user, these experiences enable clarity, coordination, and confident decision-making.' },
    { title: 'Employee & Talent Experience', body: 'Shaping how employees and future talents experience their work, workplace, and everyday interactions. Focused on creating connected and meaningful experiences that foster an engaging, purposeful, and human-centred culture.' },
    { title: 'Enterprise Experience', body: 'Humanising and innovating digital service experiences across enterprise platforms and systems. From workplace tools to developer ecosystems, the focus is on creating experiences that feel simple, seamless, and empowering.' },
    { title: 'Product Strategy', body: 'Orchestrating people, processes, and technology to amplify the impact of design and innovation. Enabling teams to focus on real user needs while driving consistency, efficiency, and meaningful experiences at scale.' },
  ],
  mission_eyebrow: '// Our mission',
  mission_lines: ['We shape', 'the entire user universe', 'and create', 'awesome products.'],
  stats: [
    { value: '33', label: '// Creative minds' },
    { value: '11', label: '// Strategic domains' },
    { value: '60', label: '// Innovation missions' },
    { value: '∞', label: '// Possibilities engineered' },
  ],
  updated_at: new Date(0).toISOString(),
};

export async function getHomeContent(): Promise<HomeContent> {
  const sb = getPublicClient();
  const { data, error } = await sb.from('home_content').select('*').eq('id', 'home').maybeSingle();
  if (error) {
    console.error('home_content read failed', error);
    return DEFAULTS;
  }
  return mergeWithDefaults(data);
}

export async function updateHomeContent(input: Partial<HomeContent>): Promise<HomeContent> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('home_content')
    .upsert({ id: 'home', ...input }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return mergeWithDefaults(data);
}

function mergeWithDefaults(row: Partial<HomeContent> | null): HomeContent {
  if (!row) return DEFAULTS;
  return {
    ...DEFAULTS,
    ...row,
    pillars: Array.isArray(row.pillars) && row.pillars.length ? row.pillars : DEFAULTS.pillars,
    stats: Array.isArray(row.stats) && row.stats.length ? row.stats : DEFAULTS.stats,
    hero_h1_rotator: row.hero_h1_rotator?.length ? row.hero_h1_rotator : DEFAULTS.hero_h1_rotator,
    mission_lines: row.mission_lines?.length ? row.mission_lines : DEFAULTS.mission_lines,
  } as HomeContent;
}

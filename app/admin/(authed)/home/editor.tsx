'use client';

import { useState, useTransition } from 'react';
import { useForm, useFieldArray, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Field, Input, Textarea, Button, Toast } from '@/components/admin/ui';
import { saveHomeAction } from '@/app/admin/actions';
import { HomeSchema, type HomeFormValues } from '@/lib/schemas/home';
import type { HomeContent } from '@/lib/supabase/types';

export function HomeEditor({ initial }: { initial: HomeContent }) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { kind: 'success' | 'error'; message: string } | null
  >(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm<HomeFormValues>({
    resolver: zodResolver(HomeSchema),
    defaultValues: {
      hero_eyebrow: initial.hero_eyebrow,
      hero_h1_prefix: initial.hero_h1_prefix,
      hero_h1_rotator: initial.hero_h1_rotator,
      hero_h1_suffix: initial.hero_h1_suffix,
      hero_sub: initial.hero_sub,
      pillars: initial.pillars,
      mission_eyebrow: initial.mission_eyebrow,
      mission_lines: initial.mission_lines,
      stats: initial.stats,
    },
  });

  const pillars = useFieldArray({ control, name: 'pillars' });
  const stats = useFieldArray({ control, name: 'stats' });
  const rotator = useFieldArray({
    control,
    name: 'hero_h1_rotator' as never,
  });
  const lines = useFieldArray({
    control,
    name: 'mission_lines' as never,
  });

  const onSubmit: SubmitHandler<HomeFormValues> = (values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveHomeAction(values);
      if (!result.ok) {
        setFeedback({ kind: 'error', message: result.error });
        if (result.fieldErrors) {
          for (const [path, message] of Object.entries(result.fieldErrors)) {
            // path could be e.g. 'pillars.0.title'
            setError(path as never, { type: 'server', message });
          }
        }
        return;
      }
      setFeedback({ kind: 'success', message: 'Saved. Live site updated.' });
      reset(values, { keepValues: true });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {feedback && <Toast kind={feedback.kind}>{feedback.message}</Toast>}

      {/* ── HERO ────────────────────────────────────────────────── */}
      <Card title="Hero" description="The headline area at the top of the home page.">
        <Field label="Eyebrow" error={errors.hero_eyebrow?.message}>
          <Input {...register('hero_eyebrow')} placeholder="// Index v3 · 2026.05" />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Headline prefix" required error={errors.hero_h1_prefix?.message}>
            <Input {...register('hero_h1_prefix')} placeholder="Designing the" />
          </Field>
          <Field label="Headline suffix" required error={errors.hero_h1_suffix?.message}>
            <Input {...register('hero_h1_suffix')} placeholder="of modern defence." />
          </Field>
        </div>

        <Field
          label="Rotating words"
          hint="Cycled in the headline, one at a time"
          error={(errors.hero_h1_rotator as { message?: string } | undefined)?.message}
        >
          <div className="space-y-2">
            {rotator.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`hero_h1_rotator.${i}` as const)}
                  placeholder="e.g. instruments"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => rotator.remove(i)}
                  className="shrink-0"
                  aria-label="Remove word"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => rotator.append('' as never)}>
              + Add word
            </Button>
          </div>
        </Field>

        <Field label="Subhead" required error={errors.hero_sub?.message}>
          <Textarea
            {...register('hero_sub')}
            rows={4}
            placeholder="Short paragraph under the headline."
          />
        </Field>
      </Card>

      {/* ── PILLARS ─────────────────────────────────────────────── */}
      <Card
        title="Pillars"
        description="The capability cards that swap as the visitor scrolls."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => pillars.append({ title: '', body: '' })}
          >
            + Add pillar
          </Button>
        }
      >
        {pillars.fields.map((field, i) => (
          <div key={field.id} className="rounded-md border border-line p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
                Pillar {i + 1}
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => i > 0 && pillars.move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Move up"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => i < pillars.fields.length - 1 && pillars.move(i, i + 1)}
                  disabled={i === pillars.fields.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </Button>
                <Button type="button" variant="danger" onClick={() => pillars.remove(i)}>
                  Delete
                </Button>
              </div>
            </div>
            <Field label="Title" required error={errors.pillars?.[i]?.title?.message}>
              <Input {...register(`pillars.${i}.title` as const)} />
            </Field>
            <Field label="Body" required error={errors.pillars?.[i]?.body?.message}>
              <Textarea {...register(`pillars.${i}.body` as const)} rows={4} />
            </Field>
          </div>
        ))}
        {(errors.pillars as { message?: string } | undefined)?.message && (
          <Toast kind="error">{(errors.pillars as { message?: string }).message}</Toast>
        )}
      </Card>

      {/* ── MISSION ─────────────────────────────────────────────── */}
      <Card
        title="Mission"
        description="The large kinetic text below the pillars. Each line animates in independently."
      >
        <Field label="Eyebrow" error={errors.mission_eyebrow?.message}>
          <Input {...register('mission_eyebrow')} placeholder="// Our mission" />
        </Field>
        <Field
          label="Lines"
          hint="One per line in the manifesto"
          error={(errors.mission_lines as { message?: string } | undefined)?.message}
        >
          <div className="space-y-2">
            {lines.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`mission_lines.${i}` as const)} />
                <Button type="button" variant="ghost" onClick={() => lines.remove(i)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => lines.append('' as never)}>
              + Add line
            </Button>
          </div>
        </Field>
      </Card>

      {/* ── STATS ───────────────────────────────────────────────── */}
      <Card
        title="Stats"
        description="The numbered band underneath the mission."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => stats.append({ value: '', label: '' })}
          >
            + Add stat
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.fields.map((field, i) => (
            <div key={field.id} className="rounded-md border border-line p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
                  Stat {i + 1}
                </div>
                <Button type="button" variant="danger" onClick={() => stats.remove(i)}>
                  Delete
                </Button>
              </div>
              <Field label="Value" required error={errors.stats?.[i]?.value?.message}>
                <Controller
                  control={control}
                  name={`stats.${i}.value` as const}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="33 or ∞"
                    />
                  )}
                />
              </Field>
              <Field label="Label" required error={errors.stats?.[i]?.label?.message}>
                <Input {...register(`stats.${i}.label` as const)} placeholder="// Creative minds" />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      {/* ── SAVE BAR ────────────────────────────────────────────── */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border border-line bg-bg0/95 backdrop-blur px-5 py-3 shadow-lg">
        <div className="text-[12px] text-fg2">
          {isDirty ? (
            <span>You have unsaved changes.</span>
          ) : (
            <span>All changes saved.</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={() => reset()} disabled={!isDirty || pending}>
            Discard
          </Button>
          <Button type="submit" variant="primary" loading={pending} disabled={!isDirty}>
            {pending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}

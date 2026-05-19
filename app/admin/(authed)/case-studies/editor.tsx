'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, Field, Input, Textarea, Button, Toast } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { CaseStudySchema, type CaseStudyFormValues } from '@/lib/schemas/case-study';
import { saveCaseStudyAction, deleteCaseStudyAction } from './actions';
import type { CaseStudy } from '@/lib/supabase/types';

export function CaseStudyEditor({ initial }: { initial: CaseStudy | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
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
    watch,
  } = useForm<CaseStudyFormValues>({
    resolver: zodResolver(CaseStudySchema),
    defaultValues: {
      slug: initial?.slug ?? '',
      title: initial?.title ?? '',
      summary: initial?.summary ?? '',
      year: initial?.year ?? '',
      client: initial?.client ?? '',
      category: initial?.category ?? '',
      tags: initial?.tags ?? [],
      hero_image: initial?.hero_image ?? null,
      body: initial?.body ?? '',
      featured: initial?.featured ?? false,
      position: initial?.position ?? 0,
    },
  });

  const slugValue = watch('slug');

  const onSubmit: SubmitHandler<CaseStudyFormValues> = (values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveCaseStudyAction({ ...values, id: initial?.id });
      if (!result.ok) {
        setFeedback({ kind: 'error', message: result.error });
        if (result.fieldErrors) {
          for (const [path, message] of Object.entries(result.fieldErrors)) {
            setError(path as never, { type: 'server', message });
          }
        }
        return;
      }
      setFeedback({
        kind: 'success',
        message: initial ? 'Saved. Changes live.' : 'Case study created.',
      });
      reset(values, { keepValues: true });
      if (!initial) router.replace(`/admin/case-studies/${result.data.id}`);
    });
  };

  const onDelete = () => {
    if (!initial) return;
    if (!confirm(`Delete “${initial.title || 'this case study'}”?`)) return;
    startDelete(async () => {
      try {
        await deleteCaseStudyAction(initial.id);
      } catch (e) {
        setFeedback({
          kind: 'error',
          message: e instanceof Error ? e.message : 'Delete failed',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {feedback && <Toast kind={feedback.kind}>{feedback.message}</Toast>}

      <Card title="Basics">
        <Field label="Title" required error={errors.title?.message}>
          <Input {...register('title')} placeholder="Aegis Console — Multi-domain awareness" />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Slug" required hint="URL: /case-study/<slug>" error={errors.slug?.message}>
            <Input {...register('slug')} placeholder="aegis-console" />
          </Field>
          <Field label="Year" error={errors.year?.message}>
            <Input {...register('year')} placeholder="2025" />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Client" error={errors.client?.message}>
            <Input {...register('client')} placeholder="BAE" />
          </Field>
          <Field label="Category" error={errors.category?.message}>
            <Input {...register('category')} placeholder="Operator UI" />
          </Field>
        </div>
        <Field
          label="Tags"
          hint="Comma-separated"
          error={(errors.tags as { message?: string } | undefined)?.message}
        >
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <Input
                value={field.value.join(', ')}
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="cmd, ops, ai"
              />
            )}
          />
        </Field>
        <Field label="Summary" error={errors.summary?.message}>
          <Textarea {...register('summary')} rows={3} />
        </Field>
        <Controller
          control={control}
          name="hero_image"
          render={({ field }) => (
            <ImageUploader
              label="Hero image"
              prefix={`case-studies/${slugValue || 'misc'}`}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Card>

      <Card title="Body" description="The long-form write-up. Plain text or basic markdown.">
        <Field label="Body" error={errors.body?.message}>
          <Textarea {...register('body')} rows={14} />
        </Field>
      </Card>

      <Card title="Display">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Position" hint="Lower numbers appear first" error={errors.position?.message}>
            <Input
              type="number"
              min={0}
              {...register('position', { valueAsNumber: true })}
            />
          </Field>
          <Field label="Featured">
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  <span className="text-[13px] text-fg0">Show on the home page</span>
                </label>
              )}
            />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border border-line bg-bg0/95 backdrop-blur px-5 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          {initial && (
            <Button type="button" variant="danger" onClick={onDelete} loading={deleting}>
              Delete
            </Button>
          )}
          <div className="text-[12px] text-fg2">
            {isDirty ? 'You have unsaved changes.' : 'All changes saved.'}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => reset()}
            disabled={!isDirty || pending}
          >
            Discard
          </Button>
          <Button type="submit" variant="primary" loading={pending} disabled={!isDirty && !!initial}>
            {pending ? 'Saving…' : initial ? 'Save changes' : 'Create case study'}
          </Button>
        </div>
      </div>
    </form>
  );
}

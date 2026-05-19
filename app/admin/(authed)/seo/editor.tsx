'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Field, Input, Textarea, Button, Toast } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { PageSeoSchema, type PageSeoFormValues } from '@/lib/schemas/seo';
import { saveSeoAction } from './actions';
import type { PageSeo } from '@/lib/supabase/types';

export function SeoEditorList({
  items,
}: {
  items: Array<{ label: string; seo: PageSeo }>;
}) {
  return (
    <div className="space-y-6">
      {items.map(({ label, seo }) => (
        <SeoEditorRow key={seo.path} label={label} initial={seo} />
      ))}
    </div>
  );
}

function SeoEditorRow({ label, initial }: { label: string; initial: PageSeo }) {
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
    watch,
  } = useForm<PageSeoFormValues>({
    resolver: zodResolver(PageSeoSchema),
    defaultValues: {
      path: initial.path,
      title: initial.title,
      description: initial.description,
      og_image: initial.og_image ?? null,
    },
  });

  const titleVal = watch('title');
  const descVal = watch('description');

  const onSubmit: SubmitHandler<PageSeoFormValues> = (values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveSeoAction(values);
      if (!result.ok) {
        setFeedback({ kind: 'error', message: result.error });
        if (result.fieldErrors) {
          for (const [path, message] of Object.entries(result.fieldErrors)) {
            setError(path as never, { type: 'server', message });
          }
        }
        return;
      }
      setFeedback({ kind: 'success', message: 'Saved.' });
      reset(values, { keepValues: true });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={`${label} — ${initial.path}`}
        description="Title under 70 chars, description under 170 for Google SERPs."
      >
        {feedback && <Toast kind={feedback.kind}>{feedback.message}</Toast>}
        <input type="hidden" {...register('path')} />
        <Field
          label="Title"
          hint={`${titleVal?.length ?? 0} / 70`}
          error={errors.title?.message}
        >
          <Input {...register('title')} />
        </Field>
        <Field
          label="Description"
          hint={`${descVal?.length ?? 0} / 170`}
          error={errors.description?.message}
        >
          <Textarea {...register('description')} rows={3} />
        </Field>
        <Controller
          control={control}
          name="og_image"
          render={({ field }) => (
            <ImageUploader
              label="OG image"
              prefix={`og${initial.path === '/' ? '/home' : initial.path}`}
              value={field.value}
              onChange={field.onChange}
              hint="Used for social previews. 1200×630 recommended."
            />
          )}
        />

        {/* SERP preview */}
        <div className="rounded-md border border-line bg-bg2/30 p-4">
          <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2 mb-2">
            // SERP preview
          </div>
          <div className="text-[12px] text-fg2 truncate">
            diux.com{initial.path === '/' ? '' : initial.path}
          </div>
          <div className="text-[18px] text-[#5b87f1] truncate mt-0.5">
            {titleVal || <span className="text-fg2">(no title)</span>}
          </div>
          <div className="text-[13px] text-fg1 line-clamp-2 mt-0.5">
            {descVal || <span className="text-fg2">(no description)</span>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => reset()}
            disabled={!isDirty || pending}
          >
            Discard
          </Button>
          <Button type="submit" variant="primary" loading={pending} disabled={!isDirty}>
            {pending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </Card>
    </form>
  );
}

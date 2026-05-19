'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, Field, Input, Textarea, Button, Toast } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ArticleSchema, type ArticleFormValues, slugify } from '@/lib/schemas/article';
import { saveArticleAction, deleteArticleAction } from './actions';
import type { Article } from '@/lib/supabase/types';

export function ArticleEditor({ initial }: { initial: Article | null }) {
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
    setValue,
    watch,
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      slug: initial?.slug ?? '',
      title: initial?.title ?? '',
      excerpt: initial?.excerpt ?? '',
      cover_image: initial?.cover_image ?? null,
      author: initial?.author ?? '',
      display_date: initial?.display_date ?? '',
      tags: initial?.tags ?? [],
      body_html: initial?.body_html ?? '',
      is_published: initial?.is_published ?? false,
    },
  });

  const titleValue = watch('title');
  const slugValue = watch('slug');

  const onSubmit: SubmitHandler<ArticleFormValues> = (values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveArticleAction({ ...values, id: initial?.id });
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
        message: initial ? 'Saved. Changes live.' : 'Article created.',
      });
      reset(values, { keepValues: true });
      if (!initial) {
        // Move to the canonical edit URL so subsequent saves are updates.
        router.replace(`/admin/articles/${result.data.id}`);
      }
    });
  };

  const onDelete = () => {
    if (!initial) return;
    if (!confirm(`Delete “${initial.title || 'this article'}”? This can't be undone.`)) return;
    startDelete(async () => {
      try {
        await deleteArticleAction(initial.id);
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
          <Input
            {...register('title')}
            onBlur={(e) => {
              register('title').onBlur(e);
              if (!slugValue && e.target.value) {
                setValue('slug', slugify(e.target.value), { shouldDirty: true });
              }
            }}
            placeholder="Designing trust into autonomous mission systems"
          />
        </Field>
        <Field
          label="Slug"
          required
          hint="URL: /article/<slug>"
          error={errors.slug?.message}
        >
          <Input {...register('slug')} placeholder="autonomous-mission-systems" />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Author"
            hint="Shown in the byline. Multiple authors: comma-separated."
            error={errors.author?.message}
          >
            <Input {...register('author')} placeholder="Maya Okafor" />
          </Field>
          <Field
            label="Date"
            hint="Free text — e.g. “April 2026” or “28 Apr 2026”. Overrides the auto-publish date on the public site."
            error={errors.display_date?.message}
          >
            <Input {...register('display_date')} placeholder="28 April 2026" />
          </Field>
        </div>
        <Field
          label="Tags"
          hint="Comma-separated. Visitors can click a tag on /article to filter by it."
          error={(errors.tags as { message?: string } | undefined)?.message}
        >
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagsInput value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
        <Field
          label="Excerpt"
          hint="Short summary shown on the listing page"
          error={errors.excerpt?.message}
        >
          <Textarea {...register('excerpt')} rows={3} />
        </Field>
        <Controller
          control={control}
          name="cover_image"
          render={({ field }) => (
            <ImageUploader
              label="Cover image"
              prefix={`articles/${slugValue || 'misc'}`}
              value={field.value}
              onChange={field.onChange}
              hint="Shown on the article card and at the top of the post."
            />
          )}
        />
      </Card>

      <Card title="Body" description="Rich text — bold, italic, headings, lists, links, images, tables.">
        <Controller
          control={control}
          name="body_html"
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              uploadPrefix={`articles/${slugValue || 'misc'}/inline`}
            />
          )}
        />
      </Card>

      <Card
        title="Publication"
        description="Drafts stay hidden from the public site. Publish to make this article visible."
      >
        <Controller
          control={control}
          name="is_published"
          render={({ field }) => (
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              <span className="text-[14px] text-fg0">Published</span>
              {field.value ? (
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent">
                  // live
                </span>
              ) : (
                <span className="text-[11px] font-mono uppercase tracking-wider text-fg2">
                  // draft
                </span>
              )}
            </label>
          )}
        />
        {initial?.published_at && (
          <div className="text-[12px] text-fg2">
            First published {new Date(initial.published_at).toLocaleString()}
          </div>
        )}
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
            {pending ? 'Saving…' : initial ? 'Save changes' : 'Create article'}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Tags input — holds the raw comma-separated text in local state so the
// admin can freely type commas, spaces, and uppercase characters without
// the field reshuffling on every keystroke. The form's `tags` array is
// kept in sync via the parent `onChange`. We re-parse on each keystroke
// (so the array is correct when saving) but the displayed text always
// reflects what the user actually typed.
function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [text, setText] = useState(value.join(', '));

  // Sync from outside (e.g. when the form `reset()`s after a save).
  useEffect(() => {
    setText(value.join(', '));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.join('')]);

  const normalize = (raw: string) =>
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

  return (
    <Input
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        // Push the parsed array up so Save reflects current state, but the
        // text input keeps the user's literal characters (commas, spaces).
        onChange(normalize(raw));
      }}
      onBlur={() => {
        // Tidy the displayed text on blur — collapses double commas, trims,
        // and removes blanks.
        setText(normalize(text).join(', '));
      }}
      placeholder="ai, ux, research"
    />
  );
}

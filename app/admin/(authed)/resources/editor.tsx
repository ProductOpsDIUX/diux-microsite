'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, Field, Input, Textarea, Button, Toast } from '@/components/admin/ui';
import { FileUploader } from '@/components/admin/FileUploader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ResourceSchema, type ResourceFormValues } from '@/lib/schemas/resource';
import { saveResourceAction, deleteResourceAction } from './actions';
import type { Resource } from '@/lib/supabase/types';

export function ResourceEditor({ initial }: { initial: Resource | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [feedback, setFeedback] = useState<
    { kind: 'success' | 'error'; message: string } | null
  >(null);
  // Source toggle — controls which input is shown. Doesn't ship to Supabase,
  // we only care about the resulting url/file_path.
  const [source, setSource] = useState<'file' | 'link'>(
    initial?.file_path ? 'file' : 'link'
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
    setValue,
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(ResourceSchema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      kind: initial?.kind ?? 'template',
      url: initial?.url ?? '',
      file_path: initial?.file_path ?? null,
      thumbnail: initial?.thumbnail ?? null,
      position: initial?.position ?? 0,
    },
  });

  const onSubmit: SubmitHandler<ResourceFormValues> = (values) => {
    setFeedback(null);
    // When switching from "file" to "link" the user might still have a stale
    // file_path lying around — drop it so the row reflects the active source.
    const payload = source === 'link' ? { ...values, file_path: null } : values;
    startTransition(async () => {
      const result = await saveResourceAction({ ...payload, id: initial?.id });
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
        message: initial ? 'Saved.' : 'Resource added.',
      });
      reset(payload, { keepValues: true });
      if (!initial) router.replace(`/admin/resources/${result.data.id}`);
    });
  };

  const onDelete = () => {
    if (!initial) return;
    if (!confirm(`Delete “${initial.title}”? Any uploaded file will be removed too.`)) return;
    startDelete(async () => {
      try {
        await deleteResourceAction(initial.id);
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
          <Input {...register('title')} placeholder="Discovery research plan template" />
        </Field>
        <Field label="Description" error={errors.description?.message}>
          <Textarea {...register('description')} rows={3} placeholder="Short summary shown next to the link." />
        </Field>
        <Field label="Category" required error={errors.kind?.message}>
          <Controller
            control={control}
            name="kind"
            render={({ field }) => (
              <div className="flex gap-2">
                {(['template', 'manual'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => field.onChange(k)}
                    className={`px-3 py-1.5 rounded-md border text-[13px] capitalize transition-colors ${
                      field.value === k
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-line bg-bg1 text-fg1 hover:bg-bg2'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            )}
          />
        </Field>
      </Card>

      <Card
        title="Source"
        description="Upload a file or paste an external link — whichever fits the resource."
      >
        <div className="flex gap-2">
          {(['file', 'link'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={`px-3 py-1.5 rounded-md border text-[13px] capitalize transition-colors ${
                source === s
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-line bg-bg1 text-fg1 hover:bg-bg2'
              }`}
            >
              {s === 'file' ? 'Upload file' : 'External link'}
            </button>
          ))}
        </div>

        {source === 'file' ? (
          <Controller
            control={control}
            name="url"
            render={({ field: urlField }) => (
              <Controller
                control={control}
                name="file_path"
                render={({ field: pathField }) => (
                  <FileUploader
                    label="File"
                    prefix="resources"
                    value={urlField.value || null}
                    filePath={pathField.value || null}
                    onChange={({ url, path }) => {
                      // setValue keeps RHF dirty-tracking honest for both fields.
                      setValue('url', url ?? '', { shouldDirty: true });
                      setValue('file_path', path ?? null, { shouldDirty: true });
                    }}
                    hint="Stored in Supabase Storage under /resources."
                  />
                )}
              />
            )}
          />
        ) : (
          <Field label="External URL" required error={errors.url?.message}>
            <Input
              type="url"
              {...register('url')}
              placeholder="https://drive.google.com/…"
            />
          </Field>
        )}

        {/* Show the URL even in file mode so admins can copy it. */}
        {source === 'file' && errors.url?.message && (
          <Toast kind="error">{errors.url.message}</Toast>
        )}
      </Card>

      <Card title="Thumbnail" description="Cover image shown on the public Resources page card.">
        <Controller
          control={control}
          name="thumbnail"
          render={({ field }) => (
            <ImageUploader
              label="Thumbnail"
              prefix="resources/thumbnails"
              value={field.value}
              onChange={field.onChange}
              hint="16:9 / 4:3 / 1:1 all work; the card crops to fit."
            />
          )}
        />
      </Card>

      <Card title="Display">
        <Field label="Position" hint="Lower numbers appear first within their category" error={errors.position?.message}>
          <Input type="number" min={0} {...register('position', { valueAsNumber: true })} />
        </Field>
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
            {pending ? 'Saving…' : initial ? 'Save changes' : 'Add resource'}
          </Button>
        </div>
      </div>
    </form>
  );
}

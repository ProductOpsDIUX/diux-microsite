'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, Field, Input, Textarea, Button, Toast } from '@/components/admin/ui';
import { HiringRoleSchema, type HiringRoleFormValues } from '@/lib/schemas/hiring';
import { saveHiringRoleAction, deleteHiringRoleAction } from './actions';
import type { HiringRole } from '@/lib/supabase/types';

export function HiringRoleEditor({ initial }: { initial: HiringRole | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm<HiringRoleFormValues>({
    resolver: zodResolver(HiringRoleSchema),
    defaultValues: {
      title: initial?.title ?? '',
      department: initial?.department ?? '',
      location: initial?.location ?? 'Singapore',
      experience: initial?.experience ?? '',
      url: initial?.url ?? '',
      summary: initial?.summary ?? '',
      position: initial?.position ?? 0,
      is_open: initial?.is_open ?? true,
    },
  });

  const onSubmit: SubmitHandler<HiringRoleFormValues> = (values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveHiringRoleAction({ ...values, id: initial?.id });
      if (!result.ok) {
        setFeedback({ kind: 'error', message: result.error });
        if (result.fieldErrors) {
          for (const [path, message] of Object.entries(result.fieldErrors)) {
            setError(path as never, { type: 'server', message });
          }
        }
        return;
      }
      setFeedback({ kind: 'success', message: initial ? 'Saved.' : 'Role added.' });
      reset(values, { keepValues: true });
      if (!initial) router.replace(`/admin/hiring/${result.data.id}`);
    });
  };

  const onDelete = () => {
    if (!initial) return;
    if (!confirm(`Delete “${initial.title}”?`)) return;
    startDelete(async () => {
      try {
        await deleteHiringRoleAction(initial.id);
      } catch (e) {
        setFeedback({ kind: 'error', message: e instanceof Error ? e.message : 'Delete failed' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {feedback && <Toast kind={feedback.kind}>{feedback.message}</Toast>}

      <Card title="Role">
        <Field label="Title" required error={errors.title?.message}>
          <Input {...register('title')} placeholder="Senior UX Designer" />
        </Field>
        <Field label="Department" error={errors.department?.message}>
          <Input {...register('department')} placeholder="Design Innovation & UX" />
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Input {...register('location')} placeholder="Singapore" />
        </Field>
        <Field
          label="Experience"
          hint="Free-text, e.g. “3–5 years”, “5+ years”, “Entry level”."
          error={errors.experience?.message}
        >
          <Input {...register('experience')} placeholder="3–5 years" />
        </Field>
        <Field label="Summary" hint="Short description shown on the contact page." error={errors.summary?.message}>
          <Textarea {...register('summary')} rows={3} placeholder="What the role is about." />
        </Field>
      </Card>

      <Card title="Application link" description="Where the 'Apply' button on the public site sends candidates.">
        <Field label="URL" required error={errors.url?.message}>
          <Input
            type="url"
            {...register('url')}
            placeholder="https://careersearch.dsta.gov.sg/jobs/..."
          />
        </Field>
      </Card>

      <Card title="Display">
        <Field label="Position" hint="Lower numbers appear first" error={errors.position?.message}>
          <Input type="number" min={0} {...register('position', { valueAsNumber: true })} />
        </Field>
        <Field label="Status">
          <Controller
            control={control}
            name="is_open"
            render={({ field }) => (
              <div className="flex gap-2">
                {[
                  { v: true, l: 'Open' },
                  { v: false, l: 'Closed (hidden)' },
                ].map((opt) => (
                  <button
                    key={String(opt.v)}
                    type="button"
                    onClick={() => field.onChange(opt.v)}
                    className={`px-3 py-1.5 rounded-md border text-[13px] transition-colors ${
                      field.value === opt.v
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-line bg-bg1 text-fg1 hover:bg-bg2'
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            )}
          />
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
          <Button type="button" variant="ghost" onClick={() => reset()} disabled={!isDirty || pending}>
            Discard
          </Button>
          <Button type="submit" variant="primary" loading={pending} disabled={!isDirty && !!initial}>
            {pending ? 'Saving…' : initial ? 'Save changes' : 'Add role'}
          </Button>
        </div>
      </div>
    </form>
  );
}

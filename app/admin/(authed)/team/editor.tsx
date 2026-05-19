'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, Field, Input, Textarea, Button, Toast } from '@/components/admin/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { TeamMemberSchema, type TeamMemberFormValues } from '@/lib/schemas/team';
import { saveTeamMemberAction, deleteTeamMemberAction } from './actions';
import type { TeamMember } from '@/lib/supabase/types';

export function TeamMemberEditor({ initial }: { initial: TeamMember | null }) {
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
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(TeamMemberSchema),
    defaultValues: {
      name: initial?.name ?? '',
      role: initial?.role ?? '',
      bio: initial?.bio ?? '',
      photo: initial?.photo ?? null,
      linkedin_url: initial?.linkedin_url ?? null,
      is_leadership: initial?.is_leadership ?? false,
      position: initial?.position ?? 0,
    },
  });

  const onSubmit: SubmitHandler<TeamMemberFormValues> = (values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveTeamMemberAction({ ...values, id: initial?.id });
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
        message: initial ? 'Saved.' : 'Member added.',
      });
      reset(values, { keepValues: true });
      if (!initial) router.replace(`/admin/team/${result.data.id}`);
    });
  };

  const onDelete = () => {
    if (!initial) return;
    if (!confirm(`Remove ${initial.name}?`)) return;
    startDelete(async () => {
      try {
        await deleteTeamMemberAction(initial.id);
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

      <Card title="Member">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" required error={errors.name?.message}>
            <Input {...register('name')} placeholder="Maya Okafor" />
          </Field>
          <Field label="Role" error={errors.role?.message}>
            <Input {...register('role')} placeholder="Head of Design Innovation" />
          </Field>
        </div>
        <Field label="Bio" error={errors.bio?.message}>
          <Textarea {...register('bio')} rows={4} placeholder="One paragraph about this person." />
        </Field>
        <Controller
          control={control}
          name="photo"
          render={({ field }) => (
            <ImageUploader
              label="Portrait"
              prefix="team"
              value={field.value}
              onChange={field.onChange}
              hint="Square works best."
            />
          )}
        />
        <Field
          label="LinkedIn URL"
          hint="Full link, e.g. https://www.linkedin.com/in/their-handle"
          error={errors.linkedin_url?.message}
        >
          <Controller
            control={control}
            name="linkedin_url"
            render={({ field }) => (
              <Input
                type="url"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                placeholder="https://www.linkedin.com/in/…"
              />
            )}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Section">
            <Controller
              control={control}
              name="is_leadership"
              render={({ field }) => (
                <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  <span className="text-[13px] text-fg0">Show under Leadership</span>
                </label>
              )}
            />
          </Field>
          <Field
            label="Position"
            hint="Lower numbers appear first within each section"
            error={errors.position?.message}
          >
            <Input
              type="number"
              min={0}
              {...register('position', { valueAsNumber: true })}
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
            {pending ? 'Saving…' : initial ? 'Save changes' : 'Add member'}
          </Button>
        </div>
      </div>
    </form>
  );
}

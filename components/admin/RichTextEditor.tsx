'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { useEffect, useCallback, useRef, useState } from 'react';
import { uploadAction } from '@/app/admin/actions';

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml';

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write the article…',
  uploadPrefix = 'rich-text',
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  // Where uploaded inline images get stored in Supabase Storage.
  uploadPrefix?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder }),
      Image.configure({
        HTMLAttributes: { class: 'rich-img' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          // Use min-content for table width so wide tables can grow beyond
          // the editor's width — the scroll container below handles overflow.
          'prose prose-invert max-w-none px-4 py-3 focus:outline-none ' +
          '[&_a]:text-accent [&_a]:underline ' +
          '[&_h2]:font-display [&_h2]:text-[22px] [&_h2]:mt-6 [&_h2]:mb-2 ' +
          '[&_h3]:font-display [&_h3]:text-[18px] [&_h3]:mt-5 [&_h3]:mb-1.5 ' +
          '[&_p]:leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 ' +
          '[&_code]:bg-bg2 [&_code]:px-1 [&_code]:rounded [&_blockquote]:border-l-2 ' +
          '[&_blockquote]:border-line [&_blockquote]:pl-3 [&_blockquote]:text-fg1 ' +
          '[&_img]:rounded [&_img]:my-3 [&_img]:max-w-full ' +
          // Tables — brighter borders than the public site's --line so the
          // grid is visible while editing. Width:max-content lets wide tables
          // overflow horizontally; the wrapper below scrolls them.
          '[&_table]:my-4 [&_table]:text-[14px] [&_table]:border-collapse [&_table]:w-max [&_table]:max-w-none ' +
          '[&_th]:border [&_th]:border-white/30 [&_th]:bg-white/[0.06] [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:text-fg0 [&_th]:whitespace-nowrap ' +
          '[&_td]:border [&_td]:border-white/20 [&_td]:px-2 [&_td]:py-1.5 ',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const promptLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL (leave blank to remove):', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const onPickImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChosen = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || !editor) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('prefix', uploadPrefix);
        const result = await uploadAction(fd);
        if (!result.ok) {
          alert(`Image upload failed: ${result.error}`);
          return;
        }
        editor.chain().focus().setImage({ src: result.url }).run();
      } finally {
        setUploading(false);
      }
    },
    [editor, uploadPrefix]
  );

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) {
    return <div className="rounded-md border border-line bg-bg1 min-h-[60vh] animate-pulse" />;
  }

  const inTable = editor.isActive('table');

  return (
    <div className="rounded-md border border-line bg-bg1 overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-line px-2 py-1.5 bg-bg2/40">
        <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><span className="italic">I</span></ToolbarBtn>
        <ToolbarBtn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><span className="line-through">S</span></ToolbarBtn>
        <Divider />
        <ToolbarBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarBtn>
        <Divider />
        <ToolbarBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>“ Quote</ToolbarBtn>
        <ToolbarBtn active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>{`<>`}</ToolbarBtn>
        <Divider />
        <ToolbarBtn active={editor.isActive('link')} onClick={promptLink}>Link</ToolbarBtn>
        <ToolbarBtn onClick={onPickImage} disabled={uploading}>
          {uploading ? '…' : '🖼 Image'}
        </ToolbarBtn>
        <ToolbarBtn onClick={insertTable}>⊞ Table</ToolbarBtn>
        {/* Table-specific controls; only enabled when caret is inside one. */}
        {inTable && (
          <>
            <Divider />
            <ToolbarBtn onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().deleteColumn().run()}>− Col</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().deleteRow().run()}>− Row</ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().deleteTable().run()}>Delete</ToolbarBtn>
          </>
        )}
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()}>↶</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()}>↷</ToolbarBtn>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        onChange={onFileChosen}
      />
      {/* Scroll wrapper — vertical when content is long, horizontal when a
          table or image stretches past the editor width. The min-height keeps
          empty editors comfortably tall; the max-height caps growth so the
          sticky save bar stays in view. */}
      <div className="min-h-[60vh] max-h-[70vh] overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarBtn({
  active,
  onClick,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-1 rounded text-[12px] font-medium transition-colors disabled:opacity-50 ${
        active ? 'bg-accent text-bg0' : 'text-fg1 hover:bg-bg2'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="self-stretch w-px bg-line mx-1" />;
}

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback } from 'react';

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write the article…',
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Drop the heading levels we don't need to keep the toolbar focused.
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none px-4 py-3 min-h-[280px] focus:outline-none ' +
          '[&_a]:text-accent [&_a]:underline ' +
          '[&_h2]:font-display [&_h2]:text-[22px] [&_h2]:mt-6 [&_h2]:mb-2 ' +
          '[&_h3]:font-display [&_h3]:text-[18px] [&_h3]:mt-5 [&_h3]:mb-1.5 ' +
          '[&_p]:leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 ' +
          '[&_code]:bg-bg2 [&_code]:px-1 [&_code]:rounded [&_blockquote]:border-l-2 ' +
          '[&_blockquote]:border-line [&_blockquote]:pl-3 [&_blockquote]:text-fg1',
      },
    },
    // Tiptap warns about hydration mismatches in Next; this flag suppresses it.
    immediatelyRender: false,
  });

  // Keep the editor in sync when the parent resets the value (e.g. on Discard).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false /* emitUpdate */);
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

  if (!editor) {
    return (
      <div className="rounded-md border border-line bg-bg1 min-h-[280px] animate-pulse" />
    );
  }

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
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()}>↶</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()}>↷</ToolbarBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarBtn({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded text-[12px] font-medium transition-colors ${
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

"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

type RichTextEditorProps = {
    value: string; // HTML
    onChange: (html: string) => void;
    placeholder?: string;
    /** Smaller toolbar/padding for inline contexts like comments. Also moves the toolbar below the content instead of above it. Defaults to false (full size, toolbar on top, for post/project bodies). */
    compact?: boolean;
};

const EMOJI = [
    "😀", "😂", "😅", "😍", "🤔", "😎", "😢", "😡", "👍", "👎",
    "🙌", "👏", "🙏", "🔥", "✨", "🎉", "🚀", "💡", "🐛", "✅",
    "❌", "❤️", "💯", "👀", "🤖", "😴", "🤯", "👋", "🙈", "☕",
];

type ToolbarButtonProps = {
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    compact: boolean;
    children: React.ReactNode;
};

const ToolbarButton = ({ label, active = false, disabled = false, onClick, compact, children }: ToolbarButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={active}
        className={`flex items-center justify-center rounded-[6px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${compact ? "h-6 w-6 text-xs" : "h-7 w-7 text-sm"} ${
            active ? "bg-dark-200 text-primary" : "text-light-200 hover:bg-dark-200 hover:text-light-100"
        }`}
    >
        {children}
    </button>
);

/** Shared TipTap rich text editor, used for post/project bodies and (compact) comments/replies. */
const RichTextEditor = ({ value, onChange, placeholder = "Write something...", compact = false }: RichTextEditorProps) => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const editor = useEditor({
        extensions: [StarterKit, Underline, Image, Placeholder.configure({ placeholder })],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: compact
                    ? "bg-dark-100 placeholder:text-light-200 min-h-24 w-full px-3 py-2 text-sm leading-relaxed outline-none"
                    : "bg-dark-100 placeholder:text-light-200 min-h-56 w-full px-4 py-3 text-sm leading-relaxed outline-none",
            },
        },
    });

    // Keep the editor in sync when `value` changes externally (e.g. a form reset)
    // instead of just on the initial mount.
    useEffect(() => {
        if (!editor) return;
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false });
        }
    }, [value, editor]);

    // Unlike the post/project cover image (uploaded inline inside POST
    // /api/posts and /api/projects once the record is being created), an
    // image inserted here becomes part of the body's HTML immediately —
    // before any post/project/comment exists yet to attach an upload to.
    // So this goes through its own small /api/upload endpoint instead.
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file || !editor) return;

        setImageUploadError(null);
        setIsUploadingImage(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/upload", { method: "POST", body: formData });
            const result: unknown = await response.json();

            if (!response.ok || typeof result !== "object" || result === null || typeof (result as { url?: unknown }).url !== "string") {
                const message =
                    typeof result === "object" && result !== null && "message" in result && typeof result.message === "string"
                        ? result.message
                        : "Failed to upload the image.";
                setImageUploadError(message);
                return;
            }

            editor.chain().focus().setImage({ src: (result as { url: string }).url }).run();
        } catch {
            setImageUploadError("Failed to upload the image.");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const insertEmoji = (emoji: string) => {
        editor?.chain().focus().insertContent(emoji).run();
        setShowEmojiPicker(false);
    };

    if (!editor) return null;

    // Comments/replies (compact) put the toolbar below the content instead of above it.
    const toolbar = (
        <div
            className={`border-dark-200 bg-dark-200/40 relative flex flex-row flex-wrap items-center gap-1 ${
                compact ? "border-t px-1.5 py-1" : "border-b px-2 py-1.5"
            }`}
        >
            <ToolbarButton
                label="Bold"
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
                compact={compact}
            >
                <span className="font-bold">B</span>
            </ToolbarButton>
            <ToolbarButton
                label="Italic"
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                compact={compact}
            >
                <span className="italic">I</span>
            </ToolbarButton>
            <ToolbarButton
                label="Underline"
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                compact={compact}
            >
                <span className="underline">U</span>
            </ToolbarButton>
            <ToolbarButton
                label="Strikethrough"
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                compact={compact}
            >
                <span className="line-through">S</span>
            </ToolbarButton>
            <ToolbarButton
                label="Inline code"
                active={editor.isActive("code")}
                onClick={() => editor.chain().focus().toggleCode().run()}
                compact={compact}
            >
                <span className="font-mono">{"</>"}</span>
            </ToolbarButton>
            <ToolbarButton
                label="Code block"
                active={editor.isActive("codeBlock")}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                compact={compact}
            >
                <span className="font-mono">{"{ }"}</span>
            </ToolbarButton>
            <ToolbarButton
                label="Blockquote"
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                compact={compact}
            >
                <span className="text-base leading-none">&rdquo;</span>
            </ToolbarButton>
            <ToolbarButton
                label="Bullet list"
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                compact={compact}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                    <path strokeLinecap="round" d="M9 6h11M9 12h11M9 18h11" />
                    <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
                    <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
                    <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
                </svg>
            </ToolbarButton>
            <ToolbarButton
                label="Ordered list"
                active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                compact={compact}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                    <path strokeLinecap="round" d="M9 6h11M9 12h11M9 18h11" />
                    <text x="2" y="8" fontSize="7" fill="currentColor" stroke="none">
                        1
                    </text>
                    <text x="2" y="14" fontSize="7" fill="currentColor" stroke="none">
                        2
                    </text>
                    <text x="2" y="20" fontSize="7" fill="currentColor" stroke="none">
                        3
                    </text>
                </svg>
            </ToolbarButton>

            <span className="bg-dark-200 mx-1 h-4 w-px" aria-hidden="true" />

            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
            />
            <ToolbarButton
                label={isUploadingImage ? "Uploading image…" : "Insert image"}
                disabled={isUploadingImage}
                onClick={() => imageInputRef.current?.click()}
                compact={compact}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5-9 9" />
                </svg>
            </ToolbarButton>

            <ToolbarButton
                label="Insert emoji"
                active={showEmojiPicker}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                compact={compact}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M8 10h.01M16 10h.01" />
                    <path strokeLinecap="round" d="M8 14.5c1.2 1.3 6.8 1.3 8 0" />
                </svg>
            </ToolbarButton>

            {imageUploadError && (
                <span role="alert" className="text-primary text-xs">
                    {imageUploadError}
                </span>
            )}

            {showEmojiPicker && (
                <div
                    className={`border-dark-200 bg-dark-100 absolute left-0 z-20 grid grid-cols-6 gap-1 rounded-[6px] border p-2 shadow-lg ${
                        compact ? "bottom-full mb-1" : "top-full mt-1"
                    }`}
                >
                    {EMOJI.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => insertEmoji(emoji)}
                            className="hover:bg-dark-200 flex h-8 w-8 items-center justify-center rounded-[6px] text-lg transition-colors"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div
            className={`rich-text-editor border-dark-200 flex w-full flex-col overflow-hidden rounded-[6px] border ${
                compact ? "max-w-xl" : ""
            }`}
        >
            {!compact && toolbar}
            <EditorContent editor={editor} />
            {compact && toolbar}
        </div>
    );
};

export default RichTextEditor;

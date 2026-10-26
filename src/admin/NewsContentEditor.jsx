import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";

function ToolbarButton({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      className={`admin-editor-btn${active ? " is-active" : ""}`}
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function NewsContentEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
        },
      }),
      Placeholder.configure({
        placeholder: "Nhập nội dung tin tức…",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "admin-tiptap-content",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = value || "";
    if (next !== editor.getHTML()) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href || "https://";
    const url = window.prompt("Nhập liên kết", previous);
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div className="admin-tiptap">
      <div className="admin-tiptap-toolbar" role="toolbar" aria-label="Định dạng nội dung">
        <ToolbarButton
          title="Đậm"
          active={editor?.isActive("bold")}
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="Nghiêng"
          active={editor?.isActive("italic")}
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          title="Gạch chân"
          active={editor?.isActive("underline")}
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </ToolbarButton>
        <span className="admin-tiptap-sep" />
        <ToolbarButton
          title="Tiêu đề mục"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Tiêu đề nhỏ"
          active={editor?.isActive("heading", { level: 3 })}
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <span className="admin-tiptap-sep" />
        <ToolbarButton
          title="Danh sách"
          active={editor?.isActive("bulletList")}
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          title="Danh sách số"
          active={editor?.isActive("orderedList")}
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          title="Trích dẫn"
          active={editor?.isActive("blockquote")}
          disabled={!editor}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “”
        </ToolbarButton>
        <ToolbarButton
          title="Liên kết"
          active={editor?.isActive("link")}
          disabled={!editor}
          onClick={setLink}
        >
          Link
        </ToolbarButton>
        <span className="admin-tiptap-sep" />
        <ToolbarButton
          title="Hoàn tác"
          disabled={!editor?.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          title="Làm lại"
          disabled={!editor?.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

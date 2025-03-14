import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Check,
  Youtube as YoutubeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = 'Escreva seu conteúdo aqui...' }: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [youtubePopoverOpen, setYoutubePopoverOpen] = useState(false);
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  // Configurar o editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        progressBarColor: 'red',
        modestBranding: true,
        HTMLAttributes: {
          class: 'w-full aspect-video my-4 rounded-md overflow-hidden',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Atualizar o conteúdo quando o conteúdo for alterado externamente
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Funções do editor
  const addLink = () => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setLinkPopoverOpen(false);
    }
  };

  const addImage = () => {
    if (imageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl })
        .run();
      setImageUrl('');
      setImagePopoverOpen(false);
    }
  };
  
  const addYoutubeVideo = () => {
    if (youtubeUrl && editor) {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({ src: youtubeUrl })
        .run();
      setYoutubeUrl('');
      setYoutubePopoverOpen(false);
    }
  };

  // Funções para edição de HTML
  const openHtmlDialog = () => {
    if (editor) {
      setHtmlContent(editor.getHTML());
      setHtmlDialogOpen(true);
    }
  };

  const applyHtmlChanges = () => {
    if (editor) {
      editor.commands.setContent(htmlContent);
      onChange(htmlContent);
      setHtmlDialogOpen(false);
    }
  };

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="border border-b-0 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          type="button"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
          type="button"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        {/* Alinhamento */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
          type="button"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
          type="button"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
          type="button"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        {/* Link Popover */}
        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={editor.isActive('link') ? 'bg-gray-200' : ''}
              type="button"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <label className="text-sm">URL do Link</label>
              <div className="flex gap-2">
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://exemplo.com"
                  className="flex-1"
                />
                <Button onClick={addLink} type="button">Inserir</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Imagem Popover */}
        <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <label className="text-sm">URL da Imagem</label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="flex-1"
                />
                <Button onClick={addImage} type="button">Inserir</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* YouTube Popover */}
        <Popover open={youtubePopoverOpen} onOpenChange={setYoutubePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
            >
              <YoutubeIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <label className="text-sm">URL do YouTube</label>
              <div className="flex gap-2">
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="flex-1"
                />
                <Button onClick={addYoutubeVideo} type="button">Inserir</Button>
              </div>
              <p className="text-xs text-gray-500">
                Cole a URL completa do vídeo do YouTube (ex: https://www.youtube.com/watch?v=XXXX)
              </p>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>

        {/* Botão para editar HTML */}
        <Button
          variant="ghost"
          size="icon"
          onClick={openHtmlDialog}
          title="Editar como HTML"
          type="button"
          className="ml-auto"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="tiptap-editor w-full">
      <MenuBar />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none border rounded-b-md p-4 min-h-[300px] focus:outline-none"
      />

      {/* Diálogo para editar HTML */}
      <Dialog open={htmlDialogOpen} onOpenChange={setHtmlDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar HTML</DialogTitle>
            <DialogDescription>
              Edite o conteúdo diretamente no formato HTML. Tenha cuidado, alterações incorretas podem quebrar o layout.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <Textarea 
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              spellCheck={false}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setHtmlDialogOpen(false)}>Cancelar</Button>
            <Button onClick={applyHtmlChanges} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Aplicar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
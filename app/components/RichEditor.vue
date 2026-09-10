<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  minHeight?: string
}>(), {
  placeholder: 'Start writing your post...',
  minHeight: '18rem',
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const editor = shallowRef<Editor | null>(null)
const tick = ref(0)

function bump() {
  tick.value++
}

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue || '',
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'editor-link' } }),
      Image,
      Placeholder.configure({ placeholder: props.placeholder }),
    ],
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML())
    },
    onTransaction: bump,
    onSelectionUpdate: bump,
  })
})

watch(() => props.modelValue, (value) => {
  if (!editor.value) return
  if (editor.value.getHTML() === value) return
  editor.value.commands.setContent(value || '', false)
  bump()
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  editor.value = null
})

const state = computed(() => {
  void tick.value
  const e = editor.value
  return {
    bold: e?.isActive('bold') ?? false,
    italic: e?.isActive('italic') ?? false,
    strike: e?.isActive('strike') ?? false,
    code: e?.isActive('code') ?? false,
    h2: e?.isActive('heading', { level: 2 }) ?? false,
    h3: e?.isActive('heading', { level: 3 }) ?? false,
    h4: e?.isActive('heading', { level: 4 }) ?? false,
    bullet: e?.isActive('bulletList') ?? false,
    ordered: e?.isActive('orderedList') ?? false,
    quote: e?.isActive('blockquote') ?? false,
    codeBlock: e?.isActive('codeBlock') ?? false,
    link: e?.isActive('link') ?? false,
    canUndo: e?.can().undo() ?? false,
    canRedo: e?.can().redo() ?? false,
  }
})

function run(fn: () => void) {
  fn()
  bump()
}

function toggle(fn: (chain: ReturnType<NonNullable<typeof editor.value>['chain']>) => void) {
  const chain = editor.value?.chain().focus()
  if (chain) {
    fn(chain as any)
    chain.run()
  }
  bump()
}

function setLink() {
  const previous = editor.value?.getAttributes('link').href as string | undefined
  const url = window.prompt('Enter URL', previous || 'https://')
  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  }
  else {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
  bump()
}

function setImage() {
  const url = window.prompt('Image URL', 'https://')
  if (!url) return
  editor.value?.chain().focus().setImage({ src: url }).run()
  bump()
}

const groups = [
  [
    { label: 'Bold', icon: 'lucide:bold', onClick: () => toggle(c => c.toggleBold()), active: () => state.value.bold },
    { label: 'Italic', icon: 'lucide:italic', onClick: () => toggle(c => c.toggleItalic()), active: () => state.value.italic },
    { label: 'Strikethrough', icon: 'lucide:strikethrough', onClick: () => toggle(c => c.toggleStrike()), active: () => state.value.strike },
    { label: 'Inline code', icon: 'lucide:code-2', onClick: () => toggle(c => c.toggleCode()), active: () => state.value.code },
  ],
  [
    { label: 'Heading 2', icon: 'lucide:heading-2', onClick: () => toggle(c => c.toggleHeading({ level: 2 })), active: () => state.value.h2 },
    { label: 'Heading 3', icon: 'lucide:heading-3', onClick: () => toggle(c => c.toggleHeading({ level: 3 })), active: () => state.value.h3 },
    { label: 'Heading 4', icon: 'lucide:heading-4', onClick: () => toggle(c => c.toggleHeading({ level: 4 })), active: () => state.value.h4 },
  ],
  [
    { label: 'Bullet list', icon: 'lucide:list', onClick: () => toggle(c => c.toggleBulletList()), active: () => state.value.bullet },
    { label: 'Ordered list', icon: 'lucide:list-ordered', onClick: () => toggle(c => c.toggleOrderedList()), active: () => state.value.ordered },
    { label: 'Quote', icon: 'lucide:quote', onClick: () => toggle(c => c.toggleBlockquote()), active: () => state.value.quote },
    { label: 'Code block', icon: 'lucide:square-code', onClick: () => toggle(c => c.toggleCodeBlock()), active: () => state.value.codeBlock },
  ],
  [
    { label: 'Link', icon: 'lucide:link', onClick: setLink, active: () => state.value.link },
    { label: 'Image', icon: 'lucide:image', onClick: setImage, active: () => false },
  ],
  [
    { label: 'Undo', icon: 'lucide:undo-2', onClick: () => run(() => editor.value?.chain().focus().undo().run()), active: () => false, disabled: () => !state.value.canUndo },
    { label: 'Redo', icon: 'lucide:redo-2', onClick: () => run(() => editor.value?.chain().focus().redo().run()), active: () => false, disabled: () => !state.value.canRedo },
  ],
] as const
</script>

<template>
  <div class="overflow-hidden rounded-md border border-border bg-background">
    <div
      v-if="editor"
      class="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 p-1.5"
    >
      <template v-for="(group, gi) in groups" :key="gi">
        <div v-if="gi > 0" class="mx-1 h-5 w-px bg-border" />
        <button
          v-for="(btn, bi) in group"
          :key="bi"
          type="button"
          :title="btn.label"
          :disabled="btn.disabled ? btn.disabled() : false"
          class="inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          :class="{ 'bg-accent text-foreground': btn.active() }"
          @click="btn.onClick"
        >
          <Icon :name="btn.icon" class="h-4 w-4" />
        </button>
      </template>
    </div>

    <EditorContent
      :editor="editor"
      class="rich-editor"
      :style="{ minHeight }"
    />
  </div>
</template>

<style scoped>
:deep(.rich-editor .tiptap) {
  padding: 0.75rem 1rem;
  outline: none;
  min-height: inherit;
}

:deep(.rich-editor .tiptap p) {
  margin: 0 0 0.75rem;
  line-height: 1.7;
}

:deep(.rich-editor .tiptap h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.5rem 0 0.5rem;
  line-height: 1.3;
}

:deep(.rich-editor .tiptap h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.25rem 0 0.5rem;
  line-height: 1.3;
}

:deep(.rich-editor .tiptap h4) {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  line-height: 1.3;
}

:deep(.rich-editor .tiptap ul),
:deep(.rich-editor .tiptap ol) {
  margin: 0 0 0.75rem 1.5rem;
}

:deep(.rich-editor .tiptap ul) {
  list-style: disc;
}

:deep(.rich-editor .tiptap ol) {
  list-style: decimal;
}

:deep(.rich-editor .tiptap li) {
  margin-bottom: 0.25rem;
  line-height: 1.7;
}

:deep(.rich-editor .tiptap blockquote) {
  border-left: 3px solid var(--color-border);
  padding-left: 1rem;
  color: var(--color-muted-foreground);
  margin: 0 0 0.75rem;
  font-style: italic;
}

:deep(.rich-editor .tiptap pre) {
  background: var(--color-muted);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0 0 0.75rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.875rem;
}

:deep(.rich-editor .tiptap code) {
  background: var(--color-muted);
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, monospace;
}

:deep(.rich-editor .tiptap pre code) {
  background: transparent;
  padding: 0;
}

:deep(.rich-editor .tiptap img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
}

:deep(.rich-editor .tiptap a) {
  color: var(--color-foreground);
  text-decoration: underline;
  text-underline-offset: 3px;
}

:deep(.rich-editor .tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: var(--color-muted-foreground);
  pointer-events: none;
  float: left;
  height: 0;
}
</style>

import { useState } from 'react';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

function insertMarkdown(textarea: HTMLTextAreaElement, before: string, after: string = '') {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = `${before}${selected || 'text'}${after}`;
    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    return {
        value: newValue,
        selectionStart: start + before.length,
        selectionEnd: start + before.length + (selected || 'text').length,
    };
}

export default function MarkdownEditor({ value, onChange, label, placeholder }: MarkdownEditorProps) {
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [MarkdownRenderer, setMarkdownRenderer] = useState<React.ComponentType<{ content: string }> | null>(null);

    // Lazy load MarkdownRenderer only when preview is requested
    const loadRenderer = async () => {
        if (!MarkdownRenderer) {
            const mod = await import('@/components/MarkdownRenderer');
            setMarkdownRenderer(() => mod.default);
        }
    };

    const handleToolbar = (action: string) => {
        const textarea = document.getElementById('md-editor-textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        let result;
        switch (action) {
            case 'bold':
                result = insertMarkdown(textarea, '**', '**');
                break;
            case 'italic':
                result = insertMarkdown(textarea, '_', '_');
                break;
            case 'heading':
                result = insertMarkdown(textarea, '## ', '');
                break;
            case 'link':
                result = insertMarkdown(textarea, '[', '](url)');
                break;
            case 'image':
                result = insertMarkdown(textarea, '![alt](', ')');
                break;
            case 'code':
                result = insertMarkdown(textarea, '```\n', '\n```');
                break;
            default:
                return;
        }

        onChange(result.value);
        // Restore cursor position after React re-render
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
        }, 0);
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            {/* Toolbar */}
            <div className="flex items-center gap-1 border border-gray-300 rounded-t-lg p-2 bg-gray-50">
                <button type="button" onClick={() => handleToolbar('bold')} className="px-2 py-1 text-sm font-bold hover:bg-gray-200 rounded" title="Bold">B</button>
                <button type="button" onClick={() => handleToolbar('italic')} className="px-2 py-1 text-sm italic hover:bg-gray-200 rounded" title="Italic">I</button>
                <button type="button" onClick={() => handleToolbar('heading')} className="px-2 py-1 text-sm font-bold hover:bg-gray-200 rounded" title="Heading">H</button>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <button type="button" onClick={() => handleToolbar('link')} className="px-2 py-1 text-sm hover:bg-gray-200 rounded" title="Link">Link</button>
                <button type="button" onClick={() => handleToolbar('image')} className="px-2 py-1 text-sm hover:bg-gray-200 rounded" title="Image">Img</button>
                <button type="button" onClick={() => handleToolbar('code')} className="px-2 py-1 text-sm font-mono hover:bg-gray-200 rounded" title="Code Block">&lt;/&gt;</button>
                <div className="flex-1" />
                <div className="flex bg-gray-200 rounded-lg p-0.5">
                    <button
                        type="button"
                        onClick={() => setMode('edit')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'edit' ? 'bg-white shadow-sm font-medium' : 'hover:bg-gray-100'}`}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('preview'); loadRenderer(); }}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'preview' ? 'bg-white shadow-sm font-medium' : 'hover:bg-gray-100'}`}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {/* Editor / Preview */}
            {mode === 'edit' ? (
                <textarea
                    id="md-editor-textarea"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || 'Write markdown content...'}
                    className="w-full h-64 px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y"
                />
            ) : (
                <div className="w-full min-h-[16rem] px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg bg-white overflow-auto prose prose-sm max-w-none">
                    {MarkdownRenderer ? (
                        <MarkdownRenderer content={value || '*Nothing to preview*'} />
                    ) : (
                        <p className="text-gray-400">Loading preview...</p>
                    )}
                </div>
            )}
        </div>
    );
}

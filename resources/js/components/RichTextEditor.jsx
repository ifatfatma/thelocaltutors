import React, { useRef, useEffect, useState } from 'react';

export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Write detailed course description, curriculum, topics covered, batch timings, prerequisites...',
    minHeight = '200px',
}) {
    const editorRef = useRef(null);
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [sourceHtml, setSourceHtml] = useState(value || '');

    // Synchronize initial or external value changes when not editing
    useEffect(() => {
        if (editorRef.current && !isSourceMode) {
            if (editorRef.current.innerHTML !== (value || '')) {
                editorRef.current.innerHTML = value || '';
            }
        }
        setSourceHtml(value || '');
    }, [value, isSourceMode]);

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            setSourceHtml(html);
            if (onChange) {
                onChange(html);
            }
        }
    };

    const handleSourceChange = (e) => {
        const val = e.target.value;
        setSourceHtml(val);
        if (onChange) {
            onChange(val);
        }
    };

    const execCmd = (cmd, val = null) => {
        if (isSourceMode) return;
        document.execCommand(cmd, false, val);
        handleInput();
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleInsertLink = () => {
        if (isSourceMode) return;
        const url = prompt('Enter URL (e.g. https://...):');
        if (url) {
            execCmd('createLink', url);
        }
    };

    return (
        <div className="rich-text-editor border rounded-3 overflow-hidden bg-white shadow-2xs">
            {/* Toolbar */}
            <div className="d-flex flex-wrap align-items-center gap-1 p-2 bg-light border-bottom">
                {/* Headings Dropdown */}
                <select
                    className="form-select form-select-sm d-inline-block w-auto py-1 px-2 border-0 bg-white shadow-2xs"
                    disabled={isSourceMode}
                    onChange={(e) => {
                        const tag = e.target.value;
                        if (tag === 'p') {
                            execCmd('formatBlock', '<p>');
                        } else if (tag) {
                            execCmd('formatBlock', `<${tag}>`);
                        }
                        e.target.value = '';
                    }}
                    defaultValue=""
                    title="Text Style"
                >
                    <option value="" disabled>Style</option>
                    <option value="p">Paragraph</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                </select>

                <div className="vr my-1 mx-1 text-muted"></div>

                {/* Text Formatting */}
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={() => execCmd('bold')}
                    title="Bold (Ctrl+B)"
                >
                    <i className="bi bi-type-bold fw-bold"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={() => execCmd('italic')}
                    title="Italic (Ctrl+I)"
                >
                    <i className="bi bi-type-italic"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={() => execCmd('underline')}
                    title="Underline (Ctrl+U)"
                >
                    <i className="bi bi-type-underline"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={() => execCmd('strikeThrough')}
                    title="Strikethrough"
                >
                    <i className="bi bi-type-strikethrough"></i>
                </button>

                <div className="vr my-1 mx-1 text-muted"></div>

                {/* Lists */}
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={() => execCmd('insertUnorderedList')}
                    title="Bullet List"
                >
                    <i className="bi bi-list-ul"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={() => execCmd('insertOrderedList')}
                    title="Numbered List"
                >
                    <i className="bi bi-list-ol"></i>
                </button>

                <div className="vr my-1 mx-1 text-muted"></div>

                {/* Quote, Link, Clear */}
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={() => execCmd('formatBlock', '<blockquote>')}
                    title="Quote"
                >
                    <i className="bi bi-quote"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={handleInsertLink}
                    title="Insert Link"
                >
                    <i className="bi bi-link-45deg"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-1 px-2 border-0"
                    disabled={isSourceMode}
                    onClick={() => execCmd('removeFormat')}
                    title="Clear Formatting"
                >
                    <i className="bi bi-eraser"></i>
                </button>

                {/* Right: HTML Source Toggle */}
                <div className="ms-auto">
                    <button
                        type="button"
                        className={`btn btn-sm py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1 ${
                            isSourceMode ? 'btn-dark text-white' : 'btn-outline-secondary'
                        }`}
                        onClick={() => {
                            if (isSourceMode) {
                                // Switching back to visual mode
                                if (editorRef.current) {
                                    editorRef.current.innerHTML = sourceHtml;
                                }
                            }
                            setIsSourceMode(!isSourceMode);
                        }}
                        title={isSourceMode ? 'Switch to Visual Editor' : 'Edit Raw HTML Code'}
                    >
                        <i className="bi bi-code-slash"></i>
                        <span>{isSourceMode ? 'Visual' : 'HTML'}</span>
                    </button>
                </div>
            </div>

            {/* Editable Canvas or Raw HTML Mode */}
            {isSourceMode ? (
                <textarea
                    className="form-control font-monospace border-0 p-3"
                    style={{ minHeight, resize: 'vertical', fontSize: '0.88rem', background: '#f8fafc' }}
                    value={sourceHtml}
                    onChange={handleSourceChange}
                    placeholder="Enter or paste raw HTML code here..."
                ></textarea>
            ) : (
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onBlur={handleInput}
                    className="p-3 outline-none"
                    style={{
                        minHeight,
                        outline: 'none',
                        fontSize: '0.94rem',
                        lineHeight: '1.6',
                    }}
                    data-placeholder={placeholder}
                />
            )}

            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                    pointer-events: none;
                }
                .rich-text-editor blockquote {
                    border-left: 3px solid #0284c7;
                    padding-left: 1rem;
                    color: #475569;
                    font-style: italic;
                    margin: 0.5rem 0;
                }
                .rich-text-editor h2, .rich-text-editor h3, .rich-text-editor h4 {
                    font-weight: 700;
                    color: #0f172a;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .rich-text-editor ul, .rich-text-editor ol {
                    padding-left: 1.5rem;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
}

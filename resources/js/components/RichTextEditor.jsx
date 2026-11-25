import React, { useRef, useEffect, useState } from 'react';

/**
 * Reusable Rich Text HTML Editor
 * Features:
 * - Clean modern toolbar matching application UI styling
 * - Headings (H2, H3, H4, Paragraph)
 * - Formatting: Bold, Italic, Underline, Strikethrough
 * - Ordered & Unordered Lists
 * - Blockquote & Hyperlinks
 * - Clear Formatting & Visual/HTML Source Mode
 * - Drop-in replacement for <textarea>
 */
export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Write detailed content here...',
    minHeight = '180px',
    error = '',
    disabled = false,
}) {
    const editorRef = useRef(null);
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [sourceHtml, setSourceHtml] = useState(value || '');

    // Synchronize external value changes when not actively typing
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
        if (isSourceMode || disabled) return;
        document.execCommand(cmd, false, val);
        handleInput();
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleInsertLink = () => {
        if (isSourceMode || disabled) return;
        const url = prompt('Enter URL (e.g. https://...):');
        if (url) {
            execCmd('createLink', url);
        }
    };

    return (
        <div
            className={`rich-text-editor border rounded-3 overflow-hidden bg-white shadow-2xs transition-all ${
                error ? 'border-danger' : 'border-secondary-subtle'
            }`}
        >
            {/* Toolbar */}
            <div className="d-flex flex-wrap align-items-center gap-1 p-2 bg-light border-bottom">
                {/* Heading / Paragraph Selector */}
                <select
                    className="form-select form-select-sm d-inline-block w-auto py-1 px-2 border rounded-2 bg-white shadow-2xs text-secondary fw-medium"
                    disabled={isSourceMode || disabled}
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
                    <option value="p">Normal Paragraph</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                </select>

                <div className="vr my-1 mx-1 text-muted opacity-25"></div>

                {/* Inline Formatting */}
                <div className="btn-group btn-group-sm" role="group">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={() => execCmd('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <i className="bi bi-type-bold fw-bold"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={() => execCmd('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <i className="bi bi-type-italic"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={() => execCmd('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <i className="bi bi-type-underline"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={() => execCmd('strikeThrough')}
                        title="Strikethrough"
                    >
                        <i className="bi bi-type-strikethrough"></i>
                    </button>
                </div>

                <div className="vr my-1 mx-1 text-muted opacity-25"></div>

                {/* Lists & Quotes */}
                <div className="btn-group btn-group-sm" role="group">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={() => execCmd('insertUnorderedList')}
                        title="Bullet List"
                    >
                        <i className="bi bi-list-ul"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={() => execCmd('insertOrderedList')}
                        title="Numbered List"
                    >
                        <i className="bi bi-list-ol"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={() => execCmd('formatBlock', '<blockquote>')}
                        title="Quote Block"
                    >
                        <i className="bi bi-quote"></i>
                    </button>
                </div>

                <div className="vr my-1 mx-1 text-muted opacity-25"></div>

                {/* Link & Clear Format */}
                <div className="btn-group btn-group-sm" role="group">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={handleInsertLink}
                        title="Insert Hyperlink"
                    >
                        <i className="bi bi-link-45deg"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent"
                        disabled={isSourceMode || disabled}
                        onClick={() => execCmd('removeFormat')}
                        title="Clear Formatting"
                    >
                        <i className="bi bi-eraser"></i>
                    </button>
                </div>

                {/* Right: Template & Visual / HTML Mode Switcher */}
                <div className="ms-auto d-flex align-items-center gap-1">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1 rounded-2 shadow-2xs bg-white"
                        disabled={disabled}
                        onClick={() => {
                            const template = `<h4>What You Will Learn</h4>
<ul>
    <li>Core concept 1 and fundamental principles</li>
    <li>Practical techniques and hands-on exercises</li>
    <li>Real-world applications and project work</li>
</ul>

<h4>Who Can Join?</h4>
<ul>
    <li>School / College students seeking conceptual clarity</li>
    <li>Beginners looking to build a strong foundation</li>
    <li>Learners preparing for upcoming exams or career advancement</li>
</ul>

<h4>Course Benefits</h4>
<ul>
    <li>Structured step-by-step guidance</li>
    <li>Personalized doubt clearance</li>
    <li>Weekly assessments and performance tracking</li>
    <li>Official Certificate of Completion</li>
</ul>`;
                            if (isSourceMode) {
                                const updated = (sourceHtml ? sourceHtml + '\n\n' : '') + template;
                                setSourceHtml(updated);
                                if (onChange) onChange(updated);
                            } else if (editorRef.current) {
                                editorRef.current.focus();
                                document.execCommand('insertHTML', false, template);
                                handleInput();
                            }
                        }}
                        title="Insert Standard Syllabus & Curriculum Template"
                    >
                        <i className="bi bi-file-earmark-plus"></i>
                        <span style={{ fontSize: '11px' }}>Insert Template</span>
                    </button>

                    <button
                        type="button"
                        className={`btn btn-sm py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1 rounded-2 shadow-2xs ${
                            isSourceMode ? 'btn-dark text-white' : 'btn-outline-secondary bg-white'
                        }`}
                        onClick={() => {
                            if (isSourceMode) {
                                if (editorRef.current) {
                                    editorRef.current.innerHTML = sourceHtml;
                                }
                            }
                            setIsSourceMode(!isSourceMode);
                        }}
                        title={isSourceMode ? 'Switch to Visual Editor' : 'Edit Raw HTML'}
                    >
                        <i className="bi bi-code-slash"></i>
                        <span style={{ fontSize: '11px' }}>{isSourceMode ? 'Visual' : 'HTML'}</span>
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
                    disabled={disabled}
                    placeholder="Enter or paste raw HTML code here..."
                ></textarea>
            ) : (
                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    onInput={handleInput}
                    onBlur={handleInput}
                    className="p-3 outline-none rich-editor-content"
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
                .rich-editor-content:empty:before {
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
                .rich-text-editor h2 {
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .rich-text-editor h3 {
                    font-size: 1.18rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .rich-text-editor h4 {
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin-top: 0.5rem;
                    margin-bottom: 0.25rem;
                }
                .rich-text-editor ul, .rich-text-editor ol {
                    padding-left: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .rich-text-editor a {
                    color: #2563eb;
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

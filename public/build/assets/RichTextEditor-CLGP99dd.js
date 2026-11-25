import{r as c,j as t}from"./app-B0A3vVSE.js";function j({value:l="",onChange:a,placeholder:p="Write detailed content here...",minHeight:m="180px",error:x="",disabled:r=!1}){const i=c.useRef(null),[e,h]=c.useState(!1),[u,d]=c.useState(l||"");c.useEffect(()=>{i.current&&!e&&i.current.innerHTML!==(l||"")&&(i.current.innerHTML=l||""),d(l||"")},[l,e]);const b=()=>{if(i.current){const n=i.current.innerHTML;d(n),a&&a(n)}},f=n=>{const s=n.target.value;d(s),a&&a(s)},o=(n,s=null)=>{e||r||(document.execCommand(n,!1,s),b(),i.current&&i.current.focus())},g=()=>{if(e||r)return;const n=prompt("Enter URL (e.g. https://...):");n&&o("createLink",n)};return t.jsxs("div",{className:`rich-text-editor border rounded-3 overflow-hidden bg-white shadow-2xs transition-all ${x?"border-danger":"border-secondary-subtle"}`,children:[t.jsxs("div",{className:"d-flex flex-wrap align-items-center gap-1 p-2 bg-light border-bottom",children:[t.jsxs("select",{className:"form-select form-select-sm d-inline-block w-auto py-1 px-2 border rounded-2 bg-white shadow-2xs text-secondary fw-medium",disabled:e||r,onChange:n=>{const s=n.target.value;s==="p"?o("formatBlock","<p>"):s&&o("formatBlock",`<${s}>`),n.target.value=""},defaultValue:"",title:"Text Style",children:[t.jsx("option",{value:"",disabled:!0,children:"Style"}),t.jsx("option",{value:"p",children:"Normal Paragraph"}),t.jsx("option",{value:"h2",children:"Heading 2"}),t.jsx("option",{value:"h3",children:"Heading 3"}),t.jsx("option",{value:"h4",children:"Heading 4"})]}),t.jsx("div",{className:"vr my-1 mx-1 text-muted opacity-25"}),t.jsxs("div",{className:"btn-group btn-group-sm",role:"group",children:[t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:()=>o("bold"),title:"Bold (Ctrl+B)",children:t.jsx("i",{className:"bi bi-type-bold fw-bold"})}),t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:()=>o("italic"),title:"Italic (Ctrl+I)",children:t.jsx("i",{className:"bi bi-type-italic"})}),t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:()=>o("underline"),title:"Underline (Ctrl+U)",children:t.jsx("i",{className:"bi bi-type-underline"})}),t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:()=>o("strikeThrough"),title:"Strikethrough",children:t.jsx("i",{className:"bi bi-type-strikethrough"})})]}),t.jsx("div",{className:"vr my-1 mx-1 text-muted opacity-25"}),t.jsxs("div",{className:"btn-group btn-group-sm",role:"group",children:[t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:()=>o("insertUnorderedList"),title:"Bullet List",children:t.jsx("i",{className:"bi bi-list-ul"})}),t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:()=>o("insertOrderedList"),title:"Numbered List",children:t.jsx("i",{className:"bi bi-list-ol"})}),t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:()=>o("formatBlock","<blockquote>"),title:"Quote Block",children:t.jsx("i",{className:"bi bi-quote"})})]}),t.jsx("div",{className:"vr my-1 mx-1 text-muted opacity-25"}),t.jsxs("div",{className:"btn-group btn-group-sm",role:"group",children:[t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:g,title:"Insert Hyperlink",children:t.jsx("i",{className:"bi bi-link-45deg"})}),t.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:e||r,onClick:()=>o("removeFormat"),title:"Clear Formatting",children:t.jsx("i",{className:"bi bi-eraser"})})]}),t.jsx("div",{className:"ms-auto",children:t.jsxs("button",{type:"button",className:`btn btn-sm py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1 rounded-2 shadow-2xs ${e?"btn-dark text-white":"btn-outline-secondary bg-white"}`,onClick:()=>{e&&i.current&&(i.current.innerHTML=u),h(!e)},title:e?"Switch to Visual Editor":"Edit Raw HTML",children:[t.jsx("i",{className:"bi bi-code-slash"}),t.jsx("span",{style:{fontSize:"11px"},children:e?"Visual":"HTML"})]})})]}),e?t.jsx("textarea",{className:"form-control font-monospace border-0 p-3",style:{minHeight:m,resize:"vertical",fontSize:"0.88rem",background:"#f8fafc"},value:u,onChange:f,disabled:r,placeholder:"Enter or paste raw HTML code here..."}):t.jsx("div",{ref:i,contentEditable:!r,onInput:b,onBlur:b,className:"p-3 outline-none rich-editor-content",style:{minHeight:m,outline:"none",fontSize:"0.94rem",lineHeight:"1.6"},"data-placeholder":p}),t.jsx("style",{children:`
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
            `})]})}export{j as R};

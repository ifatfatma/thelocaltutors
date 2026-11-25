import{r as b,j as e}from"./app-DUDyZKwP.js";function j({value:a="",onChange:l,placeholder:p="Write detailed content here...",minHeight:m="180px",error:x="",disabled:n=!1}){const i=b.useRef(null),[t,h]=b.useState(!1),[c,d]=b.useState(a||"");b.useEffect(()=>{i.current&&!t&&i.current.innerHTML!==(a||"")&&(i.current.innerHTML=a||""),d(a||"")},[a,t]);const u=()=>{if(i.current){const r=i.current.innerHTML;d(r),l&&l(r)}},f=r=>{const s=r.target.value;d(s),l&&l(s)},o=(r,s=null)=>{t||n||(document.execCommand(r,!1,s),u(),i.current&&i.current.focus())},g=()=>{if(t||n)return;const r=prompt("Enter URL (e.g. https://...):");r&&o("createLink",r)};return e.jsxs("div",{className:`rich-text-editor border rounded-3 overflow-hidden bg-white shadow-2xs transition-all ${x?"border-danger":"border-secondary-subtle"}`,children:[e.jsxs("div",{className:"d-flex flex-wrap align-items-center gap-1 p-2 bg-light border-bottom",children:[e.jsxs("select",{className:"form-select form-select-sm d-inline-block w-auto py-1 px-2 border rounded-2 bg-white shadow-2xs text-secondary fw-medium",disabled:t||n,onChange:r=>{const s=r.target.value;s==="p"?o("formatBlock","<p>"):s&&o("formatBlock",`<${s}>`),r.target.value=""},defaultValue:"",title:"Text Style",children:[e.jsx("option",{value:"",disabled:!0,children:"Style"}),e.jsx("option",{value:"p",children:"Normal Paragraph"}),e.jsx("option",{value:"h2",children:"Heading 2"}),e.jsx("option",{value:"h3",children:"Heading 3"}),e.jsx("option",{value:"h4",children:"Heading 4"})]}),e.jsx("div",{className:"vr my-1 mx-1 text-muted opacity-25"}),e.jsxs("div",{className:"btn-group btn-group-sm",role:"group",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:()=>o("bold"),title:"Bold (Ctrl+B)",children:e.jsx("i",{className:"bi bi-type-bold fw-bold"})}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:()=>o("italic"),title:"Italic (Ctrl+I)",children:e.jsx("i",{className:"bi bi-type-italic"})}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:()=>o("underline"),title:"Underline (Ctrl+U)",children:e.jsx("i",{className:"bi bi-type-underline"})}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:()=>o("strikeThrough"),title:"Strikethrough",children:e.jsx("i",{className:"bi bi-type-strikethrough"})})]}),e.jsx("div",{className:"vr my-1 mx-1 text-muted opacity-25"}),e.jsxs("div",{className:"btn-group btn-group-sm",role:"group",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:()=>o("insertUnorderedList"),title:"Bullet List",children:e.jsx("i",{className:"bi bi-list-ul"})}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:()=>o("insertOrderedList"),title:"Numbered List",children:e.jsx("i",{className:"bi bi-list-ol"})}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:()=>o("formatBlock","<blockquote>"),title:"Quote Block",children:e.jsx("i",{className:"bi bi-quote"})})]}),e.jsx("div",{className:"vr my-1 mx-1 text-muted opacity-25"}),e.jsxs("div",{className:"btn-group btn-group-sm",role:"group",children:[e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:g,title:"Insert Hyperlink",children:e.jsx("i",{className:"bi bi-link-45deg"})}),e.jsx("button",{type:"button",className:"btn btn-sm btn-outline-secondary py-1 px-2 border-0 bg-transparent",disabled:t||n,onClick:()=>o("removeFormat"),title:"Clear Formatting",children:e.jsx("i",{className:"bi bi-eraser"})})]}),e.jsxs("div",{className:"ms-auto d-flex align-items-center gap-1",children:[e.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-primary py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1 rounded-2 shadow-2xs bg-white",disabled:n,onClick:()=>{const r=`<h4>What You Will Learn</h4>
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
</ul>`;if(t){const s=(c?c+`

`:"")+r;d(s),l&&l(s)}else i.current&&(i.current.focus(),document.execCommand("insertHTML",!1,r),u())},title:"Insert Standard Syllabus & Curriculum Template",children:[e.jsx("i",{className:"bi bi-file-earmark-plus"}),e.jsx("span",{style:{fontSize:"11px"},children:"Insert Template"})]}),e.jsxs("button",{type:"button",className:`btn btn-sm py-1 px-2 fw-semibold d-inline-flex align-items-center gap-1 rounded-2 shadow-2xs ${t?"btn-dark text-white":"btn-outline-secondary bg-white"}`,onClick:()=>{t&&i.current&&(i.current.innerHTML=c),h(!t)},title:t?"Switch to Visual Editor":"Edit Raw HTML",children:[e.jsx("i",{className:"bi bi-code-slash"}),e.jsx("span",{style:{fontSize:"11px"},children:t?"Visual":"HTML"})]})]})]}),t?e.jsx("textarea",{className:"form-control font-monospace border-0 p-3",style:{minHeight:m,resize:"vertical",fontSize:"0.88rem",background:"#f8fafc"},value:c,onChange:f,disabled:n,placeholder:"Enter or paste raw HTML code here..."}):e.jsx("div",{ref:i,contentEditable:!n,onInput:u,onBlur:u,className:"p-3 outline-none rich-editor-content",style:{minHeight:m,outline:"none",fontSize:"0.94rem",lineHeight:"1.6"},"data-placeholder":p}),e.jsx("style",{children:`
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

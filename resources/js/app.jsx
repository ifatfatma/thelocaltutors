import './bootstrap';
import '@/front/css/bootstrap.min.css';
import '@/front/css/animate.css';
import '@/front/css/nice-select2.css';
import '@/front/css/icomoom.css';
import '@/front/css/toastr.css';
import '@/front/scss/style.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => title ? `${title} - The Local Tutors` : 'The Local Tutors',
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#ff6b35',
    },
});

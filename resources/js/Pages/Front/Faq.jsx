import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function Faq({ faqlist = [] }) {
    const list = Array.isArray(faqlist) ? faqlist : [];

    return (
        <FrontLayout>
            <Head title="Frequently Asked Questions" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold text-white mb-2">Frequently Asked Questions</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">FAQ</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {list.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-question-circle fs-1 text-muted"></i>
                                <h4 className="mt-3 text-muted">No FAQs found.</h4>
                            </div>
                        ) : (
                            <div className="accordion shadow-sm rounded-4 overflow-hidden" id="faqPageAccordion">
                                {list.map((faq, idx) => (
                                    <div className="accordion-item border-0 border-bottom" key={faq.id || idx}>
                                        <h2 className="accordion-header" id={`faqHeading${idx}`}>
                                            <button
                                                className={`accordion-button fw-semibold ${idx !== 0 ? 'collapsed' : ''}`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#faqCollapse${idx}`}
                                                aria-expanded={idx === 0 ? 'true' : 'false'}
                                            >
                                                {faq.title}
                                            </button>
                                        </h2>
                                        <div
                                            id={`faqCollapse${idx}`}
                                            className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                                            data-bs-parent="#faqPageAccordion"
                                        >
                                            <div
                                                className="accordion-body text-muted"
                                                dangerouslySetInnerHTML={{ __html: faq.description }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

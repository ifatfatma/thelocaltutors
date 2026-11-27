import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function OurVision({ pageData }) {
    return (
        <FrontLayout>
            <Head title="Our Vision" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold text-white mb-2">Our Vision</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Our Vision</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                <div className="row align-items-center gy-4">
                    <div className="col-lg-6">
                        <span className="badge bg-primary-subtle text-primary fw-bold mb-2">Looking Ahead</span>
                        <h2 className="fw-bold text-dark mb-4">{pageData?.title || 'Our Vision for the Future'}</h2>
                        <div
                            className="text-muted lead fs-6"
                            dangerouslySetInnerHTML={{
                                __html: pageData?.description ||
                                    'We envision a world where every learner has immediate access to exceptional mentors who inspire curiosity, unlock confidence, and foster lifelong learning.',
                            }}
                        />
                    </div>
                    <div className="col-lg-6 text-center">
                        <img
                            src="/front/img/bg-img/home-4/c-1.png"
                            onError={(e) => { e.target.src = '/front/img/bg-img/light.png'; }}
                            alt="Our Vision"
                            className="img-fluid rounded-4 shadow-sm"
                            style={{ maxHeight: '400px' }}
                        />
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

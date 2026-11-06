import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function OurMission({ pageData }) {
    return (
        <FrontLayout>
            <Head title="Our Mission" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold mb-2">Our Mission</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Our Mission</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                <div className="row align-items-center gy-4">
                    <div className="col-lg-6">
                        <span className="badge bg-primary-subtle text-primary fw-bold mb-2">Purpose &amp; Goals</span>
                        <h2 className="fw-bold text-dark mb-4">{pageData?.title || 'Our Mission for Learners & Tutors'}</h2>
                        <div
                            className="text-muted lead fs-6"
                            dangerouslySetInnerHTML={{
                                __html: pageData?.description ||
                                    'Our mission is to bridge the educational gap by enabling every student to find reliable, high-quality, and affordable personalized tutoring right in their local area.',
                            }}
                        />
                    </div>
                    <div className="col-lg-6 text-center">
                        <img
                            src="/front/img/bg-img/home-4/c-3.png"
                            onError={(e) => { e.target.src = '/front/img/bg-img/light.png'; }}
                            alt="Our Mission"
                            className="img-fluid rounded-4 shadow-sm"
                            style={{ maxHeight: '400px' }}
                        />
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

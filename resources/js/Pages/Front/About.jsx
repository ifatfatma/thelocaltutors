import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function About({ pageData, pageDatax }) {
    return (
        <FrontLayout>
            <Head title="About Us" />

            {/* Breadcrumb banner */}
            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold text-white mb-2">About Us</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">About Us</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                <div className="row align-items-center gy-4 mb-5">
                    <div className="col-lg-6">
                        <span className="badge bg-primary-subtle text-primary fw-bold mb-2">Who We Are</span>
                        <h2 className="fw-bold text-dark mb-4">{pageData?.title || 'Empowering Education Locally'}</h2>
                        <div
                            className="text-muted lead fs-6"
                            dangerouslySetInnerHTML={{
                                __html: pageData?.description ||
                                    'We are dedicated to providing students with immediate access to verified, passionate local teachers, coaches, and academic mentors across subjects and grade levels.',
                            }}
                        />
                    </div>
                    <div className="col-lg-6 text-center">
                        <img
                            src="/front/img/bg-img/home-4/c-2.png"
                            onError={(e) => { e.target.src = '/front/img/bg-img/light.png'; }}
                            alt="About Us"
                            className="img-fluid rounded-4 shadow-sm"
                            style={{ maxHeight: '400px' }}
                        />
                    </div>
                </div>

                {pageDatax && (
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-light my-5">
                        <h3 className="fw-bold mb-3">{pageDatax.title}</h3>
                        <div
                            className="text-muted"
                            dangerouslySetInnerHTML={{ __html: pageDatax.description }}
                        />
                    </div>
                )}

                {/* Values cards */}
                <div className="row g-4 text-center mt-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                            <div className="text-primary fs-1 mb-3">
                                <i className="bi bi-shield-check"></i>
                            </div>
                            <h5 className="fw-bold">Verified Tutors</h5>
                            <p className="text-muted small">
                                Every tutor undergoes rigorous qualification checks and background validation.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                            <div className="text-primary fs-1 mb-3">
                                <i className="bi bi-geo-alt"></i>
                            </div>
                            <h5 className="fw-bold">Hyper-Local Matching</h5>
                            <p className="text-muted small">
                                Find tutors within your immediate locality or connect via online interactive classrooms.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                            <div className="text-primary fs-1 mb-3">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <h5 className="fw-bold">Proven Results</h5>
                            <p className="text-muted small">
                                Track progress and boost academic performance with continuous feedback and support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

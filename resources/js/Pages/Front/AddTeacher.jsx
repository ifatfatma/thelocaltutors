import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function AddTeacher() {
    return (
        <FrontLayout>
            <Head title="Join as a Teacher" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold text-white mb-2">Join Our Teaching Community</h1>
                    <p className="text-white-50">Share your knowledge and tutor eager learners in your city</p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-center">
                            <i className="bi bi-mortarboard-fill text-primary display-3 mb-3"></i>
                            <h3 className="fw-bold mb-3">Start Tutoring Today</h3>
                            <p className="text-muted mb-4 lead fs-6">
                                Create your teacher profile, choose your subjects, teaching mode (home or online), set your timings and fee rates, and get connected with students looking for guidance in your area.
                            </p>

                            <div className="d-flex justify-content-center gap-3">
                                <Link href="/register" className="btn btn-primary px-4 py-2 fw-semibold">
                                    Register as Teacher
                                </Link>
                                <Link href="/login" className="btn btn-outline-secondary px-4 py-2">
                                    Already Registered? Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';
import axios from 'axios';

export default function FavouriteCourses({ myfavcourselist }) {
    const list = myfavcourselist?.data || myfavcourselist || [];
    const [errorMsg, setErrorMsg] = useState('');

    const handleRemove = async (courseId) => {
        if (!confirm('Remove this course from favorites?')) return;
        setErrorMsg('');
        try {
            await axios.get(`/myfavcourse/ajax?id=${courseId}`);
            router.reload();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Unable to remove course from favorites. Please try again.');
        }
    };

    return (
        <FrontLayout>
            <Head title="Saved Courses" />

            <div className="bg-primary text-white py-4">
                <div className="container">
                    <h2 className="fw-bold mb-1">Saved Courses</h2>
                    <p className="text-white-50 mb-0">Your bookmarked and favorite courses</p>
                </div>
            </div>

            <div className="container py-5">
                {errorMsg && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {errorMsg}
                        <button type="button" className="btn-close" onClick={() => setErrorMsg('')} aria-label="Close"></button>
                    </div>
                )}
                {list.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-heart fs-1 text-muted"></i>
                        <h4 className="mt-3 text-muted">You haven't saved any courses yet.</h4>
                        <Link href="/all_course" className="btn btn-primary mt-2">Explore Courses</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {list.map((fav) => {
                            const course = fav.course;
                            if (!course) return null;
                            return (
                                <div key={fav.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <img
                                            src={course.image ? `/course/${course.image}` : '/front/img/noimage.jpg'}
                                            alt={course.title}
                                            className="card-img-top"
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-4 d-flex flex-column">
                                            <h5 className="fw-bold mb-2">
                                                <Link
                                                    href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                    className="text-dark text-decoration-none"
                                                >
                                                    {course.title}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small flex-grow-1">
                                                {course.short_description || (course.description ? course.description.substring(0, 80) + '...' : '')}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                                                <span className="fw-bold text-primary">
                                                    {course.price ? `₹${course.price}` : 'Free'}
                                                </span>
                                                <div className="d-flex gap-2">
                                                    <Link
                                                        href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemove(course.id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Remove"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {myfavcourselist?.links && <Pagination links={myfavcourselist.links} />}
            </div>
        </FrontLayout>
    );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';

export default function MyCourses({ mycourselist }) {
    const list = mycourselist?.data || mycourselist || [];

    return (
        <FrontLayout>
            <Head title="My Enrolled Courses" />

            <div className="bg-primary text-white py-4">
                <div className="container">
                    <h2 className="fw-bold mb-1">My Enrolled Courses</h2>
                    <p className="text-white-50 mb-0">Courses you have joined or completed</p>
                </div>
            </div>

            <div className="container py-5">
                {list.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-mortarboard fs-1 text-muted"></i>
                        <h4 className="mt-3 text-muted">You are not enrolled in any courses yet.</h4>
                        <Link href="/all_course" className="btn btn-primary mt-2">Find a Course</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {list.map((enrollment) => {
                            const course = enrollment.course;
                            if (!course) return null;
                            return (
                                <div key={enrollment.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <img
                                            src={course.image ? `/course/${course.image}` : '/front/img/noimage.jpg'}
                                            alt={course.title}
                                            className="card-img-top"
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="badge bg-success-subtle text-success text-uppercase">
                                                    {enrollment.status || 'Active'}
                                                </span>
                                                <span className="text-muted small">
                                                    {new Date(enrollment.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
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
                                            <div className="pt-3 border-top mt-auto">
                                                <Link
                                                    href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                    className="btn btn-primary btn-sm w-100"
                                                >
                                                    Access Course Materials
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {mycourselist?.links && <Pagination links={mycourselist.links} />}
            </div>
        </FrontLayout>
    );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';
import axios from 'axios';

export default function AllCourse({ courses, categories = [] }) {
    const courseList = courses?.data || courses || [];

    const handleFav = async (id) => {
        try {
            const res = await axios.get(`/myfavcourse/ajax?id=${id}`);
            alert(res.data.message);
        } catch (err) {
            alert('Please login to save favorite courses.');
        }
    };

    return (
        <FrontLayout>
            <Head title="All Courses" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold mb-2">All Courses</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Courses</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                {/* Categories bar */}
                {categories.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-4">
                        <Link href="/all_course" className="btn btn-sm btn-primary">
                            All
                        </Link>
                        {categories.map((c) => (
                            <Link
                                key={c.id}
                                href={`/course/${c.id}/${c.slug}`}
                                className="btn btn-sm btn-outline-secondary"
                            >
                                {c.title}
                            </Link>
                        ))}
                    </div>
                )}

                {courseList.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-book fs-1 text-muted"></i>
                        <h4 className="mt-3 text-muted">No courses available at the moment.</h4>
                        <Link href="/" className="btn btn-primary mt-2">Back to Home</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {courseList.map((course) => (
                            <div key={course.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                    <div className="position-relative">
                                        <img
                                            src={course.image ? `/course/${course.image}` : '/front/img/noimage.jpg'}
                                            alt={course.title}
                                            className="card-img-top"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <button
                                            onClick={() => handleFav(course.id)}
                                            className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 p-2 shadow-sm"
                                            title="Save Course"
                                        >
                                            <i className="bi bi-heart text-danger"></i>
                                        </button>
                                    </div>
                                    <div className="card-body p-4 d-flex flex-column">
                                        <span className="badge bg-primary-subtle text-primary align-self-start mb-2">
                                            {course.category?.title || 'General'}
                                        </span>
                                        <h5 className="fw-bold mb-2">
                                            <Link
                                                href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                className="text-dark text-decoration-none"
                                            >
                                                {course.title}
                                            </Link>
                                        </h5>
                                        <p className="text-muted small flex-grow-1">
                                            {course.short_description || (course.description ? course.description.substring(0, 90) + '...' : '')}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                                            <span className="fw-bold text-primary fs-5">
                                                {course.price ? `₹${course.price}` : 'Free'}
                                            </span>
                                            <Link
                                                href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                View Course
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {courses?.links && <Pagination links={courses.links} />}
            </div>
        </FrontLayout>
    );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';
import { cleanExcerpt, formatPrice } from '../../Utils/text';
import axios from 'axios';

export default function AllCourse({ courses, categories = [] }) {
    const courseList = courses?.data || (Array.isArray(courses) ? courses : []);

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
            <Head>
                <title>All Courses &amp; Specialized Batches - The Local Tutors</title>
                <meta name="description" content="Explore certified academic courses in TIF Core Mathematics, Science, CBSE, ICSE, WBBSE boards, Artificial Intelligence, and Basic Computer skills with free demo classes." />
            </Head>

            {/* Modern Clean Header */}
            <div className="bg-white border-bottom py-5 hero-wrapper">
                <div className="container text-center">
                    <span className="badge badge-soft-primary text-primary px-3 py-2 rounded-pill fw-semibold mb-3 d-inline-flex align-items-center gap-2 shadow-2xs">
                        <i className="bi bi-journal-code text-primary"></i>
                        <span>Explore Certified Courses &amp; Batches</span>
                    </span>
                    <h1 className="fw-bold display-6 text-dark mb-2">Academic &amp; Specialized Courses</h1>
                    <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '640px' }}>
                        Learn from verified local instructors with customized 1-on-1 home tuition and small-group online batches. Transparent INR pricing with free trial demo classes available.
                    </p>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0 small">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-secondary text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">Courses</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                {/* Categories bar */}
                {categories.length > 0 && (
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-4 pb-2 border-bottom">
                        <span className="small text-secondary fw-semibold me-2 d-none d-sm-inline">
                            <i className="bi bi-funnel me-1"></i>Filter by Category:
                        </span>
                        <Link
                            href="/all_course"
                            className="btn btn-sm btn-primary-gradient rounded-pill px-3 py-1"
                        >
                            All Categories
                        </Link>
                        {categories.map((c) => (
                            <Link
                                key={c.id}
                                href={`/course/${c.id}/${c.slug}`}
                                className="btn btn-sm btn-light border rounded-pill px-3 py-1 text-secondary text-hover-primary"
                            >
                                {c.title}
                            </Link>
                        ))}
                    </div>
                )}

                {courseList.length === 0 ? (
                    <div className="text-center py-5 my-4 bg-white rounded-4 border p-5">
                        <div className="p-3 bg-light rounded-circle d-inline-flex mb-3">
                            <i className="bi bi-journal-x fs-1 text-secondary"></i>
                        </div>
                        <h4 className="fw-bold text-dark">No courses available at the moment</h4>
                        <p className="text-secondary small mb-4">
                            New batches are added regularly. Check back soon or browse our verified tutors.
                        </p>
                        <Link href="/" className="btn btn-primary-gradient rounded-pill px-4 py-2">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {courseList.map((course) => {
                            const courseTitle = course.title || course.name || 'Specialized Course';
                            const cleanDesc = cleanExcerpt(
                                course.short_description || course.description,
                                110,
                                'Structured curriculum with conceptual clarity, weekly revision worksheets, and comprehensive board preparation.'
                            );

                            return (
                                <div key={course.id} className="col-md-6 col-lg-4">
                                    <div className="card card-modern h-100 overflow-hidden d-flex flex-column">
                                        <div className="position-relative overflow-hidden" style={{ height: '210px', backgroundColor: '#e2e8f0' }}>
                                            <img
                                                src={course.image && course.image.startsWith('http') ? course.image : (course.image ? `/course/${course.image}` : '/front/img/noimage.jpg')}
                                                alt={`Course banner for ${courseTitle}`}
                                                className="w-100 h-100 object-fit-cover transition-transform"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60';
                                                }}
                                            />
                                            {course.category?.title && (
                                                <span className="badge bg-white text-dark shadow-sm position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill small fw-semibold">
                                                    {course.category.title}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => handleFav(course.id)}
                                                className="btn btn-white bg-white rounded-circle position-absolute top-0 end-0 m-3 p-2 shadow-sm border-0 d-flex align-items-center justify-content-center"
                                                style={{ width: '36px', height: '36px' }}
                                                title="Save Course to Favourites"
                                            >
                                                <i className="bi bi-heart text-danger"></i>
                                            </button>
                                        </div>

                                        <div className="card-body p-4 d-flex flex-column flex-grow-1">
                                            {/* Mode & Duration Badges */}
                                            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                                <span className="badge bg-light text-secondary border small">
                                                    <i className="bi bi-geo-alt me-1"></i>{course.teaching_mode || 'Home / Online'}
                                                </span>
                                                {course.duration && (
                                                    <span className="badge bg-light text-secondary border small">
                                                        <i className="bi bi-clock me-1"></i>{course.duration} mins / session
                                                    </span>
                                                )}
                                            </div>

                                            <h5 className="fw-bold mb-2">
                                                <Link
                                                    href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                    className="text-dark text-decoration-none text-hover-primary"
                                                >
                                                    {courseTitle}
                                                </Link>
                                            </h5>
                                            <p className="text-secondary small flex-grow-1 mb-3">
                                                {cleanDesc}
                                            </p>

                                            {course.teacher && (
                                                <div className="d-flex align-items-center gap-2 mb-3 py-2 px-2 bg-light rounded-3">
                                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '26px', height: '26px', fontSize: '11px' }}>
                                                        <i className="bi bi-person-fill"></i>
                                                    </div>
                                                    <span className="small text-dark fw-semibold text-truncate">
                                                        Taught by {course.teacher.name}
                                                    </span>
                                                    <span className="badge bg-primary-subtle text-primary rounded-pill ms-auto" style={{ fontSize: '10px' }}>
                                                        Teacher
                                                    </span>
                                                </div>
                                            )}

                                            <div className="d-flex justify-content-between align-items-end pt-3 border-top mt-auto">
                                                <div>
                                                    <div className="d-flex align-items-baseline gap-1">
                                                        <span className="fw-bold text-primary fs-5">
                                                            {course.price ? `₹${Number(course.price).toLocaleString('en-IN')}` : 'Free'}
                                                        </span>
                                                        {course.price > 0 && <span className="text-muted small">/ month</span>}
                                                    </div>
                                                    <span className="badge badge-soft-success text-success small d-inline-block mt-1">
                                                        <i className="bi bi-patch-check me-1"></i>Trial Class Available
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                    className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 fw-semibold"
                                                >
                                                    Details <i className="bi bi-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {courses?.links && <div className="mt-5"><Pagination links={courses.links} /></div>}
            </div>
        </FrontLayout>
    );
}

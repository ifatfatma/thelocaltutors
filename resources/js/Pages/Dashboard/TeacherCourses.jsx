import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';
import { cleanExcerpt } from '../../Utils/text';

export default function TeacherCourses({ courses, categories = [], subjects = [], teacher, stats }) {
    const courseList = courses?.data || (Array.isArray(courses) ? courses : []);

    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Form handling
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        price: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        duration: '3 Months (3 classes/week)',
        teaching_mode: 'Both (Home & Online)',
        description: '',
        youtube_url: '',
        is_active: 1,
        image: null,
    });

    // Commission calculations (5% standard platform commission)
    const numericPrice = parseFloat(data.price) || 0;
    const commissionAmount = Math.round((numericPrice * 0.05) * 100) / 100;
    const teacherPayout = Math.round((numericPrice * 0.95) * 100) / 100;

    const openCreateModal = () => {
        setEditingCourse(null);
        setPreviewImage(null);
        clearErrors();
        reset();
        setData({
            name: '',
            price: '',
            category_id: categories.length > 0 ? categories[0].id : '',
            duration: '3 Months (3 classes/week)',
            teaching_mode: 'Both (Home & Online)',
            description: '',
            youtube_url: '',
            is_active: 1,
            image: null,
        });
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        clearErrors();
        setPreviewImage(course.image ? `/course/${course.image}` : null);
        setData({
            name: course.name || '',
            price: course.price || '',
            category_id: course.category_id || (categories.length > 0 ? categories[0].id : ''),
            duration: course.duration || '',
            teaching_mode: course.teaching_mode || 'Both (Home & Online)',
            description: course.description || '',
            youtube_url: course.youtube_url || '',
            is_active: course.is_active ? 1 : 0,
            image: null,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCourse) {
            post(`/dashboard/courses/${editingCourse.id}/update`, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    setEditingCourse(null);
                    reset();
                },
            });
        } else {
            post('/dashboard/courses', {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id, name) => {
        if (!confirm(`Are you sure you want to remove the course "${name}"?`)) return;
        router.delete(`/dashboard/courses/${id}`);
    };

    const handleToggleStatus = (id) => {
        router.post(`/dashboard/courses/${id}/toggle`);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <FrontLayout>
            <Head>
                <title>Manage My Courses - The Local Tutors</title>
            </Head>

            {/* Hero Header */}
            <div className="bg-white border-bottom py-4 hero-wrapper">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-2">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-secondary text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/dashboard" className="text-secondary text-decoration-none">Dashboard</Link>
                            </li>
                            <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">
                                My Courses
                            </li>
                        </ol>
                    </nav>

                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <span className="badge badge-soft-primary text-primary px-3 py-1 rounded-pill fw-semibold mb-2">
                                <i className="bi bi-mortarboard-fill me-1"></i>Teacher Course Portal
                            </span>
                            <h2 className="fw-bold text-dark mb-1">Manage My Offered Courses</h2>
                            <p className="text-secondary small mb-0">
                                Create and publish your academic or skill courses, set custom pricing according to your choice, and track enrollments with transparent 5% platform commission.
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <Link href="/dashboard" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                                <i className="bi bi-arrow-left me-1"></i>Dashboard
                            </Link>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="btn btn-primary-gradient btn-sm rounded-pill px-4 fw-semibold shadow-xs"
                            >
                                <i className="bi bi-plus-circle me-1"></i>+ Add New Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                {/* Stats & Commission Highlight Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-primary-subtle text-primary rounded-circle fs-4">
                                    <i className="bi bi-journal-check"></i>
                                </div>
                                <div>
                                    <div className="fs-4 fw-bold text-dark">{stats?.total_courses || 0}</div>
                                    <div className="text-muted small">Total Courses</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-success-subtle text-success rounded-circle fs-4">
                                    <i className="bi bi-broadcast"></i>
                                </div>
                                <div>
                                    <div className="fs-4 fw-bold text-dark">{stats?.active_courses || 0}</div>
                                    <div className="text-muted small">Active &amp; Published</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-info-subtle text-info rounded-circle fs-4">
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <div>
                                    <div className="fs-4 fw-bold text-dark">{stats?.total_enrollments || 0}</div>
                                    <div className="text-muted small">Student Inquiries/Enrolled</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-warning">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-circle fs-4">
                                    <i className="bi bi-percent"></i>
                                </div>
                                <div>
                                    <div className="fs-4 fw-bold text-dark">5% Platform Fee</div>
                                    <div className="text-muted small">95% Direct Teacher Payout</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transparent Commission Information Note */}
                <div className="card border-0 bg-primary-subtle text-dark rounded-4 p-4 mb-4 shadow-sm border-start border-4 border-primary">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-start gap-3">
                            <div className="p-2 bg-primary text-white rounded-3 fs-4 mt-1 d-none d-sm-block">
                                <i className="bi bi-shield-check"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold mb-1 text-primary-emphasis">
                                    <i className="bi bi-info-circle-fill me-1 text-primary"></i>Transparent Teacher Pricing &amp; 5% Commission Model
                                </h6>
                                <p className="mb-0 small text-secondary">
                                    You have complete freedom to set the course price according to your expertise and course duration.
                                    <strong> The Local Tutors charges only a 5% platform commission</strong> to maintain live matching, verified educator badging, and automated lead management. <strong>95% of your set price is your direct take-home earnings.</strong>
                                    <span className="d-block mt-1 text-dark fw-medium">
                                        <em>Example: If you set a course fee of ₹1,000, your take-home payout is ₹950 and ₹50 is the platform commission. If you set ₹3,000, you receive ₹2,850 and ₹150 is commission.</em>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="btn btn-primary rounded-pill px-4 py-2 btn-sm fw-semibold shadow-xs text-nowrap"
                        >
                            <i className="bi bi-plus-lg me-1"></i>Publish New Course
                        </button>
                    </div>
                </div>

                {/* Course List Section */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
                    <div className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between border-bottom">
                        <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                            <i className="bi bi-grid-fill text-primary"></i>Your Created Courses ({courses?.total || courseList.length})
                        </h5>
                        <button
                            onClick={openCreateModal}
                            className="btn btn-outline-primary btn-sm rounded-pill px-3"
                        >
                            <i className="bi bi-plus-circle me-1"></i>Add Course
                        </button>
                    </div>

                    {courseList.length === 0 ? (
                        <div className="text-center py-5 px-3">
                            <div className="p-3 bg-light rounded-circle d-inline-flex mb-3">
                                <i className="bi bi-journal-plus fs-1 text-muted"></i>
                            </div>
                            <h5 className="fw-bold text-dark mb-1">No Courses Created Yet</h5>
                            <p className="text-secondary small mb-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
                                Start offering courses to students! Choose your subject, customize your teaching duration and syllabus, and set your own price with transparent 5% platform commission.
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="btn btn-primary-gradient rounded-pill px-4 py-2 fw-semibold"
                            >
                                <i className="bi bi-plus-lg me-1"></i>Create Your First Course Now
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light small text-uppercase text-secondary">
                                    <tr>
                                        <th className="ps-4" style={{ width: '80px' }}>Image</th>
                                        <th>Course Name &amp; Details</th>
                                        <th>Mode &amp; Duration</th>
                                        <th>Price &amp; Payout (95%)</th>
                                        <th>Commission (5%)</th>
                                        <th>Status</th>
                                        <th className="text-end pe-4" style={{ minWidth: '160px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseList.map((course) => {
                                        const cPrice = parseFloat(course.price) || 0;
                                        const cComm = Math.round((cPrice * 0.05) * 100) / 100;
                                        const cNet = Math.round((cPrice * 0.95) * 100) / 100;

                                        return (
                                            <tr key={course.id}>
                                                <td className="ps-4">
                                                    {course.image ? (
                                                        <img
                                                            src={`/course/thumbnail/${course.image}`}
                                                            onError={(e) => { e.target.src = `/course/${course.image}`; }}
                                                            alt={course.name}
                                                            className="rounded-3 object-fit-cover shadow-2xs"
                                                            style={{ width: '60px', height: '48px' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                                            style={{ width: '60px', height: '48px', fontSize: '18px' }}
                                                        >
                                                            <i className="bi bi-book"></i>
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="fw-bold text-dark mb-1">{course.name}</div>
                                                    <div className="d-flex align-items-center gap-2 small text-muted">
                                                        {course.category?.title && (
                                                            <span className="badge bg-light text-secondary border">
                                                                {course.category.title}
                                                            </span>
                                                        )}
                                                        <span>
                                                            <i className="bi bi-people me-1"></i>
                                                            {course.enrollments_count || 0} students enrolled
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="small fw-semibold text-dark">
                                                        <i className="bi bi-geo-alt-fill text-primary me-1"></i>
                                                        {course.teaching_mode || 'Home / Online'}
                                                    </div>
                                                    <div className="small text-muted">
                                                        <i className="bi bi-clock me-1"></i>
                                                        {course.duration || 'Flexible'}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="fw-bold text-success fs-6">
                                                        ₹{cPrice.toLocaleString('en-IN')}
                                                    </div>
                                                    <div className="small text-success-emphasis fw-medium">
                                                        Net Payout: ₹{cNet.toLocaleString('en-IN')}
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2 py-1">
                                                        5% = ₹{cComm.toLocaleString('en-IN')}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(course.id)}
                                                        className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                                                            course.is_active
                                                                ? 'btn-success bg-opacity-10 text-success border border-success'
                                                                : 'btn-secondary bg-opacity-10 text-secondary border'
                                                        }`}
                                                        title="Click to toggle active status"
                                                    >
                                                        <i className={`bi ${course.is_active ? 'bi-check-circle-fill' : 'bi-pause-circle-fill'} me-1`}></i>
                                                        {course.is_active ? 'Active' : 'Draft'}
                                                    </button>
                                                </td>

                                                <td className="text-end pe-4">
                                                    <div className="d-flex align-items-center justify-content-end gap-1">
                                                        <Link
                                                            href={`/course_details/${course.id}/${course.slug || 'course'}`}
                                                            target="_blank"
                                                            className="btn btn-sm btn-light border text-primary"
                                                            title="Preview public course page"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(course)}
                                                            className="btn btn-sm btn-light border text-secondary"
                                                            title="Edit course & fee"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(course.id, course.name)}
                                                            className="btn btn-sm btn-light border text-danger"
                                                            title="Delete course"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {courses?.links && (
                        <div className="card-footer bg-white border-top py-3 px-4">
                            <Pagination links={courses.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Course Create & Edit Modal */}
            {showModal && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div className="modal-header bg-primary text-white py-3 px-4 border-0">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="p-2 bg-white bg-opacity-25 rounded-circle d-inline-flex">
                                        <i className="bi bi-journal-plus fs-5"></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">
                                            {editingCourse ? 'Edit Course & Pricing' : 'Add New Course / Batch'}
                                        </h5>
                                        <span className="small text-white-50">
                                            Set your course fee of choice with transparent 5% platform commission
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                                    {/* 1. Title */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small">
                                            Course Title / Topic <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="e.g. ICSE Class 10 Physics & Numericals Mastery Batch"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* 2. Category & Teaching Mode */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small">
                                                Academic Subject / Category
                                            </label>
                                            <select
                                                className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                            >
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.title}
                                                    </option>
                                                ))}
                                                {categories.length === 0 && (
                                                    <option value="0">General Academic Course</option>
                                                )}
                                            </select>
                                            {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small">
                                                Teaching Mode
                                            </label>
                                            <select
                                                className="form-select"
                                                value={data.teaching_mode}
                                                onChange={(e) => setData('teaching_mode', e.target.value)}
                                            >
                                                <option value="Both (Home & Online)">Both (Home &amp; Online Classes)</option>
                                                <option value="Home Tuition">Home Tuition (In-person)</option>
                                                <option value="Online Classes">Online Live 1-on-1 Classes</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* 3. Duration & Price with Real-Time 5% Commission Calculator */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-5">
                                            <label className="form-label fw-semibold text-secondary small">
                                                Duration / Schedule
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                                                placeholder="e.g. 3 Months (3 classes/week)"
                                                value={data.duration}
                                                onChange={(e) => setData('duration', e.target.value)}
                                            />
                                            {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                                        </div>

                                        <div className="col-md-7">
                                            <label className="form-label fw-semibold text-secondary small">
                                                Course Fee / Price (₹ INR) <span className="text-danger">*</span>
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light fw-bold">₹</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className={`form-control fw-bold fs-6 ${errors.price ? 'is-invalid' : ''}`}
                                                    placeholder="Enter fee of your choice (e.g. 1500)"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {errors.price && <div className="text-danger small mt-1">{errors.price}</div>}
                                        </div>
                                    </div>

                                    {/* 4. Live Commission Calculator Card */}
                                    <div className="card border-0 rounded-3 p-3 mb-3 bg-light border-start border-4 border-primary">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <span className="small fw-bold text-dark d-flex align-items-center gap-1">
                                                <i className="bi bi-calculator-fill text-primary"></i>
                                                Transparent 5% Commission Breakdown
                                            </span>
                                            <span className="badge bg-primary text-white rounded-pill px-2 py-1 small">
                                                5% Platform Fee Policy
                                            </span>
                                        </div>

                                        <div className="row g-2 text-center my-1">
                                            <div className="col-4">
                                                <div className="p-2 bg-white rounded-2 border">
                                                    <div className="text-muted small" style={{ fontSize: '11px' }}>Your Course Price</div>
                                                    <div className="fw-bold text-dark fs-6">
                                                        ₹{numericPrice > 0 ? numericPrice.toLocaleString('en-IN') : '0'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="p-2 bg-white rounded-2 border border-warning-subtle">
                                                    <div className="text-warning-emphasis small" style={{ fontSize: '11px' }}>
                                                        Platform Fee (5%)
                                                    </div>
                                                    <div className="fw-bold text-warning-emphasis fs-6">
                                                        ₹{commissionAmount > 0 ? commissionAmount.toLocaleString('en-IN') : '0'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="p-2 bg-success bg-opacity-10 rounded-2 border border-success-subtle">
                                                    <div className="text-success small fw-semibold" style={{ fontSize: '11px' }}>
                                                        Your Payout (95%)
                                                    </div>
                                                    <div className="fw-bold text-success fs-6">
                                                        ₹{teacherPayout > 0 ? teacherPayout.toLocaleString('en-IN') : '0'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-muted mb-0 mt-2" style={{ fontSize: '12px' }}>
                                            <i className="bi bi-info-circle me-1 text-primary"></i>
                                            <strong>Short Note:</strong> The Local Tutors charges a <strong>5% commission</strong> from the price you set to cover platform maintenance, verified tutor certification, and student inquiry coordination.
                                            {numericPrice > 0 ? (
                                                <span> For this course, you will take home <strong>₹{teacherPayout.toLocaleString('en-IN')}</strong> per student enrollment.</span>
                                            ) : (
                                                <span> (e.g., if you set ₹1,000, you will receive ₹950 and ₹50 will be the platform commission).</span>
                                            )}
                                        </p>
                                    </div>

                                    {/* 5. Description */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small">
                                            Course Description &amp; Syllabus Highlights
                                        </label>
                                        <textarea
                                            rows="4"
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            placeholder="Outline what students will learn, syllabus covered, study materials provided, and frequency of doubt classes..."
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        ></textarea>
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                    </div>

                                    {/* 6. YouTube URL & Thumbnail Image */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small">
                                                Preview Demo Video Link (YouTube)
                                            </label>
                                            <input
                                                type="url"
                                                className={`form-control ${errors.youtube_url ? 'is-invalid' : ''}`}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                value={data.youtube_url}
                                                onChange={(e) => setData('youtube_url', e.target.value)}
                                            />
                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                Optional: A 2–5 min introductory preview for students.
                                            </span>
                                            {errors.youtube_url && <div className="invalid-feedback">{errors.youtube_url}</div>}
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small">
                                                Course Thumbnail Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                                onChange={handleImageChange}
                                            />
                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                JPG, PNG, or WebP (max 3 MB).
                                            </span>
                                            {errors.image && <div className="text-danger small mt-1">{errors.image}</div>}

                                            {previewImage && (
                                                <div className="mt-2">
                                                    <img
                                                        src={previewImage}
                                                        alt="Thumbnail preview"
                                                        className="rounded-3 border object-fit-cover shadow-2xs"
                                                        style={{ width: '100px', height: '60px' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 7. Active Status */}
                                    <div className="form-check form-switch mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="courseActiveSwitch"
                                            checked={data.is_active === 1}
                                            onChange={(e) => setData('is_active', e.target.checked ? 1 : 0)}
                                        />
                                        <label className="form-check-label small fw-semibold text-dark" htmlFor="courseActiveSwitch">
                                            Publish course immediately on the website
                                        </label>
                                    </div>
                                </div>

                                <div className="modal-footer bg-light px-4 py-3 border-top d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary rounded-pill px-4"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn btn-primary-gradient rounded-pill px-4 fw-semibold shadow-xs"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check2-circle me-1"></i>
                                                {editingCourse ? 'Save Changes' : 'Publish Course'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </FrontLayout>
    );
}

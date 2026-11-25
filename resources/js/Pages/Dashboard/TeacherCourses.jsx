import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';
import RichTextEditor from '../../components/RichTextEditor';
import { cleanExcerpt } from '../../Utils/text';

export default function TeacherCourses({
    courses,
    enrolledStudents = [],
    categories = [],
    subjects = [],
    teacher,
    stats,
}) {
    const courseList = courses?.data || (Array.isArray(courses) ? courses : []);
    const enrollmentList = Array.isArray(enrolledStudents) ? enrolledStudents : [];

    const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'enrollments'
    const [enrollmentSearch, setEnrollmentSearch] = useState('');
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Form handling
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        price: '',
        price_type: 'one_time', // 'one_time' | 'per_month'
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
            price_type: 'one_time',
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
            price_type: course.price_type || 'one_time',
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

    const handleEnrollmentStatusChange = (enrollmentId, newStatus) => {
        setStatusUpdatingId(enrollmentId);
        router.post(
            `/dashboard/courses/enrollment/${enrollmentId}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onFinish: () => setStatusUpdatingId(null),
            }
        );
    };

    // Filter enrolled students by search query
    const filteredEnrollments = enrollmentList.filter((enr) => {
        if (!enrollmentSearch.trim()) return true;
        const q = enrollmentSearch.toLowerCase();
        const userName = (enr.user?.name || '').toLowerCase();
        const userEmail = (enr.user?.email || '').toLowerCase();
        const userPhone = (enr.user?.mobile || '').toLowerCase();
        const courseName = (enr.course?.name || '').toLowerCase();
        return userName.includes(q) || userEmail.includes(q) || userPhone.includes(q) || courseName.includes(q);
    });

    return (
        <FrontLayout>
            <Head>
                <title>Manage My Courses &amp; Students - The Local Tutors</title>
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
                            <h2 className="fw-bold text-dark mb-1">Courses &amp; Enrolled Students</h2>
                            <p className="text-secondary small mb-0">
                                Create and publish your courses, choose one-time or monthly pricing, and connect with your enrolled students directly.
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
                        <div
                            className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 cursor-pointer"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('enrollments')}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-info-subtle text-info rounded-circle fs-4">
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <div>
                                    <div className="fs-4 fw-bold text-dark">{enrollmentList.length}</div>
                                    <div className="text-muted small d-flex align-items-center gap-1">
                                        <span>Enrolled Students</span>
                                        <i className="bi bi-arrow-right-short text-info"></i>
                                    </div>
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

                {/* Tab Navigation: My Courses vs Enrolled Students */}
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('courses')}
                        className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
                            activeTab === 'courses'
                                ? 'btn-primary shadow-xs'
                                : 'btn-light text-secondary border'
                        }`}
                    >
                        <i className="bi bi-grid-fill"></i>
                        <span>My Courses ({courses?.total || courseList.length})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('enrollments')}
                        className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 position-relative ${
                            activeTab === 'enrollments'
                                ? 'btn-primary shadow-xs'
                                : 'btn-light text-secondary border'
                        }`}
                    >
                        <i className="bi bi-people-fill"></i>
                        <span>Enrolled Students</span>
                        <span className={`badge rounded-pill ${activeTab === 'enrollments' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                            {enrollmentList.length}
                        </span>
                    </button>
                </div>

                {/* ============================================================== */}
                {/* TAB 1: COURSES LIST                                            */}
                {/* ============================================================== */}
                {activeTab === 'courses' && (
                    <>
                        {/* Transparent Commission Information Note */}
                        <div className="card border-0 bg-primary-subtle text-dark rounded-4 p-4 mb-4 shadow-sm border-start border-4 border-primary">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div className="d-flex align-items-start gap-3">
                                    <div className="p-2 bg-primary text-white rounded-3 fs-4 mt-1 d-none d-sm-block">
                                        <i className="bi bi-shield-check"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1 text-primary-emphasis">
                                            <i className="bi bi-info-circle-fill me-1 text-primary"></i>Transparent Teacher Pricing &amp; Flexible Billing
                                        </h6>
                                        <p className="mb-0 small text-secondary">
                                            You can set course fees as either <strong>One-Time Complete Fee</strong> or <strong>Per Month Monthly Tuition</strong>.
                                            The Local Tutors deducts a <strong>flat 5% platform commission</strong> to power student lead delivery, verification, and support. <strong>95% of your set fee is your direct take-home earnings.</strong>
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
                                                <th>Price &amp; Billing</th>
                                                <th>Net Payout (95%)</th>
                                                <th>Status</th>
                                                <th className="text-end pe-4" style={{ minWidth: '160px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courseList.map((course) => {
                                                const cPrice = parseFloat(course.price) || 0;
                                                const cComm = Math.round((cPrice * 0.05) * 100) / 100;
                                                const cNet = Math.round((cPrice * 0.95) * 100) / 100;
                                                const isPerMonth = course.price_type === 'per_month';

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
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEnrollmentSearch(course.name);
                                                                        setActiveTab('enrollments');
                                                                    }}
                                                                    className="btn btn-link btn-sm p-0 text-decoration-none text-muted small"
                                                                >
                                                                    <i className="bi bi-people me-1 text-primary"></i>
                                                                    {course.enrollments_count || 0} enrolled
                                                                </button>
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
                                                            <div className="fw-bold text-dark fs-6">
                                                                ₹{cPrice.toLocaleString('en-IN')}
                                                                <span className="small text-muted fw-normal ms-1">
                                                                    {isPerMonth ? '/ month' : '(one-time)'}
                                                                </span>
                                                            </div>
                                                            <span className={`badge ${isPerMonth ? 'bg-info-subtle text-info-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'} rounded-pill`} style={{ fontSize: '11px' }}>
                                                                {isPerMonth ? 'Monthly' : 'One-Time'}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="fw-bold text-success fs-6">
                                                                ₹{cNet.toLocaleString('en-IN')}
                                                            </div>
                                                            <span className="text-muted small" style={{ fontSize: '11px' }}>
                                                                (5% fee: ₹{cComm})
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
                    </>
                )}

                {/* ============================================================== */}
                {/* TAB 2: ENROLLED STUDENTS LIST (Requirement #3)                  */}
                {/* ============================================================== */}
                {activeTab === 'enrollments' && (
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
                        <div className="card-header bg-white py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom">
                            <div>
                                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                    <i className="bi bi-people-fill text-primary"></i>
                                    Enrolled Students ({filteredEnrollments.length})
                                </h5>
                                <span className="text-secondary small">
                                    Direct inquiries and student enrollments for your listed courses
                                </span>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <div className="input-group input-group-sm" style={{ width: '260px' }}>
                                    <span className="input-group-text bg-light border-end-0">
                                        <i className="bi bi-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search student, course, mobile..."
                                        value={enrollmentSearch}
                                        onChange={(e) => setEnrollmentSearch(e.target.value)}
                                    />
                                    {enrollmentSearch && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => setEnrollmentSearch('')}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {filteredEnrollments.length === 0 ? (
                            <div className="text-center py-5 px-3">
                                <div className="p-3 bg-light rounded-circle d-inline-flex mb-3">
                                    <i className="bi bi-people fs-1 text-muted"></i>
                                </div>
                                <h5 className="fw-bold text-dark mb-1">
                                    {enrollmentSearch ? 'No Students Found Matching Search' : 'No Students Enrolled Yet'}
                                </h5>
                                <p className="text-secondary small mb-3" style={{ maxWidth: '460px', margin: '0 auto' }}>
                                    {enrollmentSearch
                                        ? 'Try clearing your search query to see all enrolled students.'
                                        : 'When students click "Instant Enroll" on any of your course pages, their contact details will appear here immediately and you will receive an instant email notification.'}
                                </p>
                                {enrollmentSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setEnrollmentSearch('')}
                                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light small text-uppercase text-secondary">
                                        <tr>
                                            <th className="ps-4">Student Details</th>
                                            <th>Enrolled Course</th>
                                            <th>Course Fee</th>
                                            <th>Enrollment Date</th>
                                            <th>Status</th>
                                            <th className="text-end pe-4" style={{ minWidth: '180px' }}>Contact Student</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEnrollments.map((enr) => {
                                            const student = enr.user || {};
                                            const course = enr.course || {};
                                            const rawPhone = student.mobile || '';
                                            const cleanPhone = rawPhone.replace(/\D/g, '');
                                            const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                                            const waMessage = encodeURIComponent(
                                                `Hello ${student.name || 'Student'}, thank you for enrolling in my course "${course.name || 'course'}" on The Local Tutors. I am reaching out to discuss your schedule and batch timings.`
                                            );
                                            const isUpdating = statusUpdatingId === enr.id;

                                            return (
                                                <tr key={enr.id}>
                                                    <td className="ps-4">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div
                                                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-2xs"
                                                                style={{ width: '42px', height: '42px', fontSize: '16px', flexShrink: 0 }}
                                                            >
                                                                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-dark">{student.name || 'Registered Student'}</div>
                                                                <div className="small text-muted">
                                                                    <i className="bi bi-envelope me-1"></i>
                                                                    <a href={`mailto:${student.email}`} className="text-secondary text-decoration-none">
                                                                        {student.email || 'N/A'}
                                                                    </a>
                                                                </div>
                                                                {rawPhone && (
                                                                    <div className="small text-muted">
                                                                        <i className="bi bi-telephone me-1 text-primary"></i>
                                                                        <a href={`tel:${rawPhone}`} className="text-secondary text-decoration-none">
                                                                            {rawPhone}
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="fw-semibold text-dark mb-1">
                                                            {course.name || 'Course'}
                                                        </div>
                                                        {course.id && (
                                                            <Link
                                                                href={`/course_details/${course.id}/${course.slug || 'course'}`}
                                                                target="_blank"
                                                                className="badge bg-light text-primary border text-decoration-none"
                                                            >
                                                                <i className="bi bi-box-arrow-up-right me-1"></i>View Course
                                                            </Link>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="fw-bold text-dark">
                                                            ₹{course.price ? Number(course.price).toLocaleString('en-IN') : '0'}
                                                        </div>
                                                        <span className="small text-muted">
                                                            {course.price_type === 'per_month' ? 'per month' : 'one-time'}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="small text-dark fw-medium">
                                                            {enr.created_at ? new Date(enr.created_at).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            }) : 'Recent'}
                                                        </div>
                                                        <div className="small text-muted" style={{ fontSize: '11px' }}>
                                                            {enr.created_at ? new Date(enr.created_at).toLocaleTimeString('en-IN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : ''}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <select
                                                            className={`form-select form-select-sm fw-semibold rounded-pill ${
                                                                enr.status === 'accepted'
                                                                    ? 'border-success text-success bg-success-subtle'
                                                                    : enr.status === 'completed'
                                                                    ? 'border-primary text-primary bg-primary-subtle'
                                                                    : enr.status === 'canceled'
                                                                    ? 'border-danger text-danger bg-danger-subtle'
                                                                    : 'border-warning text-warning-emphasis bg-warning-subtle'
                                                            }`}
                                                            style={{ width: '130px' }}
                                                            value={enr.status || 'pending'}
                                                            disabled={isUpdating}
                                                            onChange={(e) => handleEnrollmentStatusChange(enr.id, e.target.value)}
                                                        >
                                                            <option value="pending">⏳ Pending</option>
                                                            <option value="accepted">✓ Accepted</option>
                                                            <option value="completed">🎓 Completed</option>
                                                            <option value="canceled">✕ Canceled</option>
                                                        </select>
                                                    </td>

                                                    <td className="text-end pe-4">
                                                        <div className="d-flex align-items-center justify-content-end gap-1">
                                                            {cleanPhone ? (
                                                                <>
                                                                    <a
                                                                        href={`https://wa.me/${waNumber}?text=${waMessage}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-sm btn-success text-white rounded-pill px-2 py-1 shadow-2xs"
                                                                        title="Chat with student on WhatsApp"
                                                                    >
                                                                        <i className="bi bi-whatsapp me-1"></i>WhatsApp
                                                                    </a>
                                                                    <a
                                                                        href={`tel:${cleanPhone}`}
                                                                        className="btn btn-sm btn-outline-primary rounded-pill px-2 py-1 shadow-2xs"
                                                                        title="Call student"
                                                                    >
                                                                        <i className="bi bi-telephone-fill"></i>
                                                                    </a>
                                                                </>
                                                            ) : (
                                                                <a
                                                                    href={`mailto:${student.email}`}
                                                                    className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                                                                    title="Email student"
                                                                >
                                                                    <i className="bi bi-envelope-fill me-1"></i>Email
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
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

                                    {/* 3. Pricing Type & Price with Real-Time 5% Commission Calculator */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small d-block">
                                            Pricing Type <span className="text-danger">*</span>
                                        </label>
                                        <div className="row g-2">
                                            <div className="col-sm-6">
                                                <div
                                                    className={`card p-3 border-2 cursor-pointer h-100 ${
                                                        data.price_type === 'one_time'
                                                            ? 'border-primary bg-primary-subtle text-primary'
                                                            : 'border-light-subtle bg-white text-dark'
                                                    }`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setData('price_type', 'one_time')}
                                                >
                                                    <div className="form-check mb-0">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="price_type"
                                                            id="price_type_one_time"
                                                            checked={data.price_type === 'one_time'}
                                                            onChange={() => setData('price_type', 'one_time')}
                                                        />
                                                        <label className="form-check-label fw-bold cursor-pointer" htmlFor="price_type_one_time">
                                                            One-Time Course Fee
                                                        </label>
                                                        <div className="small text-secondary mt-1" style={{ fontSize: '11px' }}>
                                                            Fixed total fee charged for the complete course syllabus
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div
                                                    className={`card p-3 border-2 cursor-pointer h-100 ${
                                                        data.price_type === 'per_month'
                                                            ? 'border-primary bg-primary-subtle text-primary'
                                                            : 'border-light-subtle bg-white text-dark'
                                                    }`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setData('price_type', 'per_month')}
                                                >
                                                    <div className="form-check mb-0">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="price_type"
                                                            id="price_type_per_month"
                                                            checked={data.price_type === 'per_month'}
                                                            onChange={() => setData('price_type', 'per_month')}
                                                        />
                                                        <label className="form-check-label fw-bold cursor-pointer" htmlFor="price_type_per_month">
                                                            Per Month (Monthly Tuition)
                                                        </label>
                                                        <div className="small text-secondary mt-1" style={{ fontSize: '11px' }}>
                                                            Recurring monthly tuition fee per student per month
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration & Price Input */}
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
                                                {data.price_type === 'per_month' ? 'Monthly Tuition Fee (₹ / month)' : 'Total Course Fee (₹)'} <span className="text-danger">*</span>
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
                                                <span className="input-group-text bg-light text-muted small">
                                                    {data.price_type === 'per_month' ? '/ mo' : 'total'}
                                                </span>
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
                                                    <div className="text-muted small" style={{ fontSize: '11px' }}>
                                                        {data.price_type === 'per_month' ? 'Fee / Month' : 'Course Fee'}
                                                    </div>
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
                                            <strong>Policy:</strong> The Local Tutors charges only a <strong>5% platform fee</strong>.
                                            {numericPrice > 0 ? (
                                                <span> You will take home <strong>₹{teacherPayout.toLocaleString('en-IN')}</strong> {data.price_type === 'per_month' ? 'per month per student' : 'per student enrollment'}.</span>
                                            ) : (
                                                <span> (e.g., if you set ₹1,000, you will receive ₹950 and ₹50 will be the platform fee).</span>
                                            )}
                                        </p>
                                    </div>

                                    {/* 5. Description with WYSIWYG HTML Editor (Requirement #5) */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small d-flex align-items-center justify-content-between">
                                            <span>Course Description &amp; Syllabus Highlights</span>
                                            <span className="text-muted fw-normal" style={{ fontSize: '11px' }}>
                                                Rich HTML formatting supported
                                            </span>
                                        </label>
                                        <RichTextEditor
                                            value={data.description}
                                            onChange={(val) => setData('description', val)}
                                            placeholder="Outline what students will learn, syllabus covered, study materials provided, class schedules, and doubt-clearing sessions..."
                                            minHeight="220px"
                                        />
                                        {errors.description && <div className="text-danger small mt-1">{errors.description}</div>}
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

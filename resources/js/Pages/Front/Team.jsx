import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import { cleanExcerpt } from '../../Utils/text';
import TeacherCard from '../../Components/TeacherCard';
import TeacherProfileModal from '../../Components/TeacherProfileModal';
import axios from 'axios';

export default function Team({ teachers = [], selectedSubject = null, allSubjects = [] }) {
    const { auth } = usePage().props;
    const list = Array.isArray(teachers) ? teachers : [];
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalHtml, setModalHtml] = useState('');
    const [loading, setLoading] = useState(false);

    // Quick Inquiry Modal State
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [inquiryTeacher, setInquiryTeacher] = useState(null);
    const [inquiryForm, setInquiryForm] = useState({
        name: auth?.user?.name || '',
        phone: auth?.user?.mobile || '',
        email: auth?.user?.email || '',
        student_class: 'Class 9–10',
        course_subject: 'Mathematics & Science',
        learning_mode: 'Home Tuition',
        teacher_name: '',
        message: '',
    });
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState('');
    const [inquiryError, setInquiryError] = useState('');

    const handleViewTeacher = async (teacher) => {
        setSelectedTeacher(teacher);
        setLoading(true);
        setModalHtml('');
        try {
            const res = await axios.get(`/getTeamTeacherDetailsAjax/${teacher.user_id || teacher.id}`);
            if (res.data.status === 200 && res.data.teacher) {
                setSelectedTeacher((prev) => ({
                    ...(prev || {}),
                    ...res.data.teacher,
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenInquiry = (teacher) => {
        const u = teacher.user || {};
        const tName = teacher.name || u.name || 'Verified Educator';
        setInquiryTeacher(teacher);
        setInquiryForm({
            name: auth?.user?.name || '',
            phone: auth?.user?.mobile || '',
            email: auth?.user?.email || '',
            student_class: 'Class 9–10',
            course_subject: teacher.subject_names || 'Core Subjects',
            learning_mode: teacher.teaching_mode_name || 'Home Tuition / Online',
            teacher_name: tName,
            message: `Hello, I would like to request a demo or inquire about home/online tutoring with ${tName}.`,
        });
        setInquirySuccess('');
        setInquiryError('');
        setShowInquiryModal(true);
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setInquirySubmitting(true);
        setInquirySuccess('');
        setInquiryError('');

        try {
            const res = await axios.post('/contactpost', inquiryForm);
            if (res.data.status === 200) {
                setInquirySuccess(res.data.message || 'Trial inquiry sent! Our coordinator will contact you promptly.');
            } else {
                setInquiryError(res.data.message || 'Could not send inquiry.');
            }
        } catch (err) {
            setInquiryError('Failed to send inquiry. Please check your details and try again.');
        } finally {
            setInquirySubmitting(false);
        }
    };

    return (
        <FrontLayout>
            <Head>
                <title>Verified Home &amp; Online Teachers in Kolkata - The Local Tutors</title>
                <meta name="description" content="Meet verified, qualified teachers and mentors for CBSE, ICSE, and WBBSE boards across Kolkata. Explore tutor qualifications, subjects taught, and book trial classes." />
            </Head>

            {/* Breadcrumb banner */}
            <div className="bg-white border-bottom py-5 hero-wrapper">
                <div className="container text-center">
                    <span className="badge badge-soft-primary text-primary px-3 py-2 rounded-pill fw-semibold mb-3 d-inline-flex align-items-center gap-2 shadow-2xs">
                        <i className="bi bi-shield-check text-primary"></i>
                        <span>100% Background-Verified Educators</span>
                    </span>
                    <h1 className="fw-bold display-6 text-dark mb-2">
                        {selectedSubject ? `${selectedSubject.name} Tutors & Mentors` : 'Meet Our Expert Teachers & Mentors'}
                    </h1>
                    <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '640px' }}>
                        {selectedSubject
                            ? `Browse verified educators specialized in ${selectedSubject.name}. Book free trial classes or request home and online tuition.`
                            : 'Browse qualified home tutors and online educators across Kolkata and West Bengal. Specialized guidance in Mathematics, Science, Languages, Commerce, and Computer Skills.'}
                    </p>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0 small">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-secondary text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/subjects" className="text-secondary text-decoration-none">Subjects</Link>
                            </li>
                            {selectedSubject ? (
                                <>
                                    <li className="breadcrumb-item">
                                        <Link href="/team" className="text-secondary text-decoration-none">Teachers</Link>
                                    </li>
                                    <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">
                                        {selectedSubject.name}
                                    </li>
                                </>
                            ) : (
                                <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">Teachers</li>
                            )}
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5 flex-grow-1 d-flex flex-column">
                {/* Active Subject Filter Banner */}
                {selectedSubject && (
                    <div className="alert alert-primary bg-primary-subtle border-primary-subtle rounded-4 d-flex align-items-center justify-content-between p-3 mb-4 shadow-xs flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="badge bg-primary text-white rounded-pill px-3 py-1.5 fw-semibold shadow-2xs">
                                <i className="bi bi-funnel-fill me-1"></i>Active Subject Filter
                            </span>
                            <span className="fw-bold text-dark fs-6">
                                Showing educators for: <span className="text-primary">{selectedSubject.name}</span>
                            </span>
                            <span className="badge bg-white text-secondary border rounded-pill px-2.5 py-1">
                                {list.length} {list.length === 1 ? 'Teacher' : 'Teachers'} Found
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <Link
                                href="/subjects"
                                className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1.5 fw-semibold"
                            >
                                <i className="bi bi-grid me-1"></i>All Subjects
                            </Link>
                            <Link
                                href="/team"
                                className="btn btn-primary btn-sm rounded-pill px-3 py-1.5 fw-semibold shadow-xs"
                            >
                                <i className="bi bi-x-circle me-1"></i>Clear Filter
                            </Link>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-2 border-bottom">
                    <div>
                        <h3 className="fw-bold text-dark mb-1">
                            {selectedSubject ? `${selectedSubject.name} Educators` : 'Qualified Mentors Directory'}
                        </h3>
                        <p className="text-muted small mb-0">
                            {selectedSubject
                                ? `Showing background-verified tutors offering ${selectedSubject.name} classes`
                                : 'Showing verified teachers with direct trial class booking'}
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge badge-soft-success text-success px-3 py-2 rounded-pill small">
                            <i className="bi bi-geo-alt-fill me-1"></i>Covering Kolkata &amp; Suburbs
                        </span>
                    </div>
                </div>

                {list.length === 0 ? (
                    <div className="text-center py-5 my-auto bg-white rounded-4 border p-5">
                        <div className="rounded-circle bg-light d-inline-flex p-4 mb-3 shadow-xs">
                            <i className="bi bi-people fs-1 text-primary"></i>
                        </div>
                        <h4 className="fw-bold text-dark">
                            {selectedSubject ? `No Teachers Listed for ${selectedSubject.name} Yet` : 'No Teachers Listed At The Moment'}
                        </h4>
                        <p className="text-muted mx-auto mb-3" style={{ maxWidth: '420px' }}>
                            {selectedSubject
                                ? `We are currently onboarding verified tutors for ${selectedSubject.name}. You can explore other subjects or view all active tutors.`
                                : 'Our directory of verified local tutors is updating. Find teachers using our search on the homepage.'}
                        </p>
                        <div className="d-flex justify-content-center gap-2">
                            <Link href="/team" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-xs">
                                View All Teachers
                            </Link>
                            <Link href="/subjects" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold">
                                Browse Other Subjects
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {list.map((t) => (
                            <div key={t.id || t.user_id} className="col-12 col-md-6 col-lg-6 mb-2">
                                <TeacherCard
                                    teacher={t}
                                    isModal={false}
                                    onViewProfile={() => handleViewTeacher(t)}
                                    onBookTrial={() => handleOpenInquiry(t)}
                                    onExplore={() => handleOpenInquiry(t)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Profile Detail Modal */}
            <TeacherProfileModal
                isOpen={!!selectedTeacher}
                onClose={() => setSelectedTeacher(null)}
                teacher={selectedTeacher}
                onBookTrial={(t) => {
                    const target = t || selectedTeacher;
                    setSelectedTeacher(null);
                    handleOpenInquiry(target);
                }}
            />

            {/* Trial Inquiry Modal */}
            {showInquiryModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0">
                                <div>
                                    <span className="badge badge-soft-primary text-primary small px-2 py-1 rounded-pill mb-1">Trial Inquiry</span>
                                    <h5 className="modal-title fw-bold text-dark">Book Trial with {inquiryForm.teacher_name}</h5>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setShowInquiryModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                {inquirySuccess ? (
                                    <div className="p-4 text-center">
                                        <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-flex mb-3">
                                            <i className="bi bi-check2-circle fs-1"></i>
                                        </div>
                                        <h5 className="fw-bold text-dark">Inquiry Sent!</h5>
                                        <p className="text-secondary small mb-3">{inquirySuccess}</p>
                                        <button
                                            type="button"
                                            className="btn btn-primary-gradient btn-sm rounded-pill px-4"
                                            onClick={() => setShowInquiryModal(false)}
                                        >
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleInquirySubmit}>
                                        {inquiryError && <div className="alert alert-danger small py-2">{inquiryError}</div>}

                                        <div className="mb-2">
                                            <label className="form-label small fw-semibold">Parent / Student Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={inquiryForm.name}
                                                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="row g-2 mb-2">
                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold">Phone / WhatsApp *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control form-control-sm"
                                                    placeholder="10-digit number"
                                                    value={inquiryForm.phone}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold">Student Class / Level</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={inquiryForm.student_class}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, student_class: e.target.value })}
                                                >
                                                    <option value="Class 1–5">Class 1–5 (Primary)</option>
                                                    <option value="Class 6–8">Class 6–8 (Middle)</option>
                                                    <option value="Class 9–10">Class 9–10 (Board)</option>
                                                    <option value="Class 11–12">Class 11–12 (Higher Sec)</option>
                                                    <option value="College / Competitive">College / Competitive</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row g-2 mb-2">
                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold">Subject / Course</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={inquiryForm.course_subject}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, course_subject: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold">Preferred Mode</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={inquiryForm.learning_mode}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, learning_mode: e.target.value })}
                                                >
                                                    <option value="Home Tuition">Home Tuition (In-person)</option>
                                                    <option value="Interactive Online">Interactive 1-on-1 Online</option>
                                                    <option value="Either Mode">Either Mode</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold">Notes / Preferred Timings</label>
                                            <textarea
                                                rows="2"
                                                className="form-control form-control-sm"
                                                value={inquiryForm.message}
                                                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <div className="d-grid">
                                            <button
                                                type="submit"
                                                className="btn btn-primary-gradient py-2 fw-semibold"
                                                disabled={inquirySubmitting}
                                            >
                                                {inquirySubmitting ? 'Submitting...' : 'Request Trial Class'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FrontLayout>
    );
}

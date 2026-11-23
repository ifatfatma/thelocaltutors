import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import { cleanExcerpt } from '../../Utils/text';
import axios from 'axios';

export default function Team({ teachers = [] }) {
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
            if (res.data.status === 200) {
                setModalHtml(res.data.message);
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
                    <h1 className="fw-bold display-6 text-dark mb-2">Meet Our Expert Teachers &amp; Mentors</h1>
                    <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '640px' }}>
                        Browse qualified home tutors and online educators across Kolkata and West Bengal. Specialized guidance in Mathematics, Science, Languages, Commerce, and Computer Skills.
                    </p>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0 small">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-secondary text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">Teachers</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5 flex-grow-1 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-2 border-bottom">
                    <div>
                        <h3 className="fw-bold text-dark mb-1">Qualified Mentors Directory</h3>
                        <p className="text-muted small mb-0">Showing verified teachers with direct trial class booking</p>
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
                        <h4 className="fw-bold text-dark">No Teachers Listed At The Moment</h4>
                        <p className="text-muted mx-auto" style={{ maxWidth: '420px' }}>
                            Our directory of verified local tutors is updating. Find teachers using our search on the homepage.
                        </p>
                        <Link href="/" className="btn btn-primary-gradient rounded-pill px-4 py-2 mt-3 fw-semibold shadow-xs">Back to Home</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {list.map((t) => {
                            const u = t.user || {};
                            const tName = t.name || u.name || 'Verified Educator';
                            const experienceText = t.experience ? `${t.experience} Years Exp` : 'Experienced';
                            const qualification = t.qualification_name || 'Graduate Educator';
                            const subjects = t.subject_names || 'Mathematics, Science';
                            const boards = t.board_names || 'CBSE / ICSE / WBBSE';
                            const mode = t.teaching_mode_name || 'Home & Online Tuition';
                            const bio = cleanExcerpt(t.description, 85, 'Dedicated educator providing structured lesson plans and individual doubt resolution.');

                            return (
                                <div key={t.id} className="col-md-6 col-lg-4">
                                    <div className="card card-modern h-100 p-4 d-flex flex-column">
                                        <div className="d-flex align-items-start gap-3 mb-3">
                                            <div className="position-relative flex-shrink-0">
                                                <img
                                                    src={u.image ? `/user/${u.image}` : '/front/img/noprofileimage.png'}
                                                    onError={(e) => { e.currentTarget.src = '/front/img/noprofileimage.png'; }}
                                                    alt={`Profile photo of ${tName}`}
                                                    className="rounded-circle shadow-sm"
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                />
                                                <span
                                                    className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                                                    style={{ width: '14px', height: '14px' }}
                                                    title="Available for Tuition"
                                                />
                                            </div>

                                            <div className="flex-grow-1 min-w-0">
                                                <h5 className="fw-bold text-dark mb-1 text-truncate" title={tName}>
                                                    {tName}
                                                </h5>
                                                <div className="d-flex align-items-center gap-1 flex-wrap mb-1">
                                                    <span className="badge badge-soft-primary text-primary px-2 py-1 rounded-pill small" style={{ fontSize: '0.72rem' }}>
                                                        <i className="bi bi-patch-check-fill me-1"></i>Verified
                                                    </span>
                                                    <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill small" style={{ fontSize: '0.72rem' }}>
                                                        {experienceText}
                                                    </span>
                                                </div>
                                                <span className="text-muted small d-block text-truncate" style={{ fontSize: '0.82rem' }}>
                                                    <i className="bi bi-mortarboard me-1 text-primary"></i>{qualification}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Academic Details Pill Box */}
                                        <div className="bg-light rounded-3 p-3 mb-3 small flex-grow-1">
                                            <div className="mb-2">
                                                <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Subjects Taught:</span>
                                                <strong className="text-dark d-block text-truncate" title={subjects}>
                                                    {subjects}
                                                </strong>
                                            </div>
                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Boards:</span>
                                                    <span className="text-dark text-truncate d-block fw-medium">{boards}</span>
                                                </div>
                                                <div className="col-6">
                                                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Mode:</span>
                                                    <span className="text-dark text-truncate d-block fw-medium">{mode}</span>
                                                </div>
                                            </div>
                                            {t.address && (
                                                <div className="mt-2 pt-2 border-top text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                                                    <i className="bi bi-geo-alt text-danger me-1"></i>{t.address}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-secondary small mb-3">
                                            {bio}
                                        </p>

                                        {/* Action buttons */}
                                        <div className="d-flex gap-2 mt-auto pt-2">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenInquiry(t)}
                                                className="btn btn-primary-gradient btn-sm rounded-pill flex-grow-1 fw-semibold"
                                            >
                                                <i className="bi bi-calendar-check me-1"></i>Book Trial
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleViewTeacher(t)}
                                                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                                data-bs-toggle="modal"
                                                data-bs-target="#teamTeacherModal"
                                                title="View detailed qualifications"
                                            >
                                                Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Profile Detail Modal */}
            <div className="modal fade" id="teamTeacherModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 border-0 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold">Educator Qualifications &amp; Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status"></div>
                                </div>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: modalHtml || '<p class="text-muted">No details available.</p>' }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

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

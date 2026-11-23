import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

export default function Contact() {
    const { settings } = usePage().props;
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        student_class: 'Class 9–10',
        course_subject: 'Mathematics & Science',
        learning_mode: 'Home Tuition (In-person)',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            const res = await axios.post('/contactpost', form);
            if (res.data.status === 200) {
                setSuccessMsg(res.data.message || 'Your inquiry has been received! Our coordinator will contact you shortly.');
                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    student_class: 'Class 9–10',
                    course_subject: 'Mathematics & Science',
                    learning_mode: 'Home Tuition (In-person)',
                    message: '',
                });
            } else {
                setErrorMsg(res.data.message || 'Failed to submit inquiry.');
            }
        } catch (err) {
            setErrorMsg('An error occurred while submitting. Please call or WhatsApp us directly.');
        } finally {
            setLoading(false);
        }
    };

    const phoneNumber = settings?.mobile || '7003578764';
    const emailAddress = settings?.email || 'info@thelocaltutors.com';
    const officeAddress = settings?.address || '88/1 Shyambazar Street, Kolkata - 700004, West Bengal';

    return (
        <FrontLayout>
            <Head>
                <title>Contact &amp; Book Trial Class - The Local Tutors</title>
                <meta name="description" content="Inquire about verified home tutors and online batches in Kolkata. Contact our academic coordinator for free trial classes, fee structures, and customized study plans." />
            </Head>

            <div className="bg-white border-bottom py-5 hero-wrapper">
                <div className="container text-center">
                    <span className="badge badge-soft-primary text-primary px-3 py-2 rounded-pill fw-semibold mb-3 d-inline-flex align-items-center gap-2 shadow-2xs">
                        <i className="bi bi-chat-dots-fill text-primary"></i>
                        <span>Dedicated Academic Support</span>
                    </span>
                    <h1 className="fw-bold display-6 text-dark mb-2">Get in Touch &amp; Book a Trial</h1>
                    <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '640px' }}>
                        Need an experienced home tutor or online coaching? Fill out the quick inquiry form below or connect instantly with our Kolkata coordinator on WhatsApp.
                    </p>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0 small">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-secondary text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">Contact Us</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                <div className="row gy-5">
                    {/* Left: Contact Info & Local Trust Signals */}
                    <div className="col-lg-5">
                        <span className="badge badge-soft-success text-success fw-bold mb-2 px-3 py-1 rounded-pill small">
                            Local Support Helpline
                        </span>
                        <h2 className="fw-bold text-dark mb-3">Speak with Our Academic Coordinator</h2>
                        <p className="text-secondary mb-4">
                            We match your child with verified local educators tailored to their syllabus (CBSE, ICSE, WBBSE), learning pace, and neighborhood.
                        </p>

                        <div className="d-flex flex-column gap-3 mb-4">
                            <div className="d-flex align-items-start gap-3 p-3 bg-white rounded-3 border shadow-2xs">
                                <div className="p-2 bg-primary-subtle text-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                                    <i className="bi bi-telephone-fill"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Direct Call &amp; WhatsApp</h6>
                                    <a href={`tel:${phoneNumber}`} className="text-dark fw-semibold text-decoration-none d-block">
                                        +91 {phoneNumber}
                                    </a>
                                    <a
                                        href={`https://wa.me/91${phoneNumber}?text=Hello%20The%20Local%20Tutors,%20I%20would%20like%20to%20inquire%20about%20a%20tutor`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-success small fw-semibold text-decoration-none d-inline-flex align-items-center gap-1 mt-1"
                                    >
                                        <i className="bi bi-whatsapp"></i> Chat on WhatsApp (Fast response)
                                    </a>
                                </div>
                            </div>

                            <div className="d-flex align-items-start gap-3 p-3 bg-white rounded-3 border shadow-2xs">
                                <div className="p-2 bg-info-subtle text-info rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                                    <i className="bi bi-envelope-fill"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Official Email</h6>
                                    <a href={`mailto:${emailAddress}`} className="text-secondary small text-decoration-none">
                                        {emailAddress}
                                    </a>
                                </div>
                            </div>

                            <div className="d-flex align-items-start gap-3 p-3 bg-white rounded-3 border shadow-2xs">
                                <div className="p-2 bg-warning-subtle text-warning-emphasis rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                                    <i className="bi bi-geo-alt-fill"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Registered Address</h6>
                                    <p className="text-secondary small mb-0">{officeAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Pan-India Tutoring Coverage */}
                        <div className="p-4 bg-light rounded-4 border">
                            <h6 className="fw-bold text-dark mb-2">
                                <i className="bi bi-geo-alt-fill text-danger me-2"></i>Pan-India Tutoring Coverage
                            </h6>
                            <p className="text-secondary small mb-2">
                                Verified 1-on-1 home tutors and online mentors available across all Indian states and major cities:
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                {['All States & UTs', 'Delhi NCR', 'Mumbai', 'Kolkata', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Patna'].map((area) => (
                                    <span key={area} className="badge bg-white text-secondary border small px-2 py-1 rounded-pill">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Comprehensive Quick Inquiry Form */}
                    <div className="col-lg-7">
                        <div className="card card-modern p-4 p-md-5">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h4 className="fw-bold text-dark mb-0">Quick Inquiry &amp; Demo Request</h4>
                                <span className="badge badge-soft-success text-success small px-2 py-1 rounded-pill">
                                    Free Demo Class
                                </span>
                            </div>
                            <p className="text-secondary small mb-4">
                                Fill in the details below. Our academic team will analyze your requirements and recommend matched tutors within 2 hours.
                            </p>

                            {successMsg && (
                                <div className="alert alert-success d-flex align-items-center mb-4 rounded-3">
                                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                                    <div>{successMsg}</div>
                                </div>
                            )}

                            {errorMsg && (
                                <div className="alert alert-danger d-flex align-items-center mb-4 rounded-3">
                                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                                    <div>{errorMsg}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold">Parent / Student Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Ramesh Ghosh"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold">Phone / WhatsApp Number *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="10-digit mobile number"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold">Student Class / Grade *</label>
                                        <select
                                            className="form-select"
                                            value={form.student_class}
                                            onChange={(e) => setForm({ ...form, student_class: e.target.value })}
                                            required
                                        >
                                            <option value="Class 1–5">Class 1–5 (Primary Foundation)</option>
                                            <option value="Class 6–8">Class 6–8 (Middle School)</option>
                                            <option value="Class 9–10">Class 9–10 (CBSE / ICSE / WBBSE Board)</option>
                                            <option value="Class 11–12">Class 11–12 (Science / Commerce / Arts)</option>
                                            <option value="NEET / JEE">Competitive (NEET / JEE / Entrance)</option>
                                            <option value="Computer / Skill">Basic Computer / AI / Coding</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold">Preferred Learning Mode *</label>
                                        <select
                                            className="form-select"
                                            value={form.learning_mode}
                                            onChange={(e) => setForm({ ...form, learning_mode: e.target.value })}
                                            required
                                        >
                                            <option value="Home Tuition (In-person)">1-on-1 Home Tuition (At Doorstep)</option>
                                            <option value="Interactive 1-on-1 Online">Interactive 1-on-1 Online</option>
                                            <option value="Small Batch Online">Small Batch Group</option>
                                            <option value="Either Mode">Either Mode Suitable</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-semibold">Subjects / Courses Required *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. TIF Core Mathematics, Class 10 Science, Artificial Intelligence, Spoken English"
                                            value={form.course_subject}
                                            onChange={(e) => setForm({ ...form, course_subject: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-semibold">Email Address (Optional)</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="name@email.com (optional)"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-semibold">City, State, Locality &amp; Specific Requirements</label>
                                        <textarea
                                            rows="3"
                                            className="form-control"
                                            placeholder="Mention your City, State, Pin Code, Locality, preferred schedule (morning/evening), or specific weak areas."
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary-gradient px-4 py-2 fw-semibold w-100"
                                            disabled={loading}
                                        >
                                            {loading ? 'Submitting Inquiry...' : 'Submit Inquiry & Request Free Trial'}
                                        </button>
                                        <p className="text-muted small text-center mt-2 mb-0">
                                            <i className="bi bi-shield-lock me-1"></i>Your information is private and never shared with third parties.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

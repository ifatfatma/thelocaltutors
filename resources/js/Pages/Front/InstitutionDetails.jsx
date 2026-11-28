import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

export default function InstitutionDetails({ institution }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('overview');
    const details = institution?.details || {};
    const facilities = Array.isArray(institution?.facilities) ? institution.facilities : [];
    const programs = Array.isArray(institution?.programs) ? institution.programs : [];
    const galleries = Array.isArray(institution?.galleries) ? institution.galleries : [];

    // Student Inquiry Form State
    const [inquiry, setInquiry] = useState({
        student_name: auth?.user?.name || '',
        student_email: auth?.user?.email || '',
        student_phone: auth?.user?.mobile || '',
        program_interest: programs[0]?.title || '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [inquiryStatus, setInquiryStatus] = useState({ type: '', text: '' });

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setInquiryStatus({ type: '', text: '' });

        try {
            const res = await axios.post(`/institutions/${institution.id}/inquiry`, inquiry);
            setInquiryStatus({
                type: 'success',
                text: res.data?.message || 'Inquiry sent successfully! The institution will reach out soon.',
            });
            setInquiry((prev) => ({ ...prev, message: '' }));
        } catch (err) {
            setInquiryStatus({
                type: 'danger',
                text: err.response?.data?.message || 'Could not submit inquiry. Please check your phone & name.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const hasMapCoords = Boolean(institution.latitude && institution.longitude);
    const fullLocation = [institution.address, institution.city, institution.state, institution.pincode]
        .filter(Boolean)
        .join(', ');

    return (
        <FrontLayout>
            <Head title={`${institution.name} (${institution.type_label}) - The Local Tutors`} />

            {/* Hero Cover Banner */}
            <div
                className="position-relative text-white py-5"
                style={{
                    background: institution.cover_image
                        ? `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.85)), url(${institution.cover_image}) center/cover no-repeat`
                        : 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
                }}
            >
                <div className="container">
                    <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
                        <div
                            className="bg-white rounded-4 p-2 shadow d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: '92px', height: '92px' }}
                        >
                            {institution.logo ? (
                                <img src={institution.logo} alt={institution.name} className="w-100 h-100" style={{ objectFit: 'contain' }} />
                            ) : (
                                <i className="bi bi-building text-primary display-5"></i>
                            )}
                        </div>

                        <div className="flex-grow-1">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                <span className="badge bg-primary text-white rounded-pill px-3 py-1">{institution.type_label}</span>
                                {institution.verified_badge && (
                                    <span className="badge bg-info text-white rounded-pill px-3 py-1">
                                        <i className="bi bi-patch-check-fill me-1"></i>Verified Institution
                                    </span>
                                )}
                                <span
                                    className={`badge rounded-pill px-3 py-1 ${
                                        institution.admission_status === 'open'
                                            ? 'bg-success'
                                            : institution.admission_status === 'upcoming'
                                            ? 'bg-warning text-dark'
                                            : 'bg-secondary'
                                    }`}
                                >
                                    Admissions: {(institution.admission_status || 'open').toUpperCase()}
                                </span>
                                {institution.established_year && (
                                    <span className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-1">
                                        Est. {institution.established_year}
                                    </span>
                                )}
                            </div>

                            <h1 className="fw-bold text-white mb-1">{institution.name}</h1>
                            {institution.tagline && <p className="text-white-50 mb-2">{institution.tagline}</p>}

                            {fullLocation && (
                                <div className="small text-white-50">
                                    <i className="bi bi-geo-alt-fill text-warning me-1"></i>
                                    {fullLocation}
                                </div>
                            )}
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                            {institution.brochure_pdf && (
                                <a
                                    href={institution.brochure_pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-light rounded-pill px-3 fw-semibold"
                                >
                                    <i className="bi bi-file-earmark-pdf-fill text-danger me-1"></i>Brochure PDF
                                </a>
                            )}
                            {institution.website && (
                                <a
                                    href={institution.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-light rounded-pill px-3"
                                >
                                    <i className="bi bi-globe me-1"></i>Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabbed Content + Sticky Inquiry Form */}
            <div className="container py-5">
                <div className="row g-4">
                    {/* Left 8 Columns: Tabs */}
                    <div className="col-lg-8">
                        <ul className="nav nav-pills bg-white p-2 rounded-4 shadow-sm mb-4 gap-1 flex-wrap">
                            {[
                                { id: 'overview', label: 'Overview', icon: 'bi-info-circle' },
                                { id: 'programs', label: `Programs & Fees (${programs.length})`, icon: 'bi-journal-bookmark' },
                                { id: 'facilities', label: `Facilities (${facilities.length})`, icon: 'bi-stars' },
                                { id: 'admission', label: 'Admission & Contact', icon: 'bi-telephone' },
                                { id: 'gallery', label: `Gallery (${galleries.length})`, icon: 'bi-images' },
                                { id: 'map', label: 'Map Location', icon: 'bi-geo-alt' },
                            ].map((tab) => (
                                <li className="nav-item" key={tab.id}>
                                    <button
                                        type="button"
                                        className={`nav-link btn-sm rounded-pill px-3 fw-semibold ${
                                            activeTab === tab.id ? 'active' : 'text-secondary'
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <i className={`bi ${tab.icon} me-1`}></i>
                                        {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            {/* TAB 1: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div>
                                    <h4 className="fw-bold text-dark mb-3">About {institution.name}</h4>
                                    {institution.overview ? (
                                        <div
                                            className="text-secondary lh-lg mb-4"
                                            dangerouslySetInnerHTML={{ __html: institution.overview }}
                                        />
                                    ) : (
                                        <p className="text-muted mb-4">Detailed overview coming soon.</p>
                                    )}

                                    {/* Key Category Facts Grid */}
                                    <h5 className="fw-bold text-dark border-top pt-4 mb-3">Key Institutional Highlights</h5>
                                    <div className="row g-3">
                                        {institution.ownership_type && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Ownership</div>
                                                    <div className="fw-bold text-dark">{institution.ownership_type}</div>
                                                </div>
                                            </div>
                                        )}
                                        {institution.fee_range && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Fee Range</div>
                                                    <div className="fw-bold text-success">{institution.fee_range}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Coaching specific */}
                                        {details.target_exams?.length > 0 && (
                                            <div className="col-12">
                                                <div className="p-3 bg-light rounded-3 border">
                                                    <div className="small text-muted mb-1">Target Exams &amp; Categories</div>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {details.target_exams.map((ex, i) => (
                                                            <span key={i} className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1">{ex}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {details.batch_modes?.length > 0 && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Batch Modes</div>
                                                    <div className="fw-bold text-dark">{details.batch_modes.join(', ')}</div>
                                                </div>
                                            </div>
                                        )}
                                        {details.batch_timings && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Batch Timings</div>
                                                    <div className="fw-bold text-dark">{details.batch_timings}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* School specific */}
                                        {details.affiliated_board && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Affiliated Board</div>
                                                    <div className="fw-bold text-dark">{details.affiliated_board}</div>
                                                </div>
                                            </div>
                                        )}
                                        {details.grade_range && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Grade Levels</div>
                                                    <div className="fw-bold text-dark">{details.grade_range}</div>
                                                </div>
                                            </div>
                                        )}
                                        {details.medium && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Medium</div>
                                                    <div className="fw-bold text-dark">{details.medium}</div>
                                                </div>
                                            </div>
                                        )}
                                        {(details.school_gender_type || details.school_residential_type) && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">School Type</div>
                                                    <div className="fw-bold text-dark">
                                                        {[details.school_gender_type, details.school_residential_type].filter(Boolean).join(' • ')}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* College & University specific */}
                                        {details.affiliated_university && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Affiliated University</div>
                                                    <div className="fw-bold text-dark">{details.affiliated_university}</div>
                                                </div>
                                            </div>
                                        )}
                                        {details.accreditation && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Accreditation</div>
                                                    <div className="fw-bold text-dark">{details.accreditation}</div>
                                                </div>
                                            </div>
                                        )}
                                        {details.university_type && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">University Type</div>
                                                    <div className="fw-bold text-dark">{details.university_type}</div>
                                                </div>
                                            </div>
                                        )}
                                        {details.nirf_ranking && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Rankings</div>
                                                    <div className="fw-bold text-dark">{details.nirf_ranking}</div>
                                                </div>
                                            </div>
                                        )}
                                        {details.campus_area && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Campus Area</div>
                                                    <div className="fw-bold text-dark">{details.campus_area}</div>
                                                </div>
                                            </div>
                                        )}
                                        {(details.average_package || details.highest_package) && (
                                            <div className="col-sm-6">
                                                <div className="p-3 bg-light rounded-3 border h-100">
                                                    <div className="small text-muted">Placement Packages</div>
                                                    <div className="fw-bold text-success">
                                                        {details.average_package && `Avg: ${details.average_package}`}
                                                        {details.average_package && details.highest_package && ' | '}
                                                        {details.highest_package && `Highest: ${details.highest_package}`}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Rich Extra Blocks */}
                                    {details.past_results && (
                                        <div className="mt-4 pt-3 border-top">
                                            <h5 className="fw-bold text-dark mb-2">Past Results &amp; Rank Highlights</h5>
                                            <div className="text-secondary" dangerouslySetInnerHTML={{ __html: details.past_results }} />
                                        </div>
                                    )}
                                    {details.placement_highlights && (
                                        <div className="mt-4 pt-3 border-top">
                                            <h5 className="fw-bold text-dark mb-2">Placement Highlights</h5>
                                            <div className="text-secondary" dangerouslySetInnerHTML={{ __html: details.placement_highlights }} />
                                        </div>
                                    )}
                                    {details.scholarships && (
                                        <div className="mt-4 pt-3 border-top">
                                            <h5 className="fw-bold text-dark mb-2">Scholarships &amp; Aid</h5>
                                            <div className="text-secondary" dangerouslySetInnerHTML={{ __html: details.scholarships }} />
                                        </div>
                                    )}
                                    {details.placement_stats && (
                                        <div className="mt-4 pt-3 border-top">
                                            <h5 className="fw-bold text-dark mb-2">Placement Stats &amp; Research</h5>
                                            <div className="text-secondary" dangerouslySetInnerHTML={{ __html: details.placement_stats }} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: PROGRAMS & FEES */}
                            {activeTab === 'programs' && (
                                <div>
                                    <h4 className="fw-bold text-dark mb-3">Courses, Programs &amp; Fee Structure</h4>
                                    {programs.length === 0 ? (
                                        <p className="text-muted">No individual programs listed yet. Contact the institution using the inquiry form for detailed fee structures.</p>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {programs.map((p) => (
                                                <div key={p.id} className="p-3 bg-light rounded-4 border">
                                                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                                                        <div>
                                                            <h6 className="fw-bold text-dark mb-1">{p.title}</h6>
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {p.level && <span className="badge bg-primary-subtle text-primary rounded-pill">{p.level}</span>}
                                                                {p.duration && <span className="badge bg-light text-dark border rounded-pill">{p.duration}</span>}
                                                                {p.mode && <span className="badge bg-info-subtle text-info-emphasis rounded-pill">{p.mode}</span>}
                                                                {p.seat_intake && <span className="badge bg-warning-subtle text-dark rounded-pill">Intake: {p.seat_intake}</span>}
                                                            </div>
                                                        </div>
                                                        {p.fee_amount && (
                                                            <div className="fw-bold text-success fs-6">{p.fee_amount}</div>
                                                        )}
                                                    </div>
                                                    {p.eligibility && (
                                                        <div className="small text-secondary mt-1">
                                                            <strong>Eligibility:</strong> {p.eligibility}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: FACILITIES */}
                            {activeTab === 'facilities' && (
                                <div>
                                    <h4 className="fw-bold text-dark mb-3">Campus Facilities &amp; Infrastructure</h4>
                                    {facilities.length === 0 ? (
                                        <p className="text-muted">No facilities listed yet.</p>
                                    ) : (
                                        <div className="row g-2">
                                            {facilities.map((fac, idx) => (
                                                <div key={idx} className="col-6 col-md-4">
                                                    <div className="p-3 bg-light rounded-3 border d-flex align-items-center gap-2 fw-semibold small text-dark">
                                                        <i className="bi bi-check-circle-fill text-success"></i>
                                                        <span>{fac}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: ADMISSION & CONTACT */}
                            {activeTab === 'admission' && (
                                <div>
                                    <h4 className="fw-bold text-dark mb-3">Admission Process &amp; Official Contact</h4>
                                    {institution.admission_process ? (
                                        <div
                                            className="text-secondary lh-lg mb-4"
                                            dangerouslySetInnerHTML={{ __html: institution.admission_process }}
                                        />
                                    ) : (
                                        <p className="text-muted mb-4">Submit an inquiry using the form on the right to receive complete admission dates and counseling details.</p>
                                    )}

                                    <div className="row g-3 border-top pt-3">
                                        {institution.phone && (
                                            <div className="col-sm-6">
                                                <div className="small text-muted">Phone</div>
                                                <a href={`tel:${institution.phone}`} className="fw-bold text-decoration-none">{institution.phone}</a>
                                            </div>
                                        )}
                                        {institution.email && (
                                            <div className="col-sm-6">
                                                <div className="small text-muted">Email</div>
                                                <a href={`mailto:${institution.email}`} className="fw-bold text-decoration-none">{institution.email}</a>
                                            </div>
                                        )}
                                        {fullLocation && (
                                            <div className="col-12">
                                                <div className="small text-muted">Campus Address</div>
                                                <div className="fw-semibold text-dark">{fullLocation}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: CAMPUS GALLERY */}
                            {activeTab === 'gallery' && (
                                <div>
                                    <h4 className="fw-bold text-dark mb-3">Campus Gallery</h4>
                                    {galleries.length === 0 ? (
                                        <p className="text-muted">No campus photos uploaded yet.</p>
                                    ) : (
                                        <div className="row g-3">
                                            {galleries.map((photo) => (
                                                <div key={photo.id} className="col-6 col-md-4">
                                                    <div className="card border rounded-3 overflow-hidden h-100">
                                                        <img src={photo.image_path} alt={photo.caption || 'Campus'} style={{ height: '160px', objectFit: 'cover' }} />
                                                        {(photo.caption || photo.category) && (
                                                            <div className="p-2 small text-muted">
                                                                <span className="badge bg-light text-dark border me-1">{photo.category}</span>
                                                                {photo.caption}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 6: MAP LOCATION */}
                            {activeTab === 'map' && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                        <h4 className="fw-bold text-dark mb-0">Campus Location on Map</h4>
                                        {hasMapCoords && (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${institution.latitude},${institution.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                            >
                                                <i className="bi bi-geo-alt-fill me-1"></i>Open in Google Maps
                                            </a>
                                        )}
                                    </div>
                                    {hasMapCoords ? (
                                        <iframe
                                            title="Campus Map"
                                            width="100%"
                                            height="360"
                                            className="rounded-4 border"
                                            loading="lazy"
                                            src={`https://maps.google.com/maps?q=${institution.latitude},${institution.longitude}&z=16&output=embed`}
                                        />
                                    ) : (
                                        <p className="text-muted">Exact map coordinates have not been pinned yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right 4 Columns: Sticky Admission Inquiry / Callback Form */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
                            <h5 className="fw-bold text-dark mb-1">
                                <i className="bi bi-envelope-paper-fill text-primary me-2"></i>
                                Request Admission Info
                            </h5>
                            <p className="text-muted small mb-3">
                                Get fee structure, brochure, and a direct callback from <strong>{institution.name}</strong>.
                            </p>

                            {inquiryStatus.text && (
                                <div className={`alert alert-${inquiryStatus.type} py-2 px-3 small rounded-3`}>
                                    {inquiryStatus.text}
                                </div>
                            )}

                            <form onSubmit={handleInquirySubmit}>
                                <div className="mb-2">
                                    <label className="form-label small fw-semibold">Student / Parent Name *</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={inquiry.student_name}
                                        onChange={(e) => setInquiry({ ...inquiry, student_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-semibold">Phone Number *</label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-sm"
                                        placeholder="10-digit mobile number"
                                        value={inquiry.student_phone}
                                        onChange={(e) => setInquiry({ ...inquiry, student_phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-sm"
                                        value={inquiry.student_email}
                                        onChange={(e) => setInquiry({ ...inquiry, student_email: e.target.value })}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label small fw-semibold">Program / Class Interested In</label>
                                    {programs.length > 0 ? (
                                        <select
                                            className="form-select form-select-sm"
                                            value={inquiry.program_interest}
                                            onChange={(e) => setInquiry({ ...inquiry, program_interest: e.target.value })}
                                        >
                                            {programs.map((p) => (
                                                <option key={p.id} value={p.title}>{p.title}</option>
                                            ))}
                                            <option value="General Admission Inquiry">General Admission Inquiry</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="e.g. Class 11 Science / B.Tech / NEET Batch"
                                            value={inquiry.program_interest}
                                            onChange={(e) => setInquiry({ ...inquiry, program_interest: e.target.value })}
                                        />
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Message / Questions</label>
                                    <textarea
                                        rows="3"
                                        className="form-control form-control-sm"
                                        placeholder="Ask about fees, timings, hostel, or scholarships..."
                                        value={inquiry.message}
                                        onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary-gradient w-100 rounded-pill py-2 fw-semibold" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Request Free Callback'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

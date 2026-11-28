import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import InstitutionFormFields from '../../Components/InstitutionFormFields';

export default function InstitutionDashboard({ institution, stats = {} }) {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'gallery' | 'inquiries'
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        institution_type: institution?.institution_type || 'coaching_institute',
        name: institution?.name || '',
        tagline: institution?.tagline || '',
        established_year: institution?.established_year || '',
        ownership_type: institution?.ownership_type || '',
        phone: institution?.phone || '',
        whatsapp: institution?.whatsapp || '',
        email: institution?.email || '',
        website: institution?.website || '',
        admission_status: institution?.admission_status || 'open',
        admission_process: institution?.admission_process || '',
        fee_range: institution?.fee_range || '',
        overview: institution?.overview || '',
        address: institution?.address || '',
        area: institution?.area || '',
        city: institution?.city || '',
        district: institution?.district || '',
        state: institution?.state || '',
        pincode: institution?.pincode || '',
        latitude: institution?.latitude || '',
        longitude: institution?.longitude || '',
        logo: institution?.logo || '',
        cover_image: institution?.cover_image || '',
        brochure_pdf: institution?.brochure_pdf || '',
        facilities: institution?.facilities || [],
        details: institution?.details || {},
        programs: institution?.programs || [],
    });

    const [files, setFiles] = useState({ logo: null, cover_image: null, brochure_pdf: null });
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryCaption, setGalleryCaption] = useState('');
    const [galleryCategory, setGalleryCategory] = useState('Campus');

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setSaving(true);

        const fd = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (['logo', 'cover_image', 'brochure_pdf'].includes(key)) return;
            if (['facilities', 'details', 'programs'].includes(key)) {
                fd.append(key, JSON.stringify(val));
            } else {
                fd.append(key, val ?? '');
            }
        });
        if (files.logo) fd.append('logo', files.logo);
        if (files.cover_image) fd.append('cover_image', files.cover_image);
        if (files.brochure_pdf) fd.append('brochure_pdf', files.brochure_pdf);

        router.post('/dashboard/institution/profile', fd, {
            forceFormData: true,
            onFinish: () => setSaving(false),
        });
    };

    const handleGalleryUpload = (e) => {
        e.preventDefault();
        if (!galleryFiles.length) return;
        const fd = new FormData();
        Array.from(galleryFiles).forEach((f) => fd.append('gallery_images[]', f));
        fd.append('caption', galleryCaption);
        fd.append('category', galleryCategory);

        router.post('/dashboard/institution/gallery', fd, {
            forceFormData: true,
            onSuccess: () => {
                setGalleryFiles([]);
                setGalleryCaption('');
            },
        });
    };

    const handleDeleteGallery = (id) => {
        if (!confirm('Remove this photo from campus gallery?')) return;
        router.delete(`/dashboard/institution/gallery/${id}`);
    };

    const handleInquiryStatus = (id, status) => {
        router.post(`/dashboard/institution/inquiries/${id}/status`, { status });
    };

    const statusBadge = {
        approved: { bg: 'bg-success', label: 'Approved & Live' },
        pending: { bg: 'bg-warning text-dark', label: 'Pending Admin Approval' },
        rejected: { bg: 'bg-danger', label: 'Rejected — Needs Updates' },
    }[institution?.verification_status || 'pending'];

    return (
        <FrontLayout>
            <Head title={`${institution?.name || 'Institution'} - Institution Dashboard`} />

            {/* Header Banner */}
            <div className="bg-primary text-white py-4">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                            {institution?.logo ? (
                                <img
                                    src={institution.logo}
                                    alt={institution.name}
                                    className="rounded-3 bg-white p-1 shadow-sm"
                                    style={{ width: '58px', height: '58px', objectFit: 'contain' }}
                                />
                            ) : (
                                <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fs-3" style={{ width: '58px', height: '58px' }}>
                                    <i className="bi bi-building"></i>
                                </div>
                            )}
                            <div>
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                    <span className="badge bg-white text-primary text-uppercase">{institution?.type_label}</span>
                                    <span className={`badge ${statusBadge.bg}`}>{statusBadge.label}</span>
                                    {institution?.verified_badge && (
                                        <span className="badge bg-info text-white">
                                            <i className="bi bi-patch-check-fill me-1"></i>Verified
                                        </span>
                                    )}
                                </div>
                                <h3 className="fw-bold text-white mb-0">{institution?.name}</h3>
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            {institution?.verification_status === 'approved' && institution?.is_active && (
                                <Link
                                    href={`/institutions/${institution.slug}`}
                                    className="btn btn-light btn-sm rounded-pill px-3 fw-semibold"
                                >
                                    <i className="bi bi-box-arrow-up-right me-1"></i>View Public Profile
                                </Link>
                            )}
                            <Link href="/dashboard" className="btn btn-outline-light btn-sm rounded-pill px-3">
                                <i className="bi bi-arrow-left me-1"></i>Account Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                {/* Pending / Rejected Notice */}
                {institution?.verification_status !== 'approved' && (
                    <div className={`alert ${institution?.verification_status === 'rejected' ? 'alert-danger' : 'alert-warning'} rounded-4 d-flex align-items-center gap-3 mb-4`}>
                        <i className="bi bi-info-circle-fill fs-4 flex-shrink-0"></i>
                        <div className="small">
                            <strong>
                                {institution?.verification_status === 'rejected'
                                    ? 'Your listing requires updates before approval.'
                                    : 'Your institution listing is awaiting Admin verification.'}
                            </strong>{' '}
                            Complete your profile, programs, facilities, and map location below. Once approved by our team, your institution will go live in public search results.
                            {institution?.admin_notes && <div className="mt-1 fw-semibold">Admin Note: {institution.admin_notes}</div>}
                        </div>
                    </div>
                )}

                {/* Summary Stat Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                            <div className="small text-muted">Programs / Courses</div>
                            <div className="fs-3 fw-bold text-primary">{stats.programs_count || 0}</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                            <div className="small text-muted">Campus Photos</div>
                            <div className="fs-3 fw-bold text-info">{stats.galleries_count || 0}</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                            <div className="small text-muted">Total Inquiries</div>
                            <div className="fs-3 fw-bold text-success">{stats.inquiries_total || 0}</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                            <div className="small text-muted">New Inquiries</div>
                            <div className="fs-3 fw-bold text-danger">{stats.inquiries_new || 0}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <ul className="nav nav-pills bg-white p-2 rounded-4 shadow-sm mb-4 gap-2">
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'profile' ? 'active' : 'text-secondary'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <i className="bi bi-building-gear me-2"></i>Profile, Programs &amp; Map
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'gallery' ? 'active' : 'text-secondary'}`}
                            onClick={() => setActiveTab('gallery')}
                        >
                            <i className="bi bi-images me-2"></i>Campus Gallery ({institution?.galleries?.length || 0})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            type="button"
                            className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'inquiries' ? 'active' : 'text-secondary'}`}
                            onClick={() => setActiveTab('inquiries')}
                        >
                            <i className="bi bi-envelope-paper me-2"></i>Admission Inquiries ({institution?.inquiries?.length || 0})
                        </button>
                    </li>
                </ul>

                {/* TAB 1: PROFILE & PROGRAMS */}
                {activeTab === 'profile' && (
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                        <form onSubmit={handleProfileSubmit}>
                            <InstitutionFormFields
                                form={form}
                                setForm={setForm}
                                files={files}
                                setFiles={setFiles}
                                isAdmin={false}
                                allowTypeChange={true}
                            />
                            <div className="pt-3 border-top d-flex gap-2">
                                <button type="submit" className="btn btn-primary-gradient rounded-pill px-5 py-2 fw-semibold" disabled={saving}>
                                    {saving ? 'Saving Changes...' : 'Save Institution Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 2: CAMPUS GALLERY */}
                {activeTab === 'gallery' && (
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">Upload Campus Photos</h5>
                        <form onSubmit={handleGalleryUpload} className="row g-3 mb-4 p-3 bg-light rounded-4 border">
                            <div className="col-md-5">
                                <label className="form-label small fw-semibold">Select Image(s) *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="form-control form-control-sm"
                                    onChange={(e) => setGalleryFiles(e.target.files)}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small fw-semibold">Category</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={galleryCategory}
                                    onChange={(e) => setGalleryCategory(e.target.value)}
                                >
                                    <option value="Campus">Campus</option>
                                    <option value="Classroom">Classroom</option>
                                    <option value="Lab">Lab</option>
                                    <option value="Library">Library</option>
                                    <option value="Hostel">Hostel</option>
                                    <option value="Events">Events</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-semibold">Caption (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="e.g. Main Science Lab"
                                    value={galleryCaption}
                                    onChange={(e) => setGalleryCaption(e.target.value)}
                                />
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold">
                                    <i className="bi bi-cloud-upload me-1"></i>Upload Photos
                                </button>
                            </div>
                        </form>

                        {!institution?.galleries?.length ? (
                            <p className="text-muted text-center py-4 mb-0">No campus photos uploaded yet.</p>
                        ) : (
                            <div className="row g-3">
                                {institution.galleries.map((photo) => (
                                    <div key={photo.id} className="col-6 col-md-4 col-lg-3">
                                        <div className="card h-100 border rounded-3 overflow-hidden">
                                            <img src={photo.image_path} alt={photo.caption || 'Campus'} style={{ height: '150px', objectFit: 'cover' }} />
                                            <div className="p-2 d-flex justify-content-between align-items-center">
                                                <div className="small text-truncate">
                                                    <span className="badge bg-light text-dark border me-1">{photo.category}</span>
                                                    {photo.caption}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGallery(photo.id)}
                                                    className="btn btn-sm btn-outline-danger border-0 py-0 px-1"
                                                    title="Delete"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: STUDENT ADMISSION INQUIRIES */}
                {activeTab === 'inquiries' && (
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">Student Admission Inquiries &amp; Callback Requests</h5>
                        {!institution?.inquiries?.length ? (
                            <p className="text-muted text-center py-4 mb-0">No student inquiries received yet.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Student</th>
                                            <th>Contact</th>
                                            <th>Program Interest</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {institution.inquiries.map((inq) => (
                                            <tr key={inq.id}>
                                                <td className="fw-semibold">{inq.student_name}</td>
                                                <td className="small">
                                                    <div><i className="bi bi-telephone me-1 text-primary"></i>{inq.student_phone}</div>
                                                    {inq.student_email && <div className="text-muted">{inq.student_email}</div>}
                                                </td>
                                                <td className="small">{inq.program_interest || '-'}</td>
                                                <td className="small text-secondary" style={{ maxWidth: '240px' }}>{inq.message || '-'}</td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={inq.status}
                                                        onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                                                        style={{ width: '130px' }}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                </td>
                                                <td className="small text-muted">{new Date(inq.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </FrontLayout>
    );
}

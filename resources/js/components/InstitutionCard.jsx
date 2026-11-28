import React from 'react';
import { Link } from '@inertiajs/react';

export default function InstitutionCard({ institution }) {
    if (!institution) return null;

    const details = institution.details || {};
    const type = institution.institution_type;

    const distanceText =
        institution.distance !== undefined && institution.distance !== null
            ? Number(institution.distance) < 1
                ? `${Math.round(Number(institution.distance) * 1000)} m away`
                : `${Number(institution.distance).toFixed(1)} km away`
            : null;

    const admissionBadge = {
        open: { cls: 'bg-success-subtle text-success border-success-subtle', text: 'Admissions Open' },
        upcoming: { cls: 'bg-warning-subtle text-warning-emphasis border-warning-subtle', text: 'Admissions Upcoming' },
        closed: { cls: 'bg-secondary-subtle text-secondary border-secondary-subtle', text: 'Admissions Closed' },
    }[institution.admission_status || 'open'] || { cls: 'bg-success-subtle text-success', text: 'Admissions Open' };

    // Build category-specific highlight pills
    const highlights = [];
    if (type === 'coaching_institute') {
        if (Array.isArray(details.target_exams) && details.target_exams.length > 0) {
            highlights.push({ icon: 'bi-trophy', label: 'Exams', value: details.target_exams.slice(0, 3).join(', ') });
        }
        if (Array.isArray(details.batch_modes) && details.batch_modes.length > 0) {
            highlights.push({ icon: 'bi-laptop', label: 'Mode', value: details.batch_modes.join(' / ') });
        }
        if (details.demo_class_available) {
            highlights.push({ icon: 'bi-play-circle-fill', label: 'Demo', value: 'Free Demo Available' });
        }
    } else if (type === 'school') {
        if (details.affiliated_board) {
            highlights.push({ icon: 'bi-award', label: 'Board', value: details.affiliated_board });
        }
        if (details.grade_range) {
            highlights.push({ icon: 'bi-layers', label: 'Grades', value: details.grade_range });
        }
        if (details.medium) {
            highlights.push({ icon: 'bi-translate', label: 'Medium', value: details.medium });
        }
    } else if (type === 'college') {
        if (details.affiliated_university) {
            highlights.push({ icon: 'bi-bank', label: 'Affiliated', value: details.affiliated_university });
        }
        if (details.accreditation) {
            highlights.push({ icon: 'bi-patch-check', label: 'Accreditation', value: details.accreditation });
        }
        if (Array.isArray(details.degree_levels) && details.degree_levels.length > 0) {
            highlights.push({ icon: 'bi-mortarboard', label: 'Degrees', value: details.degree_levels.slice(0, 3).join(', ') });
        }
    } else if (type === 'university') {
        if (details.university_type) {
            highlights.push({ icon: 'bi-bank2', label: 'Type', value: details.university_type });
        }
        if (Array.isArray(details.approvals) && details.approvals.length > 0) {
            highlights.push({ icon: 'bi-shield-check', label: 'Approvals', value: details.approvals.slice(0, 3).join(', ') });
        }
        if (details.nirf_ranking) {
            highlights.push({ icon: 'bi-star-fill', label: 'Ranking', value: details.nirf_ranking });
        }
    }

    const locationStr = [institution.area || institution.city, institution.state].filter(Boolean).join(', ');

    return (
        <div className="card card-modern h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column">
            {/* Cover Banner */}
            <div
                className="position-relative"
                style={{
                    height: '130px',
                    background: institution.cover_image
                        ? `url(${institution.cover_image}) center/cover no-repeat`
                        : 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 65%, #0ea5e9 100%)',
                }}
            >
                <div className="position-absolute top-0 start-0 m-2 d-flex flex-wrap gap-1">
                    <span className="badge bg-white text-primary shadow-xs rounded-pill px-2 py-1 small fw-semibold">
                        {institution.type_label}
                    </span>
                    <span className={`badge border rounded-pill px-2 py-1 small fw-semibold ${admissionBadge.cls}`}>
                        {admissionBadge.text}
                    </span>
                </div>

                {distanceText && (
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white rounded-pill px-2 py-1 small">
                        <i className="bi bi-geo-alt-fill text-warning me-1"></i>
                        {distanceText}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="card-body p-3 p-md-4 d-flex flex-column flex-grow-1">
                <div className="d-flex align-items-start gap-3 mb-3" style={{ marginTop: '-34px' }}>
                    <div
                        className="bg-white rounded-3 border shadow-sm d-flex align-items-center justify-content-center flex-shrink-0 p-1"
                        style={{ width: '60px', height: '60px', zIndex: 2 }}
                    >
                        {institution.logo ? (
                            <img src={institution.logo} alt={institution.name} className="w-100 h-100" style={{ objectFit: 'contain' }} />
                        ) : (
                            <i className="bi bi-building text-primary fs-3"></i>
                        )}
                    </div>
                    <div className="pt-4">
                        <h5 className="fw-bold text-dark mb-0 lh-sm">
                            <Link href={`/institutions/${institution.slug}`} className="text-dark text-decoration-none">
                                {institution.name}
                            </Link>
                            {institution.verified_badge && (
                                <i className="bi bi-patch-check-fill text-primary ms-1 fs-6" title="Verified Institution"></i>
                            )}
                        </h5>
                        {locationStr && (
                            <div className="small text-muted mt-1">
                                <i className="bi bi-geo-alt me-1 text-danger"></i>
                                {locationStr}
                            </div>
                        )}
                    </div>
                </div>

                {institution.tagline && (
                    <p className="text-secondary small mb-3">{institution.tagline}</p>
                )}

                {/* Category Highlights */}
                <div className="d-flex flex-column gap-1 mb-3 small">
                    {highlights.map((h, i) => (
                        <div key={i} className="d-flex align-items-start gap-2 text-secondary">
                            <i className={`bi ${h.icon} text-primary mt-1 flex-shrink-0`}></i>
                            <div>
                                <strong className="text-dark">{h.label}:</strong> {h.value}
                            </div>
                        </div>
                    ))}
                    {institution.fee_range && (
                        <div className="d-flex align-items-start gap-2 text-secondary">
                            <i className="bi bi-currency-rupee text-success mt-1 flex-shrink-0"></i>
                            <div>
                                <strong className="text-dark">Fees:</strong> {institution.fee_range}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between gap-2">
                    <div className="small text-muted">
                        {institution.programs_count > 0 && (
                            <span className="badge bg-light text-dark border rounded-pill me-1">
                                {institution.programs_count} Programs
                            </span>
                        )}
                        {institution.brochure_pdf && (
                            <span className="badge bg-danger-subtle text-danger rounded-pill">
                                <i className="bi bi-file-pdf me-1"></i>Brochure
                            </span>
                        )}
                    </div>
                    <Link
                        href={`/institutions/${institution.slug}`}
                        className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold"
                    >
                        View Details <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}

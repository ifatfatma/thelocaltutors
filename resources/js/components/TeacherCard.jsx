import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * Format location strictly as City, State, Country
 * Never displays street, lane, house number, or pincode.
 */
export function formatTeacherLocation(teacher) {
    if (!teacher) return 'India';
    if (typeof teacher.location_formatted === 'string' && teacher.location_formatted.trim() && !teacher.location_formatted.includes('undefined')) {
        return teacher.location_formatted;
    }

    let city = (teacher.city || teacher.teachermore?.city || '').toString().trim();
    let state = (teacher.state || teacher.teachermore?.state || '').toString().trim();

    // If city or state are missing or numeric IDs, safely check if address contains city/state name
    if ((!city || city === '0' || /^\d+$/.test(city)) && teacher.address) {
        const addr = String(teacher.address);
        const matches = addr.match(/(Kolkata|Mumbai|Delhi|Bangalore|Bengaluru|Chennai|Hyderabad|Pune|Ahmedabad|Jaipur|Lucknow|Chandigarh|Patna|Bhubaneswar|Ranchi|Noida|Gurgaon|Gurugram|Howrah)/i);
        if (matches) {
            city = matches[1];
        }
    }
    if ((!state || state === '0' || /^\d+$/.test(state)) && teacher.address) {
        const addr = String(teacher.address);
        const stateMatches = addr.match(/(West Bengal|Maharashtra|Delhi|Karnataka|Tamil Nadu|Telangana|Uttar Pradesh|Gujarat|Rajasthan|Punjab|Haryana|Bihar|Odisha|Jharkhand)/i);
        if (stateMatches) {
            state = stateMatches[1];
        } else if (/kolkata/i.test(addr) || /howrah/i.test(addr) || /kolkata/i.test(city)) {
            state = 'West Bengal';
        }
    }

    const parts = [];
    if (city && city !== '0' && city !== 'null' && city !== 'undefined' && !/^\d+$/.test(city)) {
        parts.push(city);
    }
    if (state && state !== '0' && state !== 'null' && state !== 'undefined' && !/^\d+$/.test(state)) {
        parts.push(state);
    }
    parts.push('India');

    return parts.join(', ');
}

/**
 * Clean & Sanitize Bio text
 */
function cleanBioText(desc, fallback) {
    if (!desc) return fallback;
    const stripped = desc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return stripped || fallback;
}

/**
 * Premium Modern Teacher Card & Modal Content
 * Matches the user-provided design specifications:
 * - Corner decorative curved accents
 * - Avatar with status indicator ring
 * - Aligned academic details (Icon + Label + Value)
 * - "About Me" quotation card with tab header
 * - Location strictly limited to State, City, India
 * - Neatly aligned CTA buttons
 */
export default function TeacherCard({
    teacher,
    isModal = false,
    onBookTrial = null,
    onViewProfile = null,
    onExplore = null,
    className = '',
}) {
    if (!teacher) return null;

    const u = teacher.user || {};
    const name = teacher.name || u.name || 'Verified Educator';
    const gender = teacher.gender || (teacher.teachermore?.gender) || 'Educator';
    const experience = teacher.experience || teacher.teachermore?.experience;
    const expText = experience ? `${experience} Yrs Exp` : 'Experienced';

    const qualification =
        teacher.qualification_name ||
        teacher.qualification ||
        teacher.teachermore?.qualification_name ||
        'Graduation';

    const subjects =
        teacher.subject_names ||
        teacher.subjects ||
        teacher.teachermore?.subject_names ||
        'English, Mathematics';

    const boards =
        teacher.board_names ||
        teacher.board ||
        teacher.teachermore?.board_names ||
        'CBSE, ICSE, WBBSE';

    const mode =
        teacher.teaching_mode_name ||
        teacher.teaching_mode ||
        teacher.teachermore?.teaching_mode_name ||
        'Both (Online & Offline)';

    const timings =
        teacher.timings ||
        teacher.teachermore?.timings ||
        '10 AM – 10 PM';

    const rawBio = teacher.description || teacher.teachermore?.description || '';
    const bio = cleanBioText(
        rawBio,
        'Dedicated and certified educator committed to conceptual clarity, personalized doubt clearing, and continuous academic growth for students.'
    );

    const locationText = formatTeacherLocation(teacher);

    // Image URL resolution
    const rawImage = teacher.image || u.image || teacher.teachermore?.image;
    let imageUrl = '/front/img/noprofileimage.png';
    if (rawImage && typeof rawImage === 'string') {
        const trimmed = rawImage.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            imageUrl = trimmed;
        } else if (trimmed.startsWith('/')) {
            imageUrl = trimmed;
        } else if (trimmed) {
            imageUrl = `/user/${trimmed}`;
        }
    }

    const distance = teacher.distance;
    const distanceText =
        distance !== undefined && distance !== null
            ? Number(distance) < 0.1
                ? 'Nearby'
                : Number(distance) < 1
                ? `${Math.round(Number(distance) * 1000)} m away`
                : `${Number(distance).toFixed(1)} km away`
            : null;

    return (
        <div
            className={`teacher-premium-card position-relative bg-white overflow-hidden ${
                isModal ? 'rounded-4' : 'rounded-4 shadow-sm h-100'
            } ${className}`}
            style={{
                border: '1.5px solid #dbeafe',
                boxShadow: isModal
                    ? 'none'
                    : '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
            }}
        >
            {/* Top-Left Modern Corner Wave Graphic */}
            <div
                className="position-absolute top-0 start-0 pointer-events-none"
                style={{ width: '130px', height: '110px', zIndex: 1, opacity: 0.95 }}
            >
                <svg viewBox="0 0 130 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-100 h-100">
                    <path
                        d="M0 0H80C110 0 120 40 70 70C20 100 0 110 0 110V0Z"
                        fill="url(#cornerBlueGrad)"
                    />
                    <path
                        d="M0 0H50C85 0 95 25 55 50C15 75 0 85 0 85V0Z"
                        fill="url(#cornerGoldGrad)"
                        opacity="0.75"
                    />
                    <defs>
                        <linearGradient id="cornerBlueGrad" x1="0" y1="0" x2="130" y2="110" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0284c7" />
                            <stop offset="0.6" stopColor="#38bdf8" />
                            <stop offset="1" stopColor="#bae6fd" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="cornerGoldGrad" x1="0" y1="0" x2="80" y2="70" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#f59e0b" />
                            <stop offset="1" stopColor="#fbbf24" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Bottom-Right Modern Corner Wave Graphic */}
            <div
                className="position-absolute bottom-0 end-0 pointer-events-none"
                style={{ width: '140px', height: '90px', zIndex: 1, opacity: 0.95 }}
            >
                <svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-100 h-100">
                    <path
                        d="M140 90H60C30 90 20 60 70 30C120 0 140 0 140 0V90Z"
                        fill="url(#cornerBlueGrad2)"
                    />
                    <path
                        d="M140 90H90C60 90 50 70 90 45C130 20 140 10 140 10V90Z"
                        fill="url(#cornerGoldGrad2)"
                        opacity="0.7"
                    />
                    <defs>
                        <linearGradient id="cornerBlueGrad2" x1="140" y1="90" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0284c7" />
                            <stop offset="0.7" stopColor="#38bdf8" />
                            <stop offset="1" stopColor="#e0f2fe" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="cornerGoldGrad2" x1="140" y1="90" x2="60" y2="20" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#f59e0b" />
                            <stop offset="1" stopColor="#fde68a" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Card Content Container */}
            <div className={`position-relative ${isModal ? 'p-3 p-md-4' : 'p-3'}`} style={{ zIndex: 2 }}>
                {/* 1. Header Row: Avatar + Name + Badges + Stars + State/City Location */}
                <div className={`d-flex flex-column flex-sm-row align-items-start gap-3 ${isModal ? 'mb-3 pb-2' : 'mb-2'}`}>
                    {/* Teacher Photo with Ring & Online Status */}
                    <div className="position-relative flex-shrink-0 mx-auto mx-sm-0">
                        <div
                            className="rounded-circle p-1"
                            style={{
                                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 60%, #f59e0b 100%)',
                                width: isModal ? '98px' : '76px',
                                height: isModal ? '98px' : '76px',
                            }}
                        >
                            <img
                                src={imageUrl}
                                onError={(e) => {
                                    e.currentTarget.src = '/front/img/noprofileimage.png';
                                }}
                                alt={`Profile of ${name}`}
                                className="w-100 h-100 rounded-circle bg-white"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        {/* Online Indicator Green Dot */}
                        <span
                            className="position-absolute bg-success border border-white border-2 rounded-circle"
                            style={{
                                width: '14px',
                                height: '14px',
                                bottom: '2px',
                                right: '2px',
                            }}
                            title="Verified & Available"
                        />
                    </div>

                    {/* Teacher Title & Meta Badges */}
                    <div className="flex-grow-1 min-w-0 text-center text-sm-start w-100">
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-between gap-2 mb-1">
                            <h4 className="fw-bold text-dark mb-0 lh-sm text-truncate" title={name} style={{ fontSize: isModal ? '1.55rem' : '1.2rem' }}>
                                {name}
                            </h4>
                            {gender && (
                                <span
                                    className="badge rounded-pill fw-semibold px-2 py-1 text-secondary border"
                                    style={{
                                        backgroundColor: '#f1f5f9',
                                        fontSize: '0.74rem',
                                    }}
                                >
                                    <i className="bi bi-person me-1"></i>
                                    {gender}
                                </span>
                            )}
                        </div>

                        {/* Verified & Experience Badges */}
                        <div className="d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap gap-2 mb-1">
                            <span
                                className="badge rounded-pill fw-semibold px-2 py-1 text-primary d-inline-flex align-items-center gap-1"
                                style={{
                                    backgroundColor: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    fontSize: '0.76rem',
                                }}
                            >
                                <i className="bi bi-patch-check-fill text-primary"></i>
                                Verified Educator
                            </span>

                            <span className="text-muted small d-none d-sm-inline">|</span>

                            <span
                                className="badge rounded-pill fw-semibold px-2 py-1 text-dark d-inline-flex align-items-center gap-1"
                                style={{
                                    backgroundColor: '#fffbeb',
                                    border: '1px solid #fde68a',
                                    fontSize: '0.76rem',
                                }}
                            >
                                <i className="bi bi-award-fill text-warning"></i>
                                {expText}
                            </span>
                        </div>

                        {/* Ratings & Distance */}
                        <div className="d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap gap-2 mb-1">
                            <div className="d-flex align-items-center text-warning" style={{ fontSize: '0.86rem' }}>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill ms-1"></i>
                                <i className="bi bi-star-fill ms-1"></i>
                                <i className="bi bi-star-fill ms-1"></i>
                                <i className="bi bi-star-fill ms-1"></i>
                            </div>

                            {distanceText && (
                                <span
                                    className="badge rounded-pill px-2 py-1 text-success fw-semibold d-inline-flex align-items-center gap-1"
                                    style={{
                                        backgroundColor: '#ecfdf5',
                                        border: '1px solid #a7f3d0',
                                        fontSize: '0.74rem',
                                    }}
                                >
                                    <i className="bi bi-geo-alt-fill text-success"></i>
                                    {distanceText}
                                </span>
                            )}
                        </div>

                        {/* Location: ONLY State, City, Country */}
                        <div
                            className="d-flex align-items-center justify-content-center justify-content-sm-start gap-1 text-secondary small fw-medium"
                            style={{ fontSize: '0.82rem' }}
                        >
                            <i className="bi bi-geo-alt-fill text-danger flex-shrink-0"></i>
                            <span className="text-truncate">{locationText}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Body Grid: Academic Details + About Me */}
                <div className="row g-2 mb-2">
                    {/* Academic Details Panel */}
                    <div className={isModal ? "col-12 col-md-6" : "col-12"}>
                        <div
                            className="p-2 p-sm-3 rounded-3 h-100 d-flex flex-column justify-content-center"
                            style={{
                                backgroundColor: '#f0f7ff',
                                border: '1px solid #d0e7ff',
                                minHeight: isModal ? '175px' : 'auto',
                            }}
                        >
                            {isModal ? (
                                <div className="d-flex flex-column gap-2">
                                    {/* Qualification */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '28px', height: '28px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-mortarboard-fill" style={{ fontSize: '0.82rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.84rem', lineHeight: '1.4' }}>
                                            <span className="fw-bold text-dark me-1">Qualification:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {qualification}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subjects */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '28px', height: '28px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-book-fill" style={{ fontSize: '0.82rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.84rem', lineHeight: '1.4' }}>
                                            <span className="fw-bold text-dark me-1">Subjects:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {subjects}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Board */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '28px', height: '28px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-layers-fill" style={{ fontSize: '0.82rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.84rem', lineHeight: '1.4' }}>
                                            <span className="fw-bold text-dark me-1">Board:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {boards}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mode */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '28px', height: '28px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-display" style={{ fontSize: '0.82rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.84rem', lineHeight: '1.4' }}>
                                            <span className="fw-bold text-dark me-1">Mode:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {mode}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timings */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '28px', height: '28px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-clock-fill" style={{ fontSize: '0.82rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.84rem', lineHeight: '1.4' }}>
                                            <span className="fw-bold text-dark me-1">Timings:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {timings}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Clean single-column layout with word wrapping (prevents overlapping) */
                                <div className="d-flex flex-column gap-2 py-1">
                                    {/* Qualification */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-2 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '24px', height: '24px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-mortarboard-fill" style={{ fontSize: '0.74rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.80rem', lineHeight: '1.35' }}>
                                            <span className="fw-bold text-dark me-1">Qualification:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {qualification}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subjects */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-2 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '24px', height: '24px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-book-fill" style={{ fontSize: '0.74rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.80rem', lineHeight: '1.35' }}>
                                            <span className="fw-bold text-dark me-1">Subjects:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {subjects}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Board */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-2 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '24px', height: '24px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-layers-fill" style={{ fontSize: '0.74rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.80rem', lineHeight: '1.35' }}>
                                            <span className="fw-bold text-dark me-1">Board:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {boards}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mode */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-2 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '24px', height: '24px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-display" style={{ fontSize: '0.74rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.80rem', lineHeight: '1.35' }}>
                                            <span className="fw-bold text-dark me-1">Mode:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {mode}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timings */}
                                    <div className="d-flex align-items-start gap-2">
                                        <div
                                            className="rounded-2 d-flex align-items-center justify-content-center text-white flex-shrink-0 mt-1 shadow-2xs"
                                            style={{ width: '24px', height: '24px', backgroundColor: '#0284c7' }}
                                        >
                                            <i className="bi bi-clock-fill" style={{ fontSize: '0.74rem' }}></i>
                                        </div>
                                        <div className="flex-grow-1 min-w-0" style={{ fontSize: '0.80rem', lineHeight: '1.35' }}>
                                            <span className="fw-bold text-dark me-1">Timings:</span>
                                            <span className="text-secondary fw-semibold" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                                {timings}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Attribute Panel: "About Me" */}
                    <div className={isModal ? "col-12 col-md-6 d-flex flex-column" : "col-12"}>
                        {isModal ? (
                            <>
                                {/* Blue Tab Header */}
                                <div className="d-flex align-items-end" style={{ marginBottom: '-1px', zIndex: 2 }}>
                                    <span
                                        className="px-3 py-1 text-white fw-bold d-inline-flex align-items-center gap-1 shadow-2xs"
                                        style={{
                                            backgroundColor: '#0284c7',
                                            borderRadius: '10px 10px 0 0',
                                            fontSize: '0.82rem',
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        <i className="bi bi-person-fill"></i>
                                        About Me
                                    </span>
                                    <div className="flex-grow-1" style={{ height: '1px', backgroundColor: '#d0e7ff' }}></div>
                                </div>

                                {/* Quote Content Box */}
                                <div
                                    className="p-3 rounded-bottom-4 rounded-end-4 flex-grow-1 position-relative d-flex flex-column justify-content-center"
                                    style={{
                                        backgroundColor: '#f0f7ff',
                                        border: '1px solid #d0e7ff',
                                        minHeight: '175px',
                                    }}
                                >
                                    <p
                                        className="text-secondary fst-italic mb-0 small lh-base text-start"
                                        style={{
                                            fontSize: '0.84rem',
                                            color: '#334155',
                                            maxHeight: 'none',
                                            overflow: 'visible',
                                        }}
                                    >
                                        <span className="fw-bold text-primary fs-5 me-1 lh-1" style={{ verticalAlign: '-3px' }}>
                                            &ldquo;
                                        </span>
                                        {bio}
                                        <span className="fw-bold text-primary fs-5 ms-1 lh-1" style={{ verticalAlign: '-3px' }}>
                                            &rdquo;
                                        </span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            /* Sleek Compact Quote for Card */
                            <div
                                className="p-2 px-3 rounded-3"
                                style={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                <div className="d-flex align-items-center gap-1 mb-1 text-primary fw-bold" style={{ fontSize: '0.74rem' }}>
                                    <i className="bi bi-chat-quote-fill"></i> About Educator
                                </div>
                                <p
                                    className="text-secondary fst-italic mb-0 small lh-sm text-start"
                                    style={{
                                        fontSize: '0.80rem',
                                        color: '#475569',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    &ldquo;{bio}&rdquo;
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Action Buttons Row: View Profile / Book Trial / Explore */}
                <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 pt-2">
                    {onViewProfile ? (
                        <button
                            type="button"
                            onClick={() => onViewProfile(teacher)}
                            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm text-white"
                            style={{
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                border: 'none',
                                fontSize: '0.88rem',
                            }}
                        >
                            <i className="bi bi-info-circle fs-6"></i>
                            View Profile
                        </button>
                    ) : onBookTrial ? (
                        <button
                            type="button"
                            onClick={() => onBookTrial(teacher)}
                            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm text-white"
                            style={{
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                border: 'none',
                                fontSize: '0.88rem',
                            }}
                        >
                            <i className="bi bi-calendar-check fs-6"></i>
                            Book Free Trial
                        </button>
                    ) : (
                        <a
                            href="#inquiry-form"
                            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm text-white"
                            style={{
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                border: 'none',
                                fontSize: '0.88rem',
                            }}
                        >
                            <i className="bi bi-info-circle fs-6"></i>
                            View Profile
                        </a>
                    )}

                    {onExplore ? (
                        <button
                            type="button"
                            onClick={() => onExplore(teacher)}
                            className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#0f172a',
                                color: '#0f172a',
                                fontSize: '0.88rem',
                            }}
                        >
                            Explore &rarr;
                        </button>
                    ) : (
                        <Link
                            href="/team"
                            className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#0f172a',
                                color: '#0f172a',
                                fontSize: '0.88rem',
                            }}
                        >
                            Explore &rarr;
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

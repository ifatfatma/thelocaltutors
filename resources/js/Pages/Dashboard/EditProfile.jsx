import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import IndiaLocationSelector from '../../Components/IndiaLocationSelector';
import MapLocationPicker from '../../components/MapLocationPicker';
import RichTextEditor from '../../components/RichTextEditor';
import axios from 'axios';

export default function EditProfile({
    userdetails = {},
    teacherdetails = {},
    states = [],
    boards = [],
    subjects = [],
    qualifications = [],
    modes = [],
    days = [],
}) {
    const { auth } = usePage().props;
    const isTeacher = Boolean(
        auth?.user?.is_teacher || (auth?.user?.type || '').toLowerCase() === 'teacher'
    );

    const [form, setForm] = useState({
        name: userdetails?.name || '',
        email: userdetails?.email || '',
        mobile: userdetails?.mobile || '',
        gender: teacherdetails?.gender || 'Male',
        whatsapp: teacherdetails?.whatsapp || '',
        experience: teacherdetails?.experience || '',
        description: teacherdetails?.description || '',
        address: teacherdetails?.address || '',
        state: teacherdetails?.state || '',
        district: teacherdetails?.district || '',
        city: teacherdetails?.city || '',
        pincode: teacherdetails?.pincode || '',
        latitude: teacherdetails?.latitude || '',
        longitude: teacherdetails?.longitude || '',
        timings: teacherdetails?.timings || '',
        qualification: teacherdetails?.qualification
            ? (Array.isArray(teacherdetails.qualification) ? teacherdetails.qualification : teacherdetails.qualification.split(',').map(s => s.trim()))
            : [],
        teaching_mode: teacherdetails?.teaching_mode
            ? (Array.isArray(teacherdetails.teaching_mode) ? teacherdetails.teaching_mode : teacherdetails.teaching_mode.split(',').map(s => s.trim()))
            : [],
        board: teacherdetails?.board
            ? (Array.isArray(teacherdetails.board) ? teacherdetails.board : teacherdetails.board.split(',').map(s => s.trim()))
            : [],
        subjects: teacherdetails?.subjects
            ? (Array.isArray(teacherdetails.subjects) ? teacherdetails.subjects : teacherdetails.subjects.split(',').map(s => s.trim()))
            : [],
        days: teacherdetails?.days
            ? (Array.isArray(teacherdetails.days) ? teacherdetails.days : teacherdetails.days.split(',').map(s => s.trim()))
            : [],
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
        if (!imageFile) {
            setImagePreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setImagePreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [locationStatus, setLocationStatus] = useState({ type: '', text: '' });

    // Email & Mobile Change OTP Verification State
    const originalEmail = (userdetails?.email || '').trim().toLowerCase();
    const originalMobile = (userdetails?.mobile || '').trim();
    const currentEmailNorm = (form.email || '').trim().toLowerCase();
    const currentMobileNorm = (form.mobile || '').trim();
    const emailChanged = currentEmailNorm !== originalEmail;
    const mobileChanged = currentMobileNorm !== originalMobile;

    const [emailOtp, setEmailOtp] = useState({
        sent: false,
        code: '',
        loading: false,
        verifying: false,
        verifiedValue: '',
        cooldown: 0,
        msg: '',
        msgType: '',
    });
    const [mobileOtp, setMobileOtp] = useState({
        sent: false,
        code: '',
        loading: false,
        verifying: false,
        verifiedValue: '',
        cooldown: 0,
        msg: '',
        msgType: '',
    });

    const isEmailChangeVerified = !emailChanged || emailOtp.verifiedValue === currentEmailNorm;
    const isMobileChangeVerified = !mobileChanged || mobileOtp.verifiedValue === currentMobileNorm;

    // OTP cooldown timers
    useEffect(() => {
        if (emailOtp.cooldown <= 0 && mobileOtp.cooldown <= 0) return;
        const timer = setInterval(() => {
            setEmailOtp((prev) => (prev.cooldown > 0 ? { ...prev, cooldown: prev.cooldown - 1 } : prev));
            setMobileOtp((prev) => (prev.cooldown > 0 ? { ...prev, cooldown: prev.cooldown - 1 } : prev));
        }, 1000);
        return () => clearInterval(timer);
    }, [emailOtp.cooldown, mobileOtp.cooldown]);

    const handleSendProfileOtp = async (type) => {
        const value = type === 'email' ? currentEmailNorm : currentMobileNorm;
        const setter = type === 'email' ? setEmailOtp : setMobileOtp;

        setter((prev) => ({ ...prev, loading: true, msg: '', msgType: '' }));
        try {
            const res = await axios.post('/auth/profile-otp/send', { type, value });
            setter((prev) => ({
                ...prev,
                loading: false,
                sent: true,
                code: '',
                cooldown: res.data?.cooldown || 60,
                msg: res.data?.message || '6-digit verification OTP sent!',
                msgType: 'success',
            }));
        } catch (err) {
            const data = err.response?.data || {};
            setter((prev) => ({
                ...prev,
                loading: false,
                cooldown: data.cooldown || prev.cooldown,
                msg: data.message || 'Failed to send verification OTP.',
                msgType: 'danger',
            }));
        }
    };

    const handleVerifyProfileOtp = async (type) => {
        const value = type === 'email' ? currentEmailNorm : currentMobileNorm;
        const state = type === 'email' ? emailOtp : mobileOtp;
        const setter = type === 'email' ? setEmailOtp : setMobileOtp;

        if ((state.code || '').trim().length !== 6) {
            setter((prev) => ({ ...prev, msg: 'Please enter the 6-digit OTP.', msgType: 'danger' }));
            return;
        }

        setter((prev) => ({ ...prev, verifying: true, msg: '', msgType: '' }));
        try {
            const res = await axios.post('/auth/profile-otp/verify', {
                type,
                value,
                otp: state.code.trim(),
            });
            setter((prev) => ({
                ...prev,
                verifying: false,
                verifiedValue: value,
                sent: false,
                code: '',
                msg: res.data?.message || 'Verified successfully!',
                msgType: 'success',
            }));
        } catch (err) {
            setter((prev) => ({
                ...prev,
                verifying: false,
                msg: err.response?.data?.message || 'Invalid or expired OTP.',
                msgType: 'danger',
            }));
        }
    };

    // Auto-dismiss status toast after 4.5 seconds
    useEffect(() => {
        if (!statusMsg.text) return;
        const timer = setTimeout(() => {
            setStatusMsg({ type: '', text: '' });
        }, 4500);
        return () => clearTimeout(timer);
    }, [statusMsg.text]);

    // Extract any existing custom "other" entries that don't match predefined IDs or names
    const getInitialOther = (storedList, predefinedList) => {
        if (!Array.isArray(storedList)) return '';
        const knownIds = new Set(predefinedList.map((p) => String(p.id)));
        const knownNames = new Set(predefinedList.map((p) => String(p.name).trim().toLowerCase()));
        const others = storedList.filter((item) => {
            const s = String(item).trim();
            return s && !knownIds.has(s) && !knownNames.has(s.toLowerCase());
        });
        return others.join(', ');
    };

    const initialOtherQual = getInitialOther(
        teacherdetails?.qualification
            ? (Array.isArray(teacherdetails.qualification) ? teacherdetails.qualification : teacherdetails.qualification.split(',').map(s => s.trim()))
            : [],
        qualifications
    );

    const initialOtherSubj = getInitialOther(
        teacherdetails?.subjects
            ? (Array.isArray(teacherdetails.subjects) ? teacherdetails.subjects : teacherdetails.subjects.split(',').map(s => s.trim()))
            : [],
        subjects
    );

    const initialOtherBoard = getInitialOther(
        teacherdetails?.board
            ? (Array.isArray(teacherdetails.board) ? teacherdetails.board : teacherdetails.board.split(',').map(s => s.trim()))
            : [],
        boards
    );

    const [showOtherQualification, setShowOtherQualification] = useState(!!initialOtherQual);
    const [otherQualification, setOtherQualification] = useState(initialOtherQual);

    const [showOtherSubjects, setShowOtherSubjects] = useState(!!initialOtherSubj);
    const [otherSubjects, setOtherSubjects] = useState(initialOtherSubj);

    const [showOtherBoards, setShowOtherBoards] = useState(!!initialOtherBoard);
    const [otherBoards, setOtherBoards] = useState(initialOtherBoard);

    const handleDetectServingLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus({
                type: 'warning',
                text: 'Geolocation is not supported by your browser. You can enter coordinates or your area manually.',
            });
            return;
        }

        setDetectingLocation(true);
        setLocationStatus({ type: 'info', text: 'Detecting your serving location...' });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);
                const accuracy = Math.round(position.coords.accuracy);

                setForm((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                }));
                setDetectingLocation(false);
                setLocationStatus({
                    type: 'success',
                    text: `Serving location detected: ${lat}, ${lng} (~${accuracy}m accuracy). Click "Save Profile" below to persist.`,
                });

                axios.get(`/savelatlong/${lat}/${lng}`).catch(() => {});
            },
            (error) => {
                setDetectingLocation(false);
                let msg = 'Unable to retrieve GPS location.';
                if (error.code === 1) {
                    msg = 'Location permission was denied. Please allow location access or select your Pan-India State and City below.';
                } else if (error.code === 2) {
                    msg = 'GPS location unavailable. Please select your State, City, and PIN code below.';
                } else if (error.code === 3) {
                    msg = 'Location request timed out. Please try again.';
                }
                setLocationStatus({ type: 'danger', text: msg });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleMultiSelect = (field, value) => {
        const strVal = String(value);
        const current = [...(form[field] || [])].map(String);
        const idx = current.indexOf(strVal);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(strVal);
        }
        setForm({ ...form, [field]: current });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEmailChangeVerified) {
            setStatusMsg({
                type: 'danger',
                text: 'You changed your email address. Please verify your new email via OTP before saving.',
            });
            return;
        }

        if (!isMobileChangeVerified) {
            setStatusMsg({
                type: 'danger',
                text: 'You changed your mobile number. Please verify your new mobile number via OTP before saving.',
            });
            return;
        }

        setLoading(true);
        setStatusMsg({ type: '', text: '' });

        // Build final multi-select lists combining selected pills + active "Other" text
        const mergeWithOther = (selectedArr, isOtherActive, otherText, predefinedList) => {
            const knownIds = new Set(predefinedList.map((p) => String(p.id)));
            const knownNames = new Set(predefinedList.map((p) => String(p.name).trim().toLowerCase()));

            // Retain selected predefined items
            const result = selectedArr.filter((val) => {
                const s = String(val).trim();
                return knownIds.has(s) || knownNames.has(s.toLowerCase());
            });

            // Append custom typed entries from Other input
            if (isOtherActive && otherText && otherText.trim()) {
                const customItems = otherText
                    .split(',')
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0 && !result.includes(item));
                result.push(...customItems);
            }
            return result;
        };

        const finalQualification = mergeWithOther(form.qualification, showOtherQualification, otherQualification, qualifications);
        const finalSubjects = mergeWithOther(form.subjects, showOtherSubjects, otherSubjects, subjects);
        const finalBoard = mergeWithOther(form.board, showOtherBoards, otherBoards, boards);

        const submissionData = {
            ...form,
            qualification: finalQualification,
            subjects: finalSubjects,
            board: finalBoard,
        };

        const formData = new FormData();
        Object.keys(submissionData).forEach((k) => {
            if (Array.isArray(submissionData[k])) {
                submissionData[k].forEach((val) => formData.append(`${k}[]`, val));
            } else {
                formData.append(k, submissionData[k] ?? '');
            }
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await axios.post('/EditProfilePost', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setStatusMsg({ type: 'success', text: res.data?.message || 'Profile updated successfully!' });
            setImageFile(null);
            setTimeout(() => {
                router.reload({ preserveScroll: true });
            }, 1800);
        } catch (err) {
            const msg = err.response?.data?.message || 'Error updating profile. Please check your inputs.';
            setStatusMsg({ type: 'danger', text: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <FrontLayout>
            <Head title="Edit Profile & Tutoring Location - The Local Tutors" />

            {/* Clean Header */}
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
                                Edit Profile
                            </li>
                        </ol>
                    </nav>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">
                                {isTeacher ? 'Teacher Profile & Pan-India Location' : 'Edit Profile'}
                            </h2>
                            <p className="text-secondary small mb-0">
                                {isTeacher
                                    ? 'Keep your personal contact information, teaching credentials, and Pan-India service location up to date.'
                                    : 'Keep your personal contact information, email, and mobile number up to date.'}
                            </p>
                        </div>
                        {isTeacher && (
                            <Link
                                href="/dashboard/demos"
                                className="btn btn-outline-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-2"
                            >
                                <i className="bi bi-camera-video-fill"></i>
                                <span>Recorded Demo Sessions</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card card-modern p-4 p-md-5 border-0 shadow-sm">
                            {/* Floating Toast Popup in Right Bottom Corner */}
                            {statusMsg.text && (
                                <div
                                    className="position-fixed"
                                    style={{
                                        bottom: '24px',
                                        right: '24px',
                                        zIndex: 9999,
                                        maxWidth: '380px',
                                        animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}
                                >
                                    <div
                                        className="toast show align-items-center border-0 shadow-lg rounded-3 overflow-hidden bg-white"
                                        style={{
                                            borderLeft: `5px solid ${statusMsg.type === 'success' ? '#10b981' : '#ef4444'}`,
                                            boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.18)',
                                        }}
                                        role="alert"
                                        aria-live="assertive"
                                        aria-atomic="true"
                                    >
                                        <div className="d-flex p-3 align-items-start gap-3">
                                            <i
                                                className={`bi ${
                                                    statusMsg.type === 'success'
                                                        ? 'bi-check-circle-fill text-success'
                                                        : 'bi-exclamation-circle-fill text-danger'
                                                } fs-4 flex-shrink-0`}
                                            ></i>
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.925rem' }}>
                                                    {statusMsg.type === 'success' ? 'Success' : 'Notice'}
                                                </h6>
                                                <p className="mb-0 text-secondary small" style={{ lineHeight: 1.4 }}>
                                                    {statusMsg.text}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-close ms-2 mt-1"
                                                aria-label="Close"
                                                onClick={() => setStatusMsg({ type: '', text: '' })}
                                            ></button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Basic Information */}
                                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4 d-flex align-items-center gap-2">
                                    <i className="bi bi-person-circle text-primary"></i>
                                    <span>Personal &amp; Contact Information</span>
                                </h5>

                                <div className="row g-4 mb-4">
                                    <div className="col-md-3 text-center">
                                        <img
                                            src={
                                                imagePreviewUrl
                                                    ? imagePreviewUrl
                                                    : userdetails?.image
                                                    ? `/user/${userdetails.image}`
                                                    : '/front/img/noprofileimage.png'
                                            }
                                            alt="Profile Avatar"
                                            className="rounded-circle shadow-xs border border-2 mb-3"
                                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = '/front/img/noprofileimage.png';
                                            }}
                                        />
                                        <div>
                                            <label className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                                                <i className="bi bi-camera me-1"></i>Change Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="d-none"
                                                    onChange={(e) => setImageFile(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-md-9">
                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold text-secondary">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold text-secondary d-flex align-items-center justify-content-between">
                                                    <span>Email Address *</span>
                                                    {emailChanged && isEmailChangeVerified && (
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                                                            <i className="bi bi-check-circle-fill me-1"></i>Verified
                                                        </span>
                                                    )}
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={form.email}
                                                    onChange={(e) => {
                                                        setForm({ ...form, email: e.target.value });
                                                        if (emailOtp.msg) setEmailOtp((p) => ({ ...p, msg: '' }));
                                                    }}
                                                    required
                                                />
                                                {emailChanged && !isEmailChangeVerified && (
                                                    <div className="mt-2 p-2 bg-warning-subtle border border-warning-subtle rounded-3 small">
                                                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-1">
                                                            <span className="text-dark fw-semibold" style={{ fontSize: '12px' }}>
                                                                <i className="bi bi-shield-lock-fill text-warning me-1"></i>
                                                                Verify new email via OTP
                                                            </span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-sm py-0 px-2"
                                                                style={{ fontSize: '12px' }}
                                                                onClick={() => handleSendProfileOtp('email')}
                                                                disabled={emailOtp.loading || emailOtp.cooldown > 0}
                                                            >
                                                                {emailOtp.loading
                                                                    ? 'Sending...'
                                                                    : emailOtp.cooldown > 0
                                                                    ? `Resend (${emailOtp.cooldown}s)`
                                                                    : emailOtp.sent
                                                                    ? 'Resend OTP'
                                                                    : 'Send OTP'}
                                                            </button>
                                                        </div>
                                                        {emailOtp.sent && (
                                                            <div className="input-group input-group-sm mt-2">
                                                                <input
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    maxLength="6"
                                                                    className="form-control"
                                                                    placeholder="Enter 6-digit OTP"
                                                                    value={emailOtp.code}
                                                                    onChange={(e) =>
                                                                        setEmailOtp((p) => ({
                                                                            ...p,
                                                                            code: e.target.value.replace(/\D/g, '').slice(0, 6),
                                                                        }))
                                                                    }
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success fw-semibold"
                                                                    onClick={() => handleVerifyProfileOtp('email')}
                                                                    disabled={emailOtp.verifying || emailOtp.code.length !== 6}
                                                                >
                                                                    {emailOtp.verifying ? 'Verifying...' : 'Verify'}
                                                                </button>
                                                            </div>
                                                        )}
                                                        {emailOtp.msg && (
                                                            <div
                                                                className={`mt-1 fw-medium ${
                                                                    emailOtp.msgType === 'success' ? 'text-success' : 'text-danger'
                                                                }`}
                                                                style={{ fontSize: '11.5px' }}
                                                            >
                                                                {emailOtp.msg}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold text-secondary d-flex align-items-center justify-content-between">
                                                    <span>Mobile Number (Calling) *</span>
                                                    {mobileChanged && isMobileChangeVerified && (
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                                                            <i className="bi bi-check-circle-fill me-1"></i>Verified
                                                        </span>
                                                    )}
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    placeholder="10-digit mobile number"
                                                    value={form.mobile}
                                                    onChange={(e) => {
                                                        setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) });
                                                        if (mobileOtp.msg) setMobileOtp((p) => ({ ...p, msg: '' }));
                                                    }}
                                                    required
                                                />
                                                {mobileChanged && !isMobileChangeVerified && (
                                                    <div className="mt-2 p-2 bg-warning-subtle border border-warning-subtle rounded-3 small">
                                                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-1">
                                                            <span className="text-dark fw-semibold" style={{ fontSize: '12px' }}>
                                                                <i className="bi bi-shield-lock-fill text-warning me-1"></i>
                                                                Verify new mobile via Email OTP
                                                            </span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-sm py-0 px-2"
                                                                style={{ fontSize: '12px' }}
                                                                onClick={() => handleSendProfileOtp('mobile')}
                                                                disabled={mobileOtp.loading || mobileOtp.cooldown > 0}
                                                            >
                                                                {mobileOtp.loading
                                                                    ? 'Sending...'
                                                                    : mobileOtp.cooldown > 0
                                                                    ? `Resend (${mobileOtp.cooldown}s)`
                                                                    : mobileOtp.sent
                                                                    ? 'Resend OTP'
                                                                    : 'Send OTP'}
                                                            </button>
                                                        </div>
                                                        {mobileOtp.sent && (
                                                            <div className="input-group input-group-sm mt-2">
                                                                <input
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    maxLength="6"
                                                                    className="form-control"
                                                                    placeholder="Enter 6-digit OTP"
                                                                    value={mobileOtp.code}
                                                                    onChange={(e) =>
                                                                        setMobileOtp((p) => ({
                                                                            ...p,
                                                                            code: e.target.value.replace(/\D/g, '').slice(0, 6),
                                                                        }))
                                                                    }
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success fw-semibold"
                                                                    onClick={() => handleVerifyProfileOtp('mobile')}
                                                                    disabled={mobileOtp.verifying || mobileOtp.code.length !== 6}
                                                                >
                                                                    {mobileOtp.verifying ? 'Verifying...' : 'Verify'}
                                                                </button>
                                                            </div>
                                                        )}
                                                        {mobileOtp.msg && (
                                                            <div
                                                                className={`mt-1 fw-medium ${
                                                                    mobileOtp.msgType === 'success' ? 'text-success' : 'text-danger'
                                                                }`}
                                                                style={{ fontSize: '11.5px' }}
                                                            >
                                                                {mobileOtp.msg}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {isTeacher && (
                                                <div className="col-sm-6">
                                                    <label className="form-label small fw-semibold text-secondary">WhatsApp Number</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="WhatsApp number for instant demo requests"
                                                        value={form.whatsapp}
                                                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isTeacher && (
                                    <>
                                        {/* Pan-India Location Section */}
                                        <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                                            <i className="bi bi-geo-alt-fill text-danger"></i>
                                            <span>Pan-India Location &amp; Tutoring Coverage</span>
                                        </h5>
                                <p className="text-secondary small mb-3">
                                    Select your State/UT and City. This ensures students and parents in your region can match with you for doorstep home tuition or online classes.
                                </p>

                                <div className="p-3 p-md-4 bg-light rounded-4 border mb-4">
                                    <IndiaLocationSelector
                                        stateValue={form.state}
                                        cityValue={form.city}
                                        areaValue={form.address}
                                        pincodeValue={form.pincode}
                                        onStateChange={(st) => setForm((prev) => ({ ...prev, state: st, city: '' }))}
                                        onCityChange={(ct) => setForm((prev) => ({ ...prev, city: ct }))}
                                        onAreaChange={(ar) => setForm((prev) => ({ ...prev, address: ar }))}
                                        onPincodeChange={(pin) => setForm((prev) => ({ ...prev, pincode: pin }))}
                                        required={isTeacher}
                                        stateLabel="State / Union Territory"
                                        cityLabel="City / District"
                                        areaLabel="Area / Neighborhood / Street Address"
                                        pincodeLabel="PIN Code (6 digits)"
                                    />

                                    {/* Interactive Map Picker & GPS Coordinates */}
                                    <div className="mt-4 pt-3 border-top">
                                        <div className="mb-3">
                                            <span className="fw-bold text-dark d-flex align-items-center gap-2 mb-1">
                                                <i className="bi bi-map-fill text-primary"></i>
                                                <span>Interactive Tutoring Location &amp; Map Coordinates</span>
                                            </span>
                                        </div>

                                        <MapLocationPicker
                                            latitude={form.latitude}
                                            longitude={form.longitude}
                                            onChange={({ lat, lng, area, pincode }) => {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    latitude: lat,
                                                    longitude: lng,
                                                    ...(area && !prev.address ? { address: area } : {}),
                                                    ...(pincode && !prev.pincode ? { pincode: pincode } : {}),
                                                }));
                                            }}
                                            stateName={form.state}
                                            cityName={form.city}
                                            areaName={form.address}
                                            pincode={form.pincode}
                                            height="380px"
                                        />
                                    </div>
                                </div>

                                {/* Teacher-Specific Qualifications & Pedagogy */}
                                <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                                    <i className="bi bi-mortarboard-fill text-primary"></i>
                                    <span>Teaching Qualifications, Mode &amp; Subjects</span>
                                </h5>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <label className="form-label small fw-semibold text-secondary">Gender</label>
                                        <select
                                            className="form-select"
                                            value={form.gender}
                                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label small fw-semibold text-secondary">Teaching Experience (Years)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            className="form-control"
                                            placeholder="e.g. 5"
                                            value={form.experience}
                                            onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label small fw-semibold text-secondary">Timings / Availability</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. 5 PM - 8 PM (Mon-Sat)"
                                            value={form.timings}
                                            onChange={(e) => setForm({ ...form, timings: e.target.value })}
                                        />
                                    </div>

                                    {/* Teaching Mode */}
                                    <div className="col-12">
                                        <label className="form-label small fw-semibold text-secondary d-block">
                                            Teaching Mode (Select all that apply)
                                        </label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {modes.length > 0 ? (
                                                modes.map((m) => {
                                                    const isChecked = form.teaching_mode.includes(String(m.id)) || form.teaching_mode.includes(m.name);
                                                    return (
                                                        <label
                                                            key={m.id}
                                                            className={`btn btn-sm rounded-pill px-3 py-2 border ${
                                                                isChecked ? 'btn-primary text-white' : 'btn-light text-secondary'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="d-none"
                                                                checked={isChecked}
                                                                onChange={() => handleMultiSelect('teaching_mode', m.id)}
                                                            />
                                                            <i className={`bi ${isChecked ? 'bi-check2' : 'bi-plus'} me-1`}></i>
                                                            {m.name}
                                                        </label>
                                                    );
                                                })
                                            ) : (
                                                ['Home Tuition (Doorstep)', 'Online 1-on-1', 'Both (Home & Online)'].map((m) => {
                                                    const isChecked = form.teaching_mode.includes(m);
                                                    return (
                                                        <label
                                                            key={m}
                                                            className={`btn btn-sm rounded-pill px-3 py-2 border ${
                                                                isChecked ? 'btn-primary text-white' : 'btn-light text-secondary'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="d-none"
                                                                checked={isChecked}
                                                                onChange={() => handleMultiSelect('teaching_mode', m)}
                                                            />
                                                            <i className={`bi ${isChecked ? 'bi-check2' : 'bi-plus'} me-1`}></i>
                                                            {m}
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Qualifications */}
                                    <div className="col-12">
                                        <label className="form-label small fw-semibold text-secondary d-block">
                                            Highest Qualifications
                                        </label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {qualifications.map((q) => {
                                                const isChecked = form.qualification.includes(String(q.id)) || form.qualification.includes(q.name);
                                                return (
                                                    <label
                                                        key={q.id}
                                                        className={`btn btn-sm rounded-pill px-3 py-1 border ${
                                                            isChecked ? 'btn-primary text-white' : 'btn-light text-secondary'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="d-none"
                                                            checked={isChecked}
                                                            onChange={() => handleMultiSelect('qualification', q.id)}
                                                        />
                                                        {q.name}
                                                    </label>
                                                );
                                            })}
                                            <button
                                                type="button"
                                                onClick={() => setShowOtherQualification(!showOtherQualification)}
                                                className={`btn btn-sm rounded-pill px-3 py-1 border ${
                                                    showOtherQualification ? 'btn-primary text-white' : 'btn-light text-secondary'
                                                }`}
                                            >
                                                <i className={`bi ${showOtherQualification ? 'bi-check2' : 'bi-plus'} me-1`}></i>
                                                Other
                                            </button>
                                        </div>
                                        {showOtherQualification && (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter custom qualification(s), e.g. B.Tech, MCA, B.Ed (comma-separated)"
                                                    value={otherQualification}
                                                    onChange={(e) => setOtherQualification(e.target.value)}
                                                />
                                                <div className="form-text small text-muted">
                                                    Enter any additional qualifications or degrees manually.
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Subjects Taught */}
                                    <div className="col-12">
                                        <label className="form-label small fw-semibold text-secondary d-block">
                                            Subjects Taught
                                        </label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {subjects.map((sub) => {
                                                const isChecked = form.subjects.includes(String(sub.id)) || form.subjects.includes(sub.name);
                                                return (
                                                    <label
                                                        key={sub.id}
                                                        className={`btn btn-sm rounded-pill px-3 py-1 border ${
                                                            isChecked ? 'btn-primary text-white' : 'btn-light text-secondary'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="d-none"
                                                            checked={isChecked}
                                                            onChange={() => handleMultiSelect('subjects', sub.id)}
                                                        />
                                                        {sub.name}
                                                    </label>
                                                );
                                            })}
                                            <button
                                                type="button"
                                                onClick={() => setShowOtherSubjects(!showOtherSubjects)}
                                                className={`btn btn-sm rounded-pill px-3 py-1 border ${
                                                    showOtherSubjects ? 'btn-primary text-white' : 'btn-light text-secondary'
                                                }`}
                                            >
                                                <i className={`bi ${showOtherSubjects ? 'bi-check2' : 'bi-plus'} me-1`}></i>
                                                Other
                                            </button>
                                        </div>
                                        {showOtherSubjects && (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter custom subject(s), e.g. Computer Science, Economics (comma-separated)"
                                                    value={otherSubjects}
                                                    onChange={(e) => setOtherSubjects(e.target.value)}
                                                />
                                                <div className="form-text small text-muted">
                                                    Enter any additional subjects manually.
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Boards & Classes Taught */}
                                    <div className="col-12">
                                        <label className="form-label small fw-semibold text-secondary d-block">
                                            School Boards Covered
                                        </label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {boards.map((b) => {
                                                const isChecked = form.board.includes(String(b.id)) || form.board.includes(b.name);
                                                return (
                                                    <label
                                                        key={b.id}
                                                        className={`btn btn-sm rounded-pill px-3 py-1 border ${
                                                            isChecked ? 'btn-primary text-white' : 'btn-light text-secondary'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="d-none"
                                                            checked={isChecked}
                                                            onChange={() => handleMultiSelect('board', b.id)}
                                                        />
                                                        {b.name}
                                                    </label>
                                                );
                                            })}
                                            <button
                                                type="button"
                                                onClick={() => setShowOtherBoards(!showOtherBoards)}
                                                className={`btn btn-sm rounded-pill px-3 py-1 border ${
                                                    showOtherBoards ? 'btn-primary text-white' : 'btn-light text-secondary'
                                                }`}
                                            >
                                                <i className={`bi ${showOtherBoards ? 'bi-check2' : 'bi-plus'} me-1`}></i>
                                                Other
                                            </button>
                                        </div>
                                        {showOtherBoards && (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter custom board(s), e.g. Cambridge, IB, IGCSE (comma-separated)"
                                                    value={otherBoards}
                                                    onChange={(e) => setOtherBoards(e.target.value)}
                                                />
                                                <div className="form-text small text-muted">
                                                    Enter any additional school boards manually.
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bio / Teaching Methodology */}
                                    <div className="col-12">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Teacher Bio &amp; Pedagogy (Displayed on your Public Profile)
                                        </label>
                                        <RichTextEditor
                                            value={form.description}
                                            onChange={(val) => setForm({ ...form, description: val })}
                                            placeholder="Highlight your academic degree, teaching style, past student board examination results, and approach to conceptual clarity..."
                                            minHeight="180px"
                                        />
                                    </div>
                                </div>
                                    </>
                                )}

                                <div className="mt-4 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-3">
                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary-gradient rounded-pill px-4 py-2 fw-semibold shadow-sm"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving Profile...' : 'Save Profile Changes'}
                                        </button>
                                        <Link href="/dashboard" className="btn btn-outline-secondary rounded-pill px-4 py-2">
                                            Cancel
                                        </Link>
                                    </div>

                                    {isTeacher && (
                                        <Link
                                            href="/dashboard/demos"
                                            className="btn btn-light border rounded-pill px-3 py-2 small text-secondary d-inline-flex align-items-center gap-1"
                                        >
                                            <i className="bi bi-camera-video text-primary"></i>
                                            <span>Manage Demo Video Submissions</span>
                                        </Link>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

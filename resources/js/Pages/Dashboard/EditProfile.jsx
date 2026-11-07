import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
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
    const isTeacher = auth?.user?.type === 'teacher';

    const [form, setForm] = useState({
        name: userdetails?.name || '',
        email: userdetails?.email || '',
        mobile: userdetails?.mobile || '',
        gender: teacherdetails?.gender || 'Male',
        whatsapp: teacherdetails?.whatsapp || '',
        experience: teacherdetails?.experience || '',
        description: teacherdetails?.description || '',
        address: teacherdetails?.address || '',
        state: teacherdetails?.state || '0',
        district: teacherdetails?.district || '0',
        city: teacherdetails?.city || '0',
        pincode: teacherdetails?.pincode || '',
        latitude: teacherdetails?.latitude || '',
        longitude: teacherdetails?.longitude || '',
        qualification: teacherdetails?.qualification ? teacherdetails.qualification.split(',') : [],
        teaching_mode: teacherdetails?.teaching_mode ? teacherdetails.teaching_mode.split(',') : [],
        board: teacherdetails?.board ? teacherdetails.board.split(',') : [],
        subjects: teacherdetails?.subjects ? teacherdetails.subjects.split(',') : [],
        days: teacherdetails?.days ? teacherdetails.days.split(',') : [],
    });

    const [imageFile, setImageFile] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [locationStatus, setLocationStatus] = useState({ type: '', text: '' });

    const handleDetectServingLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus({
                type: 'warning',
                text: 'Geolocation is not supported by your browser. You can still enter coordinates manually.',
            });
            return;
        }

        setDetectingLocation(true);
        setLocationStatus({ type: 'info', text: 'Detecting your current location...' });

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
                    text: `Current serving location detected: ${lat}, ${lng} (Accuracy: ~${accuracy}m). Click "Save Profile" below to persist.`,
                });

                axios.get(`/savelatlong/${lat}/${lng}`).catch(() => {});
            },
            (error) => {
                setDetectingLocation(false);
                let msg = 'Unable to retrieve location.';
                if (error.code === 1) {
                    msg = 'Location permission was denied. Please allow location access in your browser or enter coordinates manually.';
                } else if (error.code === 2) {
                    msg = 'Location unavailable. Please check your network/GPS connection or enter coordinates manually.';
                } else if (error.code === 3) {
                    msg = 'Location request timed out. Please try again.';
                }
                setLocationStatus({ type: 'danger', text: msg });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        if (form.state && form.state !== '0') {
            axios.get(`/get-districts?state_id=${form.state}`).then((res) => {
                setDistricts(res.data || []);
            }).catch(() => {
                axios.get(`/getDistrictAjax/${form.state}`).then((res) => setDistricts(res.data || []));
            });
        }
        if (form.district && form.district !== '0') {
            axios.get(`/get-cities?district_id=${form.district}`).then((res) => {
                setCities(res.data || []);
            }).catch(() => {
                axios.get(`/getCityAjax/${form.district}`).then((res) => setCities(res.data || []));
            });
        }
    }, []);

    const handleStateChange = async (e) => {
        const sId = e.target.value;
        setForm((prev) => ({ ...prev, state: sId, district: '0', city: '0' }));
        setDistricts([]);
        setCities([]);
        if (sId && sId !== '0') {
            try {
                const res = await axios.get(`/get-districts?state_id=${sId}`);
                setDistricts(res.data || []);
            } catch {
                const res = await axios.get(`/getDistrictAjax/${sId}`);
                setDistricts(res.data || []);
            }
        }
    };

    const handleDistrictChange = async (e) => {
        const dId = e.target.value;
        setForm((prev) => ({ ...prev, district: dId, city: '0' }));
        setCities([]);
        if (dId && dId !== '0') {
            try {
                const res = await axios.get(`/get-cities?district_id=${dId}`);
                setCities(res.data || []);
            } catch {
                const res = await axios.get(`/getCityAjax/${dId}`);
                setCities(res.data || []);
            }
        }
    };

    const handleMultiSelect = (field, value) => {
        const current = [...(form[field] || [])];
        const idx = current.indexOf(value);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(value);
        }
        setForm({ ...form, [field]: current });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg({ type: '', text: '' });

        const formData = new FormData();
        Object.keys(form).forEach((k) => {
            if (Array.isArray(form[k])) {
                form[k].forEach((val) => formData.append(`${k}[]`, val));
            } else {
                formData.append(k, form[k] ?? '');
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
            router.reload();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error updating profile. Please check input.';
            setStatusMsg({ type: 'danger', text: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <FrontLayout>
            <Head title="Edit Profile" />

            <div className="bg-primary text-white py-4">
                <div className="container">
                    <h2 className="fw-bold mb-1">Edit Profile</h2>
                    <p className="text-white-50 mb-0">Update your account information and preferences</p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                            {statusMsg.text && (
                                <div className={`alert alert-${statusMsg.type} mb-4`}>
                                    {statusMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <h5 className="fw-bold text-dark border-bottom pb-2 mb-4">Basic Information</h5>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4 text-center mb-3">
                                        <img
                                            src={
                                                imageFile
                                                    ? URL.createObjectURL(imageFile)
                                                    : userdetails?.image
                                                    ? `/user/${userdetails.image}`
                                                    : '/front/img/noprofileimage.png'
                                            }
                                            alt="Avatar"
                                            className="rounded-circle shadow-sm mb-3"
                                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <label className="btn btn-outline-secondary btn-sm">
                                                Change Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="d-none"
                                                    onChange={(e) => setImageFile(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <label className="form-label fw-semibold">Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label fw-semibold">Email *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label fw-semibold">Mobile Number *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={form.mobile}
                                                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            {isTeacher && (
                                                <div className="col-sm-6">
                                                    <label className="form-label fw-semibold">WhatsApp Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
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
                                        <h5 className="fw-bold text-dark border-bottom pb-2 mb-4 mt-4">
                                            Teacher Profile &amp; Tutoring Details
                                        </h5>

                                        <div className="row g-3 mb-4">
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">Gender</label>
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
                                                <label className="form-label fw-semibold">Experience (Years)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={form.experience}
                                                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">Pincode</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={form.pincode}
                                                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">State</label>
                                                <select
                                                    className="form-select"
                                                    value={form.state}
                                                    onChange={handleStateChange}
                                                >
                                                    <option value="0">Select State</option>
                                                    {states.map((s) => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">District</label>
                                                <select
                                                    className="form-select"
                                                    value={form.district}
                                                    onChange={handleDistrictChange}
                                                >
                                                    <option value="0">Select District</option>
                                                    {districts.map((d) => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">City</label>
                                                <select
                                                    className="form-select"
                                                    value={form.city}
                                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                                >
                                                    <option value="0">Select City</option>
                                                    {cities.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={form.address}
                                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                                />
                                            </div>

                                            {/* Serving Location & Geolocation */}
                                            <div className="col-12 mt-3">
                                                <div className="p-3 bg-light rounded-4 border">
                                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                                                        <div>
                                                            <h6 className="fw-bold mb-1 text-dark d-flex align-items-center">
                                                                <i className="bi bi-geo-alt-fill text-danger me-2 fs-5"></i>
                                                                Serving Location &amp; Coordinates
                                                            </h6>
                                                            <p className="text-muted small mb-0">
                                                                Save your current physical location where you provide tutoring. Students searching within 1 km or nearby will discover your profile based on these coordinates.
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 fw-semibold px-3 py-2 shadow-sm"
                                                            onClick={handleDetectServingLocation}
                                                            disabled={detectingLocation}
                                                        >
                                                            {detectingLocation ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    <span>Detecting GPS...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="bi bi-crosshair"></i>
                                                                    <span>Detect / Use My Current Location</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>

                                                    {locationStatus.text && (
                                                        <div className={`alert alert-${locationStatus.type} py-2 px-3 small mb-3`}>
                                                            {locationStatus.text}
                                                        </div>
                                                    )}

                                                    <div className="row g-2">
                                                        <div className="col-sm-6">
                                                            <label className="form-label small fw-semibold text-secondary">
                                                                Serving Latitude
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                placeholder="e.g. 22.545120"
                                                                value={form.latitude}
                                                                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <label className="form-label small fw-semibold text-secondary">
                                                                Serving Longitude
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                placeholder="e.g. 88.305430"
                                                                value={form.longitude}
                                                                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    {form.latitude && form.longitude && (
                                                        <div className="mt-2 text-end">
                                                            <a
                                                                href={`https://www.google.com/maps?q=${form.latitude},${form.longitude}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-decoration-none small text-primary fw-semibold"
                                                            >
                                                                <i className="bi bi-box-arrow-up-right me-1"></i> Preview on Google Maps
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-semibold">About / Bio</label>
                                                <textarea
                                                    rows="3"
                                                    className="form-control"
                                                    value={form.description}
                                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                    placeholder="Introduce yourself to prospective students and parents..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-4 pt-3 border-top d-flex gap-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4 py-2 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving Changes...' : 'Save Profile'}
                                    </button>
                                    <Link href="/dashboard" className="btn btn-outline-secondary px-4 py-2">
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

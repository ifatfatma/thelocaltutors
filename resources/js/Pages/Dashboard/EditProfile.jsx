import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
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

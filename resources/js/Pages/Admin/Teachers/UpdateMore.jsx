import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import axios from 'axios';

export default function UpdateMore({ teacher = {}, user_id, states = [] }) {
    const [form, setForm] = useState({
        gender: teacher?.gender || 'Male',
        whatsapp: teacher?.whatsapp || '',
        experience: teacher?.experience || '',
        description: teacher?.description || '',
        address: teacher?.address || '',
        state: teacher?.state || '0',
        district: teacher?.district || '0',
        city: teacher?.city || '0',
        pincode: teacher?.pincode || '',
        street: teacher?.street || '',
        block: teacher?.block || '',
        post_office: teacher?.post_office || '',
        police_station: teacher?.police_station || '',
        latitude: teacher?.latitude || '',
        longitude: teacher?.longitude || '',
        timings: teacher?.timings || '',
        qualification: teacher?.qualification ? teacher.qualification.split(',') : [],
        teaching_mode: teacher?.teaching_mode ? teacher.teaching_mode.split(',') : [],
        board: teacher?.board ? teacher.board.split(',') : [],
        subjects: teacher?.subjects ? teacher.subjects.split(',') : [],
        days: teacher?.days ? teacher.days.split(',') : [],
    });

    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`/admin/teacher/updatemore/post/${user_id}`, form);
    };

    return (
        <AdminLayout title="Update Extended Teacher Information">
            <Head title="Teacher Extended Profile" />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <h5 className="fw-bold mb-0">Extended Profile Details</h5>
                    <Link href="/admin/teacher" className="btn btn-sm btn-secondary">
                        &larr; Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
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

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">WhatsApp</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.whatsapp}
                                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Experience (Years)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={form.experience}
                                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Timings</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 4 PM - 8 PM"
                                value={form.timings}
                                onChange={(e) => setForm({ ...form, timings: e.target.value })}
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

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Street / Locality</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.street}
                                onChange={(e) => setForm({ ...form, street: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Pincode</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.pincode}
                                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Full Address</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Latitude</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.latitude}
                                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Longitude</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.longitude}
                                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Detailed Description / Bio</label>
                            <textarea
                                rows="4"
                                className="form-control"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Save Extended Details
                        </button>
                        <Link href="/admin/teacher" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

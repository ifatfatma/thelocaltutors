import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import IndiaLocationSelector from '../../../Components/IndiaLocationSelector';
import axios from 'axios';

export default function UpdateMore({
    teacher = {},
    user_id,
    states = [],
    boards = [],
    subjects = [],
    qualifications = [],
    modes = [],
    days = []
}) {
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
        qualification: teacher?.qualification
            ? (Array.isArray(teacher.qualification) ? teacher.qualification : teacher.qualification.split(',').map(s => s.trim()))
            : [],
        teaching_mode: teacher?.teaching_mode
            ? (Array.isArray(teacher.teaching_mode) ? teacher.teaching_mode : teacher.teaching_mode.split(',').map(s => s.trim()))
            : [],
        board: teacher?.board
            ? (Array.isArray(teacher.board) ? teacher.board : teacher.board.split(',').map(s => s.trim()))
            : [],
        subjects: teacher?.subjects
            ? (Array.isArray(teacher.subjects) ? teacher.subjects : teacher.subjects.split(',').map(s => s.trim()))
            : [],
        days: teacher?.days
            ? (Array.isArray(teacher.days) ? teacher.days : teacher.days.split(',').map(s => s.trim()))
            : [],
    });

    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [detectingLocation, setDetectingLocation] = useState(false);

    // Extract any existing custom "other" entries that don't match predefined IDs or names
    const getInitialOther = (storedList, predefinedList) => {
        if (!Array.isArray(storedList)) return '';
        const knownIds = new Set((predefinedList || []).map((p) => String(p.id)));
        const knownNames = new Set((predefinedList || []).map((p) => String(p.name).trim().toLowerCase()));
        const others = storedList.filter((item) => {
            const s = String(item).trim();
            return s && !knownIds.has(s) && !knownNames.has(s.toLowerCase());
        });
        return others.join(', ');
    };

    const initialOtherQual = getInitialOther(
        teacher?.qualification
            ? (Array.isArray(teacher.qualification) ? teacher.qualification : teacher.qualification.split(',').map(s => s.trim()))
            : [],
        qualifications
    );

    const initialOtherSubj = getInitialOther(
        teacher?.subjects
            ? (Array.isArray(teacher.subjects) ? teacher.subjects : teacher.subjects.split(',').map(s => s.trim()))
            : [],
        subjects
    );

    const initialOtherBoard = getInitialOther(
        teacher?.board
            ? (Array.isArray(teacher.board) ? teacher.board : teacher.board.split(',').map(s => s.trim()))
            : [],
        boards
    );

    const [showOtherQualification, setShowOtherQualification] = useState(!!initialOtherQual);
    const [otherQualification, setOtherQualification] = useState(initialOtherQual);

    const [showOtherSubjects, setShowOtherSubjects] = useState(!!initialOtherSubj);
    const [otherSubjects, setOtherSubjects] = useState(initialOtherSubj);

    const [showOtherBoards, setShowOtherBoards] = useState(!!initialOtherBoard);
    const [otherBoards, setOtherBoards] = useState(initialOtherBoard);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation not supported by browser.');
            return;
        }
        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm((prev) => ({
                    ...prev,
                    latitude: pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6),
                }));
                setDetectingLocation(false);
            },
            () => {
                alert('Could not determine current location.');
                setDetectingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleMultiSelect = (field, id) => {
        const strId = String(id);
        const current = [...(form[field] || [])].map(String);
        const idx = current.indexOf(strId);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(strId);
        }
        setForm((prev) => ({ ...prev, [field]: current }));
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const mergeWithOther = (selectedArr, isOtherActive, otherText, predefinedList) => {
            const knownIds = new Set((predefinedList || []).map((p) => String(p.id)));
            const knownNames = new Set((predefinedList || []).map((p) => String(p.name).trim().toLowerCase()));

            const result = (selectedArr || []).filter((val) => {
                const s = String(val).trim();
                return knownIds.has(s) || knownNames.has(s.toLowerCase());
            });

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

        const payload = {
            ...form,
            qualification: finalQualification,
            subjects: finalSubjects,
            board: finalBoard,
        };

        router.post(`/admin/teacher/updatemore/post/${user_id}`, payload);
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

                        <div className="col-12">
                            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Pan-India Location &amp; Address</h6>
                            <IndiaLocationSelector
                                stateValue={form.state}
                                cityValue={form.city}
                                areaValue={form.address}
                                pincodeValue={form.pincode}
                                onStateChange={(st) => setForm((prev) => ({ ...prev, state: st, city: '' }))}
                                onCityChange={(ct) => setForm((prev) => ({ ...prev, city: ct }))}
                                onAreaChange={(ar) => setForm((prev) => ({ ...prev, address: ar }))}
                                onPincodeChange={(pin) => setForm((prev) => ({ ...prev, pincode: pin }))}
                                stateColClass="col-md-6"
                                cityColClass="col-md-6"
                                areaColClass="col-md-8"
                                pincodeColClass="col-md-4"
                            />
                        </div>

                        <div className="col-12 mt-2">
                            <div className="p-3 bg-light rounded-3 border">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label fw-bold mb-0">Serving GPS Coordinates (Latitude / Longitude)</label>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={handleDetectLocation}
                                        disabled={detectingLocation}
                                    >
                                        {detectingLocation ? 'Detecting...' : '📍 Detect Current Location'}
                                    </button>
                                </div>
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Latitude (e.g. 22.545120)"
                                            value={form.latitude}
                                            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Longitude (e.g. 88.305430)"
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
                                            className="small text-decoration-none"
                                        >
                                            View on Google Maps &rarr;
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Qualifications</label>
                            <div className="d-flex flex-wrap gap-2">
                                {qualifications.map((q) => {
                                    const isSelected = form.qualification.includes(String(q.id));
                                    return (
                                        <button
                                            type="button"
                                            key={q.id}
                                            onClick={() => handleMultiSelect('qualification', q.id)}
                                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        >
                                            {isSelected && '✓ '}
                                            {q.name}
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => setShowOtherQualification(!showOtherQualification)}
                                    className={`btn btn-sm ${showOtherQualification ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {showOtherQualification && '✓ '}
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
                                        Enter any additional qualifications manually.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Subjects Taught</label>
                            <div className="d-flex flex-wrap gap-2">
                                {subjects.map((sub) => {
                                    const isSelected = form.subjects.includes(String(sub.id));
                                    return (
                                        <button
                                            type="button"
                                            key={sub.id}
                                            onClick={() => handleMultiSelect('subjects', sub.id)}
                                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        >
                                            {isSelected && '✓ '}
                                            {sub.name}
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => setShowOtherSubjects(!showOtherSubjects)}
                                    className={`btn btn-sm ${showOtherSubjects ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {showOtherSubjects && '✓ '}
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

                        <div className="col-12">
                            <label className="form-label fw-semibold">Boards</label>
                            <div className="d-flex flex-wrap gap-2">
                                {boards.map((b) => {
                                    const isSelected = form.board.includes(String(b.id));
                                    return (
                                        <button
                                            type="button"
                                            key={b.id}
                                            onClick={() => handleMultiSelect('board', b.id)}
                                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        >
                                            {isSelected && '✓ '}
                                            {b.name}
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => setShowOtherBoards(!showOtherBoards)}
                                    className={`btn btn-sm ${showOtherBoards ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {showOtherBoards && '✓ '}
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

                        <div className="col-12">
                            <label className="form-label fw-semibold">Teaching Mode</label>
                            <div className="d-flex flex-wrap gap-2">
                                {modes.map((m) => {
                                    const isSelected = form.teaching_mode.includes(String(m.id));
                                    return (
                                        <button
                                            type="button"
                                            key={m.id}
                                            onClick={() => handleMultiSelect('teaching_mode', m.id)}
                                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        >
                                            {isSelected && '✓ '}
                                            {m.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Available Days</label>
                            <div className="d-flex flex-wrap gap-2">
                                {days.map((d) => {
                                    const isSelected = form.days.includes(String(d.id));
                                    return (
                                        <button
                                            type="button"
                                            key={d.id}
                                            onClick={() => handleMultiSelect('days', d.id)}
                                            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        >
                                            {isSelected && '✓ '}
                                            {d.name}
                                        </button>
                                    );
                                })}
                            </div>
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

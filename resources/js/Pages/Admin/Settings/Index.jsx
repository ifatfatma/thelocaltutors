import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index({ generalsettings }) {
    const [form, setForm] = useState({
        name: generalsettings?.name || '',
        mobile: generalsettings?.mobile || '',
        email: generalsettings?.email || '',
        address: generalsettings?.address || '',
        whatsapp: generalsettings?.whatsapp || '',
        facebook: generalsettings?.facebook || '',
        twitter: generalsettings?.twitter || '',
        youtube: generalsettings?.youtube || '',
        linkedin: generalsettings?.linkedin || '',
        instagram: generalsettings?.instagram || '',
        google_map: generalsettings?.google_map || '',
    });
    const [logo, setLogo] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach((k) => data.append(k, form[k] ?? ''));
        if (logo) data.append('logo', logo);

        router.post('/admin/settingpost', data, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title="General Settings">
            <Head title="Website Settings" />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Website Name *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Website Logo</label>
                            <div className="d-flex align-items-center gap-3">
                                {generalsettings?.logo && (
                                    <img
                                        src={`/generalsettings/${generalsettings.logo}`}
                                        alt="Current Logo"
                                        style={{ maxHeight: '40px', objectFit: 'contain' }}
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control form-control-sm"
                                    onChange={(e) => setLogo(e.target.files[0])}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Contact Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Contact Phone / Mobile</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.mobile}
                                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">WhatsApp Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.whatsapp}
                                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Physical Address</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                        </div>

                        <div className="col-12 mt-4">
                            <h6 className="fw-bold text-dark border-bottom pb-2">Social Media &amp; Maps</h6>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Facebook URL</label>
                            <input
                                type="url"
                                className="form-control"
                                value={form.facebook}
                                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Twitter / X URL</label>
                            <input
                                type="url"
                                className="form-control"
                                value={form.twitter}
                                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">LinkedIn URL</label>
                            <input
                                type="url"
                                className="form-control"
                                value={form.linkedin}
                                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Instagram URL</label>
                            <input
                                type="url"
                                className="form-control"
                                value={form.instagram}
                                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Google Maps Embed Link / Coordinates</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.google_map}
                                onChange={(e) => setForm({ ...form, google_map: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold">
                        Save Settings
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

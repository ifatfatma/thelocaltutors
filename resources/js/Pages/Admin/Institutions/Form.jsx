import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InstitutionFormFields from '../../../Components/InstitutionFormFields';

export default function Form({ institution = null, defaultType = 'coaching_institute', users = [] }) {
    const isEdit = Boolean(institution?.id);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        institution_type: institution?.institution_type || defaultType,
        user_id: institution?.user_id || '',
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
        verification_status: institution?.verification_status || 'approved',
        verified_badge: institution ? Boolean(institution.verified_badge) : true,
        is_active: institution ? Boolean(institution.is_active) : true,
        admin_notes: institution?.admin_notes || '',
    });

    const [files, setFiles] = useState({ logo: null, cover_image: null, brochure_pdf: null });
    const [galleryFiles, setGalleryFiles] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);

        const fd = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (['logo', 'cover_image', 'brochure_pdf'].includes(key)) return;
            if (['facilities', 'details', 'programs'].includes(key)) {
                fd.append(key, JSON.stringify(val));
            } else if (typeof val === 'boolean') {
                fd.append(key, val ? '1' : '0');
            } else {
                fd.append(key, val ?? '');
            }
        });
        if (files.logo) fd.append('logo', files.logo);
        if (files.cover_image) fd.append('cover_image', files.cover_image);
        if (files.brochure_pdf) fd.append('brochure_pdf', files.brochure_pdf);
        if (galleryFiles.length) {
            Array.from(galleryFiles).forEach((f) => fd.append('gallery_images[]', f));
        }

        const url = isEdit ? `/admin/institutions/${institution.id}/update` : '/admin/institutions';
        router.post(url, fd, {
            forceFormData: true,
            onFinish: () => setSaving(false),
        });
    };

    const handleDeletePhoto = (photoId) => {
        if (!confirm('Remove this campus photo?')) return;
        router.delete(`/admin/institutions/gallery/${photoId}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title={isEdit ? `Edit Institution: ${institution.name}` : 'Create New Institution'}>
            <Head title={isEdit ? `Edit ${institution.name}` : 'Add Institution'} />

            <div className="mb-3">
                <Link href="/admin/institutions" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                    <i className="bi bi-arrow-left me-1"></i>Back to Institutions
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                    <InstitutionFormFields
                        form={form}
                        setForm={setForm}
                        files={files}
                        setFiles={setFiles}
                        isAdmin={true}
                        allowTypeChange={true}
                        users={users}
                    />

                    {/* Campus Gallery Upload */}
                    <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                        <i className="bi bi-images text-info"></i>
                        <span>9. Campus Gallery Photos</span>
                    </h5>
                    <div className="mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="form-control form-control-sm mb-3"
                            onChange={(e) => setGalleryFiles(e.target.files)}
                        />
                        {institution?.galleries?.length > 0 && (
                            <div className="row g-2">
                                {institution.galleries.map((photo) => (
                                    <div key={photo.id} className="col-4 col-md-2">
                                        <div className="position-relative border rounded-3 overflow-hidden">
                                            <img src={photo.image_path} alt="Campus" className="w-100" style={{ height: '90px', objectFit: 'cover' }} />
                                            <button
                                                type="button"
                                                onClick={() => handleDeletePhoto(photo.id)}
                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 py-0 px-1"
                                            >
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-top d-flex gap-2">
                        <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 fw-semibold" disabled={saving}>
                            {saving ? 'Saving...' : isEdit ? 'Update Institution' : 'Create Institution'}
                        </button>
                        <Link href="/admin/institutions" className="btn btn-outline-secondary rounded-pill px-4 py-2">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

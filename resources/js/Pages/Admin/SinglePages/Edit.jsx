import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import RichTextEditor from '../../../components/RichTextEditor';

export default function Edit({ singlepages }) {
    const [title, setTitle] = useState(singlepages?.title || '');
    const [keyName, setKeyName] = useState(singlepages?.key_name || '');
    const [description, setDescription] = useState(singlepages?.description || '');
    const [isActive, setIsActive] = useState(
        singlepages?.is_active !== undefined ? String(singlepages.is_active) : '1'
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/singlepages/${singlepages.id}`, {
            title,
            key_name: keyName,
            description,
            is_active: isActive,
        });
    };

    return (
        <AdminLayout title={`Edit Page: ${singlepages?.title}`}>
            <Head title={`Edit Page: ${singlepages?.title}`} />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Page Title *</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Key Identifier</label>
                            <input
                                type="text"
                                className="form-control"
                                value={keyName}
                                onChange={(e) => setKeyName(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Status *</label>
                            <select
                                className="form-select"
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Page Content (HTML / Text)</label>
                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                                placeholder="Enter page content..."
                                minHeight="300px"
                            />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Update Page
                        </button>
                        <Link href="/admin/singlepages" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

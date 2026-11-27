import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function Gallery({ gallerylist = [] }) {
    const list = Array.isArray(gallerylist) ? gallerylist : [];

    return (
        <FrontLayout>
            <Head title="Gallery & Events" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold text-white mb-2">Our Gallery &amp; Events</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Gallery</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                {list.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-images fs-1 text-muted"></i>
                        <h4 className="mt-3 text-muted">No images found in gallery.</h4>
                    </div>
                ) : (
                    <div className="row g-4">
                        {list.map((item) => (
                            <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
                                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 position-relative group">
                                    <img
                                        src={`/gallery/${item.gallery_image}`}
                                        alt={item.title}
                                        className="card-img-top"
                                        style={{ height: '220px', objectFit: 'cover' }}
                                    />
                                    {item.title && (
                                        <div className="card-body p-3 text-center">
                                            <h6 className="fw-bold mb-0 text-dark small">{item.title}</h6>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </FrontLayout>
    );
}

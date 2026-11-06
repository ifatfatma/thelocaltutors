import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashAlert() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('danger');
            setVisible(true);
        } else if (flash?.message) {
            setMessage(flash.message);
            setType('info');
            setVisible(true);
        }
    }, [flash]);

    if (!visible || !message) return null;

    return (
        <div className="container mt-3">
            <div
                className={`alert alert-${type} alert-dismissible fade show d-flex align-items-center justify-content-between shadow-sm`}
                role="alert"
            >
                <div className="d-flex align-items-center">
                    <i
                        className={`bi ${
                            type === 'success'
                                ? 'bi-check-circle-fill'
                                : type === 'danger'
                                ? 'bi-exclamation-triangle-fill'
                                : 'bi-info-circle-fill'
                        } me-2 fs-5`}
                    ></i>
                    <span>{message}</span>
                </div>
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setVisible(false)}
                ></button>
            </div>
        </div>
    );
}

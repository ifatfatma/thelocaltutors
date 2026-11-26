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

    // Auto-dismiss after 4.5 seconds
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => {
            setVisible(false);
        }, 4500);
        return () => clearTimeout(timer);
    }, [visible]);

    if (!visible || !message) return null;

    const accentColor = type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : '#3b82f6';
    const iconClass = type === 'success' ? 'bi-check-circle-fill text-success' : type === 'danger' ? 'bi-exclamation-circle-fill text-danger' : 'bi-info-circle-fill text-primary';
    const titleText = type === 'success' ? 'Success' : type === 'danger' ? 'Error' : 'Notice';

    return (
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
                    borderLeft: `5px solid ${accentColor}`,
                    boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.18)',
                }}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex p-3 align-items-start gap-3">
                    <i className={`bi ${iconClass} fs-4 flex-shrink-0`}></i>
                    <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.925rem' }}>
                            {titleText}
                        </h6>
                        <p className="mb-0 text-secondary small" style={{ lineHeight: 1.4 }}>
                            {message}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn-close ms-2 mt-1"
                        aria-label="Close"
                        onClick={() => setVisible(false)}
                    ></button>
                </div>
            </div>
        </div>
    );
}

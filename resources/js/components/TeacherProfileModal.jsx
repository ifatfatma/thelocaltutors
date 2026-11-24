import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import TeacherCard from './TeacherCard';

/**
 * Universal Teacher Profile Pop-up Modal
 * Reusable across Home, SearchResults, Team, and Courses pages.
 * Displays the exact teacher card design requested:
 * - Location strictly limited to State, City, Country (no street/lane/house/pincode)
 * - Beautiful aligned academic details and quote box
 * - Book trial & leave review actions (self-review disabled)
 */
export default function TeacherProfileModal({
    isOpen,
    onClose,
    teacher,
    onBookTrial = null,
    teacherRating = '5',
    setTeacherRating = null,
    teacherReview = '',
    setTeacherReview = null,
    handlePostTeacherReview = null,
    reviewMsg = '',
    submittingReview = false,
}) {
    if (!isOpen || !teacher) return null;

    const { auth } = usePage().props;
    const currentUserId = auth?.user?.id ? Number(auth.user.id) : null;
    const currentUserEmail = auth?.user?.email ? auth.user.email.toLowerCase().trim() : null;
    const currentUserName = auth?.user?.name ? auth.user.name.toLowerCase().trim() : null;

    const teacherUserId = teacher.user_id ? Number(teacher.user_id) : null;
    const teacherId = teacher.id ? Number(teacher.id) : null;
    const teacherEmail = teacher.email ? teacher.email.toLowerCase().trim() : null;
    const teacherName = teacher.name ? teacher.name.toLowerCase().trim() : null;

    // Determine if the currently logged-in user is viewing their OWN profile
    const isSelf = Boolean(
        currentUserId && (
            (teacherUserId && currentUserId === teacherUserId) ||
            (teacherId && currentUserId === teacherId) ||
            (currentUserEmail && teacherEmail && currentUserEmail === teacherEmail) ||
            (currentUserName && teacherName && currentUserName === teacherName)
        )
    );

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(5px)',
                zIndex: 1060,
                overflowY: 'auto',
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-lg my-4"
                role="document"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="modal-content border-0 rounded-4 shadow-xl overflow-hidden"
                    style={{ backgroundColor: '#ffffff' }}
                >
                    {/* Modal Close Button */}
                    <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 10 }}>
                        <button
                            type="button"
                            className="btn btn-sm btn-light rounded-circle shadow-xs border d-flex align-items-center justify-content-center"
                            style={{ width: '34px', height: '34px' }}
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <i className="bi bi-x-lg text-dark"></i>
                        </button>
                    </div>

                    {/* The Exact Teacher Card Design */}
                    <div className="p-1">
                        <TeacherCard
                            teacher={teacher}
                            isModal={true}
                            onBookTrial={onBookTrial}
                            onViewProfile={null}
                            onExplore={onBookTrial}
                        />
                    </div>

                    {/* Review Section */}
                    {isSelf ? (
                        /* Self-review is strictly disabled */
                        <div className="px-4 pb-4 pt-1">
                            <div
                                className="p-3 rounded-4 d-flex align-items-center gap-3"
                                style={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                <div
                                    className="p-2 bg-primary-subtle text-primary rounded-circle fs-5 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ width: '38px', height: '38px' }}
                                >
                                    <i className="bi bi-person-check-fill"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>
                                        Your Educator Profile
                                    </h6>
                                    <p className="text-secondary mb-0 small" style={{ fontSize: '12px' }}>
                                        Self-reviews are disabled. Only other registered students and parents can leave verified reviews for your profile.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : handlePostTeacherReview ? (
                        /* Only other users can review another user */
                        <div className="px-4 pb-4 pt-1">
                            <div
                                className="p-3 rounded-4"
                                style={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                        <i className="bi bi-chat-heart text-primary"></i>
                                        Leave Verified Student / Parent Review
                                    </h6>
                                    {setTeacherRating && (
                                        <select
                                            className="form-select form-select-sm w-auto fw-semibold border rounded-pill"
                                            value={teacherRating}
                                            onChange={(e) => setTeacherRating(e.target.value)}
                                        >
                                            <option value="5">⭐⭐⭐⭐⭐ 5.0 Rating</option>
                                            <option value="4">⭐⭐⭐⭐ 4.0 Rating</option>
                                            <option value="3">⭐⭐⭐ 3.0 Rating</option>
                                            <option value="2">⭐⭐ 2.0 Rating</option>
                                            <option value="1">⭐ 1.0 Rating</option>
                                        </select>
                                    )}
                                </div>

                                {reviewMsg && (
                                    <div className="alert alert-info py-2 px-3 small rounded-3 mb-2">
                                        {reviewMsg}
                                    </div>
                                )}

                                {setTeacherReview && (
                                    <div className="d-flex flex-column gap-2">
                                        <textarea
                                            rows="2"
                                            className="form-control form-control-sm rounded-3"
                                            placeholder={`Share your experience with ${teacher.name || 'this tutor'}...`}
                                            value={teacherReview}
                                            onChange={(e) => setTeacherReview(e.target.value)}
                                        />
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                onClick={handlePostTeacherReview}
                                                disabled={submittingReview}
                                                className="btn btn-dark btn-sm rounded-pill px-4 fw-semibold shadow-xs"
                                            >
                                                {submittingReview ? 'Submitting...' : 'Post Review'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import IndiaLocationSelector from './IndiaLocationSelector';
import MapLocationPicker from '../components/MapLocationPicker';
import RichTextEditor from '../components/RichTextEditor';

export const INSTITUTION_TYPE_OPTIONS = [
    { value: 'coaching_institute', label: 'Coaching Institute', icon: 'bi-building' },
    { value: 'school', label: 'School', icon: 'bi-backpack4' },
    { value: 'college', label: 'College', icon: 'bi-mortarboard' },
    { value: 'university', label: 'University', icon: 'bi-bank' },
];

export const FACILITY_OPTIONS = [
    'Library',
    'Computer Lab',
    'Science Labs',
    'Smart Classrooms',
    'Hostel',
    'Transport / Bus',
    'Sports Complex',
    'Cafeteria / Canteen',
    'Wi-Fi Campus',
    'CCTV Security',
    'Auditorium',
    'Medical Room',
    'Scholarship Desk',
    'Placement Cell',
    'AC Classrooms',
    'Doubt Clearing Room',
];

const COACHING_EXAMS = ['JEE Main & Adv', 'NEET Medical', 'UPSC / WBCS', 'Banking / SSC', 'Board Tuition (CBSE/ICSE/WBBSE)', 'CAT / MBA', 'GATE', 'CLAT / Law', 'CUET', 'Foundation (Class 6-10)'];
const BATCH_MODES = ['Offline Classroom', 'Live Online', 'Hybrid'];
const SCHOOL_BOARDS = ['CBSE', 'ICSE / ISC', 'WBBSE / WBCHSE', 'IB', 'IGCSE / Cambridge', 'State Board', 'NIOS'];
const COLLEGE_STREAMS = ['Science', 'Commerce', 'Arts & Humanities', 'Engineering & Tech', 'Medical & Allied', 'Management / BBA / MBA', 'Law', 'Computer Applications (BCA/MCA)'];
const DEGREE_LEVELS = ['UG (Undergraduate)', 'PG (Postgraduate)', 'Diploma / Certificate', 'Integrated', 'PhD / Doctoral'];
const UNI_APPROVALS = ['UGC', 'AICTE', 'NAAC Accredited', 'NIRF Ranked', 'BCI', 'NMC / MCI', 'PCI', 'NBA'];
const ENTRANCE_EXAMS = ['CUET', 'JEE Main', 'NEET', 'GATE', 'CAT / MAT', 'CLAT', 'WBJEE', 'University Own Entrance', 'Direct Merit'];

/**
 * Shared Institution Form Component
 * Used by BOTH Institution Self-Management Dashboard AND Admin Panel Create/Edit
 */
export default function InstitutionFormFields({
    form,
    setForm,
    files,
    setFiles,
    errors = {},
    isAdmin = false,
    allowTypeChange = true,
    users = [],
}) {
    const details = form.details || {};
    const facilities = Array.isArray(form.facilities) ? form.facilities : [];
    const programs = Array.isArray(form.programs) ? form.programs : [];

    const setDetail = (key, val) => {
        setForm((prev) => ({
            ...prev,
            details: {
                ...(prev.details || {}),
                [key]: val,
            },
        }));
    };

    const toggleDetailArray = (key, item) => {
        const current = Array.isArray(details[key]) ? [...details[key]] : [];
        const idx = current.indexOf(item);
        if (idx > -1) current.splice(idx, 1);
        else current.push(item);
        setDetail(key, current);
    };

    const toggleFacility = (fac) => {
        const current = [...facilities];
        const idx = current.indexOf(fac);
        if (idx > -1) current.splice(idx, 1);
        else current.push(fac);
        setForm((prev) => ({ ...prev, facilities: current }));
    };

    const addProgram = () => {
        setForm((prev) => ({
            ...prev,
            programs: [
                ...(prev.programs || []),
                { title: '', level: '', duration: '', mode: 'Offline', fee_amount: '', seat_intake: '', eligibility: '', description: '' },
            ],
        }));
    };

    const updateProgram = (index, field, val) => {
        setForm((prev) => {
            const list = [...(prev.programs || [])];
            list[index] = { ...list[index], [field]: val };
            return { ...prev, programs: list };
        });
    };

    const removeProgram = (index) => {
        setForm((prev) => ({
            ...prev,
            programs: (prev.programs || []).filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="institution-form-fields">
            {/* 1. BASIC ORGANIZATION INFORMATION */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-building-fill text-primary"></i>
                <span>1. Basic Organization Information</span>
            </h5>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Institution Category *</label>
                    <select
                        className="form-select"
                        value={form.institution_type}
                        onChange={(e) => setForm({ ...form, institution_type: e.target.value })}
                        disabled={!allowTypeChange}
                        required
                    >
                        {INSTITUTION_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-8">
                    <label className="form-label small fw-semibold text-secondary">Institution Name *</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="e.g. Apex IIT-JEE & NEET Academy / St. Xavier's High School"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Tagline / Short Motto</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Shaping Future Engineers & Doctors Since 2005"
                        value={form.tagline || ''}
                        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Established Year</label>
                    <input
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        className="form-control"
                        placeholder="e.g. 2008"
                        value={form.established_year || ''}
                        onChange={(e) => setForm({ ...form, established_year: e.target.value })}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Ownership Type</label>
                    <select
                        className="form-select"
                        value={form.ownership_type || ''}
                        onChange={(e) => setForm({ ...form, ownership_type: e.target.value })}
                    >
                        <option value="">Select Ownership</option>
                        <option value="Private">Private</option>
                        <option value="Government">Government</option>
                        <option value="Government Aided">Government Aided</option>
                        <option value="Trust / Society">Trust / Society</option>
                        <option value="Public-Private">Public-Private</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Official Phone *</label>
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="Phone / Helpline"
                        value={form.phone || ''}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">WhatsApp Number</label>
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="WhatsApp for admissions"
                        value={form.whatsapp || ''}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Official Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="admissions@institute.edu"
                        value={form.email || ''}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Website URL</label>
                    <input
                        type="url"
                        className="form-control"
                        placeholder="https://www.example.edu"
                        value={form.website || ''}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Admission Status</label>
                    <select
                        className="form-select"
                        value={form.admission_status || 'open'}
                        onChange={(e) => setForm({ ...form, admission_status: e.target.value })}
                    >
                        <option value="open">Admissions Open</option>
                        <option value="upcoming">Admissions Upcoming</option>
                        <option value="closed">Admissions Closed</option>
                    </select>
                </div>

                <div className="col-md-8">
                    <label className="form-label small fw-semibold text-secondary">Overall Fee Range</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. ₹25,000 – ₹1,20,000 / year"
                        value={form.fee_range || ''}
                        onChange={(e) => setForm({ ...form, fee_range: e.target.value })}
                    />
                </div>
            </div>

            {/* 2. CATEGORY-SPECIFIC ACADEMIC DETAILS */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                <i className="bi bi-mortarboard-fill text-primary"></i>
                <span>
                    2.{' '}
                    {form.institution_type === 'coaching_institute'
                        ? 'Coaching Institute Details (Exams, Batches & Results)'
                        : form.institution_type === 'school'
                        ? 'School Academics (Board, Grades & Medium)'
                        : form.institution_type === 'college'
                        ? 'College Academics (Affiliation, Accreditation & Placements)'
                        : 'University Academics (Approvals, Faculties & Rankings)'}
                </span>
            </h5>

            <div className="p-3 p-md-4 bg-light rounded-4 border mb-4">
                {/* COACHING INSTITUTE FIELDS */}
                {form.institution_type === 'coaching_institute' && (
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label small fw-semibold text-secondary d-block">Target Exams &amp; Categories</label>
                            <div className="d-flex flex-wrap gap-2">
                                {COACHING_EXAMS.map((exam) => {
                                    const active = (details.target_exams || []).includes(exam);
                                    return (
                                        <button
                                            key={exam}
                                            type="button"
                                            onClick={() => toggleDetailArray('target_exams', exam)}
                                            className={`btn btn-sm rounded-pill px-3 ${active ? 'btn-primary text-white' : 'btn-white bg-white border text-secondary'}`}
                                        >
                                            {active && <i className="bi bi-check2 me-1"></i>}
                                            {exam}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary d-block">Batch Modes</label>
                            <div className="d-flex flex-wrap gap-2">
                                {BATCH_MODES.map((mode) => {
                                    const active = (details.batch_modes || []).includes(mode);
                                    return (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => toggleDetailArray('batch_modes', mode)}
                                            className={`btn btn-sm rounded-pill px-3 ${active ? 'btn-success text-white' : 'btn-white bg-white border text-secondary'}`}
                                        >
                                            {mode}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary">Demo Class Availability</label>
                            <select
                                className="form-select"
                                value={details.demo_class_available ? 'yes' : 'no'}
                                onChange={(e) => setDetail('demo_class_available', e.target.value === 'yes')}
                            >
                                <option value="yes">Yes — Free Demo / Trial Class Available</option>
                                <option value="no">No Demo Class</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Batch Timings</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Morning 7AM-10AM, Evening 4PM-8PM"
                                value={details.batch_timings || ''}
                                onChange={(e) => setDetail('batch_timings', e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Average Batch Size</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 25–30 students per batch"
                                value={details.batch_size || ''}
                                onChange={(e) => setDetail('batch_size', e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Faculty Strength</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 15+ IIT/NIT/PhD Educators"
                                value={details.faculty_count || ''}
                                onChange={(e) => setDetail('faculty_count', e.target.value)}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label small fw-semibold text-secondary">Past Results &amp; Rank Highlights</label>
                            <RichTextEditor
                                value={details.past_results || ''}
                                onChange={(val) => setDetail('past_results', val)}
                                placeholder="Highlight top ranks, selection ratios, board toppers..."
                                minHeight="130px"
                            />
                        </div>
                    </div>
                )}

                {/* SCHOOL FIELDS */}
                {form.institution_type === 'school' && (
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Affiliated Board *</label>
                            <select
                                className="form-select"
                                value={details.affiliated_board || ''}
                                onChange={(e) => setDetail('affiliated_board', e.target.value)}
                            >
                                <option value="">Select Board</option>
                                {SCHOOL_BOARDS.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Grade / Class Range</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Nursery – Class 12 (Science/Comm/Arts)"
                                value={details.grade_range || ''}
                                onChange={(e) => setDetail('grade_range', e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Medium of Instruction</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. English / Bengali / Bilingual"
                                value={details.medium || ''}
                                onChange={(e) => setDetail('medium', e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Co-ed / Gender Type</label>
                            <select
                                className="form-select"
                                value={details.school_gender_type || 'Co-educational'}
                                onChange={(e) => setDetail('school_gender_type', e.target.value)}
                            >
                                <option value="Co-educational">Co-educational</option>
                                <option value="Boys Only">Boys Only</option>
                                <option value="Girls Only">Girls Only</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Day / Boarding Type</label>
                            <select
                                className="form-select"
                                value={details.school_residential_type || 'Day School'}
                                onChange={(e) => setDetail('school_residential_type', e.target.value)}
                            >
                                <option value="Day School">Day School</option>
                                <option value="Boarding School">Boarding School</option>
                                <option value="Day-cum-Boarding">Day-cum-Boarding</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Student-Teacher Ratio</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 20:1"
                                value={details.student_teacher_ratio || ''}
                                onChange={(e) => setDetail('student_teacher_ratio', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* COLLEGE FIELDS */}
                {form.institution_type === 'college' && (
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary">Affiliated University</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. University of Calcutta / MAKAUT / Delhi University"
                                value={details.affiliated_university || ''}
                                onChange={(e) => setDetail('affiliated_university', e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary">Accreditation &amp; Approvals</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. NAAC A+, UGC Recognized, AICTE Approved"
                                value={details.accreditation || ''}
                                onChange={(e) => setDetail('accreditation', e.target.value)}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label small fw-semibold text-secondary d-block">Academic Streams</label>
                            <div className="d-flex flex-wrap gap-2">
                                {COLLEGE_STREAMS.map((st) => {
                                    const active = (details.streams || []).includes(st);
                                    return (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => toggleDetailArray('streams', st)}
                                            className={`btn btn-sm rounded-pill px-3 ${active ? 'btn-primary text-white' : 'btn-white bg-white border text-secondary'}`}
                                        >
                                            {st}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary d-block">Degree Levels</label>
                            <div className="d-flex flex-wrap gap-2">
                                {DEGREE_LEVELS.map((lvl) => {
                                    const active = (details.degree_levels || []).includes(lvl);
                                    return (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => toggleDetailArray('degree_levels', lvl)}
                                            className={`btn btn-sm rounded-pill px-3 ${active ? 'btn-info text-white' : 'btn-white bg-white border text-secondary'}`}
                                        >
                                            {lvl}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-semibold text-secondary">Total Seat Intake</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 1,200 seats / year"
                                value={details.seat_intake || ''}
                                onChange={(e) => setDetail('seat_intake', e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-semibold text-secondary">Eligibility Criteria</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 10+2 with 60% / WBJEE"
                                value={details.eligibility_criteria || ''}
                                onChange={(e) => setDetail('eligibility_criteria', e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary">Average Placement Package</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. ₹6.5 LPA"
                                value={details.average_package || ''}
                                onChange={(e) => setDetail('average_package', e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary">Highest Placement Package</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. ₹28 LPA"
                                value={details.highest_package || ''}
                                onChange={(e) => setDetail('highest_package', e.target.value)}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label small fw-semibold text-secondary">Placement Highlights &amp; Top Recruiters</label>
                            <RichTextEditor
                                value={details.placement_highlights || ''}
                                onChange={(val) => setDetail('placement_highlights', val)}
                                placeholder="List placement percentage, top recruiting companies, internship support..."
                                minHeight="130px"
                            />
                        </div>
                    </div>
                )}

                {/* UNIVERSITY FIELDS */}
                {form.institution_type === 'university' && (
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">University Type</label>
                            <select
                                className="form-select"
                                value={details.university_type || ''}
                                onChange={(e) => setDetail('university_type', e.target.value)}
                            >
                                <option value="">Select Type</option>
                                <option value="Central University">Central University</option>
                                <option value="State University">State University</option>
                                <option value="Deemed University">Deemed University</option>
                                <option value="Private University">Private University</option>
                                <option value="Institute of National Importance">Institute of National Importance</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">NIRF / National Ranking</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. NIRF Top 50 Overall / NAAC A++"
                                value={details.nirf_ranking || ''}
                                onChange={(e) => setDetail('nirf_ranking', e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-secondary">Campus Area</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 120 Acres Green Campus"
                                value={details.campus_area || ''}
                                onChange={(e) => setDetail('campus_area', e.target.value)}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label small fw-semibold text-secondary d-block">Approvals &amp; Accreditations</label>
                            <div className="d-flex flex-wrap gap-2">
                                {UNI_APPROVALS.map((app) => {
                                    const active = (details.approvals || []).includes(app);
                                    return (
                                        <button
                                            key={app}
                                            type="button"
                                            onClick={() => toggleDetailArray('approvals', app)}
                                            className={`btn btn-sm rounded-pill px-3 ${active ? 'btn-primary text-white' : 'btn-white bg-white border text-secondary'}`}
                                        >
                                            {app}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary d-block">Program Levels Offered</label>
                            <div className="d-flex flex-wrap gap-2">
                                {DEGREE_LEVELS.map((lvl) => {
                                    const active = (details.program_levels || []).includes(lvl);
                                    return (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => toggleDetailArray('program_levels', lvl)}
                                            className={`btn btn-sm rounded-pill px-3 ${active ? 'btn-success text-white' : 'btn-white bg-white border text-secondary'}`}
                                        >
                                            {lvl}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary d-block">Entrance Exams Accepted</label>
                            <div className="d-flex flex-wrap gap-2">
                                {ENTRANCE_EXAMS.map((ex) => {
                                    const active = (details.entrance_exams || []).includes(ex);
                                    return (
                                        <button
                                            key={ex}
                                            type="button"
                                            onClick={() => toggleDetailArray('entrance_exams', ex)}
                                            className={`btn btn-sm rounded-pill px-3 ${active ? 'btn-danger text-white' : 'btn-white bg-white border text-secondary'}`}
                                        >
                                            {ex}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label small fw-semibold text-secondary">Departments / Faculties</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Faculty of Engineering, School of Management, Law, Life Sciences, Humanities"
                                value={details.departments || ''}
                                onChange={(e) => setDetail('departments', e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary">Scholarships &amp; Financial Aid</label>
                            <RichTextEditor
                                value={details.scholarships || ''}
                                onChange={(val) => setDetail('scholarships', val)}
                                placeholder="Merit scholarships, government aid, fee waivers..."
                                minHeight="120px"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-secondary">Placement Stats &amp; Research</label>
                            <RichTextEditor
                                value={details.placement_stats || ''}
                                onChange={(val) => setDetail('placement_stats', val)}
                                placeholder="Median package, global recruiters, research centers..."
                                minHeight="120px"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* 3. CAMPUS FACILITIES */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                <i className="bi bi-stars text-warning"></i>
                <span>3. Campus Facilities &amp; Infrastructure</span>
            </h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
                {FACILITY_OPTIONS.map((fac) => {
                    const active = facilities.includes(fac);
                    return (
                        <button
                            key={fac}
                            type="button"
                            onClick={() => toggleFacility(fac)}
                            className={`btn btn-sm rounded-pill px-3 py-1 border ${
                                active ? 'btn-primary text-white' : 'btn-light text-secondary'
                            }`}
                        >
                            <i className={`bi ${active ? 'bi-check-circle-fill' : 'bi-plus-circle'} me-1`}></i>
                            {fac}
                        </button>
                    );
                })}
            </div>

            {/* 4. OVERVIEW & ADMISSION PROCESS */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                <i className="bi bi-file-text-fill text-primary"></i>
                <span>4. Overview &amp; Admission Process</span>
            </h5>
            <div className="row g-3 mb-4">
                <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Institution Overview</label>
                    <RichTextEditor
                        value={form.overview || ''}
                        onChange={(val) => setForm({ ...form, overview: val })}
                        placeholder="Describe your institution's history, pedagogy, strengths, and achievements..."
                        minHeight="160px"
                    />
                </div>
                <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Admission Process &amp; Key Dates</label>
                    <RichTextEditor
                        value={form.admission_process || ''}
                        onChange={(val) => setForm({ ...form, admission_process: val })}
                        placeholder="Explain how students can apply, entrance tests, counseling, and documents required..."
                        minHeight="130px"
                    />
                </div>
            </div>

            {/* 5. COURSES / PROGRAMS & FEE STRUCTURE */}
            <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3 mt-4">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-journal-bookmark-fill text-success"></i>
                    <span>5. Courses / Programs &amp; Fee Structure</span>
                </h5>
                <button type="button" onClick={addProgram} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold">
                    <i className="bi bi-plus-lg me-1"></i>Add Program / Course
                </button>
            </div>

            {programs.length === 0 ? (
                <div className="p-4 bg-light rounded-4 border text-center text-muted small mb-4">
                    No programs added yet. Click <strong>"Add Program / Course"</strong> to list your courses, batches, degrees, or classes with fees.
                </div>
            ) : (
                <div className="d-flex flex-column gap-3 mb-4">
                    {programs.map((prog, idx) => (
                        <div key={idx} className="p-3 bg-light rounded-4 border position-relative">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="badge bg-primary-subtle text-primary rounded-pill">Program #{idx + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => removeProgram(idx)}
                                    className="btn btn-sm btn-outline-danger rounded-pill px-2 py-0"
                                >
                                    <i className="bi bi-trash me-1"></i>Remove
                                </button>
                            </div>
                            <div className="row g-2">
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Program / Course Title (e.g. B.Tech CSE / 2-Year NEET Batch)"
                                        value={prog.title || ''}
                                        onChange={(e) => updateProgram(idx, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Level (e.g. UG / Class 11-12)"
                                        value={prog.level || ''}
                                        onChange={(e) => updateProgram(idx, 'level', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Duration (e.g. 4 Yrs)"
                                        value={prog.duration || ''}
                                        onChange={(e) => updateProgram(idx, 'duration', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <select
                                        className="form-select form-select-sm"
                                        value={prog.mode || 'Offline'}
                                        onChange={(e) => updateProgram(idx, 'mode', e.target.value)}
                                    >
                                        <option value="Offline">Offline</option>
                                        <option value="Online">Online</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Full-Time">Full-Time</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Fee Amount (e.g. ₹65,000 / year)"
                                        value={prog.fee_amount || ''}
                                        onChange={(e) => updateProgram(idx, 'fee_amount', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Seat Intake (e.g. 60 Seats)"
                                        value={prog.seat_intake || ''}
                                        onChange={(e) => updateProgram(idx, 'seat_intake', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Eligibility (e.g. 10+2 Science 60%)"
                                        value={prog.eligibility || ''}
                                        onChange={(e) => updateProgram(idx, 'eligibility', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 6. MEDIA & BROCHURE */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                <i className="bi bi-image-fill text-info"></i>
                <span>6. Logo, Cover Banner &amp; Brochure PDF</span>
            </h5>
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Institution Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control form-control-sm"
                        onChange={(e) => setFiles((prev) => ({ ...prev, logo: e.target.files[0] }))}
                    />
                    {form.logo && (
                        <img src={form.logo} alt="Logo" className="mt-2 rounded-3 border" style={{ height: '54px', objectFit: 'contain' }} />
                    )}
                </div>
                <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Campus Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control form-control-sm"
                        onChange={(e) => setFiles((prev) => ({ ...prev, cover_image: e.target.files[0] }))}
                    />
                    {form.cover_image && (
                        <img src={form.cover_image} alt="Cover" className="mt-2 rounded-3 border" style={{ height: '54px', width: '100px', objectFit: 'cover' }} />
                    )}
                </div>
                <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Prospectus / Brochure (PDF)</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="form-control form-control-sm"
                        onChange={(e) => setFiles((prev) => ({ ...prev, brochure_pdf: e.target.files[0] }))}
                    />
                    {form.brochure_pdf && (
                        <a href={form.brochure_pdf} target="_blank" rel="noopener noreferrer" className="btn btn-link btn-sm px-0 mt-1 text-decoration-none">
                            <i className="bi bi-file-earmark-pdf-fill text-danger me-1"></i>View Uploaded Brochure
                        </a>
                    )}
                </div>
            </div>

            {/* 7. LOCATION & GOOGLE MAPS RADIUS COORDINATES */}
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill text-danger"></i>
                <span>7. Campus Address &amp; Map Coordinates (Radius Search)</span>
            </h5>
            <div className="p-3 p-md-4 bg-light rounded-4 border mb-4">
                <IndiaLocationSelector
                    stateValue={form.state || ''}
                    cityValue={form.city || ''}
                    areaValue={form.address || ''}
                    pincodeValue={form.pincode || ''}
                    onStateChange={(st) => setForm((prev) => ({ ...prev, state: st, city: '' }))}
                    onCityChange={(ct) => setForm((prev) => ({ ...prev, city: ct }))}
                    onAreaChange={(ar) => setForm((prev) => ({ ...prev, address: ar, area: ar }))}
                    onPincodeChange={(pin) => setForm((prev) => ({ ...prev, pincode: pin }))}
                    stateLabel="State / Union Territory"
                    cityLabel="City / District"
                    areaLabel="Full Campus Street Address / Area"
                    pincodeLabel="PIN Code (6 digits)"
                />

                <div className="mt-4 pt-3 border-top">
                    <MapLocationPicker
                        latitude={form.latitude}
                        longitude={form.longitude}
                        onChange={({ lat, lng, area, pincode }) => {
                            setForm((prev) => ({
                                ...prev,
                                latitude: lat,
                                longitude: lng,
                                ...(area && !prev.address ? { address: area, area } : {}),
                                ...(pincode && !prev.pincode ? { pincode } : {}),
                            }));
                        }}
                        stateName={form.state}
                        cityName={form.city}
                        areaName={form.address}
                        pincode={form.pincode}
                        height="340px"
                    />
                </div>
            </div>

            {/* 8. ADMIN-ONLY OWNERSHIP & APPROVAL CONTROLS */}
            {isAdmin && (
                <>
                    <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 mt-4 d-flex align-items-center gap-2">
                        <i className="bi bi-shield-lock-fill text-danger"></i>
                        <span>8. Admin Verification, Status &amp; Account Ownership</span>
                    </h5>
                    <div className="p-3 p-md-4 bg-primary-subtle bg-opacity-25 rounded-4 border border-primary-subtle mb-4">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small fw-semibold text-secondary">Verification Status</label>
                                <select
                                    className="form-select"
                                    value={form.verification_status || 'approved'}
                                    onChange={(e) => setForm({ ...form, verification_status: e.target.value })}
                                >
                                    <option value="pending">Pending Review</option>
                                    <option value="approved">Approved (Publicly Visible)</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small fw-semibold text-secondary">Link User Account (Optional)</label>
                                <select
                                    className="form-select"
                                    value={form.user_id || ''}
                                    onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                                >
                                    <option value="">-- Admin-Managed (No Linked Account) --</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            #{u.id} — {u.name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4 d-flex align-items-end gap-4 pb-2">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="instActiveToggle"
                                        checked={Boolean(form.is_active)}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    />
                                    <label className="form-check-label small fw-semibold" htmlFor="instActiveToggle">
                                        Active Listing
                                    </label>
                                </div>

                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="instVerifiedToggle"
                                        checked={Boolean(form.verified_badge)}
                                        onChange={(e) => setForm({ ...form, verified_badge: e.target.checked })}
                                    />
                                    <label className="form-check-label small fw-semibold" htmlFor="instVerifiedToggle">
                                        Verified Badge
                                    </label>
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-semibold text-secondary">Internal Admin Notes</label>
                                <textarea
                                    rows="2"
                                    className="form-control"
                                    placeholder="Optional verification notes or rejection reason..."
                                    value={form.admin_notes || ''}
                                    onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

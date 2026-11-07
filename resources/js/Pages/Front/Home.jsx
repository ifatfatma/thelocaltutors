import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

export default function Home({
    pageData,
    popularCategories = [],
    courses = [],
    blogs = [],
    teachers = [],
    stats = { courses: 0, teachers: 0, students: 0 },
    states = [],
    subjects = [],
    boards = [],
}) {
    const [searchState, setSearchState] = useState({
        lookingfor: 'teacher',
        search_state: '0',
        search_district: '0',
        search_city: '0',
        search_subject: '0',
        search_board: '0',
        search_gender: '',
        search_radius: '0',
        user_lat: '',
        user_lng: '',
    });
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [geoActive, setGeoActive] = useState(false);
    const [loadingGeo, setLoadingGeo] = useState(false);
    const [geoMsg, setGeoMsg] = useState('');

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeoMsg('Geolocation is not supported by your browser.');
            return;
        }

        setLoadingGeo(true);
        setGeoMsg('Detecting your GPS location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);

                setSearchState((prev) => ({
                    ...prev,
                    search_radius: '1',
                    user_lat: lat,
                    user_lng: lng,
                }));

                setLoadingGeo(false);
                setGeoActive(true);
                setGeoMsg('📍 Location acquired! Ready to find tutors within 1 km.');

                axios.get(`/savelatlong/${lat}/${lng}`).catch(() => {});
            },
            (error) => {
                setLoadingGeo(false);
                let msg = 'Unable to fetch your location.';
                if (error.code === 1) {
                    msg = 'Location permission denied. Please allow location access in your browser.';
                } else if (error.code === 2) {
                    msg = 'Location unavailable. Please check your GPS/internet connection.';
                }
                setGeoMsg(msg);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleStateChange = async (e) => {
        const stateId = e.target.value;
        setSearchState((prev) => ({ ...prev, search_state: stateId, search_district: '0', search_city: '0' }));
        setDistricts([]);
        setCities([]);

        if (stateId && stateId !== '0') {
            setLoadingDistricts(true);
            try {
                const res = await axios.get(`/get-districts?state_id=${stateId}`);
                setDistricts(res.data || []);
            } catch (err) {
                try {
                    const fallback = await axios.get(`/getDistrictAjax/${stateId}`);
                    setDistricts(fallback.data || []);
                } catch (e2) {
                    console.error('Error fetching districts:', err);
                }
            } finally {
                setLoadingDistricts(false);
            }
        }
    };

    const handleDistrictChange = async (e) => {
        const distId = e.target.value;
        setSearchState((prev) => ({ ...prev, search_district: distId, search_city: '0' }));
        setCities([]);

        if (distId && distId !== '0') {
            setLoadingCities(true);
            try {
                const res = await axios.get(`/get-cities?district_id=${distId}`);
                setCities(res.data || []);
            } catch (err) {
                try {
                    const fallback = await axios.get(`/getCityAjax/${distId}`);
                    setCities(fallback.data || []);
                } catch (e2) {
                    console.error('Error fetching cities:', err);
                }
            } finally {
                setLoadingCities(false);
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/search', searchState);
    };

    const handleToggleFav = async (courseId) => {
        try {
            const res = await axios.get(`/myfavcourse/ajax?id=${courseId}`);
            alert(res.data.message);
        } catch (err) {
            alert('Please login to save courses.');
        }
    };

    return (
        <FrontLayout>
            <Head title="Home - Find Expert Tutors Near You" />

            {/* Hero Section */}
            <section className="hero-section py-5 bg-light position-relative overflow-hidden border-bottom">
                <div className="container py-lg-4">
                    <div className="row align-items-center gy-4">
                        <div className="col-lg-6">
                            <span className="badge bg-primary-subtle text-primary fw-bold mb-3 px-3 py-2 rounded-pill">
                                Top Rated Learning Platform
                            </span>
                            <h1 className="display-5 fw-bold text-dark lh-sm mb-3">
                                Find the Perfect <span className="text-primary">Tutor</span> in Your Local Area
                            </h1>
                            <p className="lead text-muted mb-4">
                                Connect with qualified home and online teachers, coaching institutes, schools, and colleges for all subjects and boards.
                            </p>

                            {/* Search Form Card */}
                            <div className="card shadow border-0 rounded-4 p-3 p-md-4 bg-white">
                                <h5 className="fw-bold mb-3 text-dark d-flex align-items-center">
                                    <i className="bi bi-search text-primary me-2"></i>
                                    What are you looking for?
                                </h5>
                                <form onSubmit={handleSearch}>
                                    <div className="row g-2">
                                        <div className="col-sm-6">
                                            <select
                                                className="form-select form-select-sm"
                                                value={searchState.lookingfor}
                                                onChange={(e) => setSearchState({ ...searchState, lookingfor: e.target.value })}
                                            >
                                                <option value="teacher">Tutors / Teachers</option>
                                                <option value="coaching-center">Coaching Center</option>
                                                <option value="schools">Schools</option>
                                                <option value="college">Colleges</option>
                                                <option value="university">Universities</option>
                                            </select>
                                        </div>

                                        <div className="col-sm-6">
                                            <select
                                                className="form-select form-select-sm"
                                                value={searchState.search_state}
                                                onChange={handleStateChange}
                                            >
                                                <option value="0">Select State</option>
                                                {states.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-sm-6">
                                            <select
                                                className="form-select form-select-sm"
                                                value={searchState.search_district}
                                                onChange={handleDistrictChange}
                                                disabled={searchState.search_state === '0' || loadingDistricts}
                                            >
                                                <option value="0">
                                                    {loadingDistricts ? 'Loading Districts...' : 'Select District'}
                                                </option>
                                                {districts.map((d) => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-sm-6">
                                            <select
                                                className="form-select form-select-sm"
                                                value={searchState.search_city}
                                                onChange={(e) => setSearchState((prev) => ({ ...prev, search_city: e.target.value }))}
                                                disabled={searchState.search_district === '0' || loadingCities}
                                            >
                                                <option value="0">
                                                    {loadingCities
                                                        ? 'Loading Cities...'
                                                        : (searchState.search_district !== '0' && cities.length === 0)
                                                            ? 'No Cities Found'
                                                            : 'Select City'}
                                                </option>
                                                {cities.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-sm-6">
                                            <select
                                                className="form-select form-select-sm"
                                                value={searchState.search_subject}
                                                onChange={(e) => setSearchState({ ...searchState, search_subject: e.target.value })}
                                            >
                                                <option value="0">Select Subject</option>
                                                {subjects.map((sub) => (
                                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-sm-6">
                                            <select
                                                className="form-select form-select-sm"
                                                value={searchState.search_board}
                                                onChange={(e) => setSearchState({ ...searchState, search_board: e.target.value })}
                                            >
                                                <option value="0">Select Board</option>
                                                {boards.map((b) => (
                                                    <option key={b.id} value={b.id}>{b.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-sm-6">
                                            <select
                                                className="form-select form-select-sm"
                                                value={searchState.search_radius}
                                                onChange={(e) => setSearchState({ ...searchState, search_radius: e.target.value })}
                                            >
                                                <option value="0">All Locations (City-wide)</option>
                                                <option value="1">Within 1 KM (Nearest)</option>
                                                <option value="2">Within 2 KM</option>
                                                <option value="3">Within 3 KM</option>
                                                <option value="5">Within 5 KM</option>
                                                <option value="10">Within 10 KM</option>
                                            </select>
                                        </div>

                                        <div className="col-12 mt-2">
                                            <button
                                                type="button"
                                                className={`btn btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold ${
                                                    geoActive ? 'btn-success text-white' : 'btn-outline-primary'
                                                }`}
                                                onClick={handleUseCurrentLocation}
                                                disabled={loadingGeo}
                                            >
                                                {loadingGeo ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        <span>Detecting your GPS location...</span>
                                                    </>
                                                ) : geoActive ? (
                                                    <>
                                                        <i className="bi bi-geo-alt-fill"></i>
                                                        <span>📍 Browsing Near You (1 km Radius Active)</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-crosshair"></i>
                                                        <span>Use My Current Location (Search 1 km Radius)</span>
                                                    </>
                                                )}
                                            </button>
                                            {geoMsg && (
                                                <div className={`small text-center mt-1 fw-semibold ${geoActive ? 'text-success' : 'text-danger'}`}>
                                                    {geoMsg}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-12 mt-3">
                                            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm">
                                                <i className="bi bi-search"></i>
                                                <span>Search Now</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="col-lg-6 text-center">
                            <img
                                src="/front/img/bg-img/home-4/c-1.png"
                                onError={(e) => { e.target.src = '/front/img/bg-img/light.png'; }}
                                alt="Tutoring Platform"
                                className="img-fluid rounded-4 shadow-sm"
                                style={{ maxHeight: '450px' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Banner */}
            <section className="stats-section py-4 bg-primary text-white">
                <div className="container">
                    <div className="row text-center gy-3">
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold mb-0">{stats.courses || 120}+</h2>
                            <p className="text-white-50 mb-0 small">Active Courses</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold mb-0">{stats.teachers || 250}+</h2>
                            <p className="text-white-50 mb-0 small">Verified Teachers</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold mb-0">{stats.students || 1500}+</h2>
                            <p className="text-white-50 mb-0 small">Enrolled Students</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold mb-0">99%</h2>
                            <p className="text-white-50 mb-0 small">Success &amp; Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="categories-section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-primary fw-bold text-uppercase small">Top Categories</span>
                        <h2 className="fw-bold text-dark">Explore by Course Category</h2>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {popularCategories.map((cat) => (
                            <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                                <Link
                                    href={`/course/${cat.id}/${cat.slug}`}
                                    className="card h-100 text-center border-0 shadow-sm rounded-4 p-4 text-decoration-none hover-shadow transition"
                                >
                                    <div className="category-img mb-3">
                                        <img
                                            src={cat.image ? `/coursecategory/${cat.image}` : '/front/img/noimage.jpg'}
                                            alt={cat.title}
                                            className="img-fluid rounded-circle"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">{cat.title}</h5>
                                    <span className="text-muted small">View Courses &rarr;</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            {courses.length > 0 && (
                <section className="courses-section py-5 bg-light">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <span className="text-primary fw-bold text-uppercase small">Featured Offerings</span>
                                <h2 className="fw-bold text-dark mb-0">Popular Courses</h2>
                            </div>
                            <Link href="/all_course" className="btn btn-outline-primary btn-sm">
                                View All Courses
                            </Link>
                        </div>

                        <div className="row g-4">
                            {courses.map((course) => (
                                <div key={course.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="position-relative">
                                            <img
                                                src={course.image ? `/course/${course.image}` : '/front/img/noimage.jpg'}
                                                alt={course.title}
                                                className="card-img-top"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <button
                                                onClick={() => handleToggleFav(course.id)}
                                                className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 p-2 shadow-sm"
                                                title="Save to favorites"
                                            >
                                                <i className="bi bi-heart text-danger"></i>
                                            </button>
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column">
                                            <span className="badge bg-secondary-subtle text-secondary align-self-start mb-2">
                                                {course.category?.title || 'General'}
                                            </span>
                                            <h5 className="fw-bold mb-2">
                                                <Link
                                                    href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                    className="text-dark text-decoration-none"
                                                >
                                                    {course.title}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small flex-grow-1">
                                                {course.short_description || (course.description ? course.description.substring(0, 90) + '...' : '')}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                                                <span className="fw-bold text-primary fs-5">
                                                    {course.price ? `₹${course.price}` : 'Free'}
                                                </span>
                                                <Link
                                                    href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Become a Mentor Banner */}
            <section className="cta-section py-5 bg-dark text-white position-relative">
                <div className="container py-lg-4">
                    <div className="row align-items-center gy-4">
                        <div className="col-lg-7">
                            <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-2 rounded-pill">
                                Teach &amp; Earn
                            </span>
                            <h2 className="display-6 fw-bold mb-3">
                                {pageData?.title || 'Become a Tutor or Mentor on Our Platform'}
                            </h2>
                            <div
                                className="lead text-white-50 mb-4"
                                dangerouslySetInnerHTML={{
                                    __html: pageData?.description || 'Share your expertise, teach students in your local community or online, and grow your career with us.',
                                }}
                            />
                            <div className="d-flex gap-3">
                                <Link href="/register" className="btn btn-primary px-4 py-2 fw-semibold">
                                    Become a Mentor
                                </Link>
                                <Link href="/about" className="btn btn-outline-light px-4 py-2">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5 text-center">
                            <img
                                src="/front/img/bg-img/c-1.png"
                                alt="Become Mentor"
                                className="img-fluid rounded-4"
                                style={{ maxHeight: '320px' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Blogs */}
            {blogs.length > 0 && (
                <section className="blogs-section py-5">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <span className="text-primary fw-bold text-uppercase small">News &amp; Articles</span>
                                <h2 className="fw-bold text-dark mb-0">From Our Blog</h2>
                            </div>
                            <Link href="/blogs" className="btn btn-outline-primary btn-sm">
                                Read All Blogs
                            </Link>
                        </div>

                        <div className="row g-4">
                            {blogs.slice(0, 3).map((blog) => (
                                <div key={blog.id} className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <img
                                            src={blog.image ? `/blog/${blog.image}` : '/front/img/noimage.jpg'}
                                            alt={blog.title}
                                            className="card-img-top"
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-4 d-flex flex-column">
                                            <span className="text-muted small mb-2">
                                                <i className="bi bi-calendar3 me-1"></i>
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                            <h5 className="fw-bold mb-2">
                                                <Link href={`/blog_details/${blog.id}`} className="text-dark text-decoration-none">
                                                    {blog.title}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small flex-grow-1">
                                                {blog.short_description || (blog.description ? blog.description.substring(0, 90) + '...' : '')}
                                            </p>
                                            <Link href={`/blog_details/${blog.id}`} className="text-primary fw-semibold small text-decoration-none mt-2">
                                                Read More &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </FrontLayout>
    );
}

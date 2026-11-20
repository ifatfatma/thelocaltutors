import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

/**
 * Modern Category Definitions with Icons, Descriptions & Badge Accents
 */
const CATEGORIES = [
    {
        id: 'teacher',
        name: 'Tutors / Teachers',
        icon: 'bi-person-video3',
        description: 'Verified home & online personal tutors',
        badgeColor: 'bg-primary-subtle text-primary',
    },
    {
        id: 'coaching-center',
        name: 'Coaching Institutes',
        icon: 'bi-building',
        description: 'Exam coaching & tuition academies',
        badgeColor: 'bg-success-subtle text-success',
    },
    {
        id: 'schools',
        name: 'Schools',
        icon: 'bi-backpack4',
        description: 'Primary, secondary & higher schools',
        badgeColor: 'bg-warning-subtle text-dark',
    },
    {
        id: 'college',
        name: 'Colleges',
        icon: 'bi-mortarboard',
        description: 'Undergraduate & degree institutions',
        badgeColor: 'bg-info-subtle text-info',
    },
    {
        id: 'university',
        name: 'Universities',
        icon: 'bi-bank',
        description: 'Higher education & research universities',
        badgeColor: 'bg-purple-subtle text-purple',
    },
    {
        id: 'course',
        name: 'Courses & Classes',
        icon: 'bi-journal-bookmark',
        description: 'Subject-specific classes & online courses',
        badgeColor: 'bg-danger-subtle text-danger',
    },
];

/**
 * Extensive Master Subject Dictionary
 * Covers STEM, Science, Languages, Humanities, Tech, Commerce, and Competitive Exams
 * across CBSE, ICSE, WBBSE, and State Boards.
 */
const EXTENSIVE_SUBJECTS = [
    { id: '14', name: 'Mathematics', category: 'STEM', board: 'All Boards', icon: 'bi-calculator' },
    { id: 'higher_math', name: 'Higher Mathematics & Calculus', category: 'STEM', board: 'Class 11-12 & College', icon: 'bi-infinity' },
    { id: '22', name: 'Physics', category: 'Science', board: 'All Boards', icon: 'bi-lightning-charge' },
    { id: '21', name: 'Chemistry', category: 'Science', board: 'All Boards', icon: 'bi-droplet-half' },
    { id: '20', name: 'Biology & Life Sciences', category: 'Science', board: 'All Boards', icon: 'bi-heart-pulse' },
    { id: '13', name: 'English Literature & Language', category: 'Languages', board: 'All Boards', icon: 'bi-book' },
    { id: '23', name: 'Hindi', category: 'Languages', board: 'All Boards', icon: 'bi-translate' },
    { id: 'bengali', name: 'Bengali (বাংলা সাহিত্য ও ব্যাকরণ)', category: 'Languages', board: 'WBBSE / ICSE', icon: 'bi-translate' },
    { id: '24', name: 'Social Studies & History', category: 'Humanities', board: 'All Boards', icon: 'bi-globe-americas' },
    { id: 'geography', name: 'Geography & Environmental Science', category: 'Humanities', board: 'All Boards', icon: 'bi-compass' },
    { id: 'cs', name: 'Computer Science & Coding', category: 'Tech & IT', board: 'All Boards', icon: 'bi-laptop' },
    { id: 'python', name: 'Python & Web Development', category: 'Tech & IT', board: 'Skill & Professional', icon: 'bi-code-slash' },
    { id: 'economics', name: 'Economics', category: 'Commerce', board: 'All Boards', icon: 'bi-graph-up' },
    { id: 'accountancy', name: 'Accountancy & Bookkeeping', category: 'Commerce', board: 'All Boards', icon: 'bi-cash-coin' },
    { id: 'business_studies', name: 'Business Studies', category: 'Commerce', board: 'All Boards', icon: 'bi-briefcase' },
    { id: 'statistics', name: 'Statistics & Data Analysis', category: 'STEM', board: 'College & Higher Secondary', icon: 'bi-bar-chart-line' },
    { id: 'neet', name: 'NEET Medical Entrance Prep', category: 'Competitive Exam', board: 'National', icon: 'bi-award' },
    { id: 'jee', name: 'JEE Main & Advanced Engineering', category: 'Competitive Exam', board: 'National', icon: 'bi-trophy' },
    { id: 'foundation', name: 'Class 6 - 10 All Subjects Foundation', category: 'School Foundation', board: 'CBSE / ICSE / WBBSE', icon: 'bi-mortarboard' },
    { id: 'vedic_math', name: 'Vedic Maths & Mental Arithmetic', category: 'Skill', board: 'All Ages', icon: 'bi-lightbulb' },
    { id: 'french', name: 'French & Foreign Languages', category: 'Languages', board: 'International & ICSE', icon: 'bi-chat-quote' },
];

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
    showcaseTeachers = [],
    showcaseNearbyTeachers = [],
    isShowcaseNearby = false,
    userAreaName = '',
    showcaseCounts = { all: 0, near_me: 0 },
}) {
    // -------------------------------------------------------------
    // 1. Primary Hero Search Bar State & Custom Category Selector
    // -------------------------------------------------------------
    const [primaryCategory, setPrimaryCategory] = useState('teacher');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('0');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchBarRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    const activeCategoryObj = useMemo(() => {
        return CATEGORIES.find((c) => c.id === primaryCategory) || CATEGORIES[0];
    }, [primaryCategory]);

    // Merge backend subjects with extensive dictionary
    const allAvailableSubjects = useMemo(() => {
        const merged = [...EXTENSIVE_SUBJECTS];
        if (Array.isArray(subjects) && subjects.length > 0) {
            subjects.forEach((dbSub) => {
                if (!merged.some((m) => String(m.id) === String(dbSub.id) || m.name.toLowerCase() === dbSub.name.toLowerCase())) {
                    merged.push({
                        id: String(dbSub.id),
                        name: dbSub.name,
                        category: 'Academic Subject',
                        board: 'All Boards',
                        icon: 'bi-journal-text',
                    });
                }
            });
        }
        return merged;
    }, [subjects]);

    // Filter dynamic suggestions matching user typing
    const matchingSuggestions = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) {
            return allAvailableSubjects.slice(0, 6);
        }
        return allAvailableSubjects
            .filter((sub) =>
                sub.name.toLowerCase().includes(q) ||
                sub.category.toLowerCase().includes(q) ||
                sub.board.toLowerCase().includes(q)
            )
            .slice(0, 8);
    }, [searchQuery, allAvailableSubjects]);

    // -------------------------------------------------------------
    // 2. Active Search & Filter State for Dedicated Results Grid
    // -------------------------------------------------------------
    // Clean "All" & "Near Me" filter mode: strictly 'all' or 'near_me'
    const [resultsFilterMode, setResultsFilterMode] = useState('all'); // 'all' (Default) vs 'near_me'

    const [activeSearchFilters, setActiveSearchFilters] = useState({
        keyword: '',
        category: 'teacher',
        subject: '0',
        subjectName: '',
        board: '0',
        boardName: '',
        radius: '0',
        gender: '',
        area: '',
    });

    // Check if user has active filters applied
    const hasActiveFilters = useMemo(() => {
        return (
            resultsFilterMode === 'near_me' ||
            !!activeSearchFilters.keyword ||
            (activeSearchFilters.category && activeSearchFilters.category !== 'teacher') ||
            (activeSearchFilters.subject && activeSearchFilters.subject !== '0') ||
            (activeSearchFilters.board && activeSearchFilters.board !== '0') ||
            (activeSearchFilters.radius && activeSearchFilters.radius !== '0') ||
            !!activeSearchFilters.gender ||
            !!activeSearchFilters.area
        );
    }, [resultsFilterMode, activeSearchFilters]);

    // Primary search bar submission -> Updates Card-Box Grid below!
    const handlePrimarySearchSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        setIsCategoryDropdownOpen(false);

        setActiveSearchFilters((prev) => ({
            ...prev,
            keyword: searchQuery.trim(),
            category: primaryCategory,
            subject: selectedSubjectId,
            subjectName: selectedSubjectId !== '0' ? searchQuery.trim() : '',
        }));

        // Smooth scroll to dedicated results grid
        setTimeout(() => {
            document.getElementById('tutorResultsSection')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion, autoFilter = true) => {
        setSearchQuery(suggestion.name);
        setSelectedSubjectId(suggestion.id);
        setShowSuggestions(false);

        if (autoFilter) {
            setActiveSearchFilters((prev) => ({
                ...prev,
                keyword: suggestion.name,
                subject: suggestion.id,
                subjectName: suggestion.name,
                category: primaryCategory,
            }));

            setTimeout(() => {
                document.getElementById('tutorResultsSection')?.scrollIntoView({ behavior: 'smooth' });
            }, 120);
        }
    };

    // Clear all filters
    const handleClearAllFilters = () => {
        setActiveSearchFilters({
            keyword: '',
            category: 'teacher',
            subject: '0',
            subjectName: '',
            board: '0',
            boardName: '',
            radius: '0',
            gender: '',
            area: '',
        });
        setSearchQuery('');
        setSelectedSubjectId('0');
        setResultsFilterMode('all');
    };

    // Remove single filter chip
    const handleRemoveFilter = (filterKey) => {
        if (filterKey === 'filterMode') {
            setResultsFilterMode('all');
        } else if (filterKey === 'keyword') {
            setActiveSearchFilters((prev) => ({ ...prev, keyword: '', subjectName: '' }));
            setSearchQuery('');
            setSelectedSubjectId('0');
        } else if (filterKey === 'category') {
            setActiveSearchFilters((prev) => ({ ...prev, category: 'teacher' }));
            setPrimaryCategory('teacher');
        } else if (filterKey === 'subject') {
            setActiveSearchFilters((prev) => ({ ...prev, subject: '0', subjectName: '' }));
            setSelectedSubjectId('0');
        } else if (filterKey === 'board') {
            setActiveSearchFilters((prev) => ({ ...prev, board: '0', boardName: '' }));
        } else if (filterKey === 'radius') {
            setActiveSearchFilters((prev) => ({ ...prev, radius: '0' }));
        } else if (filterKey === 'gender') {
            setActiveSearchFilters((prev) => ({ ...prev, gender: '' }));
        } else if (filterKey === 'area') {
            setActiveSearchFilters((prev) => ({ ...prev, area: '' }));
        }
    };

    // -------------------------------------------------------------
    // 3. Compact "What are you looking for?" Modal / Popup Form State
    // -------------------------------------------------------------
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [modalSubjectInput, setModalSubjectInput] = useState('');
    const [showModalSubjectSuggestions, setShowModalSubjectSuggestions] = useState(false);

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

    // Modal Subject auto-suggestions
    const matchingModalSubjects = useMemo(() => {
        const q = modalSubjectInput.trim().toLowerCase();
        if (!q) return allAvailableSubjects.slice(0, 6);
        return allAvailableSubjects
            .filter((sub) =>
                sub.name.toLowerCase().includes(q) ||
                sub.category.toLowerCase().includes(q)
            )
            .slice(0, 8);
    }, [modalSubjectInput, allAvailableSubjects]);

    // Cascading location handlers
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
                setGeoMsg('📍 GPS Location acquired! Ready to find nearby tutors.');
                axios.get(`/savelatlong/${lat}/${lng}`).catch(() => {});
                fetchNearbyShowcase(lat, lng);
            },
            (error) => {
                setLoadingGeo(false);
                setGeoActive(false);
                let errText = 'Failed to get location.';
                if (error.code === 1) {
                    errText = 'Location permission denied. Please allow location access in your browser.';
                } else if (error.code === 2) {
                    errText = 'Location unavailable. Please check device GPS.';
                } else if (error.code === 3) {
                    errText = 'Location request timed out. Please try again.';
                }
                setGeoMsg(errText);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Submitting modal updates the dedicated Card-Box Grid!
    const handleModalSearchSubmit = (e) => {
        e.preventDefault();
        setShowFilterModal(false);

        const boardObj = boards.find((b) => String(b.id) === String(searchState.search_board));
        setActiveSearchFilters((prev) => ({
            ...prev,
            category: searchState.lookingfor,
            subject: searchState.search_subject,
            subjectName: modalSubjectInput.trim(),
            board: searchState.search_board,
            boardName: boardObj ? boardObj.name : '',
            radius: searchState.search_radius,
            gender: searchState.search_gender,
        }));

        setTimeout(() => {
            document.getElementById('tutorResultsSection')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
    };

    // -------------------------------------------------------------
    // 4. Tutor Data & Dedicated Card-Box Grid Computation
    // -------------------------------------------------------------
    const [allTutors, setAllTutors] = useState(showcaseTeachers || []);
    const [nearbyTutors, setNearbyTutors] = useState(
        showcaseNearbyTeachers && showcaseNearbyTeachers.length > 0
            ? showcaseNearbyTeachers
            : showcaseTeachers.filter((t) => t.distance !== null && Number(t.distance) <= 50)
    );
    const [activeArea, setActiveArea] = useState(userAreaName || 'Garden Reach, Kolkata');
    const [isDetecting, setIsDetecting] = useState(false);
    const [showcaseStatusMsg, setShowcaseStatusMsg] = useState('');

    // Synchronize initial showcase props
    useEffect(() => {
        if (showcaseTeachers && showcaseTeachers.length > 0) {
            setAllTutors(showcaseTeachers);
            const strictlyNearby = showcaseNearbyTeachers && showcaseNearbyTeachers.length > 0
                ? showcaseNearbyTeachers
                : showcaseTeachers.filter((t) => t.distance !== null && Number(t.distance) <= 50);
            setNearbyTutors(strictlyNearby.length > 0 ? strictlyNearby : showcaseTeachers.slice(0, 4));
            if (userAreaName) setActiveArea(userAreaName);
        }
    }, [showcaseTeachers, showcaseNearbyTeachers, userAreaName]);

    // Dedicated Results Grid filtering:
    // Default load behavior ("All" selected): Show tutors from "All", ordered so Near Me tutors appear first.
    // Specific filter behavior ("Near Me" selected): Shows only Near Me tutors.
    const filteredGridTutors = useMemo(() => {
        let list = [...allTutors];

        // 1. Proximity Filter ("All" vs "Near Me")
        if (resultsFilterMode === 'near_me') {
            list = list.filter((t) => t.distance !== null && t.distance !== undefined && Number(t.distance) <= 50);
            list.sort((a, b) => Number(a.distance || 999) - Number(b.distance || 999));
        } else {
            // Default "all" mode: Near Me tutors appear first, ordered by distance ASC, then remaining tutors
            list.sort((a, b) => {
                const aDist = a.distance !== null && a.distance !== undefined ? Number(a.distance) : 9999;
                const bDist = b.distance !== null && b.distance !== undefined ? Number(b.distance) : 9999;
                const aIsNear = aDist <= 50 ? 0 : 1;
                const bIsNear = bDist <= 50 ? 0 : 1;
                if (aIsNear !== bIsNear) return aIsNear - bIsNear;
                return aDist - bDist;
            });
        }

        // 2. Keyword Filter
        if (activeSearchFilters.keyword) {
            const kw = activeSearchFilters.keyword.toLowerCase();
            list = list.filter((t) =>
                (t.name && t.name.toLowerCase().includes(kw)) ||
                (t.description && t.description.toLowerCase().includes(kw)) ||
                (t.subject_names && t.subject_names.toLowerCase().includes(kw)) ||
                (t.address && t.address.toLowerCase().includes(kw)) ||
                (t.board_names && t.board_names.toLowerCase().includes(kw)) ||
                (t.qualification_name && t.qualification_name.toLowerCase().includes(kw))
            );
        }

        // 3. Subject Filter
        if (activeSearchFilters.subject && activeSearchFilters.subject !== '0') {
            list = list.filter((t) => {
                if (t.subjects) {
                    const subArr = String(t.subjects).split(',').map((s) => s.trim());
                    if (subArr.includes(String(activeSearchFilters.subject))) return true;
                }
                if (activeSearchFilters.subjectName && t.subject_names) {
                    return t.subject_names.toLowerCase().includes(activeSearchFilters.subjectName.toLowerCase());
                }
                return false;
            });
        }

        // 4. Board Filter
        if (activeSearchFilters.board && activeSearchFilters.board !== '0') {
            list = list.filter((t) => {
                if (t.board) {
                    const bArr = String(t.board).split(',').map((s) => s.trim());
                    if (bArr.includes(String(activeSearchFilters.board))) return true;
                }
                if (activeSearchFilters.boardName && t.board_names) {
                    return t.board_names.toLowerCase().includes(activeSearchFilters.boardName.toLowerCase());
                }
                return false;
            });
        }

        // 5. Gender Filter
        if (activeSearchFilters.gender) {
            list = list.filter((t) => t.gender && t.gender.toLowerCase() === activeSearchFilters.gender.toLowerCase());
        }

        // 6. Radius Filter
        if (activeSearchFilters.radius && activeSearchFilters.radius !== '0') {
            const maxR = Number(activeSearchFilters.radius);
            list = list.filter((t) => t.distance !== null && t.distance !== undefined && Number(t.distance) <= maxR);
        }

        // 7. Area Filter
        if (activeSearchFilters.area) {
            list = list.filter((t) => t.address && t.address.toLowerCase().includes(activeSearchFilters.area.toLowerCase()));
        }

        return list;
    }, [allTutors, resultsFilterMode, activeSearchFilters]);

    // -------------------------------------------------------------
    // 5. Advanced Featured Tutor Slider State
    // (Preserved strictly as the Featured Educators Showcase - NOT overwritten by search)
    // -------------------------------------------------------------
    const [sliderIndex, setSliderIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);

    // Split featured showcase tutors into pairs of 2 columns
    const featuredSlidePairs = useMemo(() => {
        const pairs = [];
        const sourceList = allTutors.length > 0 ? allTutors : showcaseTeachers;
        for (let i = 0; i < sourceList.length; i += 2) {
            pairs.push(sourceList.slice(i, i + 2));
        }
        return pairs;
    }, [allTutors, showcaseTeachers]);

    const totalFeaturedSlides = featuredSlidePairs.length;

    // Auto-slide effect (Smooth 3.5s interval with continuous loop)
    useEffect(() => {
        if (!isAutoPlay || totalFeaturedSlides <= 1) return;
        const timer = setInterval(() => {
            setSliderIndex((prev) => (prev + 1) % totalFeaturedSlides);
        }, 3500);
        return () => clearInterval(timer);
    }, [isAutoPlay, totalFeaturedSlides, sliderIndex]);

    const prevFeaturedSlide = () => {
        if (totalFeaturedSlides <= 1) return;
        setSliderIndex((prev) => (prev - 1 + totalFeaturedSlides) % totalFeaturedSlides);
    };

    const nextFeaturedSlide = () => {
        if (totalFeaturedSlides <= 1) return;
        setSliderIndex((prev) => (prev + 1) % totalFeaturedSlides);
    };

    const handleTouchStart = (e) => {
        if (e.targetTouches && e.targetTouches[0]) {
            setTouchStartX(e.targetTouches[0].clientX);
        }
    };

    const handleTouchMove = (e) => {
        if (e.targetTouches && e.targetTouches[0]) {
            setTouchEndX(e.targetTouches[0].clientX);
        }
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const diff = touchStartX - touchEndX;
        if (diff > 45) {
            nextFeaturedSlide();
        } else if (diff < -45) {
            prevFeaturedSlide();
        }
        setTouchStartX(null);
        setTouchEndX(null);
    };

    // AJAX location reload
    const fetchNearbyShowcase = async (lat, lng, areaLabel = '') => {
        setIsDetecting(true);
        try {
            localStorage.setItem('user_lat', lat);
            localStorage.setItem('user_lng', lng);
            document.cookie = `user_lat=${lat};path=/;max-age=2592000`;
            document.cookie = `user_lng=${lng};path=/;max-age=2592000`;

            const res = await axios.get('/getNearbyShowcaseTeachersAjax', {
                params: { lat, lng },
            });

            if (res.data && res.data.teachers && res.data.teachers.length > 0) {
                setAllTutors(res.data.teachers);
                if (res.data.nearby_teachers && res.data.nearby_teachers.length > 0) {
                    setNearbyTutors(res.data.nearby_teachers);
                } else {
                    const filtered = res.data.teachers.filter((t) => t.distance !== null && Number(t.distance) <= 50);
                    setNearbyTutors(filtered.length > 0 ? filtered : res.data.teachers.slice(0, 4));
                }
                const locLabel = areaLabel || res.data.user_area || 'your area';
                setActiveArea(locLabel);
                const closest = res.data.teachers[0];
                const distInfo =
                    closest?.distance !== null && closest?.distance !== undefined
                        ? Number(closest.distance) < 0.1
                            ? 'in your neighborhood'
                            : `${Number(closest.distance).toFixed(1)} km away`
                        : '';
                setShowcaseStatusMsg(`Found ${res.data.teachers.length} tutors near ${locLabel}${distInfo ? ` (closest is ${distInfo})` : ''}!`);
            }
        } catch (e) {
            console.error('Failed to load nearby tutors', e);
        } finally {
            setIsDetecting(false);
        }
    };

    // Auto-detect visitor location on initial mount
    useEffect(() => {
        const savedLat = localStorage.getItem('user_lat');
        const savedLng = localStorage.getItem('user_lng');

        if (savedLat && savedLng) {
            fetchNearbyShowcase(savedLat, savedLng);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude.toFixed(6);
                    const lng = pos.coords.longitude.toFixed(6);
                    fetchNearbyShowcase(lat, lng);
                },
                () => {
                    fetch('https://ipapi.co/json/')
                        .then((r) => r.json())
                        .then((data) => {
                            if (data && data.latitude && data.longitude) {
                                fetchNearbyShowcase(
                                    data.latitude.toFixed(6),
                                    data.longitude.toFixed(6),
                                    data.city || data.region || 'your region'
                                );
                            }
                        })
                        .catch(() => {});
                },
                { enableHighAccuracy: true, timeout: 7000 }
            );
        }
    }, []);

    // Close suggestions and category dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Teacher profile detail modal state
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teacherModalHtml, setTeacherModalHtml] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [teacherRating, setTeacherRating] = useState('5');
    const [teacherReview, setTeacherReview] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');

    const openTeacherModal = async (teacher) => {
        setSelectedTeacher(teacher);
        setLoadingDetails(true);
        setTeacherModalHtml('');
        setReviewMsg('');

        try {
            const res = await axios.get(`/getTeacherDetailsAjax/${teacher.user_id || teacher.id}`);
            if (res.data.status === 200) {
                setTeacherModalHtml(res.data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handlePostTeacherReview = async () => {
        if (!selectedTeacher) return;
        setReviewMsg('');
        try {
            const res = await axios.get('/postTeacherReviews', {
                params: {
                    id: selectedTeacher.user_id || selectedTeacher.id,
                    teacher_rating: teacherRating,
                    teacher_review: teacherReview,
                },
            });
            setReviewMsg(res.data.message);
            if (res.data.status === 200) {
                setTeacherReview('');
            }
        } catch (err) {
            setReviewMsg('Please login to post a review or check your input.');
        }
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

            {/* ============================================================== */}
            {/* HERO SECTION: Custom Category Selector & Sleek Search Pill */}
            {/* ============================================================== */}
            <section className="hero-section py-4 py-lg-5 bg-light position-relative overflow-hidden border-bottom">
                <div className="container">
                    {/* 1. HERO HEADER: Heading & Subheading */}
                    <div className="text-center mx-auto mb-4" style={{ maxWidth: '850px' }}>
                        <span className="badge bg-primary-subtle text-primary fw-bold mb-2 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1 shadow-xs">
                            <i className="bi bi-patch-check-fill text-primary"></i> Top Rated Learning Platform
                        </span>
                        <h1 className="display-5 fw-bold text-dark lh-sm mb-2">
                            Find the Perfect <span className="text-primary">Tutor</span> in Your Local Area
                        </h1>
                        <p className="lead text-muted mb-4">
                            Connect with qualified home and online teachers, coaching institutes, schools, and colleges for all subjects and boards.
                        </p>

                        {/* PRIMARY SEARCH BAR: Custom Category Dropdown & Auto-Suggestions */}
                        <div className="position-relative mx-auto text-start" style={{ maxWidth: '820px', zIndex: 30 }} ref={searchBarRef}>
                            <form
                                onSubmit={handlePrimarySearchSubmit}
                                className="shadow-lg rounded-pill bg-white p-2 border d-flex flex-wrap align-items-center gap-2"
                            >
                                {/* Sleek Custom-Styled Modern Category Dropdown */}
                                <div className="position-relative" ref={categoryDropdownRef}>
                                    <button
                                        type="button"
                                        className="btn border-0 d-flex align-items-center gap-2 py-2 px-3 rounded-pill bg-light text-dark fw-semibold transition"
                                        style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        aria-expanded={isCategoryDropdownOpen}
                                    >
                                        <div
                                            className={`rounded-circle p-1 d-flex align-items-center justify-content-center ${activeCategoryObj.badgeColor}`}
                                            style={{ width: '26px', height: '26px' }}
                                        >
                                            <i className={`bi ${activeCategoryObj.icon}`} style={{ fontSize: '0.85rem' }}></i>
                                        </div>
                                        <span style={{ fontSize: '0.92rem' }}>{activeCategoryObj.name}</span>
                                        <i
                                            className="bi bi-chevron-down text-muted small ms-1"
                                            style={{
                                                transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.25s ease',
                                                fontSize: '0.75rem',
                                            }}
                                        ></i>
                                    </button>

                                    {/* Custom Dropdown Menu with Icons & Descriptions */}
                                    {isCategoryDropdownOpen && (
                                        <div
                                            className="position-absolute start-0 mt-2 bg-white rounded-4 shadow-xl border overflow-hidden p-2"
                                            style={{ minWidth: '280px', zIndex: 1060 }}
                                        >
                                            <div className="px-3 py-2 text-muted small fw-semibold border-bottom mb-1 d-flex align-items-center justify-content-between">
                                                <span>SELECT CATEGORY</span>
                                                <i className="bi bi-grid-3x3-gap-fill text-primary"></i>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                {CATEGORIES.map((cat) => {
                                                    const isSelected = cat.id === primaryCategory;
                                                    return (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            className={`btn w-100 text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 transition ${
                                                                isSelected ? 'bg-primary-subtle text-primary fw-bold' : 'hover-bg-light text-dark'
                                                            }`}
                                                            style={{ fontSize: '0.88rem' }}
                                                            onClick={() => {
                                                                setPrimaryCategory(cat.id);
                                                                setIsCategoryDropdownOpen(false);
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div
                                                                    className={`rounded-3 p-2 d-flex align-items-center justify-content-center ${cat.badgeColor}`}
                                                                    style={{ width: '32px', height: '32px' }}
                                                                >
                                                                    <i className={`bi ${cat.icon}`}></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold lh-sm">{cat.name}</div>
                                                                    <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                                                                        {cat.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {isSelected && <i className="bi bi-check2 text-primary fs-5 ms-2"></i>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="vr text-secondary opacity-25 my-1 d-none d-sm-block"></div>

                                {/* Dynamic Auto-Suggest Search Input */}
                                <div className="flex-grow-1 position-relative d-flex align-items-center px-2">
                                    <i className="bi bi-search text-muted me-2"></i>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none py-2 ps-1"
                                        placeholder="Search subject, course, or topic (e.g. Mathematics, Physics, NEET)..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        autoComplete="off"
                                        style={{ fontSize: '0.95rem' }}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link text-muted p-0 me-2"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedSubjectId('0');
                                            }}
                                            title="Clear input"
                                        >
                                            <i className="bi bi-x-circle-fill"></i>
                                        </button>
                                    )}
                                </div>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                                    style={{ minHeight: '44px' }}
                                >
                                    <span>Search</span>
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </form>

                            {/* Auto-Suggestions Dropdown Card */}
                            {showSuggestions && matchingSuggestions.length > 0 && (
                                <div
                                    className="position-absolute start-0 end-0 mt-2 bg-white rounded-4 shadow-xl border overflow-hidden p-2"
                                    style={{ zIndex: 1050, maxHeight: '350px', overflowY: 'auto' }}
                                >
                                    <div className="d-flex align-items-center justify-content-between px-3 py-1 border-bottom text-muted small">
                                        <span className="fw-semibold">
                                            <i className="bi bi-stars text-warning me-1"></i> Matching Subjects &amp; Courses
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm p-0 text-muted"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            Close &times;
                                        </button>
                                    </div>
                                    <div className="list-group list-group-flush pt-1">
                                        {matchingSuggestions.map((item, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2 px-3 border-0 rounded-3 my-1"
                                                onClick={() => handleSelectSuggestion(item, true)}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <div
                                                        className="bg-primary-subtle text-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                        style={{ width: '32px', height: '32px' }}
                                                    >
                                                        <i className={`bi ${item.icon || 'bi-book'}`}></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold text-dark small">{item.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                                                            {item.board} &bull; {item.category}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="badge bg-light text-secondary border small">
                                                    {item.category}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. COMPACT "What are you looking for?" Prompt Box (Popup Form label removed) */}
                        <div className="mt-4 mx-auto text-start" style={{ maxWidth: '820px' }}>
                            <div className="card border-0 shadow-xs rounded-4 p-3 bg-white border border-light-subtle">
                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="bg-primary-subtle text-primary p-2 rounded-3 d-flex align-items-center justify-content-center"
                                            style={{ width: '42px', height: '42px' }}
                                        >
                                            <i className="bi bi-sliders2 fs-5"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0 text-dark">
                                                What are you looking for?
                                            </h6>
                                            <p className="text-muted small mb-0">
                                                Customize search by subject, board, radius distance, and location
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-xs"
                                        onClick={() => setShowFilterModal(true)}
                                    >
                                        <i className="bi bi-funnel-fill"></i>
                                        <span>Customize Search &amp; Filters</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ============================================================== */}
                    {/* 3. ADVANCED FEATURED TUTOR SLIDER */}
                    {/* (Strictly dedicated showcase - NOT mixed with search/filter results) */}
                    {/* ============================================================== */}
                    <div className="mt-4">
                        <div
                            className="card shadow-sm border-0 rounded-4 p-3 p-md-4 bg-white position-relative overflow-hidden"
                            onMouseEnter={() => setIsAutoPlay(false)}
                            onMouseLeave={() => setIsAutoPlay(true)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Accent Top Gradient */}
                            <div
                                className="position-absolute top-0 start-0 end-0"
                                style={{
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #0d6efd, #0dcaf0)',
                                }}
                            />

                            {/* Slider Header */}
                            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-semibold shadow-xs d-inline-flex align-items-center gap-1">
                                        <i className="bi bi-patch-check-fill text-warning"></i>
                                        <span>Featured Educators Showcase</span>
                                    </span>
                                    <span className="badge bg-light text-muted border small px-2 py-2 rounded-pill">
                                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                        {activeArea ? `Zone: ${activeArea}` : 'Kolkata Region'}
                                    </span>
                                </div>

                                {/* Slider Navigation Controls */}
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-white text-dark border px-3 py-2 rounded-pill small fw-bold shadow-2xs">
                                        <span className="text-primary">{String(sliderIndex + 1).padStart(2, '0')}</span>
                                        <span className="text-muted mx-1">/</span>
                                        <span className="text-secondary">{String(totalFeaturedSlides).padStart(2, '0')}</span>
                                    </span>

                                    <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary rounded-start-pill px-3"
                                            onClick={prevFeaturedSlide}
                                            disabled={totalFeaturedSlides <= 1}
                                            title="Previous Slide"
                                        >
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary rounded-end-pill px-3"
                                            onClick={nextFeaturedSlide}
                                            disabled={totalFeaturedSlides <= 1}
                                            title="Next Slide"
                                        >
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Slider Carousel Track */}
                            <div className="position-relative overflow-hidden py-1" style={{ minHeight: '370px' }}>
                                <div
                                    className="d-flex h-100"
                                    style={{
                                        transform: `translateX(-${sliderIndex * 100}%)`,
                                        transition: 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
                                        willChange: 'transform',
                                    }}
                                >
                                    {featuredSlidePairs.map((pair, pairIdx) => (
                                        <div
                                            key={pairIdx}
                                            className="w-100 flex-shrink-0 px-1"
                                            style={{ minWidth: '100%', boxSizing: 'border-box' }}
                                        >
                                            {/* Two Columns Side-by-Side per Slide */}
                                            <div className="row row-cols-1 row-cols-md-2 g-3 g-lg-4">
                                                {pair.map((teacher, tIdx) => (
                                                    <div key={teacher.user_id || teacher.id || tIdx} className="col">
                                                        <div
                                                            className="card h-100 border rounded-4 p-3 p-lg-4 shadow-2xs transition d-flex flex-column justify-content-between bg-white"
                                                            style={{
                                                                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                                                            }}
                                                        >
                                                            <div>
                                                                {/* Profile Header */}
                                                                <div className="d-flex align-items-start gap-3 mb-3">
                                                                    <div className="position-relative flex-shrink-0">
                                                                        <img
                                                                            src={
                                                                                teacher.image
                                                                                    ? teacher.image.startsWith('http')
                                                                                        ? teacher.image
                                                                                        : `/user/${teacher.image}`
                                                                                    : '/front/img/noprofileimage.png'
                                                                            }
                                                                            onError={(e) => {
                                                                                e.target.src = '/front/img/noprofileimage.png';
                                                                            }}
                                                                            alt={teacher.name}
                                                                            className="rounded-circle border shadow-xs"
                                                                            style={{ width: '68px', height: '68px', objectFit: 'cover' }}
                                                                        />
                                                                        <span
                                                                            className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                                                                            style={{ width: '13px', height: '13px' }}
                                                                            title="Online & Available"
                                                                        />
                                                                    </div>

                                                                    <div className="flex-grow-1 min-w-0">
                                                                        <div className="d-flex align-items-center justify-content-between gap-1 mb-1">
                                                                            <h5 className="fw-bold text-dark mb-0 text-truncate" title={teacher.name}>
                                                                                {teacher.name}
                                                                            </h5>
                                                                            {teacher.gender && (
                                                                                <span className="badge bg-light text-secondary border small">
                                                                                    {teacher.gender}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="d-flex align-items-center gap-1 flex-wrap mb-1">
                                                                            <span
                                                                                className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill py-1 px-2"
                                                                                style={{ fontSize: '0.72rem' }}
                                                                            >
                                                                                <i className="bi bi-shield-check me-1"></i>
                                                                                Verified Educator
                                                                            </span>
                                                                            {teacher.experience && (
                                                                                <span
                                                                                    className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill py-1 px-2"
                                                                                    style={{ fontSize: '0.72rem' }}
                                                                                >
                                                                                    {teacher.experience} Yrs Exp
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        {/* Distance Proximity Badge */}
                                                                        {teacher.distance !== undefined && teacher.distance !== null && (
                                                                            <div className="mt-1">
                                                                                <span
                                                                                    className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1"
                                                                                    style={{ fontSize: '0.74rem' }}
                                                                                >
                                                                                    <i className="bi bi-geo-alt-fill me-1"></i>
                                                                                    {Number(teacher.distance) < 0.1
                                                                                        ? 'In your neighborhood'
                                                                                        : Number(teacher.distance) < 1
                                                                                        ? `${Math.round(Number(teacher.distance) * 1000)} meters away`
                                                                                        : `${Number(teacher.distance).toFixed(1)} km away`}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Address */}
                                                                {teacher.address && (
                                                                    <div className="text-muted small mb-2 d-flex align-items-center gap-1 text-truncate">
                                                                        <i className="bi bi-pin-map text-danger flex-shrink-0"></i>
                                                                        <span className="text-truncate">{teacher.address}</span>
                                                                    </div>
                                                                )}

                                                                {/* Academic Details Pill Box */}
                                                                <div className="bg-light rounded-3 p-2 mb-2 small">
                                                                    {teacher.qualification_name && (
                                                                        <div className="row g-1 mb-1">
                                                                            <span className="col-4 text-muted fw-semibold">Qualification:</span>
                                                                            <span className="col-8 text-dark fw-medium text-truncate">
                                                                                {teacher.qualification_name}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {teacher.subject_names && (
                                                                        <div className="row g-1 mb-1">
                                                                            <span className="col-4 text-muted fw-semibold">Subjects:</span>
                                                                            <span className="col-8 text-dark fw-medium text-truncate">
                                                                                {teacher.subject_names}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {teacher.board_names && (
                                                                        <div className="row g-1 mb-1">
                                                                            <span className="col-4 text-muted fw-semibold">Board:</span>
                                                                            <span className="col-8 text-dark text-truncate">{teacher.board_names}</span>
                                                                        </div>
                                                                    )}
                                                                    {teacher.teaching_mode_name && (
                                                                        <div className="row g-1 mb-1">
                                                                            <span className="col-4 text-muted fw-semibold">Mode:</span>
                                                                            <span className="col-8 text-dark text-truncate">{teacher.teaching_mode_name}</span>
                                                                        </div>
                                                                    )}
                                                                    {teacher.timings && (
                                                                        <div className="row g-1">
                                                                            <span className="col-4 text-muted fw-semibold">Timings:</span>
                                                                            <span className="col-8 text-dark text-truncate">{teacher.timings}</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Bio / Description */}
                                                                {teacher.description && (
                                                                    <p className="text-muted small mb-2 text-truncate-2 fst-italic" style={{ fontSize: '0.82rem' }}>
                                                                        "{teacher.description}"
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Action Footer */}
                                                            <div className="pt-2 border-top d-flex align-items-center justify-content-between gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openTeacherModal(teacher)}
                                                                    className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#homeTeacherModal"
                                                                >
                                                                    <i className="bi bi-info-circle"></i>
                                                                    <span>View Profile</span>
                                                                </button>

                                                                <Link
                                                                    href={`/search?lookingfor=teacher&search_state=${teacher.state || 0}&search_city=${teacher.city || 0}&filter_mode=all`}
                                                                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                                                >
                                                                    Explore &rarr;
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modern Progress Bar Indicator */}
                            <div className="w-100 bg-light rounded-pill overflow-hidden mt-3" style={{ height: '4px' }}>
                                <div
                                    className="h-100 rounded-pill"
                                    style={{
                                        width: `${((sliderIndex + 1) / totalFeaturedSlides) * 100}%`,
                                        background: 'linear-gradient(90deg, #0d6efd, #0dcaf0)',
                                        transition: 'width 0.4s ease',
                                    }}
                                />
                            </div>

                            {/* Bottom Capsule Indicators */}
                            {totalFeaturedSlides > 1 && (
                                <div className="pt-3 mt-1 d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                                        onClick={prevFeaturedSlide}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                        <span>Prev</span>
                                    </button>

                                    <div className="d-flex align-items-center gap-2">
                                        {featuredSlidePairs.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`btn p-0 rounded-pill transition ${
                                                    idx === sliderIndex ? 'bg-primary shadow-xs' : 'bg-secondary-subtle'
                                                }`}
                                                style={{
                                                    width: idx === sliderIndex ? '28px' : '8px',
                                                    height: '8px',
                                                    border: 'none',
                                                    transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                                                }}
                                                onClick={() => setSliderIndex(idx)}
                                                title={`Slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                                        onClick={nextFeaturedSlide}
                                    >
                                        <span>Next</span>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 4. DEDICATED CARD-BOX GRID FOR SEARCH & FILTER RESULTS */}
            {/* ============================================================== */}
            <section id="tutorResultsSection" className="py-5 bg-white border-bottom">
                <div className="container">
                    {/* Results Section Header & Clean "All" / "Near Me" Filter Dropdown */}
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-light">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small text-uppercase mb-2 d-inline-block">
                                    Local Directory
                                </span>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <h3 className="fw-bold text-dark mb-0">Find Qualified Tutors Near You</h3>
                                    <span className="badge bg-primary text-white rounded-pill px-3 py-1 fw-semibold">
                                        {filteredGridTutors.length} Available
                                    </span>
                                </div>
                                <p className="text-muted small mb-0">
                                    {resultsFilterMode === 'near_me'
                                        ? 'Displaying strictly tutors within your local regional area (sorted by distance)'
                                        : 'Displaying all tutors with regional ("Near Me") educators prioritized first'}
                                </p>
                            </div>

                            {/* Clean Filter Controls: Strictly "All" & "Near Me" */}
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill border shadow-xs">
                                    <i className="bi bi-filter-circle-fill text-primary small"></i>
                                    <span className="small fw-semibold text-secondary">Filter:</span>
                                    <select
                                        className="form-select form-select-sm border-0 bg-transparent fw-bold text-dark ps-1 pe-4 py-0"
                                        style={{ width: 'auto', cursor: 'pointer', fontSize: '0.88rem' }}
                                        value={resultsFilterMode}
                                        onChange={(e) => setResultsFilterMode(e.target.value)}
                                        aria-label="Filter tutors by proximity"
                                    >
                                        <option value="all">All</option>
                                        <option value="near_me">Near Me</option>
                                    </select>
                                </div>

                                {/* Re-detect GPS Button */}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs"
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            setIsDetecting(true);
                                            navigator.geolocation.getCurrentPosition(
                                                (pos) => fetchNearbyShowcase(pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6)),
                                                () => setIsDetecting(false),
                                                { enableHighAccuracy: true, timeout: 8000 }
                                            );
                                        }
                                    }}
                                    disabled={isDetecting}
                                    title="Re-detect GPS location"
                                >
                                    <i className={`bi bi-crosshair ${isDetecting ? 'spinner-border spinner-border-sm' : ''}`}></i>
                                    <span>{isDetecting ? 'Detecting...' : 'Near Me (GPS)'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Area Chips */}
                        <div className="d-flex align-items-center gap-1 mt-3 pt-3 border-top flex-wrap">
                            <span className="text-muted small me-2" style={{ fontSize: '0.8rem' }}>
                                <i className="bi bi-pin-map text-primary me-1"></i>
                                <strong>Quick Area:</strong>
                            </span>
                            {[
                                { name: 'Garden Reach', lat: '22.531200', lng: '88.301500' },
                                { name: 'Behala', lat: '22.498800', lng: '88.312900' },
                                { name: 'Park Circus', lat: '22.541100', lng: '88.363900' },
                                { name: 'Salt Lake', lat: '22.586700', lng: '88.417800' },
                                { name: 'Howrah', lat: '22.602200', lng: '88.349800' },
                            ].map((loc) => {
                                const isSelected = activeArea && activeArea.toLowerCase().includes(loc.name.toLowerCase());
                                return (
                                    <button
                                        key={loc.name}
                                        type="button"
                                        className={`btn py-0 px-2 rounded-pill border ${
                                            isSelected ? 'btn-primary text-white shadow-xs' : 'btn-outline-secondary'
                                        }`}
                                        style={{ fontSize: '0.74rem', lineHeight: '1.7' }}
                                        onClick={() => {
                                            fetchNearbyShowcase(loc.lat, loc.lng, `${loc.name}, Kolkata`);
                                            setActiveSearchFilters((prev) => ({ ...prev, area: loc.name }));
                                        }}
                                        title={`Show tutors nearest to ${loc.name}`}
                                    >
                                        {loc.name}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active Filter Chips Bar */}
                        {hasActiveFilters && (
                            <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top flex-wrap">
                                <span className="small text-muted fw-semibold">Active Filters:</span>

                                {resultsFilterMode === 'near_me' && (
                                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                        <span>Filter: Near Me</span>
                                        <button
                                            type="button"
                                            className="btn-close ms-1"
                                            style={{ fontSize: '0.55rem' }}
                                            onClick={() => handleRemoveFilter('filterMode')}
                                            aria-label="Remove filter"
                                        ></button>
                                    </span>
                                )}

                                {activeSearchFilters.keyword && (
                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                        <span>Keyword: "{activeSearchFilters.keyword}"</span>
                                        <button
                                            type="button"
                                            className="btn-close ms-1"
                                            style={{ fontSize: '0.55rem' }}
                                            onClick={() => handleRemoveFilter('keyword')}
                                            aria-label="Remove filter"
                                        ></button>
                                    </span>
                                )}

                                {activeSearchFilters.subjectName && (
                                    <span className="badge bg-info-subtle text-info border border-info-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                        <span>Subject: {activeSearchFilters.subjectName}</span>
                                        <button
                                            type="button"
                                            className="btn-close ms-1"
                                            style={{ fontSize: '0.55rem' }}
                                            onClick={() => handleRemoveFilter('subject')}
                                            aria-label="Remove filter"
                                        ></button>
                                    </span>
                                )}

                                {activeSearchFilters.boardName && (
                                    <span className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                        <span>Board: {activeSearchFilters.boardName}</span>
                                        <button
                                            type="button"
                                            className="btn-close ms-1"
                                            style={{ fontSize: '0.55rem' }}
                                            onClick={() => handleRemoveFilter('board')}
                                            aria-label="Remove filter"
                                        ></button>
                                    </span>
                                )}

                                {activeSearchFilters.radius && activeSearchFilters.radius !== '0' && (
                                    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                        <span>Radius: &le; {activeSearchFilters.radius} km</span>
                                        <button
                                            type="button"
                                            className="btn-close ms-1"
                                            style={{ fontSize: '0.55rem' }}
                                            onClick={() => handleRemoveFilter('radius')}
                                            aria-label="Remove filter"
                                        ></button>
                                    </span>
                                )}

                                {activeSearchFilters.gender && (
                                    <span className="badge bg-light text-dark border rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                        <span>Gender: {activeSearchFilters.gender}</span>
                                        <button
                                            type="button"
                                            className="btn-close ms-1"
                                            style={{ fontSize: '0.55rem' }}
                                            onClick={() => handleRemoveFilter('gender')}
                                            aria-label="Remove filter"
                                        ></button>
                                    </span>
                                )}

                                {activeSearchFilters.area && (
                                    <span className="badge bg-light text-dark border rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                        <span>Area: {activeSearchFilters.area}</span>
                                        <button
                                            type="button"
                                            className="btn-close ms-1"
                                            style={{ fontSize: '0.55rem' }}
                                            onClick={() => handleRemoveFilter('area')}
                                            aria-label="Remove filter"
                                        ></button>
                                    </span>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-link btn-sm text-danger text-decoration-none p-0 ms-2 small fw-semibold"
                                    onClick={handleClearAllFilters}
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Dedicated Card-Box Grid */}
                    {filteredGridTutors.length === 0 ? (
                        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-light">
                            <i className="bi bi-person-x fs-1 text-muted mb-3"></i>
                            <h4 className="fw-bold text-dark">No Tutors Matched Your Current Filters</h4>
                            <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '480px' }}>
                                We couldn't find any educators matching the selected criteria. Try resetting the filters or switching back to "All".
                            </p>
                            <div className="d-flex justify-content-center gap-2">
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-pill px-4"
                                    onClick={handleClearAllFilters}
                                >
                                    Reset All Filters
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                    onClick={() => setShowFilterModal(true)}
                                >
                                    Modify Search
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {filteredGridTutors.map((teacher, idx) => (
                                <div key={teacher.user_id || teacher.id || idx} className="col">
                                    <div
                                        className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center d-flex flex-column justify-content-between bg-white position-relative"
                                        style={{
                                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                        }}
                                    >
                                        <div>
                                            {/* Photo & Online Ring */}
                                            <div className="mx-auto mb-3 position-relative d-inline-block">
                                                <img
                                                    src={
                                                        teacher.image
                                                            ? teacher.image.startsWith('http')
                                                                ? teacher.image
                                                                : `/user/${teacher.image}`
                                                            : '/front/img/noprofileimage.png'
                                                    }
                                                    onError={(e) => {
                                                        e.target.src = '/front/img/noprofileimage.png';
                                                    }}
                                                    alt={teacher.name}
                                                    className="rounded-circle shadow-xs border"
                                                    style={{ width: '88px', height: '88px', objectFit: 'cover' }}
                                                />
                                                <span
                                                    className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                                                    style={{ width: '15px', height: '15px' }}
                                                    title="Active Educator"
                                                />
                                            </div>

                                            {/* Name & Gender Badge */}
                                            <h5 className="fw-bold text-dark mb-1 text-truncate" title={teacher.name}>
                                                {teacher.name}
                                            </h5>
                                            <div className="d-flex align-items-center justify-content-center gap-1 mb-2">
                                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill py-1 px-2 small">
                                                    <i className="bi bi-patch-check-fill text-primary me-1"></i>
                                                    Verified Educator
                                                </span>
                                                {teacher.gender && (
                                                    <span className="badge bg-light text-secondary border rounded-pill py-1 px-2 small">
                                                        {teacher.gender}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Distance Proximity Badge */}
                                            {teacher.distance !== undefined && teacher.distance !== null && (
                                                <div className="mb-3">
                                                    <span
                                                        className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1"
                                                        style={{ fontSize: '0.78rem' }}
                                                    >
                                                        <i className="bi bi-geo-alt-fill me-1"></i>
                                                        {Number(teacher.distance) < 0.1
                                                            ? 'In your neighborhood'
                                                            : Number(teacher.distance) < 1
                                                            ? `${Math.round(Number(teacher.distance) * 1000)} meters away`
                                                            : `${Number(teacher.distance).toFixed(1)} km away`}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Address */}
                                            {teacher.address && (
                                                <div className="text-muted small mb-3 text-truncate" style={{ fontSize: '0.8rem' }}>
                                                    <i className="bi bi-pin-map text-danger me-1"></i>
                                                    {teacher.address}
                                                </div>
                                            )}

                                            {/* Details Box */}
                                            <div className="text-start bg-light rounded-3 p-3 mb-3 small">
                                                {teacher.qualification_name && (
                                                    <div className="mb-1">
                                                        <strong className="text-secondary">Qualification:</strong>{' '}
                                                        <span className="text-dark fw-medium">{teacher.qualification_name}</span>
                                                    </div>
                                                )}
                                                {teacher.subject_names && (
                                                    <div className="mb-1">
                                                        <strong className="text-secondary">Subjects:</strong>{' '}
                                                        <span className="text-dark fw-medium">{teacher.subject_names}</span>
                                                    </div>
                                                )}
                                                {teacher.board_names && (
                                                    <div className="mb-1">
                                                        <strong className="text-secondary">Board:</strong>{' '}
                                                        <span className="text-dark">{teacher.board_names}</span>
                                                    </div>
                                                )}
                                                {teacher.teaching_mode_name && (
                                                    <div className="mb-1">
                                                        <strong className="text-secondary">Mode:</strong>{' '}
                                                        <span className="text-dark">{teacher.teaching_mode_name}</span>
                                                    </div>
                                                )}
                                                {teacher.timings && (
                                                    <div>
                                                        <strong className="text-secondary">Timings:</strong>{' '}
                                                        <span className="text-dark">{teacher.timings}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description Quote */}
                                            {teacher.description && (
                                                <p className="text-muted small mb-3 text-truncate-2 fst-italic" style={{ fontSize: '0.82rem' }}>
                                                    "{teacher.description}"
                                                </p>
                                            )}
                                        </div>

                                        {/* Card Actions */}
                                        <div className="pt-3 border-top d-flex align-items-center justify-content-between gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openTeacherModal(teacher)}
                                                className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold flex-grow-1"
                                                data-bs-toggle="modal"
                                                data-bs-target="#homeTeacherModal"
                                            >
                                                <i className="bi bi-person-lines-fill me-1"></i>
                                                View Profile
                                            </button>

                                            <Link
                                                href={`/search?lookingfor=teacher&search_state=${teacher.state || 0}&search_city=${teacher.city || 0}&filter_mode=all`}
                                                className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold flex-grow-1"
                                            >
                                                Contact Tutor
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* View All in Directory Button */}
                    <div className="text-center mt-5">
                        <Link
                            href="/search?lookingfor=teacher&filter_mode=all"
                            className="btn btn-outline-primary btn-lg rounded-pill px-5 shadow-sm fw-semibold"
                        >
                            <span>Browse Full Tutors Directory</span>
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* COMPACT "What are you looking for?" MODAL / POPUP FORM */}
            {/* ============================================================== */}
            {showFilterModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowFilterModal(false);
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 rounded-4 shadow-2xl overflow-hidden">
                            <div className="modal-header bg-light border-bottom py-3 px-4">
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center"
                                        style={{ width: '38px', height: '38px' }}
                                    >
                                        <i className="bi bi-search-heart fs-5"></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold text-dark mb-0">What are you looking for?</h5>
                                        <p className="text-muted small mb-0">Customize your preferences to find the best local educators</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowFilterModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body p-4">
                                <form onSubmit={handleModalSearchSubmit}>
                                    <div className="row g-3">
                                        {/* 1. Category */}
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-dark mb-1">
                                                <i className="bi bi-grid text-primary me-1"></i> Category
                                            </label>
                                            <select
                                                className="form-select rounded-3"
                                                value={searchState.lookingfor}
                                                onChange={(e) => setSearchState({ ...searchState, lookingfor: e.target.value })}
                                            >
                                                <option value="teacher">Tutors / Teachers</option>
                                                <option value="coaching-center">Coaching Institutes</option>
                                                <option value="schools">Schools</option>
                                                <option value="college">Colleges</option>
                                                <option value="university">Universities</option>
                                                <option value="course">Courses &amp; Classes</option>
                                            </select>
                                        </div>

                                        {/* 2. Subject Field with Dynamic Auto-Suggest Search */}
                                        <div className="col-md-6 position-relative">
                                            <label className="form-label small fw-bold text-dark mb-1 d-flex justify-content-between">
                                                <span><i className="bi bi-book text-primary me-1"></i> Subject</span>
                                                <span className="text-muted fw-normal small">Auto-suggest enabled</span>
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control rounded-3 pe-4"
                                                    placeholder="Type subject (e.g. Mathematics, Physics, NEET)..."
                                                    value={modalSubjectInput}
                                                    onChange={(e) => {
                                                        setModalSubjectInput(e.target.value);
                                                        setShowModalSubjectSuggestions(true);
                                                    }}
                                                    onFocus={() => setShowModalSubjectSuggestions(true)}
                                                />
                                                <i className="bi bi-search position-absolute end-0 top-50 translate-middle-y me-3 text-muted"></i>
                                            </div>

                                            {/* Auto-suggest dropdown in modal */}
                                            {showModalSubjectSuggestions && matchingModalSubjects.length > 0 && (
                                                <div
                                                    className="position-absolute start-0 end-0 bg-white border rounded-3 shadow-lg p-1 mt-1"
                                                    style={{ zIndex: 1070, maxHeight: '200px', overflowY: 'auto' }}
                                                >
                                                    {matchingModalSubjects.map((sub, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className="btn btn-sm btn-light w-100 text-start py-1 px-2 border-0 mb-1 rounded-2 d-flex justify-content-between align-items-center"
                                                            onClick={() => {
                                                                setModalSubjectInput(sub.name);
                                                                setSearchState((prev) => ({ ...prev, search_subject: sub.id }));
                                                                setShowModalSubjectSuggestions(false);
                                                            }}
                                                        >
                                                            <span className="small fw-semibold">{sub.name}</span>
                                                            <span className="badge bg-secondary-subtle text-secondary small">
                                                                {sub.category}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* 3. Search Distance / Radius */}
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-dark mb-1">
                                                <i className="bi bi-compass text-primary me-1"></i> Search Distance / Radius
                                            </label>
                                            <select
                                                className="form-select rounded-3"
                                                value={searchState.search_radius}
                                                onChange={(e) => setSearchState({ ...searchState, search_radius: e.target.value })}
                                            >
                                                <option value="0">All Locations (City-wide / No limit)</option>
                                                <option value="1">Within 1 KM (Immediate Neighborhood)</option>
                                                <option value="2">Within 2 KM</option>
                                                <option value="3">Within 3 KM</option>
                                                <option value="5">Within 5 KM</option>
                                                <option value="10">Within 10 KM</option>
                                                <option value="25">Within 25 KM</option>
                                                <option value="50">Within 50 KM (Regional)</option>
                                            </select>
                                        </div>

                                        {/* 4. Board / Curriculum */}
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-dark mb-1">
                                                <i className="bi bi-award text-primary me-1"></i> Board / Curriculum
                                            </label>
                                            <select
                                                className="form-select rounded-3"
                                                value={searchState.search_board}
                                                onChange={(e) => setSearchState({ ...searchState, search_board: e.target.value })}
                                            >
                                                <option value="0">All Educational Boards</option>
                                                {boards.map((b) => (
                                                    <option key={b.id} value={b.id}>{b.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Location / GPS Auto-detect button */}
                                        <div className="col-12">
                                            <div className="card bg-light border-0 p-3 rounded-3">
                                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                                    <div>
                                                        <span className="fw-semibold small text-dark d-block">
                                                            <i className="bi bi-crosshair text-danger me-1"></i> Auto-Detect Your Location
                                                        </span>
                                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                            Use GPS to immediately locate tutors within your chosen radius
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${
                                                            geoActive ? 'btn-success text-white' : 'btn-outline-primary'
                                                        } rounded-pill px-3 fw-semibold`}
                                                        onClick={handleUseCurrentLocation}
                                                        disabled={loadingGeo}
                                                    >
                                                        {loadingGeo ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                                <span>Acquiring GPS...</span>
                                                            </>
                                                        ) : geoActive ? (
                                                            <>
                                                                <i className="bi bi-check-circle-fill me-1"></i>
                                                                <span>GPS Active ({activeArea})</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-geo-alt-fill me-1"></i>
                                                                <span>Detect My Location</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                {geoMsg && (
                                                    <div className={`mt-2 small fw-semibold ${geoActive ? 'text-success' : 'text-danger'}`}>
                                                        {geoMsg}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cascading State, District, City */}
                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold text-dark mb-1">State</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={searchState.search_state}
                                                onChange={handleStateChange}
                                            >
                                                <option value="0">Select State</option>
                                                {states.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold text-dark mb-1">District</label>
                                            <select
                                                className="form-select rounded-3"
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

                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold text-dark mb-1">City / Area</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={searchState.search_city}
                                                onChange={(e) => setSearchState((prev) => ({ ...prev, search_city: e.target.value }))}
                                                disabled={searchState.search_district === '0' || loadingCities}
                                            >
                                                <option value="0">
                                                    {loadingCities ? 'Loading Cities...' : 'Select City / Area'}
                                                </option>
                                                {cities.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Gender Preference */}
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-dark mb-1">Teacher Gender Preference</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={searchState.search_gender}
                                                onChange={(e) => setSearchState({ ...searchState, search_gender: e.target.value })}
                                            >
                                                <option value="">Any Gender</option>
                                                <option value="Male">Male Tutor</option>
                                                <option value="Female">Female Tutor</option>
                                            </select>
                                        </div>

                                        {/* Quick Subject Picks */}
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-dark mb-1">Quick Subject Picks</label>
                                            <div className="d-flex flex-wrap gap-1">
                                                {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Python', 'NEET'].map((name) => (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        className="btn btn-outline-secondary py-0 px-2 rounded-pill small"
                                                        style={{ fontSize: '0.74rem', lineHeight: '1.7' }}
                                                        onClick={() => {
                                                            setModalSubjectInput(name);
                                                            const match = EXTENSIVE_SUBJECTS.find((s) =>
                                                                s.name.toLowerCase().includes(name.toLowerCase())
                                                            );
                                                            setSearchState((prev) => ({ ...prev, search_subject: match?.id || name }));
                                                        }}
                                                    >
                                                        + {name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer border-0 px-0 pt-4 pb-0 d-flex justify-content-between">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary rounded-pill px-4"
                                            onClick={() => {
                                                setSearchState({
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
                                                setModalSubjectInput('');
                                            }}
                                        >
                                            Reset Filters
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-pill px-5 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                                        >
                                            <i className="bi bi-search"></i>
                                            <span>Search Tutors Now</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* STATS BANNER: Modern Gradient Glassmorphism Showcase */}
            {/* ============================================================== */}
            <section
                className="stats-section py-5 text-white position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 50%, #052c65 100%)',
                }}
            >
                <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row g-3 g-lg-4 text-center">
                        <div className="col-6 col-lg-3">
                            <div
                                className="p-3 p-lg-4 rounded-4 h-100"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            >
                                <div className="d-inline-flex p-3 rounded-circle bg-white text-primary mb-3 shadow-sm">
                                    <i className="bi bi-journal-bookmark-fill fs-4"></i>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.courses || 120}+</h2>
                                <p className="text-white-50 mb-0 small fw-medium">Active Courses</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div
                                className="p-3 p-lg-4 rounded-4 h-100"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            >
                                <div className="d-inline-flex p-3 rounded-circle bg-white text-success mb-3 shadow-sm">
                                    <i className="bi bi-person-check-fill fs-4"></i>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.teachers || 250}+</h2>
                                <p className="text-white-50 mb-0 small fw-medium">Verified Teachers</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div
                                className="p-3 p-lg-4 rounded-4 h-100"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            >
                                <div className="d-inline-flex p-3 rounded-circle bg-white text-warning mb-3 shadow-sm">
                                    <i className="bi bi-people-fill fs-4"></i>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.students || 1500}+</h2>
                                <p className="text-white-50 mb-0 small fw-medium">Enrolled Students</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div
                                className="p-3 p-lg-4 rounded-4 h-100"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            >
                                <div className="d-inline-flex p-3 rounded-circle bg-white text-info mb-3 shadow-sm">
                                    <i className="bi bi-patch-check-fill fs-4"></i>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">99%</h2>
                                <p className="text-white-50 mb-0 small fw-medium">Success &amp; Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* TEMPORARILY HIDDEN PER USER REQUEST: POPULAR CATEGORIES */}
            {/* ============================================================== */}
            {/*
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
                                    <div className="mx-auto mb-3">
                                        <img
                                            src={cat.image ? `/course_category/${cat.image}` : '/front/img/default-cat.png'}
                                            onError={(e) => {
                                                e.target.src = '/front/img/default-cat.png';
                                            }}
                                            alt={cat.name}
                                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <h6 className="fw-bold text-dark mb-1">{cat.name}</h6>
                                    <p className="text-muted small mb-0">{cat.courses_count || 0} Courses</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            */}

            {/* ============================================================== */}
            {/* FEATURED COURSES: Modern Header & Cards */}
            {/* ============================================================== */}
            <section className="courses-section py-5 bg-light">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
                        <div>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small text-uppercase mb-2 d-inline-block">
                                Curated Learning
                            </span>
                            <h2 className="fw-bold text-dark mb-1">Featured Courses &amp; Classes</h2>
                            <p className="text-muted small mb-0">Learn from experienced educators across all disciplines</p>
                        </div>
                        <Link href="/courses" className="btn btn-outline-primary rounded-pill px-4 fw-semibold shadow-xs">
                            <span>View All Courses</span>
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>

                    <div className="row g-4">
                        {courses.map((course) => (
                            <div key={course.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column bg-white">
                                    <div className="position-relative">
                                        <img
                                            src={course.image ? `/course/${course.image}` : '/front/img/default-course.png'}
                                            onError={(e) => {
                                                e.target.src = '/front/img/default-course.png';
                                            }}
                                            alt={course.title}
                                            className="card-img-top"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                                            onClick={() => handleToggleFav(course.id)}
                                            title="Bookmark course"
                                        >
                                            <i className="bi bi-heart text-danger"></i>
                                        </button>
                                    </div>
                                    <div className="card-body p-4 d-flex flex-column">
                                        <h5 className="fw-bold mb-2">
                                            <Link href={`/course-detail/${course.id}/${course.slug}`} className="text-dark text-decoration-none">
                                                {course.title}
                                            </Link>
                                        </h5>
                                        <p className="text-muted small flex-grow-1">{course.short_desc}</p>
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                            <span className="fw-bold text-primary fs-5">
                                                {course.price > 0 ? `₹${course.price}` : 'Free'}
                                            </span>
                                            <Link href={`/course-detail/${course.id}/${course.slug}`} className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold">
                                                Enroll Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* LATEST BLOGS: Modern Header & Cards */}
            {/* ============================================================== */}
            {blogs.length > 0 && (
                <section className="blogs-section py-5 bg-white">
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small text-uppercase mb-2 d-inline-block">
                                Academic Insights
                            </span>
                            <h2 className="fw-bold text-dark mb-1">Latest Educational Guides &amp; Insights</h2>
                            <p className="text-muted small mb-0 mx-auto" style={{ maxWidth: '580px' }}>
                                Exam preparation strategies, study methodologies, and subject advice from experienced educators
                            </p>
                        </div>

                        <div className="row g-4">
                            {blogs.slice(0, 3).map((blog) => (
                                <div key={blog.id} className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                                        <img
                                            src={blog.image ? `/blog/${blog.image}` : '/front/img/default-blog.png'}
                                            onError={(e) => {
                                                e.target.src = '/front/img/default-blog.png';
                                            }}
                                            alt={blog.title}
                                            className="card-img-top"
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-4">
                                            <h6 className="fw-bold mb-2">
                                                <Link href={`/blog/${blog.id}/${blog.slug}`} className="text-dark text-decoration-none">
                                                    {blog.title}
                                                </Link>
                                            </h6>
                                            <p className="text-muted small mb-3">{blog.short_desc}</p>
                                            <Link href={`/blog/${blog.id}/${blog.slug}`} className="text-primary fw-semibold small text-decoration-none">
                                                Read Article &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================== */}
            {/* TEACHER PROFILE DETAILS MODAL */}
            {/* ============================================================== */}
            <div
                className="modal fade"
                id="homeTeacherModal"
                tabIndex="-1"
                aria-labelledby="homeTeacherModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-bottom py-3 px-4">
                            <h5 className="modal-title fw-bold" id="homeTeacherModalLabel">
                                {selectedTeacher?.name ? `${selectedTeacher.name} - Profile` : 'Teacher Profile'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            {loadingDetails ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 text-muted">Loading profile details...</p>
                                </div>
                            ) : (
                                <div>
                                    {teacherModalHtml ? (
                                        <div dangerouslySetInnerHTML={{ __html: teacherModalHtml }} />
                                    ) : (
                                        <div className="text-center py-3">
                                            <p className="text-muted">No additional profile details found.</p>
                                        </div>
                                    )}

                                    {/* Direct review post in modal */}
                                    <div className="card border-0 bg-light p-3 mt-4 rounded-3">
                                        <h6 className="fw-bold mb-2">Write feedback for this teacher</h6>
                                        {reviewMsg && <div className="alert alert-info py-2 small">{reviewMsg}</div>}
                                        <div className="row g-2">
                                            <div className="col-sm-4">
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={teacherRating}
                                                    onChange={(e) => setTeacherRating(e.target.value)}
                                                >
                                                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                                    <option value="3">⭐⭐⭐ 3 Stars</option>
                                                    <option value="2">⭐⭐ 2 Stars</option>
                                                    <option value="1">⭐ 1 Star</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <textarea
                                                    rows="2"
                                                    className="form-control form-control-sm"
                                                    placeholder="Share your experience with this teacher..."
                                                    value={teacherReview}
                                                    onChange={(e) => setTeacherReview(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className="col-12">
                                                <button
                                                    type="button"
                                                    onClick={handlePostTeacherReview}
                                                    className="btn btn-dark btn-sm rounded-pill px-4"
                                                >
                                                    Submit Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}

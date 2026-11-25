import React, { useEffect, useRef, useState, useCallback } from 'react';

// Common Indian State / City center coordinates for smart zooming
const REGION_COORDINATES = {
    'west bengal': [22.5726, 88.3639],
    'kolkata': [22.5726, 88.3639],
    'howrah': [22.5958, 88.2636],
    'delhi': [28.6139, 77.2090],
    'new delhi': [28.6139, 77.2090],
    'maharashtra': [19.0760, 72.8777],
    'mumbai': [19.0760, 72.8777],
    'pune': [18.5204, 73.8567],
    'karnataka': [12.9716, 77.5946],
    'bengaluru': [12.9716, 77.5946],
    'bangalore': [12.9716, 77.5946],
    'tamil nadu': [13.0827, 80.2707],
    'chennai': [13.0827, 80.2707],
    'telangana': [17.3850, 78.4867],
    'hyderabad': [17.3850, 78.4867],
    'uttar pradesh': [26.8467, 80.9462],
    'lucknow': [26.8467, 80.9462],
    'noida': [28.5355, 77.3910],
    'gujarat': [23.0225, 72.5714],
    'ahmedabad': [23.0225, 72.5714],
    'rajasthan': [26.9124, 75.7873],
    'jaipur': [26.9124, 75.7873],
    'bihar': [25.5941, 85.1376],
    'patna': [25.5941, 85.1376],
    'odisha': [20.2961, 85.8245],
    'bhubaneswar': [20.2961, 85.8245],
    'jharkhand': [23.3441, 85.3096],
    'ranchi': [23.3441, 85.3096],
    'punjab': [30.7333, 76.7794],
    'chandigarh': [30.7333, 76.7794],
    'haryana': [28.4595, 77.0266],
    'gurgaon': [28.4595, 77.0266],
    'gurugram': [28.4595, 77.0266],
    'kerala': [8.5241, 76.9366],
    'kochi': [9.9312, 76.2673],
    'india': [20.5937, 78.9629],
};

function loadLeafletLibrary() {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.L) {
            return resolve(window.L);
        }

        // Inject Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.crossOrigin = '';
            document.head.appendChild(link);
        }

        // Inject Leaflet JS
        const existingScript = document.getElementById('leaflet-js');
        if (existingScript) {
            if (window.L) return resolve(window.L);
            existingScript.addEventListener('load', () => resolve(window.L));
            existingScript.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.crossOrigin = '';
        script.onload = () => resolve(window.L);
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
    });
}

/**
 * Creates custom SVG Leaflet Marker Icon to avoid broken image asset paths
 */
function createCustomMarkerIcon(L, isCurrentLocation = false) {
    const color = isCurrentLocation ? '#059669' : '#2563eb';
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44">
            <defs>
                <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.35"/>
                </filter>
            </defs>
            <path filter="url(#shadow)" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                d="M16 2 C8.268 2 2 8.268 2 16 C2 26 16 42 16 42 C16 42 30 26 30 16 C30 8.268 23.732 2 16 2 Z"/>
            <circle cx="16" cy="16" r="6" fill="#ffffff"/>
            <circle cx="16" cy="16" r="3" fill="${color}"/>
        </svg>
    `;

    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: svgIcon,
        iconSize: [32, 44],
        iconAnchor: [16, 42],
        popupAnchor: [0, -38],
    });
}

export default function MapLocationPicker({
    latitude = '',
    longitude = '',
    onChange,
    stateName = '',
    cityName = '',
    height = '360px',
    readOnly = false,
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [leafletReady, setLeafletReady] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoStatus, setGeoStatus] = useState({ type: '', text: '' });
    const [addressLookup, setAddressLookup] = useState('');
    const [searchingAddress, setSearchingAddress] = useState(false);

    // Parse lat/lng to valid numbers or null
    const numericLat = latitude !== '' && !isNaN(latitude) ? parseFloat(latitude) : null;
    const numericLng = longitude !== '' && !isNaN(longitude) ? parseFloat(longitude) : null;
    const hasCoordinates = numericLat !== null && numericLng !== null && numericLat >= -90 && numericLat <= 90 && numericLng >= -180 && numericLng <= 180;

    // Load Leaflet once on mount
    useEffect(() => {
        let isMounted = true;
        loadLeafletLibrary()
            .then(() => {
                if (isMounted) setLeafletReady(true);
            })
            .catch((err) => {
                console.error('Failed to load Leaflet:', err);
                if (isMounted) {
                    setGeoStatus({
                        type: 'danger',
                        text: 'Map library failed to load. You can still enter coordinates manually below.',
                    });
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Determine initial center
    const getInitialCenter = useCallback(() => {
        if (hasCoordinates) {
            return [numericLat, numericLng];
        }

        const cityKey = (cityName || '').toLowerCase().trim();
        const stateKey = (stateName || '').toLowerCase().trim();

        if (cityKey && REGION_COORDINATES[cityKey]) {
            return REGION_COORDINATES[cityKey];
        }
        if (stateKey && REGION_COORDINATES[stateKey]) {
            return REGION_COORDINATES[stateKey];
        }

        // Default to center of India
        return [22.5726, 88.3639]; // Default Kolkata / Eastern hub or [20.5937, 78.9629]
    }, [hasCoordinates, numericLat, numericLng, cityName, stateName]);

    // Initialize or update Map
    useEffect(() => {
        if (!leafletReady || !mapContainerRef.current) return;
        const L = window.L;
        if (!L) return;

        // Create map instance if it doesn't exist
        if (!mapInstanceRef.current) {
            const initialCenter = getInitialCenter();
            const initialZoom = hasCoordinates ? 14 : 11;

            const map = L.map(mapContainerRef.current, {
                center: initialCenter,
                zoom: initialZoom,
                scrollWheelZoom: false, // Prevent accidental scrolling while browsing form
            });

            // OpenStreetMap tile layer (Clean, free, fast, no API key needed)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
            }).addTo(map);

            // Click on map to place/move marker
            if (!readOnly) {
                map.on('click', (e) => {
                    const { lat, lng } = e.latlng;
                    updatePosition(lat, lng, true);
                });
            }

            mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;

        // Manage Marker
        if (hasCoordinates) {
            const markerPos = [numericLat, numericLng];
            if (!markerRef.current) {
                const marker = L.marker(markerPos, {
                    draggable: !readOnly,
                    icon: createCustomMarkerIcon(L, false),
                }).addTo(map);

                marker.bindPopup(`
                    <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
                        <strong style="color: #1e293b; display: block; margin-bottom: 2px;">Your Tutoring Location</strong>
                        <span style="color: #64748b; font-size: 11px;">Lat: ${numericLat.toFixed(6)}, Lng: ${numericLng.toFixed(6)}</span>
                        ${!readOnly ? '<div style="color: #2563eb; font-size: 11px; margin-top: 4px;">Drag to adjust exact pin</div>' : ''}
                    </div>
                `);

                if (!readOnly) {
                    marker.on('dragend', (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        updatePosition(lat, lng, false);
                    });
                }

                markerRef.current = marker;
            } else {
                markerRef.current.setLatLng(markerPos);
            }
        } else if (markerRef.current) {
            map.removeLayer(markerRef.current);
            markerRef.current = null;
        }

        // Resize invalidation to fix render when tab or modal changes
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 150);
    }, [leafletReady, readOnly]);

    // Handle updates when external props change (e.g. state/city change or manual lat/lng change)
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;
        const L = window.L;
        const map = mapInstanceRef.current;

        if (hasCoordinates) {
            const targetPos = [numericLat, numericLng];
            if (markerRef.current) {
                markerRef.current.setLatLng(targetPos);
            } else {
                const marker = L.marker(targetPos, {
                    draggable: !readOnly,
                    icon: createCustomMarkerIcon(L, false),
                }).addTo(map);

                if (!readOnly) {
                    marker.on('dragend', (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        updatePosition(lat, lng, false);
                    });
                }
                markerRef.current = marker;
            }
        }
    }, [numericLat, numericLng, hasCoordinates, readOnly]);

    // Pan map when city or state changes and user hasn't set custom coordinates
    useEffect(() => {
        if (!mapInstanceRef.current || hasCoordinates) return;
        const cityKey = (cityName || '').toLowerCase().trim();
        const stateKey = (stateName || '').toLowerCase().trim();

        const targetCoords = REGION_COORDINATES[cityKey] || REGION_COORDINATES[stateKey];
        if (targetCoords) {
            mapInstanceRef.current.setView(targetCoords, 11, { animate: true });
        }
    }, [cityName, stateName, hasCoordinates]);

    const updatePosition = (lat, lng, panTo = true) => {
        const formattedLat = parseFloat(lat).toFixed(7);
        const formattedLng = parseFloat(lng).toFixed(7);

        if (onChange) {
            onChange({ lat: formattedLat, lng: formattedLng });
        }

        if (mapInstanceRef.current && panTo) {
            mapInstanceRef.current.panTo([parseFloat(lat), parseFloat(lng)], { animate: true });
        }

        setGeoStatus({
            type: 'success',
            text: `Pinned at: ${formattedLat}, ${formattedLng}. Click "Save Profile" to keep this location.`,
        });
    };

    // Browser Geolocation API ("Use My Current Location")
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeoStatus({
                type: 'warning',
                text: 'Geolocation is not supported by your browser.',
            });
            return;
        }

        setGeoLoading(true);
        setGeoStatus({ type: 'info', text: 'Detecting your GPS location...' });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const accuracy = Math.round(pos.coords.accuracy);

                setGeoLoading(false);
                updatePosition(lat, lng, true);

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
                }

                setGeoStatus({
                    type: 'success',
                    text: `Location detected (~${accuracy}m accuracy). Pin placed at ${lat.toFixed(6)}, ${lng.toFixed(6)}.`,
                });
            },
            (err) => {
                setGeoLoading(false);
                let message = 'Could not detect your current location.';
                if (err.code === 1) {
                    message = 'Location access permission was denied. Please allow location access or click on the map.';
                } else if (err.code === 2) {
                    message = 'GPS signal unavailable. Please click your neighborhood on the map.';
                } else if (err.code === 3) {
                    message = 'Location request timed out. Please try clicking on the map directly.';
                }
                setGeoStatus({ type: 'danger', text: message });
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    };

    // Address Search via OpenStreetMap Nominatim
    const handleSearchAddress = async (e) => {
        if (e) e.preventDefault();
        const query = (addressLookup || '').trim();
        if (!query) return;

        setSearchingAddress(true);
        setGeoStatus({ type: 'info', text: `Searching for "${query}"...` });

        try {
            const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`;
            const res = await fetch(endpoint, {
                headers: { 'Accept-Language': 'en' },
            });
            const data = await res.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                updatePosition(lat, lng, true);
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
                }

                setGeoStatus({
                    type: 'success',
                    text: `Found: ${result.display_name.split(',').slice(0, 3).join(',')}. Pin updated!`,
                });
            } else {
                setGeoStatus({
                    type: 'warning',
                    text: `No exact location found for "${query}". Try searching a major landmark or click on the map.`,
                });
            }
        } catch (err) {
            setGeoStatus({
                type: 'danger',
                text: 'Location search service is temporarily unavailable. Please click directly on the map.',
            });
        } finally {
            setSearchingAddress(false);
        }
    };

    const handleClearLocation = () => {
        if (onChange) {
            onChange({ lat: '', lng: '' });
        }
        if (markerRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
            markerRef.current = null;
        }
        setGeoStatus({
            type: 'info',
            text: 'Location pin cleared.',
        });
    };

    return (
        <div className="map-location-picker-wrapper mb-3">
            {/* Header controls: Search & Geolocation */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '420px' }}>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search landmark, locality, area..."
                            value={addressLookup}
                            onChange={(e) => setAddressLookup(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress(e)}
                            disabled={readOnly || searchingAddress}
                        />
                        <button
                            type="button"
                            className="btn btn-primary btn-sm px-3 fw-medium"
                            onClick={handleSearchAddress}
                            disabled={readOnly || searchingAddress || !addressLookup.trim()}
                        >
                            {searchingAddress ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                'Search'
                            )}
                        </button>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {!readOnly && (
                        <>
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1 shadow-2xs"
                                onClick={handleGetCurrentLocation}
                                disabled={geoLoading}
                                title="Detect location automatically via device GPS"
                            >
                                {geoLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        Detecting GPS...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-crosshair text-primary"></i>
                                        <span>Use My Current Location</span>
                                    </>
                                )}
                            </button>

                            {hasCoordinates && (
                                <button
                                    type="button"
                                    className="btn btn-light btn-sm text-danger border rounded-pill px-2 py-1"
                                    onClick={handleClearLocation}
                                    title="Clear pinned location"
                                >
                                    <i className="bi bi-x-circle me-1"></i>Clear Pin
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Status alerts */}
            {geoStatus.text && (
                <div className={`alert alert-${geoStatus.type} alert-dismissible py-2 px-3 small rounded-3 mb-2 d-flex align-items-center justify-content-between`}>
                    <div className="d-flex align-items-center gap-2">
                        <i className={`bi ${geoStatus.type === 'success' ? 'bi-check-circle-fill' : geoStatus.type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'}`}></i>
                        <span>{geoStatus.text}</span>
                    </div>
                    <button
                        type="button"
                        className="btn-close py-2"
                        aria-label="Close"
                        onClick={() => setGeoStatus({ type: '', text: '' })}
                    ></button>
                </div>
            )}

            {/* Map Container */}
            <div
                className="position-relative rounded-4 border overflow-hidden shadow-2xs"
                style={{ height, minHeight: '300px', backgroundColor: '#f1f5f9' }}
            >
                <div
                    ref={mapContainerRef}
                    style={{ width: '100%', height: '100%', zIndex: 1 }}
                />

                {!leafletReady && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-light bg-opacity-75"
                        style={{ zIndex: 5 }}
                    >
                        <div className="spinner-border text-primary mb-2" role="status">
                            <span className="visually-hidden">Loading interactive map...</span>
                        </div>
                        <span className="small text-secondary fw-semibold">Loading Interactive Map...</span>
                    </div>
                )}

                {/* Floating hint badge */}
                <div
                    className="position-absolute bottom-0 start-0 m-3 px-3 py-1 bg-white bg-opacity-95 rounded-pill shadow-xs border small text-dark fw-medium d-flex align-items-center gap-2"
                    style={{ zIndex: 400, fontSize: '11px', backdropFilter: 'blur(4px)' }}
                >
                    <i className="bi bi-pin-map-fill text-primary"></i>
                    <span>
                        {hasCoordinates
                            ? 'Drag the blue pin or click anywhere to adjust exact location'
                            : 'Click on the map or tap "Use My Current Location" to drop a pin'}
                    </span>
                </div>
            </div>

            {/* Bidirectional Synced Latitude & Longitude Inputs */}
            <div className="row g-2 mt-2">
                <div className="col-sm-6">
                    <label className="form-label small text-muted mb-1 fw-semibold">
                        Latitude Coordinates
                    </label>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light text-muted" style={{ fontSize: '11px' }}>LAT</span>
                        <input
                            type="number"
                            step="0.0000001"
                            min="-90"
                            max="90"
                            className="form-control"
                            placeholder="e.g. 22.572646"
                            value={latitude || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (onChange) onChange({ lat: val, lng: longitude });
                            }}
                            readOnly={readOnly}
                        />
                    </div>
                </div>

                <div className="col-sm-6">
                    <label className="form-label small text-muted mb-1 fw-semibold">
                        Longitude Coordinates
                    </label>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light text-muted" style={{ fontSize: '11px' }}>LNG</span>
                        <input
                            type="number"
                            step="0.0000001"
                            min="-180"
                            max="180"
                            className="form-control"
                            placeholder="e.g. 88.363895"
                            value={longitude || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (onChange) onChange({ lat: latitude, lng: val });
                            }}
                            readOnly={readOnly}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-2 text-muted" style={{ fontSize: '11px' }}>
                <i className="bi bi-shield-check text-success me-1"></i>
                <strong>Privacy &amp; Security:</strong> Exact street address is never exposed publicly to protect teacher safety. Pinned coordinates are used exclusively for parents and students to see your approximate locality, calculate traveling distance, and match home tuition requests.
            </div>
        </div>
    );
}

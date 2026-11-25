import React, { useEffect, useRef, useState, useCallback } from 'react';

// Convert DMS format (e.g. 22°32'39.6"N 88°17'29.1"E) from Google Maps to Decimal
export function parseDMSCoordinates(text) {
    if (!text || typeof text !== 'string') return null;
    const dmsRegex = /(\d{1,2})[°\s]+(\d{1,2})['\s]+([\d.]+)["]?\s*([NSns])[,\s]+(\d{1,3})[°\s]+(\d{1,2})['\s]+([\d.]+)["]?\s*([EWew])/;
    const match = text.match(dmsRegex);
    if (match) {
        let lat = parseFloat(match[1]) + parseFloat(match[2]) / 60 + parseFloat(match[3]) / 3600;
        if (match[4].toUpperCase() === 'S') lat = -lat;
        let lng = parseFloat(match[5]) + parseFloat(match[6]) / 60 + parseFloat(match[7]) / 3600;
        if (match[8].toUpperCase() === 'W') lng = -lng;
        return { lat, lng };
    }
    return null;
}

// Auto-extract exact coordinates from Google Maps URLs and coordinate formats
export function parseGoogleMapsLinkOrCoords(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const text = raw.trim();

    // 1. DMS Coordinates (e.g. 22°32'39.6"N 88°17'29.1"E)
    const dms = parseDMSCoordinates(text);
    if (dms) {
        return {
            lat: dms.lat,
            lng: dms.lng,
            label: `Google Maps Pinned Location (${dms.lat.toFixed(6)}, ${dms.lng.toFixed(6)})`,
        };
    }

    // 2. !3dLat!4dLng in Google Maps embed / place links
    const dataMatch = text.match(/!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/);
    if (dataMatch) {
        return {
            lat: parseFloat(dataMatch[1]),
            lng: parseFloat(dataMatch[2]),
            label: 'Google Maps Pinned Location',
        };
    }

    // 3. @lat,lng in Google Maps URLs (e.g. google.com/maps/place/.../@22.5443462,88.2914308,17z)
    const atMatch = text.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
    if (atMatch) {
        return {
            lat: parseFloat(atMatch[1]),
            lng: parseFloat(atMatch[2]),
            label: 'Google Maps Pinned Location',
        };
    }

    // 4. ?q=lat,lng or ?query=lat,lng or &daddr=lat,lng
    const qMatch = text.match(/[?&](?:q|query|daddr|ll)=(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
    if (qMatch) {
        return {
            lat: parseFloat(qMatch[1]),
            lng: parseFloat(qMatch[2]),
            label: 'Google Maps Pinned Location',
        };
    }

    // 5. Raw decimal coordinates: "22.544346, 88.291430"
    const coordMatch = text.match(/(-?\d{1,2}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/);
    if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return {
                lat,
                lng,
                label: `Google Maps Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            };
        }
    }

    return null;
}

// Resolve Google Maps Short URLs (e.g. maps.app.goo.gl or goo.gl/maps)
export async function resolveGoogleShortUrl(shortUrl) {
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const res = await fetch('/resolve-maps-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                Accept: 'application/json',
            },
            body: JSON.stringify({ url: shortUrl }),
        });
        if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.lat && data.lng) {
                return {
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng),
                    label: 'Google Maps Shared Pin',
                };
            }
        }
    } catch (_) {}
    return null;
}

// Load Leaflet Core Library
function loadLeafletLibrary() {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.L) {
            return resolve(window.L);
        }

        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.crossOrigin = '';
            document.head.appendChild(link);
        }

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

function createMarkerIcon(L) {
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="34" height="46">
            <defs>
                <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#0f172a" flood-opacity="0.45"/>
                </filter>
            </defs>
            <path filter="url(#shadow)" fill="#ea4335" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                d="M16 2 C8.268 2 2 8.268 2 16 C2 26 16 42 16 42 C16 42 30 26 30 16 C30 8.268 23.732 2 16 2 Z"/>
            <circle cx="16" cy="16" r="6" fill="#ffffff"/>
            <circle cx="16" cy="16" r="3" fill="#ea4335"/>
        </svg>
    `;

    return L.divIcon({
        className: 'custom-google-marker',
        html: svgIcon,
        iconSize: [34, 46],
        iconAnchor: [17, 44],
        popupAnchor: [0, -40],
    });
}

export default function MapLocationPicker({
    latitude = '',
    longitude = '',
    onChange,
    stateName = '',
    cityName = '',
    areaName = '',
    pincode = '',
    height = '380px',
    readOnly = false,
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const circleRef = useRef(null);
    const streetLayerRef = useRef(null);
    const satelliteLayerRef = useRef(null);

    const [mapReady, setMapReady] = useState(false);
    const [mapType, setMapType] = useState('street'); // 'street' | 'satellite'
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoStatus, setGeoStatus] = useState({ type: '', text: '' });
    const [addressLookup, setAddressLookup] = useState('');
    const [resolvingShortUrl, setResolvingShortUrl] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState('');

    const numericLat = latitude !== '' && !isNaN(latitude) ? parseFloat(latitude) : null;
    const numericLng = longitude !== '' && !isNaN(longitude) ? parseFloat(longitude) : null;
    const hasCoordinates =
        numericLat !== null &&
        numericLng !== null &&
        numericLat >= -90 &&
        numericLat <= 90 &&
        numericLng >= -180 &&
        numericLng <= 180;

    // Default center: Garden Reach / Kolkata
    const defaultCenter = hasCoordinates ? [numericLat, numericLng] : [22.5385, 88.3020];

    // Load Map Library
    useEffect(() => {
        let isMounted = true;
        loadLeafletLibrary()
            .then(() => {
                if (isMounted) setMapReady(true);
            })
            .catch(() => {
                if (isMounted) {
                    setGeoStatus({
                        type: 'danger',
                        text: 'Map failed to load. Please check your internet connection.',
                    });
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Update Position Handler
    const updatePosition = useCallback(
        (lat, lng, panMap = true, label = '') => {
            const formattedLat = parseFloat(lat).toFixed(6);
            const formattedLng = parseFloat(lng).toFixed(6);

            if (mapInstanceRef.current && window.L) {
                const pos = [parseFloat(lat), parseFloat(lng)];
                if (panMap) {
                    mapInstanceRef.current.flyTo(pos, 17, { duration: 1 });
                }
                if (markerRef.current) {
                    markerRef.current.setLatLng(pos);
                } else {
                    const marker = window.L.marker(pos, {
                        draggable: !readOnly,
                        icon: createMarkerIcon(window.L),
                    }).addTo(mapInstanceRef.current);

                    if (!readOnly) {
                        marker.on('dragend', (e) => {
                            const { lat: dLat, lng: dLng } = e.target.getLatLng();
                            updatePosition(dLat, dLng, false);
                        });
                    }
                    markerRef.current = marker;
                }
            }

            const displayLabel = label || `Coordinates: ${formattedLat}, ${formattedLng}`;
            setResolvedAddress(displayLabel);
            setGeoStatus({
                type: 'success',
                text: `Location pinned at ${displayLabel}. Click "Save Profile" below to persist.`,
            });

            if (onChange) {
                onChange({
                    lat: formattedLat,
                    lng: formattedLng,
                    area: label ? label.split(',')[0].trim() : '',
                    pincode: (label.match(/\b\d{6}\b/) || [''])[0],
                });
            }
        },
        [readOnly, onChange]
    );

    // Initialize Map with Google Maps Real Tiles (Zero 3rd party APIs)
    useEffect(() => {
        if (!mapReady || !mapContainerRef.current || !window.L) return;
        const L = window.L;

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: defaultCenter,
                zoom: hasCoordinates ? 17 : 15,
                scrollWheelZoom: true,
                dragging: true,
                touchZoom: true,
                zoomControl: false,
            });

            if (map.scrollWheelZoom) map.scrollWheelZoom.enable();
            if (map.dragging) map.dragging.enable();

            L.control.zoom({ position: 'topleft' }).addTo(map);

            // Official Google Maps Free Tiles:
            // lyrs=m : Google Maps Street view
            // lyrs=y : Google Maps Hybrid Satellite view with roads and landmark labels
            const googleStreetLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['0', '1', '2', '3'],
                attribution: '&copy; Google Maps',
            });

            const googleSatelliteLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['0', '1', '2', '3'],
                attribution: '&copy; Google Maps Satellite',
            });

            googleStreetLayer.addTo(map);
            streetLayerRef.current = googleStreetLayer;
            satelliteLayerRef.current = googleSatelliteLayer;

            if (hasCoordinates) {
                const marker = L.marker(defaultCenter, {
                    draggable: !readOnly,
                    icon: createMarkerIcon(L),
                }).addTo(map);

                if (!readOnly) {
                    marker.on('dragend', (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        updatePosition(lat, lng, false);
                    });
                }
                markerRef.current = marker;
            }

            if (!readOnly) {
                map.on('click', (e) => {
                    const { lat, lng } = e.latlng;
                    updatePosition(lat, lng, false);
                });
            }

            mapInstanceRef.current = map;
        }

        setTimeout(() => {
            if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
        }, 150);
    }, [mapReady, hasCoordinates, defaultCenter, readOnly, updatePosition]);

    // Switch between Google Street and Google Satellite
    const switchMapType = (type) => {
        if (!mapInstanceRef.current || !streetLayerRef.current || !satelliteLayerRef.current) return;
        const map = mapInstanceRef.current;
        setMapType(type);

        if (type === 'satellite') {
            map.removeLayer(streetLayerRef.current);
            map.addLayer(satelliteLayerRef.current);
        } else {
            map.removeLayer(satelliteLayerRef.current);
            map.addLayer(streetLayerRef.current);
        }
    };

    // Auto-detect & Parse Google Maps Link or Coordinates on paste or input
    const processInputForGoogleCoordinates = async (inputStr) => {
        const text = (inputStr || '').trim();
        if (!text) return false;

        // 1. Direct Coordinates or Full Google Maps URL
        const parsed = parseGoogleMapsLinkOrCoords(text);
        if (parsed) {
            updatePosition(parsed.lat, parsed.lng, true, parsed.label);
            return true;
        }

        // 2. Short Google Maps link (maps.app.goo.gl or goo.gl/maps)
        if (text.includes('goo.gl') || text.includes('maps.app.goo.gl')) {
            setResolvingShortUrl(true);
            setGeoStatus({ type: 'info', text: 'Resolving Google Maps short link...' });
            const resolved = await resolveGoogleShortUrl(text);
            setResolvingShortUrl(false);

            if (resolved) {
                updatePosition(resolved.lat, resolved.lng, true, resolved.label);
                return true;
            } else {
                setGeoStatus({
                    type: 'danger',
                    text: 'Unable to resolve Google Maps short link. Please copy the coordinates directly from Google Maps.',
                });
                return false;
            }
        }

        return false;
    };

    // Handle Search Bar Input
    const handleInputChange = async (e) => {
        const val = e.target.value;
        setAddressLookup(val);
        // Automatically check if pasted text has coordinates
        await processInputForGoogleCoordinates(val);
    };

    // Submit Search or Open in Google Maps
    const handleSearchSubmit = async () => {
        const query = (addressLookup || '').trim();
        if (!query) return;

        const found = await processInputForGoogleCoordinates(query);
        if (!found) {
            // Open Google Maps Search so user can drop their pin and copy coordinates in 1 second
            const googleSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + (cityName ? ', ' + cityName : ''))}`;
            window.open(googleSearchUrl, '_blank');
            setGeoStatus({
                type: 'info',
                text: `Opened "${query}" in Google Maps. Drop a pin on your building, copy the link or coordinates, and paste it here!`,
            });
        }
    };

    // Quick Paste Button from Clipboard
    const handlePasteFromClipboard = async () => {
        try {
            if (!navigator.clipboard?.readText) {
                setGeoStatus({
                    type: 'info',
                    text: 'Clipboard access unavailable. Please paste your Google Maps link or coordinates into the search box.',
                });
                return;
            }
            const text = await navigator.clipboard.readText();
            if (!text || !text.trim()) {
                setGeoStatus({ type: 'warning', text: 'Clipboard is empty.' });
                return;
            }
            setAddressLookup(text.trim());
            const resolved = await processInputForGoogleCoordinates(text.trim());
            if (!resolved) {
                setGeoStatus({
                    type: 'info',
                    text: `Pasted: "${text}". Press Search to open in Google Maps or right-click your landmark in Google Maps to copy coordinates.`,
                });
            }
        } catch (_) {
            setGeoStatus({
                type: 'info',
                text: 'Please paste your Google Maps link or coordinates into the search box.',
            });
        }
    };

    // Direct Button: Open Google Maps to Pin Exact Spot
    const handleOpenGoogleMaps = () => {
        const query = (addressLookup || areaName || cityName || 'Kolkata').trim();
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
        setGeoStatus({
            type: 'info',
            text: 'Google Maps opened in new tab. Tap or right-click your exact house/building, copy link or coordinates, then paste here!',
        });
    };

    // Use My Current Location Flow (Device GPS)
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeoStatus({
                type: 'warning',
                text: 'Geolocation is not supported by your browser.',
            });
            return;
        }

        setGeoLoading(true);
        setGeoStatus({ type: 'info', text: 'Detecting location via device GPS...' });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const accuracy = Math.round(pos.coords.accuracy || 30);
                setGeoLoading(false);

                if (mapInstanceRef.current && window.L) {
                    if (circleRef.current) mapInstanceRef.current.removeLayer(circleRef.current);
                    circleRef.current = window.L.circle([lat, lng], {
                        radius: Math.max(accuracy, 25),
                        color: '#ea4335',
                        fillColor: '#ea4335',
                        fillOpacity: 0.15,
                        weight: 1.5,
                    }).addTo(mapInstanceRef.current);
                }

                updatePosition(lat, lng, true, `Current GPS Location (~${accuracy}m accuracy)`);

                if (accuracy > 500) {
                    switchMapType('satellite');
                    setGeoStatus({
                        type: 'warning',
                        text: `Location is approximate (~${(accuracy / 1000).toFixed(1)} km). Switched to Google Satellite — drag the red pin onto your exact building.`,
                    });
                }
            },
            (err) => {
                setGeoLoading(false);
                switchMapType('satellite');
                let reason = 'Device GPS unavailable.';
                if (err.code === 1) reason = 'Browser location permission denied.';
                else if (err.code === 3) reason = 'Location request timed out.';

                setGeoStatus({
                    type: 'warning',
                    text: `${reason} Please click on the map, paste your Google Maps link, or use the "Open in Google Maps" button.`,
                });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Clear Location
    const handleClearLocation = () => {
        if (onChange) onChange({ lat: '', lng: '', area: '', pincode: '' });
        if (markerRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
            markerRef.current = null;
        }
        if (circleRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(circleRef.current);
            circleRef.current = null;
        }
        setResolvedAddress('');
        setAddressLookup('');
        setGeoStatus({ type: 'info', text: 'Location pin cleared.' });
    };

    return (
        <div className="map-location-picker-wrapper mb-3">
            {/* How-to Guide Note & Street/Satellite Switchers */}
            <div className="alert alert-light border shadow-xs py-2 px-3 small rounded-3 mb-2 d-flex flex-wrap align-items-center justify-content-between gap-2 text-dark">
                <div className="d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
                    <i className="bi bi-info-circle-fill text-danger flex-shrink-0"></i>
                    <span>
                        <strong>How to find &amp; pin your exact location:</strong> Click <strong>"Open in Google Maps"</strong> ↗ (opens in a new tab) ➔ Right-click (or tap) your exact house/building ➔ Click the coordinates to copy ➔ Paste here to pin instantly.
                    </span>
                </div>

                {/* Google Street / Google Satellite Switcher */}
                <div className="btn-group btn-group-sm shadow-2xs flex-shrink-0 ms-auto" role="group">
                    <button
                        type="button"
                        className={`btn btn-sm ${mapType === 'street' ? 'btn-danger text-white fw-semibold' : 'btn-outline-secondary bg-white'}`}
                        onClick={() => switchMapType('street')}
                        title="Google Maps Street View"
                    >
                        <i className="bi bi-map me-1"></i> Street
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm ${mapType === 'satellite' ? 'btn-danger text-white fw-semibold' : 'btn-outline-secondary bg-white'}`}
                        onClick={() => switchMapType('satellite')}
                        title="Google Maps Satellite Hybrid"
                    >
                        <i className="bi bi-globe-americas me-1"></i> Satellite
                    </button>
                </div>
            </div>

            {/* Google Maps Search Bar & Auto-Pin Input */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                <div className="position-relative flex-grow-1" style={{ maxWidth: '520px' }}>
                    <div className="input-group input-group-sm shadow-xs">
                        <span className="input-group-text bg-white border-end-0 text-muted">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Paste Google Maps link (maps.app.goo.gl...), coordinates, or search place..."
                            value={addressLookup}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearchSubmit();
                                }
                            }}
                            disabled={readOnly || resolvingShortUrl}
                        />
                        <button
                            type="button"
                            className="btn btn-danger btn-sm px-3 fw-semibold"
                            onClick={handleSearchSubmit}
                            disabled={readOnly || resolvingShortUrl || !addressLookup.trim()}
                        >
                            {resolvingShortUrl ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Resolving...
                                </>
                            ) : (
                                'Search / Pin'
                            )}
                        </button>
                    </div>
                </div>

                {/* Map Action Buttons */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-2 py-1 shadow-2xs fw-medium d-inline-flex align-items-center gap-1"
                        onClick={handleOpenGoogleMaps}
                        title="Open Google Maps in a new tab to find and pin your exact building"
                    >
                        <i className="bi bi-box-arrow-up-right"></i>
                        <span>Open in Google Maps</span>
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm rounded-pill px-2 py-1 shadow-2xs fw-medium d-inline-flex align-items-center gap-1"
                        onClick={handlePasteFromClipboard}
                        title="Paste copied Google Maps link or coordinates directly from clipboard"
                    >
                        <i className="bi bi-clipboard-check text-danger"></i>
                        <span>Paste Link/Coords</span>
                    </button>

                    {!readOnly && (
                        <>
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 shadow-2xs fw-medium"
                                onClick={handleGetCurrentLocation}
                                disabled={geoLoading}
                                title="Detect location automatically via device GPS"
                            >
                                {geoLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        GPS...
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
                                    <i className="bi bi-x-circle me-1"></i>Clear
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Status alerts */}
            {geoStatus.text && (
                <div
                    className={`alert alert-${geoStatus.type} alert-dismissible py-2 px-3 small rounded-3 mb-2 d-flex align-items-center justify-content-between`}
                >
                    <div className="d-flex align-items-center gap-2">
                        <i
                            className={`bi ${
                                geoStatus.type === 'success'
                                    ? 'bi-check-circle-fill'
                                    : geoStatus.type === 'danger'
                                    ? 'bi-exclamation-triangle-fill'
                                    : geoStatus.type === 'warning'
                                    ? 'bi-exclamation-circle-fill'
                                    : 'bi-info-circle-fill'
                            }`}
                        ></i>
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

            {/* Google Map Canvas */}
            <div
                className="position-relative rounded-4 border overflow-hidden shadow-2xs"
                style={{ height, minHeight: '340px', backgroundColor: '#e2e8f0' }}
            >
                <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

                {!mapReady && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-light bg-opacity-75"
                        style={{ zIndex: 5 }}
                    >
                        <div className="spinner-border text-danger mb-2" role="status">
                            <span className="visually-hidden">Loading Google Maps...</span>
                        </div>
                        <span className="small text-secondary fw-semibold">Loading Google Maps...</span>
                    </div>
                )}

                {/* Floating instruction banner at bottom */}
                <div
                    className="position-absolute bottom-0 start-0 m-2 px-3 py-1 bg-white bg-opacity-95 rounded-pill shadow-xs border small text-dark fw-medium d-flex align-items-center gap-2"
                    style={{ zIndex: 400, fontSize: '11px', backdropFilter: 'blur(4px)' }}
                >
                    <i className="bi bi-geo-alt-fill text-danger"></i>
                    <span>Click anywhere on Google Maps or drag the red pin onto your exact house/building</span>
                </div>
            </div>

            {/* Resolved Address / Coordinates Display */}
            {resolvedAddress && (
                <div className="mt-2 p-2 px-3 bg-light border rounded-3 small d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span className="text-secondary">Pinned Location:</span>
                    <strong className="text-dark">{resolvedAddress}</strong>
                </div>
            )}

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
                            placeholder="e.g. 22.544346"
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
                            placeholder="e.g. 88.291430"
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
        </div>
    );
}

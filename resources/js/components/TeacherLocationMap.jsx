import React, { useEffect, useRef, useState } from 'react';

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="30" height="42">
            <defs>
                <filter id="map-shadow" x="-20%" y="-10%" width="140%" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.35"/>
                </filter>
            </defs>
            <path filter="url(#map-shadow)" fill="#0d6efd" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                d="M16 2 C8.268 2 2 8.268 2 16 C2 26 16 42 16 42 C16 42 30 26 30 16 C30 8.268 23.732 2 16 2 Z"/>
            <circle cx="16" cy="16" r="6" fill="#ffffff"/>
            <circle cx="16" cy="16" r="3" fill="#0d6efd"/>
        </svg>
    `;

    return L.divIcon({
        className: 'teacher-map-pin',
        html: svgIcon,
        iconSize: [30, 42],
        iconAnchor: [15, 40],
        popupAnchor: [0, -36],
    });
}

export default function TeacherLocationMap({
    teacher,
    height = '230px',
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [leafletReady, setLeafletReady] = useState(false);

    const lat = teacher?.latitude ? parseFloat(teacher.latitude) : null;
    const lng = teacher?.longitude ? parseFloat(teacher.longitude) : null;
    const hasCoordinates = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

    const teacherName = teacher?.name || 'Verified Educator';
    const city = teacher?.city || '';
    const state = teacher?.state || '';
    const locationFormatted = teacher?.location_formatted || (city && state ? `${city}, ${state}, India` : 'India');
    const distanceKm = teacher?.distance ? parseFloat(teacher.distance).toFixed(1) : null;

    const directionsUrl = hasCoordinates
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationFormatted)}`;

    useEffect(() => {
        if (!hasCoordinates) return;

        let isMounted = true;
        loadLeafletLibrary()
            .then(() => {
                if (isMounted) setLeafletReady(true);
            })
            .catch(() => {});

        return () => {
            isMounted = false;
        };
    }, [hasCoordinates]);

    useEffect(() => {
        if (!hasCoordinates || !leafletReady || !mapContainerRef.current) return;
        const L = window.L;
        if (!L) return;

        const popupHtml = `
            <div style="font-family: inherit; font-size: 13px; line-height: 1.4; padding: 2px;">
                <strong style="color: #0f172a; display: block; font-weight: 700;">${teacherName}</strong>
                <span style="color: #475569; font-size: 11px;">📍 ${locationFormatted}</span>
                <div style="margin-top: 6px;">
                    <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #0d6efd; color: #ffffff; text-decoration: none; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">
                        Get Directions &rarr;
                    </a>
                </div>
            </div>
        `;

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [lat, lng],
                zoom: 14,
                scrollWheelZoom: false,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);

            const marker = L.marker([lat, lng], {
                icon: createMarkerIcon(L),
            }).addTo(map);

            marker.bindPopup(popupHtml).openPopup();

            markerRef.current = marker;
            mapInstanceRef.current = map;
        } else {
            mapInstanceRef.current.setView([lat, lng], 14);
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
                markerRef.current.setPopupContent(popupHtml);
            }
        }

        const timer = setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [hasCoordinates, leafletReady, lat, lng, teacherName, locationFormatted, directionsUrl]);

    useEffect(() => {
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    return (
        <div className="card border-0 rounded-4 shadow-xs overflow-hidden mb-3 bg-white">
            <div className="card-header bg-light py-2 px-3 d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                    <span className="p-1 px-2 bg-primary-subtle text-primary rounded-pill small fw-bold">
                        <i className="bi bi-geo-alt-fill me-1"></i>Tutoring Location &amp; Distance
                    </span>
                    {distanceKm && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill small">
                            <i className="bi bi-compass me-1"></i>~{distanceKm} km away from you
                        </span>
                    )}
                </div>
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 fw-semibold text-nowrap d-flex align-items-center gap-1"
                    style={{ fontSize: '12px' }}
                >
                    <i className="bi bi-cursor-fill"></i>
                    <span>Get Directions</span>
                </a>
            </div>

            {hasCoordinates ? (
                <div className="position-relative" style={{ height }}>
                    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
                    {!leafletReady && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                            <span className="spinner-border spinner-border-sm text-primary me-2"></span>
                            <span className="small text-muted">Loading map location...</span>
                        </div>
                    )}
                    <div
                        className="position-absolute bottom-0 start-0 m-2 px-2 py-1 bg-white bg-opacity-95 rounded-pill shadow-xs border small text-dark d-flex align-items-center gap-1"
                        style={{ zIndex: 400, fontSize: '11px', backdropFilter: 'blur(3px)' }}
                    >
                        <i className="bi bi-info-circle text-primary"></i>
                        <span>Approximate serving locality for home &amp; nearby classes</span>
                    </div>
                </div>
            ) : (
                /* Graceful Fallback if coordinates are not set yet */
                <div className="p-3 text-center bg-light">
                    <div className="p-2 bg-primary-subtle text-primary rounded-circle d-inline-flex mb-2">
                        <i className="bi bi-geo-alt fs-4"></i>
                    </div>
                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>
                        {locationFormatted}
                    </h6>
                    <p className="text-secondary small mb-2" style={{ fontSize: '12px', maxWidth: '360px', margin: '0 auto' }}>
                        Serves students across <strong>{city || state || 'India'}</strong> for online and offline home tuition. Exact GPS pin not specified by tutor.
                    </p>
                    <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-light btn-sm border rounded-pill px-3 py-1 text-primary fw-medium"
                        style={{ fontSize: '12px' }}
                    >
                        <i className="bi bi-search me-1"></i>Explore Area on Google Maps
                    </a>
                </div>
            )}
        </div>
    );
}

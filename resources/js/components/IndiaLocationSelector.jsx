import React, { useState, useEffect, useMemo } from 'react';
import { STATES_LIST, getCitiesForState, isValidPinCode } from '../Utils/indiaLocations';

export default function IndiaLocationSelector({
    stateValue = '',
    cityValue = '',
    areaValue = '',
    pincodeValue = '',
    onStateChange,
    onCityChange,
    onAreaChange,
    onPincodeChange,
    required = false,
    showArea = true,
    showPincode = true,
    stateColClass = 'col-md-6',
    cityColClass = 'col-md-6',
    areaColClass = 'col-md-8',
    pincodeColClass = 'col-md-4',
    stateLabel = 'State / Union Territory',
    cityLabel = 'City / District',
    areaLabel = 'Area / Locality / Street',
    pincodeLabel = 'PIN Code (6 digits)',
}) {
    const availableCities = useMemo(() => {
        return getCitiesForState(stateValue);
    }, [stateValue]);

    const [isCustomCity, setIsCustomCity] = useState(false);
    const [pincodeError, setPincodeError] = useState('');

    useEffect(() => {
        if (cityValue && availableCities.length > 0 && !availableCities.includes(cityValue)) {
            setIsCustomCity(true);
        } else if (availableCities.includes(cityValue)) {
            setIsCustomCity(false);
        }
    }, [cityValue, availableCities]);

    const handleStateSelect = (e) => {
        const newState = e.target.value;
        if (onStateChange) onStateChange(newState);
        if (onCityChange) onCityChange('');
        setIsCustomCity(false);
    };

    const handleCitySelect = (e) => {
        const val = e.target.value;
        if (val === '__OTHER__') {
            setIsCustomCity(true);
            if (onCityChange) onCityChange('');
        } else {
            setIsCustomCity(false);
            if (onCityChange) onCityChange(val);
        }
    };

    const handlePincodeInput = (e) => {
        const val = e.target.value.replace(/\D+/g, '').slice(0, 6);
        if (onPincodeChange) onPincodeChange(val);

        if (val.length > 0 && val.length < 6) {
            setPincodeError('Must be 6 digits');
        } else if (val.length === 6 && !isValidPinCode(val)) {
            setPincodeError('Invalid PIN code');
        } else {
            setPincodeError('');
        }
    };

    return (
        <div className="row g-3">
            {/* State Dropdown */}
            <div className={stateColClass}>
                <label className="form-label small fw-semibold text-secondary">
                    {stateLabel} {required && <span className="text-danger">*</span>}
                </label>
                <select
                    className="form-select"
                    value={stateValue || ''}
                    onChange={handleStateSelect}
                    required={required}
                >
                    <option value="">Select State / UT</option>
                    {STATES_LIST.map((st) => (
                        <option key={st} value={st}>
                            {st}
                        </option>
                    ))}
                </select>
            </div>

            {/* City Dropdown */}
            <div className={cityColClass}>
                <label className="form-label small fw-semibold text-secondary">
                    {cityLabel} {required && <span className="text-danger">*</span>}
                </label>
                {!isCustomCity ? (
                    <select
                        className="form-select"
                        value={cityValue || ''}
                        onChange={handleCitySelect}
                        disabled={!stateValue}
                        required={required}
                    >
                        <option value="">
                            {stateValue ? 'Select City / District' : 'First select a State'}
                        </option>
                        {availableCities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                        {stateValue && <option value="__OTHER__">+ Other City / Town</option>}
                    </select>
                ) : (
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter city or town name"
                            value={cityValue || ''}
                            onChange={(e) => onCityChange && onCityChange(e.target.value)}
                            required={required}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setIsCustomCity(false);
                                if (onCityChange) onCityChange('');
                            }}
                            title="Back to list"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Area / Locality */}
            {showArea && (
                <div className={areaColClass}>
                    <label className="form-label small fw-semibold text-secondary">
                        {areaLabel}
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sector 5, Civil Lines, Indiranagar, Near Station"
                        value={areaValue || ''}
                        onChange={(e) => onAreaChange && onAreaChange(e.target.value)}
                    />
                </div>
            )}

            {/* PIN Code */}
            {showPincode && (
                <div className={pincodeColClass}>
                    <label className="form-label small fw-semibold text-secondary">
                        {pincodeLabel}
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="6"
                        className={`form-control ${pincodeError ? 'is-invalid' : ''}`}
                        placeholder="e.g. 700024"
                        value={pincodeValue || ''}
                        onChange={handlePincodeInput}
                    />
                    {pincodeError && <div className="invalid-feedback">{pincodeError}</div>}
                </div>
            )}
        </div>
    );
}

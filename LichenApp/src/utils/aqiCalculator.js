/**
 * AQI Calculator — EPA standard linear interpolation
 * Using: PM2.5 (Dust sensor, mg/m³ → μg/m³), NO2 (MQ135, ppm → ppb), NH3 (MQ135 NH4 proxy, ppm → ppb)
 *
 * Formula: AQI = ((AQI_hi - AQI_lo) / (C_hi - C_lo)) * (C - C_lo) + AQI_lo
 */

// ---------------------------------------------------------------------------
// Breakpoint tables [C_lo, C_hi, AQI_lo, AQI_hi]
// ---------------------------------------------------------------------------

// PM2.5 24-h average (μg/m³) — EPA 2024 revision
const PM25_BREAKPOINTS = [
    [0.0, 12.0, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 350.4, 301, 400],
    [350.5, 500.4, 401, 500],
];

// NO2 1-h average (ppb) — EPA
const NO2_BREAKPOINTS = [
    [0, 53, 0, 50],
    [54, 100, 51, 100],
    [101, 360, 101, 150],
    [361, 649, 151, 200],
    [650, 1249, 201, 300],
    [1250, 1649, 301, 400],
    [1650, 2049, 401, 500],
];

// NH3 (using NH4 as proxy) — WHO/CPCB indicative thresholds (μg/m³ converted from ppm: 1 ppm ≈ 696 μg/m³)
// We keep units in ppb here: 1 ppm = 1000 ppb
const NH3_BREAKPOINTS = [
    [0, 200, 0, 50],   // Good
    [201, 400, 51, 100],   // Moderate
    [401, 800, 101, 150],   // Unhealthy for Sensitive
    [801, 1200, 151, 200],   // Unhealthy
    [1201, 1800, 201, 300],   // Very Unhealthy
    [1801, 2400, 301, 400],   // Hazardous
    [2401, 3000, 401, 500],   // Hazardous +
];

// AQI category definitions
export const AQI_CATEGORIES = [
    { min: 0, max: 50, label: 'Good', color: '#00E400' },
    { min: 51, max: 100, label: 'Moderate', color: '#FFFF00' },
    { min: 101, max: 150, label: 'Unhealthy for SG', color: '#FF7E00' },
    { min: 151, max: 200, label: 'Unhealthy', color: '#FF0000' },
    { min: 201, max: 300, label: 'Very Unhealthy', color: '#8F3F97' },
    { min: 301, max: 400, label: 'Hazardous', color: '#7E0023' },
    { min: 401, max: 500, label: 'Hazardous+', color: '#7E0023' },
];

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/**
 * Interpolate sub-index for a concentration using the given breakpoint table.
 * Returns null if the concentration is out of range.
 */
function linearInterp(concentration, breakpoints) {
    const c = parseFloat(concentration);
    if (isNaN(c) || c < 0) return null;

    for (const [cLo, cHi, aqiLo, aqiHi] of breakpoints) {
        if (c >= cLo && c <= cHi) {
            return Math.round(((aqiHi - aqiLo) / (cHi - cLo)) * (c - cLo) + aqiLo);
        }
    }
    // Above the top breakpoint — cap at 500
    return 500;
}

/**
 * Get AQI category metadata for a given AQI value.
 */
export function getAqiCategory(aqi) {
    if (aqi === null || isNaN(aqi)) return { label: 'N/A', color: '#888888' };
    for (const cat of AQI_CATEGORIES) {
        if (aqi >= cat.min && aqi <= cat.max) return cat;
    }
    return AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

/**
 * Calculate composite AQI from available sensor readings.
 *
 * @param {object} dustData   - { Density_mgm3 }
 * @param {object} mq135Data  - { PPM_NO2, PPM_NH4 }
 * @returns {{ aqi: number, dominant: string, subIndexes: object }}
 */
export function calculateAQI(dustData, mq135Data) {
    const subIndexes = {};

    // PM2.5: dust density in mg/m³ → multiply by 1000 to get μg/m³
    if (dustData?.Density_mgm3 !== undefined) {
        const pm25_ugm3 = parseFloat(dustData.Density_mgm3) * 1000;
        const idx = linearInterp(pm25_ugm3, PM25_BREAKPOINTS);
        if (idx !== null) subIndexes['PM2.5'] = idx;
    }

    // NO2: ppm → ppb (×1000)
    if (mq135Data?.PPM_NO2 !== undefined) {
        const no2_ppb = parseFloat(mq135Data.PPM_NO2) * 1000;
        const idx = linearInterp(no2_ppb, NO2_BREAKPOINTS);
        if (idx !== null) subIndexes['NO2'] = idx;
    }

    // NH3 (NH4 proxy): ppm → ppb (×1000)
    if (mq135Data?.PPM_NH4 !== undefined) {
        const nh3_ppb = parseFloat(mq135Data.PPM_NH4) * 1000;
        const idx = linearInterp(nh3_ppb, NH3_BREAKPOINTS);
        if (idx !== null) subIndexes['NH3'] = idx;
    }

    if (Object.keys(subIndexes).length === 0) {
        return { aqi: null, dominant: null, subIndexes };
    }

    // Overall AQI = highest sub-index
    const dominant = Object.keys(subIndexes).reduce((a, b) =>
        subIndexes[a] > subIndexes[b] ? a : b
    );
    const aqi = subIndexes[dominant];

    return { aqi, dominant, subIndexes };
}

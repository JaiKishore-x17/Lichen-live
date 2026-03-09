import { useState, useEffect } from 'react';

const DB_URL = "https://lichen-live-default-rtdb.asia-southeast1.firebasedatabase.app";

export const useRealtimeData = (path) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [now, setNow] = useState(Date.now());

    // Ticker to force re-renders for offline checks
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 5000);
        return () => clearInterval(interval);
    }, []);

    const isOffline = !lastUpdated || (now - lastUpdated > 30000);

    const fetchData = async () => {
        try {
            const url = `${DB_URL}/${path}.json`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();

            // Extract remote timestamp if available (prioritize top level)
            // Handle both seconds and milliseconds (assume > 2000000000 is milliseconds)
            let remoteTimestamp = null;
            if (json && json.timestamp) {
                remoteTimestamp = json.timestamp > 2000000000 ? json.timestamp : json.timestamp * 1000;
            }

            // Update lastUpdated only if data exists
            if (json) {
                // If we have a remote timestamp, update lastUpdated immediately
                if (remoteTimestamp) {
                    setLastUpdated(remoteTimestamp);
                }

                setData(prevData => {
                    const dataChanged = JSON.stringify(prevData) !== JSON.stringify(json);

                    // Fallback to local Date.now() ONLY if no remote timestamp and data changed
                    if (!remoteTimestamp && dataChanged) {
                        setLastUpdated(Date.now());
                    }

                    return json;
                });
            }

            setLoading(false);
            setError(null);
        } catch (err) {
            console.error(`[Firebase] Fetch error for ${path}:`, err);
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [path]);

    return { data, loading, error, lastUpdated, isOffline, refetch: fetchData };
};

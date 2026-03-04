import { useState, useEffect } from 'react';

const DB_URL = "https://lichen-live-default-rtdb.asia-southeast1.firebasedatabase.app";

export const useRealtimeData = (path) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const url = `${DB_URL}/${path}.json`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setData(json);
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
        const interval = setInterval(fetchData, 20000);
        return () => clearInterval(interval);
    }, [path]);

    return { data, loading, error, refetch: fetchData };
};

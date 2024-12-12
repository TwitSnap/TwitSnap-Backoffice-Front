import {useEffect, useState} from "react";
import {Link} from 'react-router-dom';

export default function MetricsScreen() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState({});

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token is missing");
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(
                `https://twitsnap-backoffice-twitsnap-api.onrender.com/v1/ts/users/metrics`, {
                    method: 'GET',
                    headers: headers,
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                const message = responseData.error || "Unspecified error message.";
                setError(message);
                setLoading(false);
                return;
            }

            setError('');
            setData(responseData)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return(
        <div style={styles.container}>
            <Link to="/dashboard">
                <button style={styles.dashboard}>Dashboard</button>
            </Link>
            <h1 style={{fontSize: 30}}>User Metrics</h1>
            {error && <p style={styles.errorText}>{error}</p>}
            {loading && <p>Loading...</p>}
            {!loading && !error && (
                <>
                    <p><strong>Total Users: </strong>{data.registration.total}</p>
                    <p><strong>Banned Users: </strong>{data.bannedUsers.total}</p>

                    <div style={styles.section}>
                        <h2 style={{fontSize: 24}}>Registration Methods</h2>
                        <p><strong>Email: </strong>{data.registration.distribution.email}</p>
                        <p><strong>Google: </strong>{data.registration.distribution.fedetatedIdentity?.google || 0}</p>
                    </div>

                    <div style={styles.section}>
                        <h2 style={{fontSize: 24}}>Country Distribution</h2>
                        <ul style={styles.countryList}>
                            {Object.entries(data.countryDistribution).map(([country, count]) => (
                                <li key={country}>
                                    <strong>{country}:</strong> {count}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashboard: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    errorText: {
        color: 'red',
    },
    section: {
        marginTop: '1.5rem',
    },
    countryList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
};
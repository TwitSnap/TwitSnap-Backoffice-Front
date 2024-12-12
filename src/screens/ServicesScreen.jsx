import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

export default function ServicesScreen() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedService, setExpandedService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, [])

    const fetchServices = async () => {
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
                `https://twitsnap-apps-gateway.onrender.com/v1/registry/service`, {
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

            console.log(responseData);
            setError('');
            setServices(responseData.data);
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        const response = {
            data: [
                {
                    "name": "Users",
                    "id": "01",
                    "description": "User API service",
                    "status": "ACTIVE",
                },
                {
                    "name": "Snaps",
                    "id": "02",
                    "description": "Snap API service",
                    "status": "BLOCKED",
                },
            ],
        };

        setServices(response.data);
    };

    const toggleSnapDetails = (serviceId) => {
        setExpandedService(prevState => prevState === serviceId ? null : serviceId);
    };

    const toggleServiceBlock = async (serviceId) => {
        const updateServices = services.map(service => {
            if (service.id === serviceId) {
                let newStatus;
                if (service.status === "ACTIVE") {
                    newStatus = "BLOCKED";
                } else {
                    newStatus = "ACTIVE";
                }
                const updatedService = { ...service, status: newStatus };
                return updatedService;
            }
            return service;
        });

        setServices(updateServices);
    };

    return (
        <div style={styles.container}>
            <Link to="/dashboard">
                <button style={styles.dashboard}>Dashboard</button>
            </Link>
            <h1 style={{fontSize: 30}}>Services</h1>
            {error && <p style={styles.errorText}>{error}</p>}
            {loading && <p>Loading...</p>}
            {!loading && !error && (
                <>
                    <ul style={styles.serviceList}>
                        {services.map(service => (
                            <li key={service.id} style={styles.serviceItem}>
                                <div style={styles.serviceContainer}>
                                    <div style={styles.serviceInfo}>
                                        <div style={{flexGrow: 1}}>
                                            <p><strong>{service.name}</strong></p>
                                        </div>
                                        <div style={styles.actions}>
                                            <button
                                                style={styles.detailButton}
                                                onClick={() => toggleSnapDetails(service.id)}
                                            >
                                                {expandedService === service.id ? 'Hide Details' : 'Show Details'}
                                            </button>
                                            <button
                                                style={(service.status === "BLOCKED") ? styles.unblockButton : styles.blockButton}
                                                onClick={() => {
                                                    toggleServiceBlock(service.id);
                                                }}
                                            >
                                                {(service.status === "BLOCKED") ? 'Enable' : 'Disable'}
                                            </button>
                                        </div>
                                    </div>
                                    {expandedService === service.id && (
                                        <div style={styles.details}>
                                            <p><strong>Description: </strong>{service.description}</p>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
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
    serviceList: {
        listStyleType: 'none',
        padding: 0,
    },
    serviceItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '5px',
    },
    serviceContainer: {
        width: '100%',
    },
    serviceInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        width: '100%',
    },
    actions: {
        display: 'flex',
        gap: '10px',
        paddingRight: '15px',
    },
    detailButton: {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    blockButton: {
        padding: '5px 10px',
        backgroundColor: 'rgba(217,83,79,0.6)',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    unblockButton: {
        padding: '5px 10px',
        backgroundColor: 'rgba(46,175,47,0.6)',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    details: {
        marginTop: '10px',
        paddingLeft: '10px',
    },
};
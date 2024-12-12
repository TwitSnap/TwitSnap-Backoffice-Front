import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {API_URL} from "../constants.js";

export default function ServicesScreen() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
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
                `${API_URL}/v1/ts/service`, {
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
            setServices(responseData);
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name) {
            setError('Name are required.');
            return;
        }

        setError('');
        setFormLoading(true);
        console.log('Creating service with', {name, description});
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token is missing");
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const requestBody = {
                name: name,
                description: description,
            };

            const response = await fetch(
                `${API_URL}/v1/ts/service`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create service")
            }

            console.log("Service created successfully.");
            console.log("Reload to see changes.");
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const toggleSnapDetails = (serviceId) => {
        setExpandedService(prevState => prevState === serviceId ? null : serviceId);
    };

    const toggleServiceBlock = async (serviceId, prevStatus) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token is missing");
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            let newStatus;
            console.log(newStatus);
            if (prevStatus.status === "ACTIVE") {
                newStatus = "BLOCKED";
            } else {
                newStatus = "ACTIVE";
            }
            const requestBody = {
                id: serviceId,
                status: newStatus,
            };

            const response = await fetch(
                `${API_URL}/v1/ts/service/status`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                console.log("Failed to change status.");
                return;
            }

            console.log("Service updated successfully.");
            const updateServices = services.map(service => {
                if (service.id === serviceId) {
                    const updatedService = {...service, status: newStatus};
                    return updatedService;
                }
                return service;
            });

            setServices(updateServices);
        } catch (err) {
            setError(err.message);
        }
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
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputContainer}>
                            <label>Service Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputContainer}>
                            <label>Description</label>
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <button disabled={formLoading} type="submit" style={styles.button}>
                            Create Service
                        </button>
                        {formError && <p style={styles.errorText}>{formError}</p>}
                    </form>

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
                                                    toggleServiceBlock(service.id, service.status);
                                                }}
                                            >
                                                {(service.status === "BLOCKED") ? 'Enable' : 'Disable'}
                                            </button>
                                        </div>
                                    </div>
                                    {expandedService === service.id && (
                                        <div style={styles.details}>
                                            <p><strong>Description: </strong>{service.description}</p>
                                            <p><strong>Creación: </strong>{service.creation_date}</p>
                                            <p><strong>API Key: </strong>{service.api_key}</p>
                                            <p><strong></strong></p>
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
    form: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        border: '1px solid #ddd',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
    },
    button: {},
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
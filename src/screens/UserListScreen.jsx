import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {API_URL} from "../constants.js";

export default function UserListScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedUser, setExpandedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage])

    const fetchUsers = async (page) => {
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

            const offset = (page - 1) * usersPerPage;
            const limit = usersPerPage;
            const response = await fetch(
                `${API_URL}/v1/ts/users?offset=${offset}&limit=${limit}`, {
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
            setUsers(responseData.users);
            const total_users = responseData.total_users;
            setTotalPages(Math.ceil(total_users / usersPerPage));
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const toggleUserDetails = (userId) => {
        setExpandedUser(prevState => prevState === userId ? null : userId);
    };

    const toggleUserBan = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token is missing");
            }

            const headers = {
                'Content-Type': 'application/json',
                //'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(
                `${API_URL}/v1/ts/users/${userId}/ban`, {
                    method: 'POST',
                    headers: headers,
                }
            );

            if (!response.ok) {
                console.log("Failed to ban/unban user.");
                return;
            }

            console.log("User updated successfully.");
            const updatedUsers = users.map(user => {
                if (user.uid === userId) {
                    const updatedUser = { ...user, is_banned: !user.is_banned };
                    return updatedUser;
                }
                return user;
            });

            setUsers(updatedUsers);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <Link to="/dashboard">
                <button style={styles.dashboard}>Dashboard</button>
            </Link>
            <h1 style={{fontSize: 30}}>Users</h1>
            {error && <p style={styles.errorText}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <ul style={styles.userList}>
                        {users.map(user => (
                            <li key={user.uid} style={styles.userItem}>
                                <div style={styles.userContainer}>
                                    <div style={styles.userInfo}>
                                        <img src={user.photo} style={styles.avatar}/>
                                        <div style={{flexGrow: 1}}>
                                            <p>{user.email}</p>
                                        </div>
                                        <div style={styles.actions}>
                                            <button
                                                style={styles.detailButton}
                                                onClick={() => toggleUserDetails(user.uid)}
                                            >
                                                {expandedUser === user.id ? 'Hide Details' : 'Show Details'}
                                            </button>
                                            <button
                                                style={user.is_banned ? styles.unbanButton : styles.banButton}
                                                onClick={() => {
                                                    toggleUserBan(user.uid);
                                                }}
                                            >
                                                {user.is_banned ? 'Unban' : 'Ban'}
                                            </button>
                                        </div>
                                    </div>
                                    {expandedUser === user.uid && (
                                        <div style={styles.details}>
                                            <p><strong>Username: </strong> {user.username}</p>
                                            <p><strong>Country: </strong> {user.country}</p>
                                            <p><strong>Description: </strong>{user.description}</p>
                                            <p><strong>Verified: </strong>{user.verified ? "True" : "False"}</p>
                                            <p><strong>Follower count: </strong>{user.amount_of_followers}</p>
                                            <p><strong>Following: </strong>{user.amount_of_following}</p>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination */}
                    <div style={styles.pagination}>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                disabled={currentPage === index + 1}
                                style={styles.pageButton}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
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
    errorText: {},
    searchBox: {
        padding: '10px',
        marginBottom: '20px',
        fontSize: '16px',
    },
    userList: {
        listStyleType: 'none',
        padding: 0,
    },
    userItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '5px',
    },
    userContainer: {
        width: '100%',
    },
    userInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        width: '100%',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '10px',
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
    banButton: {
        padding: '5px 10px',
        backgroundColor: 'rgba(217,83,79,0.6)',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    unbanButton: {
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
    pagination: {
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
    },
    pageButton: {
        padding: '10px',
        cursor: 'pointer',
        border: '1px solid #ddd',
    },
};
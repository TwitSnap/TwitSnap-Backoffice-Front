import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

export default function UserListScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedUser, setExpandedUser] = useState(null);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage])

    const fetchUsers = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`https://reqres.in/api/users?page=${page}`);

            const responseData = await response.json();

            if (!response.ok) {
                const message = responseData.error || "Unspecified error message.";
                setError(message);
                setLoading(false);
                return;
            }

            setError('');
            setUsers(responseData.data);
            setTotalPages(responseData.total_pages);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    }

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUserDetails = (userId) => {
        setExpandedUser(prevState => prevState === userId ? null : userId);
    };

    return (
        <div style={styles.container}>
            <Link to="/dashboard">
                <button style={styles.dashboard}>Dashboard</button>
            </Link>
            <h2>Users</h2>
            <input
                type="text"
                placeholder="Search by email"
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchBox}
            />
            {error && <p style={styles.errorText}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <ul style={styles.userList}>
                        {filteredUsers.map(user => (
                            <li key={user.id} style={styles.userItem}>
                                <div style={styles.userContainer}>
                                    <div style={styles.userInfo}>
                                        <img src={user.avatar} style={styles.avatar}/>
                                        <div style={{flexGrow: 1}}>
                                            <p>{user.email}</p>
                                        </div>
                                        <div style={styles.actions}>
                                            <button
                                                style={styles.detailButton}
                                                onClick={() => toggleUserDetails(user.id)}
                                            >
                                                {expandedUser === user.id ? 'Hide Details' : 'Show Details'}
                                            </button>
                                            <button
                                                style={styles.banButton}
                                                onClick={() => {console.log("Banned user id: ", user.id)}}
                                            >
                                                Ban
                                            </button>
                                        </div>
                                    </div>
                                    {expandedUser === user.id && (
                                        <div style={styles.details}>
                                            <p><strong>Name: </strong> {user.first_name} {user.last_name}</p>
                                            <p><strong>Country: </strong> Argentina</p>
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
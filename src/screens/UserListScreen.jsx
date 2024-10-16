import {useState, useEffect} from "react";

export default function UserListScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

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

    return (
        <div style={styles.container}>
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
                                <img src={user.avatar} alt={user.first_name} style={styles.avatar}/>
                                <div style={{flexGrow: 1}}>
                                    <p>{user.email}</p>
                                </div>
                                <div style={styles.actions}>
                                    <button
                                        style={styles.detailButton}
                                        onClick={() => {console.log(user.first_name, user.last_name)}}
                                    >
                                        Details
                                    </button>
                                    <button
                                        style={styles.banButton}
                                        onClick={() => {console.log("Banned user id: ", user.id)}}
                                    >
                                        Ban
                                    </button>
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
        height: '100vh',
    },
    errorText: {},
    searchBox: {
        padding: '10px',
        /*width: '100%',*/
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
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '10px',
    },
    actions: {
        display: 'flex',
        gap: '10px',
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
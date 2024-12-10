import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

export default function SnapListScreen() {
    const [snaps, setSnaps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSnap, setExpandedSnap] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const snapsPerPage = 10;

    useEffect(() => {
        fetchSnaps(currentPage);
    }, [currentPage])

    const fetchSnaps = async (page) => {
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

            const offset = (page - 1) * snapsPerPage;
            const limit = snapsPerPage;
            const endpoint = `https://twitsnap-backoffice-twitsnap-api.onrender.com/v1/ts/twits?offset=${offset}&limit=${limit}`;
            if (searchTerm) {
                endpoint.concat(`&userId=${searchTerm}`);
            }

            const response = await fetch(
                endpoint, {
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
            setSnaps(responseData.posts);
            const total_snaps = responseData.total_posts;
            setTotalPages(Math.ceil(total_snaps / snapsPerPage));
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(searchTerm);
        fetchSnaps(currentPage);
    }

    const toggleSnapDetails = (snapId) => {
        setExpandedSnap(prevState => prevState === snapId ? null : snapId);
    };

    const toggleSnapBlock = async (postId) => {
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
                `https://twitsnap-backoffice-twitsnap-api.onrender.com/v1/ts/twits/${postId}/block`, {
                    method: 'POST',
                    headers: headers,
                }
            );

            if (!response.ok) {
                console.log("Failed to ban/unban user.");
                return;
            }

            console.log("Snap updated successfully.");
            const updatedSnaps = snaps.map(snap => {
                if (snap.post_id === postId) {
                    const updatedSnap = {...snap, is_blocked: !snap.is_blocked};
                    return updatedSnap;
                }
                return snap;
            });

            setSnaps(updatedSnaps);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <Link to="/dashboard">
                <button style={styles.dashboard}>Dashboard</button>
            </Link>
            <h1 style={{fontSize: 30}}>Snaps</h1>
            <form onSubmit={handleSearch} style={styles.form}>
                <input
                    type="text"
                    placeholder="Search by User"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchBox}
                />
                <button type="submit" style={styles.searchButton}>Search</button>
            </form>
            {error && <p style={styles.errorText}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <ul style={styles.snapList}>
                        {snaps.map(snap => (
                            <li key={snap.post_id} style={styles.snapItem}>
                                <div style={styles.snapContainer}>
                                    <div style={styles.snapInfo}>
                                        <img src={snap.photo_creator} style={styles.avatar}/>
                                        <p style={expandedSnap === snap.post_id ? styles.fullMessage : styles.truncatedMessage}>
                                            {snap.message}
                                        </p>
                                        <div style={styles.actions}>
                                            <button
                                                style={styles.detailButton}
                                                onClick={() => toggleSnapDetails(snap.post_id)}
                                            >
                                                {expandedSnap === snap.post_id ? 'Hide Details' : 'Show Details'}
                                            </button>
                                            <button
                                                style={snap.is_blocked ? styles.unbanButton : styles.banButton}
                                                onClick={() => {
                                                    toggleSnapBlock(snap.post_id);
                                                }}
                                            >
                                                {snap.is_blocked ? 'Unblock' : 'Block'}
                                            </button>
                                        </div>
                                    </div>
                                    {expandedSnap === snap.post_id && (
                                        <div style={styles.details}>
                                            <div style={styles.detailsLeft}>
                                                <p><strong>Posted by:</strong> {snap.username_creator}</p>
                                                <p><strong>Created at:</strong> {snap.created_at}</p>
                                                <p><strong>Likes:</strong> {snap.like_ammount}</p>
                                                <p><strong>Retweets:</strong> {snap.retweet_ammount}</p>
                                                <p><strong>Comments:</strong> {snap.comment_ammount}</p>
                                            </div>
                                            <div style={styles.detailsRight}>
                                                <p><strong>Is Comment:</strong> {snap.is_comment ? 'Yes' : 'No'}</p>
                                                {snap.is_comment && (
                                                    <p><strong>Original Snap ID:</strong> {snap.origin_post}</p>
                                                )}
                                                <p><strong>Is Deleted:</strong> {snap.deleted ? 'Yes' : 'No'}</p>
                                            </div>
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
    form: {
        display: 'flex',
        marginBottom: 'irem',
    },
    searchBox: {
        padding: '10px',
        marginBottom: '20px',
        fontSize: '16px',
    },
    searchButton: {
        padding: '10px',
        marginBottom: '20px',
        fontSize: '16px',
    },
    snapList: {
        listStyleType: 'none',
        padding: 0,
    },
    snapItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '5px',
    },
    snapContainer: {
        width: '100%',
    },
    snapInfo: {
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
    truncatedMessage: {
        maxWidth: '300px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '1.1em',
        fontWeight: 'bold',
        color: '#eee',
        flexGrow: 1,
        margin: 0,
    },
    fullMessage: {
        maxWidth: '500px', // Limit the expanded width
        whiteSpace: 'normal', // Allows full message to wrap to multiple lines
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        fontSize: '1.1em',
        fontWeight: 'bold',
        color: '#eee',
        flexGrow: 1,
        margin: 0,
    },
    messageText: {
        fontSize: '1.1em',
        fontWeight: 'bold',
        color: '#eee',
        flexGrow: 1,
        margin: 0,
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
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        borderRadius: '5px',
        width: '100%',
        marginTop: '10px',
        paddingLeft: '10px',
    },
    detailsLeft: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingRight: '15px',
    },
    detailsRight: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingLeft: '15px',
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
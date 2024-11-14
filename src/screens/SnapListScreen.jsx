import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import getSnaps from "../handlers/getSnaps.js";

export default function SnapListScreen() {
    const [snaps, setSnaps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSnap, setExpandedSnap] = useState(null);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getSnaps();
            setError('');
            setSnaps(res.posts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredSnaps = snaps.filter((snap) =>
        snap.username_creator.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    }

    const toggleSnapDetails = (snapId) => {
        setExpandedSnap(prevState => prevState === snapId ? null : snapId);
    };

    return (
        <div style={styles.container}>
            <Link to="/dashboard">
                <button style={styles.dashboard}>Dashboard</button>
            </Link>
            <h2>Snaps</h2>
            <input
                type="text"
                placeholder="Search by User"
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchBox}
            />
            {error && <p style={styles.errorText}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <ul style={styles.snapList}>
                        {filteredSnaps.map(snap => (
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
                                                style={styles.banButton}
                                                onClick={() => {
                                                    console.log("Blocked snap id: ", snap.post_id)
                                                }}
                                            >
                                                Block
                                            </button>
                                        </div>
                                    </div>
                                    {expandedSnap === snap.post_id && (
                                        <div style={styles.details}>
                                            <div style={styles.detailsLeft}>
                                                <p><strong>Posted by:</strong> {snap.username_creator}</p>
                                                <p><strong>Likes:</strong> {snap.like_ammount}</p>
                                                <p><strong>Retweets:</strong> {snap.retwit_ammount}</p>
                                                <p><strong>Comments:</strong> {snap.comment_ammount}</p>
                                            </div>
                                            <div style={styles.detailsRight}>
                                                <p><strong>Is Comment:</strong> {snap.is_comment ? 'Yes' : 'No'}</p>
                                                {snap.is_comment && (
                                                    <p><strong>Original Snap ID:</strong> {snap.origin_post}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

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
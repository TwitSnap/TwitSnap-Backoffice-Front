import {Link, useNavigate} from "react-router-dom";

export default function DashboardScreen() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            <button style={styles.logout} onClick={handleLogout}>
                Log Out
            </button>
            <div style={styles.links}>
                <Link to="/users">
                    <button style={styles.button}>Users</button>
                </Link>
                <Link to="/snaps">
                    <button style={styles.button}>Snaps</button>
                </Link>
                <Link to="/metrics">
                    <button style={styles.button}>Metrics</button>
                </Link>
                <Link to="/services">
                    <button style={styles.button}>Services</button>
                </Link>
                <Link to="/invite">
                    <button style={styles.button}>Invite</button>
                </Link>
            </div>
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
    logout: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    links: {
        marginTop: '200px',
    },
    button: {
        marginLeft: '10px',
        marginRight: '10px',
    },
};
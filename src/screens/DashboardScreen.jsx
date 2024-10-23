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
    button: {},
};
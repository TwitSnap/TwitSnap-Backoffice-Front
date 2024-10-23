import {useState} from "react";
import {Link} from "react-router-dom";
import invite from "../handlers/invite.js";


export default function InvitationScreen() {
    const [email, setEmail] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setConfirmation('');

        if (!email) {
            setError('All fields are required.');
            return;
        }

        setError('');
        setLoading(true)
        try {
            await invite(email);
            setConfirmation('Invitation sent.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Link to="/dashboard">
                <button style={styles.dashboard}>Dashboard</button>
            </Link>
            <h2>Invite Admin</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputContainer}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                {error && <p style={styles.errorText}>{error}</p>}
                <button disabled={loading} type="submit">
                    Submit
                </button>
                {confirmation && <p>{confirmation}</p>}
            </form>
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
    dashboard: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    inputContainer: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
    },
    errorText: {
        color: 'red',
    },
};
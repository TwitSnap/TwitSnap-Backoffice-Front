import {useState} from 'react';
import {Link} from "react-router-dom";
import register from "../handlers/register.js";

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !pin || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');
        console.log('Registering with', {email, password, pin});
        try {
            await register(email, password, pin);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <img src="/logo.png" className="logo"/>
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
                <div style={styles.inputContainer}>
                    <label>PIN</label>
                    <input
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                {error && <p style={styles.errorText}>{error}</p>}
                <button type="submit" style={styles.button}>
                    Register
                </button>
            </form>
            <Link to="/login" style={styles.link}>
                Login
            </Link>
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
    form: {
        /*width: '100%',*/
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
    },
    button: {},
    errorText: {},
    link: {
        textDecoration: 'none',
        color: 'white',
        marginTop: '20px',
    },
};
import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import logIn from "../handlers/logIn.js";
import "../App.css"

export default function LogInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // You can add form validation or API call logic here
        if (!email || !password) {
            setError('Both fields are required.');
        } else {
            setError('');
            setLoading(true)
            console.log('Logging in with', {email, password});
            try {
                await logIn(email, password);
                navigate('/dashboard');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div style={styles.container}>
            <img src="/logo.png" className="logo"/>
            <form onSubmit={handleSubmit} style={styles.form}>
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
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                {error && <p style={styles.errorText}>{error}</p>}
                <button disabled={loading} type="submit" style={styles.button}>
                    Login
                </button>
            </form>
            <Link to="/register" style={styles.link}>
                Register Account
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

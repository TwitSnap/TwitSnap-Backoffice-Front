import {useState} from 'react';
import logIn from "../handlers/logIn.js";
import ApiError from "../errors/ApiError.js";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async (event) => {
        event.preventDefault();
        // You can add form validation or API call logic here
        if (!email || !password) {
            setError('Both fields are required.');
        } else {
            setError('');
            console.log('Signing in with', {email, password});
            try {
                await logIn(email, password);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn} style={styles.form}>
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
                <button type="submit" style={styles.button}>
                    Sign In
                </button>
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
    },
    formContainer: {
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    inputContainer: {
        marginBottom: '15px'
    },
    input: {
        width: '100%',
    },
    button: {},
    errorText: {},
};

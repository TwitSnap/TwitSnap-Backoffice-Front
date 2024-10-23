import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LogInScreen from './screens/LogInScreen.jsx';
import RegisterScreen from "./screens/RegisterScreen.jsx";
import UserListScreen from "./screens/UserListScreen.jsx";
import DashboardScreen from "./screens/DashboardScreen.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogInScreen />} />
                <Route path="/dashboard" element={<DashboardScreen />} />
                <Route path="/login" element={<LogInScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/users" element={<UserListScreen />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </Router>
    );
}

export default App

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LogInScreen from './screens/LogInScreen.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogInScreen />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </Router>
    );
}

export default App

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignIn from './screens/SignIn';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </Router>
    );
}

export default App

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { SignUp } from './features/auth/SignUp';
import { SignIn } from './features/auth/SignIn';
import { EmailConfirmation } from './features/auth/EmailConfirmation';

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="app/signup" element={<SignUp />} />
          <Route path="app/signin" element={<SignIn />} />
          <Route path="app/confirmation" element={<EmailConfirmation />} />
          <Route path="app/" element={<Navigate to="/signup" />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
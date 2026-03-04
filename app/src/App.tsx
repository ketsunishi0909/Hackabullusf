import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import AttendeeView from './pages/AttendeeView';
import AdminSignIn from './pages/AdminSignIn';
import AdminDashboard from './pages/AdminDashboard';
import AdminCheckedIn from './pages/AdminCheckedIn';

function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const adminJwt = localStorage.getItem('admin_jwt');
    if (adminJwt) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  return <Home />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/attendee/:id" element={<AttendeeView />} />
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/checked-in" element={<AdminCheckedIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

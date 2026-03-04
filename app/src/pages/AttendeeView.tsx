import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRDisplay from '../components/QRDisplay';

interface Attendee {
  id: string;
  name: string;
  email: string;
  checked_in: number;
  checked_in_at: string | null;
  created_at: string;
}

export default function AttendeeView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      console.error('[AttendeeView] id is undefined');
      setError('Missing attendee ID');
      setLoading(false);
      return;
    }
    console.log('[AttendeeView] fetching /api/attendees/' + id);
    fetch(`/api/attendees/${id}`)
      .then((r) => {
        console.log('[AttendeeView] response status:', r.status);
        if (r.status === 404) {
          localStorage.removeItem('attendee_id');
          navigate('/', { replace: true });
          return null;
        }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Attendee | null) => {
        if (data) {
          console.log('[AttendeeView] attendee loaded:', data);
          setAttendee(data);
        }
      })
      .catch((err) => {
        console.error('[AttendeeView] fetch error:', err);
        setError(`Failed to load attendee: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-white/30 text-sm animate-pulse">Loading…</p>
      </main>
    );
  }

  if (error || !attendee) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-300 text-sm mb-4">{error || 'Attendee not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            Register again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <QRDisplay attendee={attendee} />
      </div>
    </main>
  );
}

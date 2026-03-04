import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        return;
      }

      localStorage.setItem('attendee_id', data.id);
      navigate(`/attendee/${data.id}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <PageTitle fontSize={58}>HackaBull</PageTitle>
          <p className="text-white/40 mt-1 text-sm">Attendee Registration</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg p-6 flex flex-col gap-5 glass-panel"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-white/40 uppercase tracking-widest">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-md px-4 py-2.5 text-sm text-white bg-white/[0.06] border border-white/[0.12] placeholder:text-white/25 focus:outline-none focus:border-white/35 focus:bg-white/[0.09] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-white/40 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full rounded-md px-4 py-2.5 text-sm text-white bg-white/[0.06] border border-white/[0.12] placeholder:text-white/25 focus:outline-none focus:border-white/35 focus:bg-white/[0.09] transition-all"
            />
          </div>

          {error && (
            <p className="text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 rounded-md py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-40 mt-1"
          >
            {loading ? 'Registering...' : 'Register & Get QR Code'}
          </button>

          <p className="text-center text-xs text-white/25">
            Staff?{' '}
            <a href="/admin/signin" className="text-white/50 hover:text-white transition-colors">
              Admin check-in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import PageTitle from '../components/PageTitle';

export default function AdminSignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_jwt')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? 'Sign-in failed');
          return;
        }

        localStorage.setItem('admin_jwt', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        navigate('/admin');
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Sign-in failed'),
  });

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <PageTitle fontSize={52}>HackaBull</PageTitle>
          <p className="text-white/40 mt-1 text-sm">Staff Sign In</p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-white/35 hover:text-white/65 transition-colors mb-5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        <div className="rounded-lg p-6 flex flex-col gap-5 glass-panel">
          {error === 'Access denied' ? (
            <div className="text-center py-4">
              <p className="text-amber-400 text-sm font-medium mb-1">Access Denied</p>
              <p className="text-white/40 text-xs">Your account is not authorized for staff access.</p>
            </div>
          ) : (
            <>
              <p className="text-white/50 text-sm text-center">
                Sign in with your authorized Google account to access the admin dashboard.
              </p>

              {error && (
                <p className="text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-md px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                onClick={() => handleGoogleSignIn()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 rounded-md py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-40"
              >
                <GoogleIcon />
                {loading ? 'Signing in…' : 'Sign in with Google'}
              </button>
            </>
          )}

          <p className="text-center text-xs text-white/25">
            Attendee?{' '}
            <a href="/" className="text-white/50 hover:text-white transition-colors">
              Register here
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

import { useEffect, useState } from 'react';
import './App.css';
import './Auth.css';

function App() {
  const [tab, setTab] = useState('home');
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.message || 'API is running'))
      .catch(() => setApiStatus('API unavailable'));

    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data._id) setUser(data);
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message || '');

    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setForm({ name: '', email: '', password: '' });
      setTab('dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTab('home');
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <button onClick={() => setTab('home')}>Accueil</button>
          <button onClick={() => setTab('api')}>API</button>
          {user ? (
            <>
              <button onClick={() => setTab('dashboard')}>Dashboard</button>
              <button onClick={() => setTab('profile')}>Profil</button>
              <button onClick={logout}>Déconnexion</button>
            </>
          ) : (
            <button onClick={() => setTab('auth')}>Connexion</button>
          )}
        </nav>

        {tab === 'home' && (
          <section>
            <h1>Application fullstack</h1>
            <p>Bienvenue dans votre espace utilisateur.</p>
          </section>
        )}

        {tab === 'api' && (
          <section>
            <h2>État de l'API</h2>
            <p>{apiStatus}</p>
          </section>
        )}

        {tab === 'auth' && (
          <div className="auth-container">
            <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Nom complet"
                  value={form.name}
                  onChange={handleChange}
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
              />
              <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
            </form>
            <p>
              <span className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Créer un compte' : 'Déjà un compte ?'}
              </span>
            </p>
            {message && <p>{message}</p>}
          </div>
        )}

        {tab === 'dashboard' && user && (
          <section>
            <h2>Dashboard</h2>
            <p>Bonjour {user.name}</p>
            <p>Rôle : {user.role}</p>
            <p>Email : {user.email}</p>
          </section>
        )}

        {tab === 'profile' && user && (
          <section>
            <h2>Profil</h2>
            <p><strong>Nom :</strong> {user.name}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Rôle :</strong> {user.role}</p>
          </section>
        )}
      </header>
    </div>
  );
}

export default App;

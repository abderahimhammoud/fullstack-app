import { useEffect, useState } from 'react';
import './App.css';
import './Auth.css';

// 1. Define the base API URL (Falls back to localhost for local development)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [tab, setTab] = useState('home');
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    // 2. Add the base URL to your fetch requests
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(data.message || 'API is running'))
      .catch(() => setApiStatus('API unavailable'));

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/me`, {
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? `${API_BASE_URL}/api/auth/login`
      : `${API_BASE_URL}/api/auth/signup`;

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: (formData.get('email') || '').toString().trim(),
      password: (formData.get('password') || '').toString(),
      ...(isLogin ? {} : { name: (formData.get('name') || '').toString().trim() }),
    };

    if (!payload.email || !payload.password || (!isLogin && !payload.name)) {
      setMessage('Tous les champs doivent être remplis');
      setMessageType('error');
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message || '');
      setMessageType(data.token ? 'success' : 'error');

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setForm({ name: '', email: '', password: '' });
        setTab('dashboard');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
      setMessageType('error');
    }
    setTimeout(() => setMessage(''), 5000);
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
              <button
                type="button"
                className="auth-switch"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Créer un compte' : 'Déjà un compte ?'}
              </button>
            </p>
            {message && (
              <p className={`auth-message ${messageType === 'success' ? 'success' : 'error'}`}>
                {message}
              </p>
            )}
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

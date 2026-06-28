import React, { useState } from 'react';
import { Search, GitFork, Star, AlertCircle, LayoutDashboard, BookOpen, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);

  const fetchGitHubData = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setProfile(null);
    setRepos([]);

    try {
      const profileRes = await fetch(`https://api.github.com/users/${username}`);
      if (!profileRes.ok) throw new Error('Usuário ou Organização não encontrada');
      const profileData = await profileRes.json();

      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stargazers`);
      const reposData = await reposRes.json();

      setProfile(profileData);
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageData = () => {
    const langMap = {};
    repos.forEach(repo => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });
    return Object.keys(langMap).map(lang => ({
      name: lang,
      value: langMap[lang]
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const languageData = getLanguageData();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-400">
            <LayoutDashboard size={24} />
            <span>GitHub DevRadar</span>
          </div>
          <form onSubmit={fetchGitHubData} className="flex gap-2 w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Ex: netflix, google, facebook..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-hidden focus:border-indigo-500 text-slate-200"
              />
            </div>
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!profile && !loading && !error && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-lg">Busque por uma organização ou dev para carregar o radar em tempo real.</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Consultando servidores do GitHub...</p>
          </div>
        )}

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Perfil */}
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl h-fit">
              <div className="flex items-center gap-4 mb-6">
                <img src={profile.avatar_url} alt={profile.name} className="w-16 h-16 rounded-full border-2 border-indigo-500" />
                <div>
                  <h2 className="font-bold text-xl">{profile.name || profile.login}</h2>
                  <p className="text-slate-400 text-sm">@{profile.login}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-6">{profile.bio || 'Sem bio disponível.'}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800 p-3 rounded-xl flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-400" />
                  <div>
                    <span className="block font-bold">{profile.public_repos}</span>
                    <span className="text-xs text-slate-400">Repositórios</span>
                  </div>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl flex items-center gap-2">
                  <Users size={16} className="text-emerald-400" />
                  <div>
                    <span className="block font-bold">{profile.followers}</span>
                    <span className="text-xs text-slate-400">Seguidores</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos e Repositórios */}
            <div className="lg:col-span-2 space-y-8">
              {languageData.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-4 text-slate-200">Mix de Tecnologias (Top 5 Linguagens)</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={languageData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                          {languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-200">Repositórios em Destaque</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {repos.slice(0, 4).map(repo => (
                    <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="bg-slate-800/30 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition-all block">
                      <h4 className="font-semibold text-indigo-400 truncate mb-1">{repo.name}</h4>
                      <p className="text-slate-400 text-xs line-clamp-2 h-8 mb-4">{repo.description || 'Sem descrição.'}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        {repo.language && (
                          <span className="bg-slate-800 px-2 py-1 rounded text-slate-300 font-medium">{repo.language}</span>
                        )}
                        <span className="flex items-center gap-1"><Star size={14} className="text-amber-400" /> {repo.stargazers_count}</span>
                        <span className="flex items-center gap-1"><GitFork size={14} className="text-blue-400" /> {repo.forks_count}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
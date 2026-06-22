import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import MasterKarakter from './pages/MasterKarakter';
import MasterPeserta from './pages/MasterPeserta';
import DraftPick from './pages/DraftPick';
import AdminDashboard from './pages/AdminDashboard';
import RiwayatPertandingan from './pages/RiwayatPertandingan';
import Profil from './pages/Profil';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rute Standalone (Layar Penuh, tanpa Sidebar) */}
          <Route path="/draft" element={<DraftPick />} />

          {/* MainLayout membungkus route biasa */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/karakter" element={<MasterKarakter />} />
            <Route path="/peserta" element={<MasterPeserta />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/history" element={<RiwayatPertandingan />} />
            <Route path="/profil" element={<Profil />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
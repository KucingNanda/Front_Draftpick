import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts & Routes
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './routes/PrivateRoute';

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
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rute Standalone (Layar Penuh, tanpa Sidebar) */}
            <Route path="/draft" element={<DraftPick />} />

            {/* MainLayout membungkus route biasa */}
            <Route element={<MainLayout />}>
              {/* Rute Terbuka (Public) */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/karakter" element={<MasterKarakter />} />
              <Route path="/peserta" element={<MasterPeserta />} />
              <Route path="/history" element={<RiwayatPertandingan />} />
              
              {/* Rute Khusus User Login */}
              <Route element={<PrivateRoute />}>
                <Route path="/profil" element={<Profil />} />
              </Route>

              {/* Rute Khusus Wasit / Admin */}
              <Route element={<PrivateRoute allowedRoles={['wasit']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
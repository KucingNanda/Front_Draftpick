import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export function useApi() {
  const { logout } = useAuth();

  const callApi = useCallback(async (url, options = {}) => {
    // 1. Ambil token terbaru dari localStorage
    const token = localStorage.getItem('userToken');

    // 2. Siapkan headers
    const headers = { ...options.headers };

    // Sisipkan token jika ada
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Jika body bukan FormData (misal JSON biasa), tambahkan Content-Type JSON
    // Jangan tambahkan Content-Type jika FormData (browser yang akan atur boundary otomatis)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // 3. Lakukan request HTTP
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // 4. Cek status 401 Unauthorized (kecuali saat mencoba login)
      if (response.status === 401 && !url.includes('/api/login')) {
        Swal.fire({
          title: 'Sesi Habis!',
          text: 'Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.',
          icon: 'warning',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          logout(); // Otomatis clear storage dan set role ke guest
          window.location.href = '/'; // Force redirect ke home/login
        });
      }

      return response;
    } catch (error) {
      // Tangani error jaringan
      console.error('API Call Error:', error);
      throw error;
    }
  }, [logout]);

  return callApi;
}

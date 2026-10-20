import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

let isSessionAlertOpen = false;

export function useApi() {
  const { logout } = useAuth();

  const callApi = useCallback(async (url, options = {}) => {
    // 1. Ambil token terbaru dari localStorage
    const rawToken = localStorage.getItem('userToken');
    const token = (rawToken && rawToken !== 'null' && rawToken !== 'undefined') ? rawToken : null;

    // 2. Siapkan headers
    const headers = { ...options.headers };

    // Sisipkan token jika ada
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Jika body bukan FormData (misal JSON biasa), tambahkan Content-Type JSON
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // 3. Lakukan request HTTP
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // 4. Cek status 401 Unauthorized
      // HANYA tampilkan notifikasi jika user sebelumnya memiliki token (bukan guest)
      // dan bukan endpoint auth publik (login/register)
      const isAuthUrl = url.includes('/api/login') || url.includes('/api/register');
      if (response.status === 401 && !isAuthUrl && token && !isSessionAlertOpen) {
        isSessionAlertOpen = true;
        Swal.fire({
          title: 'Sesi Habis!',
          text: 'Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.',
          icon: 'warning',
          background: 'var(--theme-bg-panel)',
          color: 'var(--theme-text-main)',
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          isSessionAlertOpen = false;
          logout(); // Otomatis clear storage dan set role ke guest
          window.location.href = '/'; // Force redirect ke home
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

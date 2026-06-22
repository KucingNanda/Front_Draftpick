import { useState, useEffect } from 'react';

export function useDraftData() {
  const [karakters, setKarakters] = useState([]);
  const [pesertas, setPesertas] = useState([]);
  const [settings, setSettings] = useState({
    maxCost: 7,
    free4StarId: 0,
    bgmUrl: ''
  });

  useEffect(() => {
    const fetchOptions = {
      headers: { 'ngrok-skip-browser-warning': '69420' }
    };

    // Fetch Settings
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings`, fetchOptions)
      .then(res => res.json())
      .then(data => {
         if(data && data.maxCost) setSettings(data);
      })
      .catch(err => console.error("Error fetch settings:", err));

    // Fetch Master Karakter
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/karakter`, fetchOptions)
      .then(res => res.json())
      .then(data => setKarakters(data || []))
      .catch(err => console.error("Error fetch karakter:", err));

    // Fetch Master Peserta
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/peserta`, fetchOptions)
      .then(res => res.json())
      .then(data => setPesertas(data || []))
      .catch(err => console.error("Error fetch peserta:", err));
  }, []);

  return { karakters, pesertas, settings };
}

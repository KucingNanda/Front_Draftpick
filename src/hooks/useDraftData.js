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
    // Fetch Settings
    fetch('http://localhost:3000/api/settings')
      .then(res => res.json())
      .then(data => {
         if(data && data.maxCost) setSettings(data);
      })
      .catch(err => console.error("Error fetch settings:", err));

    // Fetch Master Karakter
    fetch('http://localhost:3000/api/karakter')
      .then(res => res.json())
      .then(data => setKarakters(data || []))
      .catch(err => console.error("Error fetch karakter:", err));

    // Fetch Master Peserta
    fetch('http://localhost:3000/api/peserta')
      .then(res => res.json())
      .then(data => setPesertas(data || []))
      .catch(err => console.error("Error fetch peserta:", err));
  }, []);

  return { karakters, pesertas, settings };
}

import { X, AlertCircle, ShieldAlert, Swords, Zap, Crown } from 'lucide-react';

export default function DraftRulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div 
        className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3 relative z-10">
            <ShieldAlert className="text-blue-500" size={28} />
            Aturan & Regulasi Draft Pick
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-red-500/20 hover:border-red-500/50 border border-transparent p-2 rounded-xl transition-all relative z-10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          
          {/* Rule 1: Struktur Pertandingan */}
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 shadow-inner">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2 mb-4">
              <Swords size={20} /> 1. Struktur Pertandingan & Cost
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base ml-2">
              <li>Pertandingan dibagi menjadi <strong>2 Babak</strong> (First Half & Second Half).</li>
              <li>Setiap karakter memiliki <strong>Cost</strong> bawaan berdasarkan <em>Rarity</em> (Bintang).</li>
              <li><strong>Penalti Cost:</strong> Penggunaan Senjata Bintang 5 (R1/R2) atau Konstelasi 1 (C1) untuk karakter Bintang 5 akan menambah beban cost tim Anda.</li>
              <li>Setiap babak memiliki batas maksimal cost yang tidak boleh dilampaui.</li>
            </ul>
          </div>

          {/* Rule 2: Sistem Ban */}
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 shadow-inner">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-4">
              <AlertCircle size={20} /> 2. Sistem Ban (Kutukan)
            </h3>
            <p className="text-gray-300 text-sm md:text-base mb-3 ml-2 border-l-2 border-red-500/30 pl-3 italic">
              "Karakter yang ada di kotak Ban Anda adalah karakter yang <strong>TIDAK BOLEH</strong> Anda pakai."
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base ml-2">
              <li><strong>Global Ban:</strong> Kutukan permanen. Karakter ini dilarang digunakan di <em>semua babak</em> oleh pemain yang menerima kutukan.</li>
              <li><strong>Half Ban:</strong> Kutukan sementara. Karakter dilarang hanya pada babak tersebut.</li>
            </ul>
          </div>

          {/* Rule 3: Sistem Pick & Mirror Match */}
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 shadow-inner">
            <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2 mb-4">
              <Zap size={20} /> 3. Sistem Pick & Pengecualian (Mirror)
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base ml-2">
              <li>Secara umum, pemain <strong>tidak boleh</strong> memilih karakter yang sudah di-pick oleh lawan.</li>
              <li><strong>Pengecualian (Boleh Mirror Match):</strong> Anda tetap bisa memilih karakter yang dipakai lawan JIKA karakter tersebut adalah:
                <ul className="list-[circle] list-inside ml-6 mt-1 text-gray-400">
                  <li><strong>Karakter C1:</strong> Karakter Bintang 5 yang terdaftar dengan Konstelasi 1.</li>
                  <li><strong>Karakter Spesial:</strong> Karakter Bintang 4 Gratis minggu ini (sesuai babak yang ditentukan).</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Rule 4: Kekebalan Khusus */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-gray-800 p-6 rounded-2xl border border-yellow-500/30 shadow-inner">
            <h3 className="text-lg font-bold text-yellow-500 flex items-center gap-2 mb-4">
              <Crown size={20} /> 4. Keistimewaan Khusus
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base ml-2">
              <li><strong>Traveler</strong> memiliki keistimewaan absolut. Mereka kebal terhadap semua aturan Ban dan bebas digunakan kapan saja.</li>
              <li><strong>Karakter Spesial (Free 4-Star)</strong> kebal terhadap aturan Ban jika dimainkan pada babak yang telah diizinkan oleh sistem.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

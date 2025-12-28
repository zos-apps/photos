import React, { useState, useRef } from 'react';

interface PhotosProps { onClose: () => void; }

interface Photo { id: string; url: string; name: string; date: string; }

const Photos: React.FC<PhotosProps> = ({ onClose }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos(p => [...p, { id: Date.now().toString(), url: ev.target?.result as string, name: file.name, date: new Date().toLocaleDateString() }]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><span>📷</span> Photos</h1>
        <button onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">+ Add Photos</button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {photos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="text-6xl mb-4">📷</div>
            <p>No photos yet</p>
            <p className="text-sm">Click "Add Photos" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {photos.map(photo => (
              <div key={photo.id} onClick={() => setSelected(photo)} className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500">
                <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <img src={selected.url} alt={selected.name} className="max-w-full max-h-full object-contain" />
          <div className="absolute bottom-4 text-white text-center">
            <p className="font-bold">{selected.name}</p>
            <p className="text-sm text-gray-400">{selected.date}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;

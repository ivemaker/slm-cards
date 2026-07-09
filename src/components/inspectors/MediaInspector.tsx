import React, { useState } from 'react';
import { Block, MediaItem } from '../../types';
import { compressImage } from '../../utils';
import { Plus, Trash, ArrowUp, ArrowDown, Image as ImageIcon, Video as VideoIcon, Sliders, Play } from 'lucide-react';

interface MediaInspectorProps {
  focusedBlock: Block;
  lang: 'en' | 'ru';
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
}

export const MediaInspector: React.FC<MediaInspectorProps> = ({
  focusedBlock,
  lang,
  updateFocusedBlock,
}) => {
  const content = focusedBlock.mediaContent || {
    items: [],
    autoplay: true,
    loop: true,
    showControls: true,
    aspectRatio: 'video',
    objectFit: 'cover',
  };

  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const items = content.items || [];

  const updateItems = (newItems: MediaItem[]) => {
    updateFocusedBlock((b) => ({
      mediaContent: {
        ...content,
        items: newItems,
      },
    }));
  };

  const addItem = (type: 'image' | 'video') => {
    const newItem: MediaItem = {
      id: `med_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      url: type === 'image' 
        ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' // default high-quality sneaker asset
        : 'https://www.w3schools.com/html/mov_bbb.mp4', // sample public MP4 video
    };
    updateItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    updateItems(items.filter((item) => item.id !== id));
  };

  const updateItemUrl = (id: string, url: string) => {
    updateItems(
      items.map((item) => (item.id === id ? { ...item, url } : item))
    );
  };

  const updateItemType = (id: string, type: 'image' | 'video') => {
    updateItems(
      items.map((item) => {
        if (item.id === id) {
          const defaultUrl = type === 'image'
            ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
            : 'https://www.w3schools.com/html/mov_bbb.mp4';
          return { ...item, type, url: defaultUrl };
        }
        return item;
      })
    );
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const list = [...items];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;
    updateItems(list);
  };

  const handleLocalImageUpload = async (file: File, index: number, itemId: string) => {
    try {
      setUploadingIdx(index);
      // Let's compress with modern limits so it's sharp but fits well in offline state
      const base64 = await compressImage(file, 800, 800);
      updateItemUrl(itemId, base64);
    } catch (e) {
      console.error(e);
      alert(lang === 'en' ? 'Image upload error' : 'Ошибка загрузки изображения');
    } finally {
      setUploadingIdx(null);
    }
  };

  const hasSliderEnabled = items.length > 1;

  return (
    <div className="space-y-4">
      {/* List of Slide Files */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
            {lang === 'en' ? 'Media Tracks & Slides' : 'Медиафайлы и слайды'}
          </label>
          <span className="text-[10px] font-mono text-zinc-500">
            {items.length} {lang === 'en' ? 'item(s)' : 'об.'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-zinc-850 rounded-xl bg-zinc-900/10">
            <p className="text-xs text-zinc-500 font-mono mb-3">
              {lang === 'en' ? 'No media added yet' : 'Медиафайлы ещё не добавлены'}
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => addItem('image')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-xs font-mono font-medium text-white transition-all cursor-pointer"
              >
                <Plus size={13} className="text-emerald-500" />
                + Image
              </button>
              <button
                type="button"
                onClick={() => addItem('video')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-xs font-mono font-medium text-white transition-all cursor-pointer"
              >
                <Plus size={13} className="text-sky-500" />
                + Video
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850 rounded-xl p-3 space-y-2.5 transition-all"
              >
                {/* File Header */}
                <div className="flex items-center justify-between border-b border-zinc-850/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-black text-zinc-500">#{idx + 1}</span>
                    <select
                      value={item.type}
                      onChange={(e) => updateItemType(item.id, e.target.value as any)}
                      className="bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none"
                    >
                      <option value="image">📸 Image</option>
                      <option value="video">🎥 Video</option>
                    </select>
                  </div>

                  {/* Actions Panel */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                      className="p-1 rounded bg-zinc-950/60 border border-zinc-850 hover:bg-zinc-850 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-zinc-400"
                      title={lang === 'en' ? 'Move Up' : 'Вверх'}
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1 rounded bg-zinc-950/60 border border-zinc-850 hover:bg-zinc-850 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-zinc-400"
                      title={lang === 'en' ? 'Move Down' : 'Вниз'}
                    >
                      <ArrowDown size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded bg-red-950/60 border border-red-900/40 hover:bg-red-900/80 cursor-pointer text-red-400 ml-1.5"
                      title={lang === 'en' ? 'Delete' : 'Удалить'}
                    >
                      <Trash size={11} />
                    </button>
                  </div>
                </div>

                {/* File Form Content */}
                <div className="space-y-2">
                  {item.type === 'image' ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        {item.url && item.url.startsWith('data:') ? (
                          <img
                            src={item.url}
                            alt="Preview"
                            className="w-12 h-12 rounded object-cover border border-zinc-800 bg-zinc-950 flex-shrink-0"
                          />
                        ) : item.url ? (
                          <div
                            className="w-12 h-12 rounded bg-cover bg-center border border-zinc-800 flex-shrink-0"
                            style={{ backgroundImage: `url("${item.url}")` }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded border border-dashed border-zinc-800 bg-zinc-950 flex items-center justify-center flex-shrink-0">
                            <ImageIcon size={14} className="text-zinc-600" />
                          </div>
                        )}

                        <div className="flex-1 space-y-1.5">
                          <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-tight">
                            {lang === 'en' ? 'Upload Image File' : 'Загрузить файл изображения'}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingIdx === idx}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLocalImageUpload(file, idx, item.id);
                            }}
                            className="block w-full text-[9px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-mono file:bg-zinc-800 file:text-white file:hover:bg-zinc-700 cursor-pointer focus:outline-none"
                          />
                          {uploadingIdx === idx && (
                            <span className="text-[8px] font-mono text-amber-500 animate-pulse">
                              {lang === 'en' ? 'Compressing...' : 'Сжатие...'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-tight mb-1">
                          {lang === 'en' ? 'Or Paste Image URL Address' : 'Или вставьте ссылку на картинку'}
                        </label>
                        <input
                          type="text"
                          value={item.url.startsWith('data:') ? '' : item.url}
                          placeholder="https://images.unsplash.com/..."
                          onChange={(e) => updateItemUrl(item.id, e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-[10px] font-mono rounded p-1.5 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <VideoIcon size={12} className="text-sky-400" />
                        <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-tight">
                          {lang === 'en' ? 'Video URL (YouTube, Vimeo, MP4 link)' : 'Ссылка на видео (YouTube, Vimeo, MP4)'}
                        </label>
                      </div>
                      <input
                        type="text"
                        value={item.url}
                        placeholder={
                          item.url.includes('youtube.com') || item.url.includes('youtu.be')
                            ? 'YouTube link'
                            : 'https://www.w3schools.com/html/mov_bbb.mp4'
                        }
                        onChange={(e) => updateItemUrl(item.id, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-[10px] font-mono rounded p-1.5 text-white focus:outline-none"
                      />
                      <span className="block text-[8px] text-zinc-500 font-mono italic">
                        {lang === 'en'
                          ? 'Supports YouTube embedding, Vimeo, or standard live video stream URLs.'
                          : 'Поддерживаются прямые .mp4/WebM ссылки, YouTube, Vimeo.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Append slide elements footer bar */}
        {items.length > 0 && (
          <div className="flex gap-2 pt-1 border-t border-zinc-900">
            <button
              type="button"
              onClick={() => addItem('image')}
              className="flex-1 flex items-center justify-center gap-1 bg-zinc-900 hover:bg-zinc-850 text-[10px] font-mono text-zinc-300 font-bold border border-zinc-800 p-1.5 rounded-lg cursor-pointer transition-colors"
            >
              <Plus size={11} className="text-emerald-500" />
              {lang === 'en' ? '+ Add Image' : '+ Картинку'}
            </button>
            <button
              type="button"
              onClick={() => addItem('video')}
              className="flex-1 flex items-center justify-center gap-1 bg-zinc-900 hover:bg-zinc-850 text-[10px] font-mono text-zinc-300 font-bold border border-zinc-800 p-1.5 rounded-lg cursor-pointer transition-colors"
            >
              <Plus size={11} className="text-sky-500" />
              {lang === 'en' ? '+ Add Video' : '+ Видео'}
            </button>
          </div>
        )}
      </div>

      {/* Slide & Player Configurations */}
      <div className="pt-3 border-t border-zinc-900/60 space-y-3">
        <label className="block text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider flex items-center gap-1">
          <Sliders size={12} className="text-amber-500" />
          {lang === 'en' ? 'Media Display Options' : 'Настройки отображения медиа'}
        </label>

        {/* Grid display config layout */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[8px] uppercase font-mono text-zinc-500 mb-1">
              {lang === 'en' ? 'Aspect Ratio' : 'Соотношение сторон'}
            </label>
            <select
              value={content.aspectRatio || 'video'}
              onChange={(e) =>
                updateFocusedBlock((b) => ({
                  mediaContent: { ...content, aspectRatio: e.target.value as any },
                }))
              }
              className="w-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono rounded-lg p-2 text-white focus:outline-none cursor-pointer"
            >
              <option value="square">1:1 (Square / Квадрат)</option>
              <option value="video">16:9 (Standard / Видео)</option>
              <option value="portrait">9:16 (Portrait / Портрет)</option>
              <option value="auto">Auto (Natural Image / Авто)</option>
            </select>
          </div>

          <div>
            <label className="block text-[8px] uppercase font-mono text-zinc-500 mb-1">
              {lang === 'en' ? 'Scale / Fit' : 'Заполнение'}
            </label>
            <select
              value={content.objectFit || 'cover'}
              onChange={(e) =>
                updateFocusedBlock((b) => ({
                  mediaContent: { ...content, objectFit: e.target.value as any },
                }))
              }
              className="w-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono rounded-lg p-2 text-white focus:outline-none cursor-pointer"
            >
              <option value="cover">Cover (Crop / Обрезать)</option>
              <option value="contain">Contain (Fit all / Вписать)</option>
            </select>
          </div>
        </div>

        {/* Playback Settings (Switches) */}
        <div className="space-y-2 p-2.5 bg-zinc-900/30 rounded-xl border border-zinc-850/60">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-300 font-mono">
              {lang === 'en' ? 'Auto Play loop' : 'Автовоспроизведение'}
            </span>
            <input
              type="checkbox"
              checked={content.autoplay !== false}
              onChange={(e) =>
                updateFocusedBlock((b) => ({
                  mediaContent: { ...content, autoplay: e.target.checked },
                }))
              }
              className="w-3.5 h-3.5 text-emerald-600 bg-zinc-950 rounded border-zinc-800 cursor-pointer focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-300 font-mono">
              {lang === 'en' ? 'Infinite Loop' : 'Бесконечный цикл'}
            </span>
            <input
              type="checkbox"
              checked={content.loop !== false}
              onChange={(e) =>
                updateFocusedBlock((b) => ({
                  mediaContent: { ...content, loop: e.target.checked },
                }))
              }
              className="w-3.5 h-3.5 text-emerald-600 bg-zinc-950 rounded border-zinc-800 cursor-pointer focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-300 font-mono">
              {lang === 'en' ? 'Show Interface Controls' : 'Интерфейс управления'}
            </span>
            <input
              type="checkbox"
              checked={content.showControls !== false}
              onChange={(e) =>
                updateFocusedBlock((b) => ({
                  mediaContent: { ...content, showControls: e.target.checked },
                }))
              }
              className="w-3.5 h-3.5 text-emerald-600 bg-zinc-950 rounded border-zinc-800 cursor-pointer focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

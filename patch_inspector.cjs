const fs = require('fs');
let code = fs.readFileSync('src/components/inspectors/ProfileInspector.tsx', 'utf8');

const target1 = `  const [localBio, setLocalBio] = React.useState(profile.bio || '');`;
const replacement1 = `  const [localSubtitle, setLocalSubtitle] = React.useState(profile.subtitle || '');\n  const [localBio, setLocalBio] = React.useState(profile.bio || '');`;
code = code.replace(target1, replacement1);

const target2 = `    setLocalBio(focusedBlock.profileContent?.bio || '');`;
const replacement2 = `    setLocalSubtitle(focusedBlock.profileContent?.subtitle || '');\n    setLocalBio(focusedBlock.profileContent?.bio || '');`;
code = code.replace(target2, replacement2);

const target3 = `  const handleBioBlur = () => {`;
const replacement3 = `  const handleSubtitleBlur = () => {\n    const trimmed = localSubtitle.trim();\n    updateProfileContent({ subtitle: trimmed });\n  };\n\n  const handleBioBlur = () => {`;
code = code.replace(target3, replacement3);

const target4 = `      {/* SECTION: BIO / DESCRIPTION */}
      <div className="pt-3 border-t border-zinc-800/60" />`;
const replacement4 = `      {/* SECTION: SUBTITLE */}
      <div className="pt-3 border-t border-zinc-800/60" />
      <div className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
        <span>{lang === 'en' ? 'Subtitle' : 'ПОДЗАГОЛОВОК'}</span>
      </div>

      <div className="flex gap-2 items-end">
        {/* Subtitle Input Field */}
        <div className="flex-1">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Subtitle' : 'Подзаголовок'}
          </label>
          <input
            type="text"
            value={localSubtitle}
            onChange={(e) => setLocalSubtitle(e.target.value)}
            onBlur={handleSubtitleBlur}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white focus:outline-none"
          />
        </div>

        {/* Font Family Dropdown */}
        <div className="w-[110px] flex-shrink-0">
          <label className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1 truncate">
            {lang === 'en' ? 'Font' : 'Шрифт'}
          </label>
          <select
            value={focusedBlock.customSubtitleFont || 'Inter'}
            onChange={(e) => updateFocusedBlock(() => ({ customSubtitleFont: e.target.value }))}
            className="w-full bg-zinc-900 border border-zinc-800 text-[11px] rounded-lg p-2 text-white focus:outline-none cursor-pointer"
            style={{ fontFamily: focusedBlock.customSubtitleFont || 'Inter' }}
          >
            <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
            <option value="Space Grotesk" style={{ fontFamily: 'Space Grotesk' }}>Grotesk</option>
            <option value="Montserrat" style={{ fontFamily: 'Montserrat' }}>Montserrat</option>
            <option value="Unbounded" style={{ fontFamily: 'Unbounded' }}>Unbounded</option>
            <option value="Merriweather" style={{ fontFamily: 'Merriweather' }}>Merriweather</option>
            <option value="Playfair Display" style={{ fontFamily: 'Playfair Display' }}>Playfair</option>
            <option value="JetBrains Mono" style={{ fontFamily: 'JetBrains Mono' }}>Mono</option>
            <option value="Pacifico" style={{ fontFamily: 'Pacifico' }}>Pacifico</option>
          </select>
        </div>

        {/* Color Picker */}
        <div className="flex flex-col items-center flex-shrink-0">
          <label className="block text-[7px] uppercase font-bold text-zinc-500 tracking-wider mb-1 text-center truncate">
            {lang === 'en' ? 'Color' : 'Цвет'}
          </label>
          <div className="relative w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center bg-zinc-950 cursor-pointer hover:border-zinc-700 transition">
            <input
              type="color"
              value={focusedBlock.customSubtitleColor || '#ffffff'}
              onChange={(e) => updateFocusedBlock(() => ({ customSubtitleColor: e.target.value }))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div 
              className="w-4 h-4 rounded border border-zinc-700 shadow-inner"
              style={{ backgroundColor: focusedBlock.customSubtitleColor || '#ffffff' }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <TextFormatToolbar 
          styles={focusedBlock.subtitleTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ subtitleTextStyles: styles }))}
        />
      </div>

      {/* Font Size Slider */}
      <div className="space-y-1 mt-1 bg-zinc-900/10 p-2 rounded-xl border border-zinc-900">
        <div className="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase">
          <span>{lang === 'en' ? 'Subtitle Font Size' : 'Размер шрифта подзаголовка'}</span>
          <span className="font-mono text-zinc-400">
            {focusedBlock.customSubtitleFontSize !== undefined ? focusedBlock.customSubtitleFontSize : 14}px
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={focusedBlock.customSubtitleFontSize !== undefined ? focusedBlock.customSubtitleFontSize : 14}
          onChange={(e) => updateFocusedBlock(() => ({ customSubtitleFontSize: parseInt(e.target.value) }))}
          className="w-full accent-white bg-zinc-950 h-1.5 rounded-lg cursor-pointer"
        />
        <TextStylesEditor 
          styles={focusedBlock.subtitleTextStyles} 
          onChange={(styles) => updateFocusedBlock(() => ({ subtitleTextStyles: styles }))}
          lang={lang}
        />
      </div>

      {/* SECTION: BIO / DESCRIPTION */}
      <div className="pt-3 border-t border-zinc-800/60" />`;
code = code.replace(target4, replacement4);

fs.writeFileSync('src/components/inspectors/ProfileInspector.tsx', code);
console.log('Done inspector');

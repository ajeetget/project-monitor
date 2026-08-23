import { useRef } from 'react';

export default function Topbar({ title, sub, search, onSearchChange, onNewProject, onBackup, onRestore, onImport }) {
  const restoreInputRef = useRef(null);

  return (
    <div id="topbar">
      <div>
        <h1>{title}</h1>
        <div className="sub">{sub}</div>
      </div>
      <div className="topbar-actions">
        <div className="searchbox">
          <input
            placeholder="Search code, title, lab, scientist…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <button className="btn btn-ghost" title="Save a full backup of all data to a file" onClick={onBackup}>⬇ Backup (JSON)</button>
        <button className="btn btn-ghost" title="Load data from a backup file" onClick={() => restoreInputRef.current?.click()}>⬆ Restore Backup</button>
        <input
          ref={restoreInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files[0];
            if (file) onRestore(file);
            e.target.value = '';
          }}
        />
        <button className="btn btn-ghost" onClick={onImport}>⬆ Import from Excel</button>
        <button className="btn btn-primary" onClick={onNewProject}>+ New Project</button>
      </div>
    </div>
  );
}

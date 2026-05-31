import { useState, useEffect, useRef, useCallback } from "react";

const api = window.electronAPI;

// ── Tipos de archivo ──────────────────────────────────────────────────────────
const FILE_TYPES = {
  pdf:  { icon: "📄", color: "#ff6b6b" }, docx: { icon: "📝", color: "#4dabf7" },
  doc:  { icon: "📝", color: "#4dabf7" }, xlsx: { icon: "📊", color: "#51cf66" },
  xls:  { icon: "📊", color: "#51cf66" }, txt:  { icon: "📃", color: "#adb5bd" },
  md:   { icon: "📋", color: "#74c0fc" }, jpg:  { icon: "🖼️", color: "#ffd43b" },
  jpeg: { icon: "🖼️", color: "#ffd43b" }, png:  { icon: "🖼️", color: "#ffd43b" },
  gif:  { icon: "🎞️", color: "#ffd43b" }, mp3:  { icon: "🎵", color: "#cc5de8" },
  flac: { icon: "🎵", color: "#cc5de8" }, mp4:  { icon: "🎬", color: "#ff8787" },
  mov:  { icon: "🎬", color: "#ff8787" }, avi:  { icon: "🎬", color: "#ff8787" },
  zip:  { icon: "📦", color: "#f08c00" }, rar:  { icon: "📦", color: "#f08c00" },
  "7z": { icon: "📦", color: "#f08c00" }, iso:  { icon: "💿", color: "#868e96" },
  exe:  { icon: "⚙️", color: "#e03131" }, msi:  { icon: "⚙️", color: "#e03131" },
  jsx:  { icon: "⚛️", color: "#61dafb" }, js:   { icon: "📜", color: "#f7df1e" },
  ts:   { icon: "📜", color: "#3178c6" }, tsx:  { icon: "⚛️", color: "#61dafb" },
  css:  { icon: "🎨", color: "#264de4" }, html: { icon: "🌐", color: "#e34c26" },
  json: { icon: "🔧", color: "#89e051" }, c:    { icon: "⚙️", color: "#a8b9cc" },
  cpp:  { icon: "⚙️", color: "#a8b9cc" }, py:   { icon: "🐍", color: "#3572A5" },
  java: { icon: "☕", color: "#f89820" }, cs:   { icon: "⚙️", color: "#239120" },
  log:  { icon: "📋", color: "#868e96" }, lnk:  { icon: "🔗", color: "#adb5bd" },
  bat:  { icon: "⚙️", color: "#e03131" }, ps1:  { icon: "💙", color: "#012456" },
  default: { icon: "📄", color: "#adb5bd" },
};

const ft = (ext) => FILE_TYPES[ext?.toLowerCase()] || FILE_TYPES.default;
const sep = "\\";
const joinPath = (base, name) => base.endsWith("\\") || base.endsWith("/") ? `${base}${name}` : `${base}${sep}${name}`;
const getParent = (p) => {
  const norm = p.replace(/[/\\]+$/, "");
  const idx = Math.max(norm.lastIndexOf("\\"), norm.lastIndexOf("/"));
  if (idx <= 2) return norm.slice(0, 3);
  return norm.slice(0, idx);
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPath, setCurrentPath] = useState("");
  const [entries, setEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [selected, setSelected] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const [creating, setCreating] = useState(null);
  const [createName, setCreateName] = useState("");
  const [toast, setToast] = useState(null);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [properties, setProperties] = useState(null);
  const [propData, setPropData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drives, setDrives] = useState([]);
  const [specialPaths, setSpecialPaths] = useState({});
  const [error, setError] = useState(null);
  const [showHidden, setShowHidden] = useState(false);
  const [creatingWithExt, setCreatingWithExt] = useState(false);

  const mainRef = useRef(null);
  const renameRef = useRef(null);
  const createRef = useRef(null);

  // ── Init ──
  useEffect(() => {
    (async () => {
      const [d, sp] = await Promise.all([api.listDrives(), api.getSpecialPaths()]);
      setDrives(d);
      setSpecialPaths(sp);
      navigate(sp.home);
    })();
  }, []);

  // ── Toast ──
  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Navigate ──
  const navigate = useCallback(async (path, push = true) => {
    if (!path) return;
    setLoading(true);
    setError(null);
    setSelected([]);
    setSearch("");
    const result = await api.readDir(path);
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    setEntries(result);
    setCurrentPath(path);
    if (push) {
      setHistory((h) => {
        const next = [...h.slice(0, historyIdx + 1), path];
        setHistoryIdx(next.length - 1);
        return next;
      });
    }
  }, [historyIdx]);

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      navigate(history[idx], false);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      navigate(history[idx], false);
    }
  };

  const goUp = () => {
    const parent = getParent(currentPath);
    if (parent !== currentPath) navigate(parent);
  };

  // ── Breadcrumbs ──
  const breadcrumbs = (() => {
    if (!currentPath) return [];
    const parts = currentPath.replace(/[/\\]+$/, "").split(/[/\\]/);
    return parts.map((p, i) => ({
      label: i === 0 ? (p || "raíz") : p,
      path: parts.slice(0, i + 1).join("\\") + (i === 0 ? "\\" : ""),
    }));
  })();

  // ── Entries visible ──
  const visible = [...entries]
    .filter((e) => showHidden ? true : !e.name.startsWith("."))
    .filter((e) => search ? e.name.toLowerCase().includes(search.toLowerCase()) : true)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "modified") cmp = (a.modified || "").localeCompare(b.modified || "");
      else if (sortBy === "type") cmp = (a.ext || "").localeCompare(b.ext || "");
      else if (sortBy === "size") cmp = (a.size || "").localeCompare(b.size || "");
      return sortAsc ? cmp : -cmp;
    });

  // ── Selection ──
  const toggleSelect = (path, e) => {
    if (e?.shiftKey && selected.length > 0) {
      const paths = visible.map((e) => e.path);
      const a = paths.indexOf(selected[selected.length - 1]);
      const b = paths.indexOf(path);
      const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
      setSelected([...new Set([...selected, ...paths.slice(lo, hi + 1)])]);
    } else if (e?.ctrlKey || e?.metaKey) {
      setSelected((s) => s.includes(path) ? s.filter((p) => p !== path) : [...s, path]);
    } else {
      setSelected([path]);
    }
  };

  // ── Open ──
  const openItem = async (node) => {
    if (node.type === "folder") {
      navigate(node.path);
    } else {
      const res = await api.openFile(node.path);
      if (res?.error) showToast("No se pudo abrir el archivo", "error");
    }
  };

  // ── Create ──
  const startCreate = (type) => {
    setCreating(type);
    setCreateName(type === "folder" ? "Nueva Carpeta" : "Nuevo Archivo.txt");
    setTimeout(() => createRef.current?.select(), 60);
  };

  const confirmCreate = async () => {
    if (!createName.trim()) { setCreating(null); return; }
    const newPath = joinPath(currentPath, createName.trim());
    const res = creating === "folder"
      ? await api.createFolder(newPath)
      : await api.createFile(newPath);
    if (res?.error) { showToast(res.error, "error"); }
    else {
      showToast(`"${createName}" creado`, "success");
      navigate(currentPath, false);
    }
    setCreating(null);
  };

  // ── Rename ──
  const startRename = (node) => {
    setRenaming(node.path);
    setRenameVal(node.name);
    setTimeout(() => { if (renameRef.current) { renameRef.current.select(); } }, 60);
  };

  const confirmRename = async () => {
    if (!renameVal.trim() || !renaming) { setRenaming(null); return; }
    const parent = getParent(renaming);
    const newPath = joinPath(parent, renameVal.trim());
    if (newPath === renaming) { setRenaming(null); return; }
    const res = await api.renameItem(renaming, newPath);
    if (res?.error) showToast(res.error, "error");
    else { showToast(`Renombrado a "${renameVal}"`, "success"); navigate(currentPath, false); }
    setRenaming(null);
  };

  // ── Delete ──
  const deleteItems = async (paths) => {
    for (const p of paths) {
      const res = await api.deleteItem(p);
      if (res?.error) { showToast(`Error: ${res.error}`, "error"); return; }
    }
    showToast(`${paths.length} elemento(s) eliminado(s)`, "warning");
    setSelected([]);
    navigate(currentPath, false);
  };

  // ── Copy / Paste ──
  const copyItems = (op = "copy") => {
    setClipboard({ paths: selected, op });
    showToast(`${selected.length} elemento(s) ${op === "copy" ? "copiado(s)" : "cortado(s)"}`, "info");
  };

  const pasteItems = async () => {
    if (!clipboard) return;
    for (const srcPath of clipboard.paths) {
      const name = srcPath.split(/[/\\]/).pop();
      const destPath = joinPath(currentPath, name);
      const res = clipboard.op === "copy"
        ? await api.copyItem(srcPath, destPath)
        : await api.moveItem(srcPath, destPath);
      if (res?.error) { showToast(res.error, "error"); return; }
    }
    showToast(`Pegado(s) ${clipboard.paths.length} elemento(s)`, "success");
    if (clipboard.op === "cut") setClipboard(null);
    navigate(currentPath, false);
  };

  // ── Properties ──
  const showProperties = async (itemPath) => {
    setProperties(itemPath);
    const res = await api.getProperties(itemPath);
    setPropData(res);
  };

  // ── Context Menu ──
  const showCtxMenu = (e, path) => {
    e.preventDefault();
    if (!selected.includes(path)) setSelected([path]);
    setCtxMenu({ x: e.clientX, y: e.clientY, path });
  };

  const showBgCtxMenu = (e) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, path: null });
  };

  // ── Seleccionar todo / Deseleccionar ──
  const selectAll = () => setSelected(visible.map((e) => e.path));
  const deselectAll = () => setSelected([]);

  // ── Duplicar ──
  const duplicateItems = async (paths) => {
    for (const p of paths) {
      const res = await api.duplicateItem(p);
      if (res?.error) { showToast(`Error: ${res.error}`, "error"); return; }
    }
    showToast(`${paths.length} elemento(s) duplicado(s)`, "success");
    navigate(currentPath, false);
  };

  // ── Cambiar permisos ──
  const toggleReadOnly = async (itemPath, currentReadOnly) => {
    const res = await api.changePermissions(itemPath, !currentReadOnly);
    if (res?.error) showToast(res.error, "error");
    else {
      showToast(`Permisos actualizados`, "success");
      navigate(currentPath, false);
    }
  };

  // ── Comprimir ──
  const compressItems = async (paths) => {
    for (const p of paths) {
      const res = await api.compressItem(p);
      if (res?.error) { showToast(res.error, "error"); return; }
    }
    showToast(`${paths.length} elemento(s) comprimido(s)`, "success");
    navigate(currentPath, false);
  };

  // ── Extraer ZIP ──
  const extractZip = async (zipPath) => {
    const res = await api.extractItem(zipPath, currentPath);
    if (res?.error) showToast(res.error, "error");
    else { showToast("Archivo extraído", "success"); navigate(currentPath, false); }
  };

  useEffect(() => {
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handle = (e) => {
      if (renaming || creating) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT") return;
      if (e.key === "F2" && selected.length === 1) {
        const node = entries.find((n) => n.path === selected[0]);
        if (node) startRename(node);
      }
      if (e.key === "Delete" && selected.length > 0) deleteItems(selected);
      if ((e.ctrlKey || e.metaKey) && e.key === "c") copyItems("copy");
      if ((e.ctrlKey || e.metaKey) && e.key === "x") copyItems("cut");
      if ((e.ctrlKey || e.metaKey) && e.key === "v") pasteItems();
      if ((e.ctrlKey || e.metaKey) && e.key === "a") { e.preventDefault(); selectAll(); }
      if (e.key === "Escape") deselectAll();
      if (e.key === "Backspace") goBack();
      if (e.key === "F5") navigate(currentPath, false);
      if ((e.ctrlKey || e.metaKey) && e.key === "d") { e.preventDefault(); selected.length && duplicateItems(selected); }
      if ((e.ctrlKey || e.metaKey) && e.key === "h") { e.preventDefault(); setShowHidden((s) => !s); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [renaming, creating, selected, entries, visible, clipboard, currentPath]);

  const sidebarItems = [
    { label: "Inicio", path: specialPaths.home, icon: "🏠" },
    { label: "Escritorio", path: specialPaths.desktop, icon: "🖥️" },
    { label: "Documentos", path: specialPaths.documents, icon: "📁" },
    { label: "Descargas", path: specialPaths.downloads, icon: "⬇️" },
    { label: "Imágenes", path: specialPaths.pictures, icon: "🖼️" },
    { label: "Música", path: specialPaths.music, icon: "🎵" },
    { label: "Videos", path: specialPaths.videos, icon: "🎬" },
  ];

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* TITLEBAR */}
      <div style={S.titlebar} className="drag-region">
        <div style={S.titlebarLeft}>
          <span style={S.appName}>⬡ NexusFiles</span>
          <span style={S.osBadge}>Windows</span>
        </div>
        <div style={S.titlebarCenter}>
          <span style={{ opacity: 0.35, fontSize: 11 }}>{currentPath}</span>
        </div>
        <div style={S.winControls} className="no-drag">
          <button style={S.winBtn} onClick={() => api.minimize()} title="Minimizar">─</button>
          <button style={S.winBtn} onClick={() => api.maximize()} title="Maximizar">□</button>
          <button style={{ ...S.winBtn, ...S.winClose }} onClick={() => api.close()} title="Cerrar">✕</button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={S.toolbar}>
        <div style={S.toolbarGroup}>
          <button style={S.iconBtn} onClick={goBack} disabled={historyIdx <= 0} title="Atrás">←</button>
          <button style={S.iconBtn} onClick={goForward} disabled={historyIdx >= history.length - 1} title="Adelante">→</button>
          <button style={S.iconBtn} onClick={goUp} title="Subir">↑</button>
          <button style={S.iconBtn} onClick={() => navigate(currentPath, false)} title="Actualizar (F5)">↺</button>
        </div>
        <div style={S.breadcrumbs}>
          {breadcrumbs.map((bc, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {i > 0 && <span style={{ color: "#ffffff25", fontSize: 12 }}>›</span>}
              <button style={{ ...S.breadBtn, fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}
                onClick={() => navigate(bc.path)}>{bc.label}</button>
            </span>
          ))}
        </div>
        <div style={S.searchBox}>
          <span style={{ opacity: 0.4, marginRight: 6, fontSize: 13 }}>🔍</span>
          <input style={S.searchInput} placeholder="Buscar en esta carpeta…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setSearch("")} />
          {search && <button style={S.clearBtn} onClick={() => setSearch("")}>×</button>}
        </div>
        <div style={S.toolbarGroup}>
          <button style={{ ...S.iconBtn, ...(viewMode === "grid" ? S.activeBtn : {}) }} onClick={() => setViewMode("grid")} title="Cuadrícula">⊞</button>
          <button style={{ ...S.iconBtn, ...(viewMode === "list" ? S.activeBtn : {}) }} onClick={() => setViewMode("list")} title="Lista">☰</button>
        </div>
      </div>

      {/* ACTION BAR */}
      <div style={S.actionBar}>
        <button style={S.actionBtn} onClick={() => startCreate("folder")}>＋ Carpeta</button>
        <button style={S.actionBtn} onClick={() => setCreatingWithExt(true)}>＋ Archivo</button>
        <div style={S.sep} />
        <button style={S.actionBtn} onClick={selectAll} title="Ctrl+A">✔ Todo</button>
        <button style={S.actionBtn} onClick={deselectAll} title="Esc">✕ Deseleccionar</button>
        <div style={S.sep} />
        <button style={{ ...S.actionBtn, ...S.dangerBtn }} onClick={() => selected.length && deleteItems(selected)} disabled={!selected.length}>🗑 Eliminar</button>
        <button style={S.actionBtn} onClick={() => selected.length && duplicateItems(selected)} disabled={!selected.length} title="Ctrl+D">📋 Duplicar</button>
        <button style={S.actionBtn} onClick={() => copyItems("copy")} disabled={!selected.length}>⎘ Copiar</button>
        <button style={S.actionBtn} onClick={() => copyItems("cut")} disabled={!selected.length}>✂ Cortar</button>
        <button style={S.actionBtn} onClick={pasteItems} disabled={!clipboard}>⎙ Pegar</button>
        <button style={S.actionBtn} onClick={() => selected.length && compressItems(selected)} disabled={!selected.length} title="Comprimir a ZIP">📦 ZIP</button>
        <div style={S.sep} />
        <button style={{ ...S.actionBtn, ...(showHidden ? S.activeBtn : {}) }} onClick={() => setShowHidden((s) => !s)} title="Ctrl+H">👁 Ocultos</button>
        <select style={S.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Nombre</option>
          <option value="modified">Modificado</option>
          <option value="type">Tipo</option>
          <option value="size">Tamaño</option>
        </select>
        <button style={S.iconBtn} onClick={() => setSortAsc((a) => !a)}>{sortAsc ? "↑" : "↓"}</button>
      </div>

      {/* BODY */}
      <div style={S.body}>
        {/* SIDEBAR */}
        <aside style={S.sidebar}>
          <div style={S.sideSection}>ACCESOS RÁPIDOS</div>
          {sidebarItems.map((s) => s.path && (
            <button key={s.path} style={{ ...S.sideBtn, ...(currentPath === s.path ? S.sideBtnActive : {}) }}
              onClick={() => navigate(s.path)}>
              <span>{s.icon}</span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</span>
            </button>
          ))}
          <div style={{ ...S.sideSection, marginTop: 14 }}>UNIDADES</div>
          {drives.map((d) => (
            <button key={d.path} style={{ ...S.sideBtn, ...(currentPath.startsWith(d.path) ? S.sideBtnActive : {}) }}
              onClick={() => navigate(d.path)}>
              <span>💾</span><span>{d.label}</span>
            </button>
          ))}
        </aside>

        {/* MAIN */}
        <main ref={mainRef} style={S.main} onContextMenu={showBgCtxMenu}
          onClick={(e) => { if (e.target === mainRef.current) setSelected([]); }}>

          {creatingWithExt && (
            <div style={S.overlay}>
              <div style={S.dialog}>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#a5b4fc" }}>
                  📄 Nuevo Archivo
                </p>
                <input ref={createRef} style={S.createInput} value={createName} placeholder="nombre.txt"
                  onChange={(e) => setCreateName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!createName.trim()) return;
                      const newPath = joinPath(currentPath, createName.trim());
                      api.createFile(newPath).then((res) => {
                        if (res?.error) { showToast(res.error, "error"); }
                        else {
                          showToast(`"${createName}" creado`, "success");
                          navigate(currentPath, false);
                        }
                        setCreatingWithExt(false);
                        setCreateName("");
                      });
                    }
                    if (e.key === "Escape") { setCreatingWithExt(false); setCreateName(""); }
                  }} />
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button style={S.confirmBtn} onClick={() => {
                    if (!createName.trim()) return;
                    const newPath = joinPath(currentPath, createName.trim());
                    api.createFile(newPath).then((res) => {
                      if (res?.error) { showToast(res.error, "error"); }
                      else {
                        showToast(`"${createName}" creado`, "success");
                        navigate(currentPath, false);
                      }
                      setCreatingWithExt(false);
                      setCreateName("");
                    });
                  }}>Crear</button>
                  <button style={S.cancelBtn} onClick={() => { setCreatingWithExt(false); setCreateName(""); }}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {creating && (
            <div style={S.overlay}>
              <div style={S.dialog}>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#a5b4fc" }}>
                  Nuevo {creating === "folder" ? "📁 Carpeta" : "📄 Archivo"}
                </p>
                <input ref={createRef} style={S.createInput} value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") confirmCreate(); if (e.key === "Escape") setCreating(null); }} />
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button style={S.confirmBtn} onClick={confirmCreate}>Crear</button>
                  <button style={S.cancelBtn} onClick={() => setCreating(null)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {loading && <div style={S.loadingBar}><div style={S.loadingFill} /></div>}
          {error && <div style={S.errorBox}>⚠️ {error}</div>}

          {!loading && !error && (
            viewMode === "grid" ? (
              <div style={S.grid}>
                {visible.map((node) => {
                  const f = node.type === "folder" ? { icon: "📁", color: "#fbbf24" } : ft(node.ext);
                  const isSel = selected.includes(node.path);
                  return (
                    <div key={node.path}
                      style={{ ...S.card, background: isSel ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.03)", borderColor: isSel ? "#6366f1" : "rgba(255,255,255,0.06)", boxShadow: isSel ? "0 0 0 2px #6366f180" : "none" }}
                      className="file-card"
                      onClick={(e) => toggleSelect(node.path, e)}
                      onDoubleClick={() => openItem(node)}
                      onContextMenu={(e) => showCtxMenu(e, node.path)}>
                      <div style={{ fontSize: 34, color: f.color, lineHeight: 1, marginBottom: 4 }}>{f.icon}</div>
                      {renaming === node.path ? (
                        <input ref={renameRef} style={S.renameInput} value={renameVal}
                          onChange={(e) => setRenameVal(e.target.value)}
                          onBlur={confirmRename}
                          onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenaming(null); }}
                          onClick={(e) => e.stopPropagation()} />
                      ) : (
                        <span style={S.cardName} title={node.name}>{node.name}</span>
                      )}
                      {node.type === "file" && node.ext && (
                        <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 10, fontWeight: 700, marginTop: 2, background: f.color + "30", color: f.color }}>
                          {node.ext.toUpperCase()}
                        </span>
                      )}
                      {node.type === "folder" && <span style={{ fontSize: 9, color: "#ffffff35", marginTop: 2 }}>Carpeta</span>}
                    </div>
                  );
                })}
                {visible.length === 0 && !loading && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, opacity: 0.3, fontSize: 16 }}>📂 Carpeta vacía</div>
                )}
              </div>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr>
                    {[["name","Nombre"],["type","Tipo"],["size","Tamaño"],["modified","Modificado"]].map(([col, label]) => (
                      <th key={col} style={S.th} onClick={() => { if (sortBy === col) setSortAsc((a) => !a); else { setSortBy(col); setSortAsc(true); } }}>
                        {label} {sortBy === col ? (sortAsc ? "↑" : "↓") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((node) => {
                    const f = node.type === "folder" ? { icon: "📁", color: "#fbbf24", label: "Carpeta" } : { ...ft(node.ext), label: node.ext?.toUpperCase() || "Archivo" };
                    return (
                      <tr key={node.path} className="list-row"
                        style={{ background: selected.includes(node.path) ? "rgba(99,102,241,0.2)" : "transparent", cursor: "pointer" }}
                        onClick={(e) => toggleSelect(node.path, e)}
                        onDoubleClick={() => openItem(node)}
                        onContextMenu={(e) => showCtxMenu(e, node.path)}>
                        <td style={S.td}>
                          <span style={{ color: f.color, marginRight: 8 }}>{f.icon}</span>
                          {renaming === node.path ? (
                            <input ref={renameRef} style={{ ...S.renameInput, display: "inline" }} value={renameVal}
                              onChange={(e) => setRenameVal(e.target.value)}
                              onBlur={confirmRename}
                              onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setRenaming(null); }}
                              onClick={(e) => e.stopPropagation()} />
                          ) : node.name}
                        </td>
                        <td style={{ ...S.td, color: f.color, fontSize: 12 }}>{f.label}</td>
                        <td style={{ ...S.td, opacity: 0.6, fontSize: 12 }}>{node.size || "—"}</td>
                        <td style={{ ...S.td, opacity: 0.6, fontSize: 12 }}>{node.modified || "—"}</td>
                      </tr>
                    );
                  })}
                  {visible.length === 0 && (
                    <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", padding: 40, opacity: 0.3 }}>Carpeta vacía</td></tr>
                  )}
                </tbody>
              </table>
            )
          )}
        </main>

        {/* PROPERTIES PANEL */}
        {properties && (
          <div style={S.propPanel}>
            <div style={S.propHeader}>
              <span style={{ fontSize: 24 }}>
                {entries.find((e) => e.path === properties)?.type === "folder" ? "📁" : ft(entries.find((e) => e.path === properties)?.ext).icon}
              </span>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {entries.find((e) => e.path === properties)?.name}
                </div>
                <div style={{ fontSize: 11, opacity: 0.4 }}>Propiedades</div>
              </div>
              <button style={S.closeBtn} onClick={() => { setProperties(null); setPropData(null); }}>✕</button>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Ruta", properties],
                ["Tipo", propData?.isDirectory ? "Carpeta" : "Archivo"],
                ["Tamaño", propData ? formatBytes(propData.size) : "…"],
                ["Creado", propData ? new Date(propData.created).toLocaleString("es-CO") : "…"],
                ["Modificado", propData ? new Date(propData.modified).toLocaleString("es-CO") : "…"],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ opacity: 0.45, fontSize: 11 }}>{label}</span>
                  <span style={{ fontWeight: 500, fontSize: 12, wordBreak: "break-all" }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#1a1a2e", borderRadius: 6 }}>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>
                    {propData?.isReadOnly ? "🔒 Solo lectura" : "🔓 Editable"}
                  </span>
                  <button style={{ ...S.smallBtn, fontSize: 10, padding: "2px 8px" }} onClick={() => {
                    if (properties) {
                      toggleReadOnly(properties, propData?.isReadOnly);
                      setPropData((p) => ({ ...p, isReadOnly: !p?.isReadOnly }));
                    }
                  }}>
                    {propData?.isReadOnly ? "Permitir" : "Bloquear"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STATUS BAR */}
      <div style={S.statusBar}>
        <span>{selected.length > 0 ? `${selected.length} seleccionado(s) de ${visible.length}` : `${visible.length} elemento(s)`}</span>
        {clipboard && <span style={{ color: "#a5b4fc" }}>📋 {clipboard.paths.length} en portapapeles ({clipboard.op === "copy" ? "copiar" : "cortar"})</span>}
        <span style={{ marginLeft: "auto", opacity: 0.3, fontSize: 11 }}>{currentPath}</span>
      </div>

      {/* CONTEXT MENU */}
      {ctxMenu && (
        <div style={{ ...S.ctxMenu, left: ctxMenu.x, top: ctxMenu.y }} onClick={(e) => e.stopPropagation()}>
          {ctxMenu.path && <CtxItem label="↗ Abrir" onClick={() => { const n = entries.find((e) => e.path === ctxMenu.path); if (n) openItem(n); }} />}
          {ctxMenu.path && selected.length === 1 && <CtxItem label="✏️ Renombrar (F2)" onClick={() => { const n = entries.find((e) => e.path === ctxMenu.path); if (n) startRename(n); }} />}
          <CtxItem label="⎘ Copiar" onClick={() => copyItems("copy")} disabled={!selected.length} />
          <CtxItem label="✂ Cortar" onClick={() => copyItems("cut")} disabled={!selected.length} />
          <CtxItem label="⎙ Pegar" onClick={pasteItems} disabled={!clipboard} />
          <CtxItem label="📋 Duplicar (Ctrl+D)" onClick={() => selected.length && duplicateItems(selected)} disabled={!selected.length} />
          <div style={S.ctxDiv} />
          <CtxItem label="＋ Nueva Carpeta" onClick={() => startCreate("folder")} />
          <CtxItem label="＋ Nuevo Archivo" onClick={() => setCreatingWithExt(true)} />
          <div style={S.ctxDiv} />
          <CtxItem label="📦 Comprimir (ZIP)" onClick={() => selected.length && compressItems(selected)} disabled={!selected.length} />
          {ctxMenu.path && ctxMenu.path.toLowerCase().endsWith(".zip") && (
            <CtxItem label="📂 Extraer aquí" onClick={() => extractZip(ctxMenu.path)} />
          )}
          <div style={S.ctxDiv} />
          <CtxItem label="🗑 Eliminar (Del)" onClick={() => selected.length && deleteItems(selected)} danger disabled={!selected.length} />
          {ctxMenu.path && (
            <CtxItem label={propData?.isReadOnly ? "🔓 Permitir edición" : "🔒 Solo lectura"} onClick={() => toggleReadOnly(ctxMenu.path, propData?.isReadOnly)} />
          )}
          <div style={S.ctxDiv} />
          <CtxItem label="ℹ️ Propiedades" onClick={() => showProperties(ctxMenu.path || currentPath)} />
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ ...S.toast, borderColor: { info: "#6366f1", success: "#22c55e", warning: "#f59e0b", error: "#ef4444" }[toast.type] }}>
          <div style={{ width: 4, borderRadius: 4, background: { info: "#6366f1", success: "#22c55e", warning: "#f59e0b", error: "#ef4444" }[toast.type], alignSelf: "stretch" }} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}

const CtxItem = ({ label, onClick, danger, disabled }) => (
  <button style={{ ...S.ctxItem, ...(danger ? { color: "#fca5a5" } : {}), opacity: disabled ? 0.4 : 1 }}
    className="ctx-item" onClick={disabled ? undefined : onClick} disabled={disabled}>{label}</button>
);

const formatBytes = (b) => {
  if (!b && b !== 0) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
};

const S = {
  root: { display: "flex", flexDirection: "column", height: "100vh", width: "100%", background: "#0d0d14", color: "#e2e8f0", fontFamily: "'JetBrains Mono','Cascadia Code',monospace", fontSize: 13, overflow: "hidden", userSelect: "none" },
  titlebar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 0 16px", height: 38, background: "linear-gradient(90deg,#12121e,#1a1a2e)", borderBottom: "1px solid #ffffff0f", WebkitAppRegion: "drag" },
  titlebarLeft: { display: "flex", alignItems: "center", gap: 10 },
  appName: { fontWeight: 700, fontSize: 14, color: "#a5b4fc", letterSpacing: 2 },
  osBadge: { fontSize: 10, background: "#6366f120", color: "#a5b4fc", padding: "2px 8px", borderRadius: 20, border: "1px solid #6366f140" },
  titlebarCenter: { position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: 11, pointerEvents: "none" },
  winControls: { display: "flex", WebkitAppRegion: "no-drag" },
  winBtn: { width: 46, height: 38, background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13, transition: "background .15s" },
  winClose: { color: "#fca5a5" },
  toolbar: { display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#111120", borderBottom: "1px solid #ffffff08" },
  toolbarGroup: { display: "flex", gap: 2 },
  iconBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#c7d2fe", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 14, transition: "all .15s" },
  activeBtn: { background: "rgba(99,102,241,0.3)", color: "#a5b4fc" },
  breadcrumbs: { display: "flex", alignItems: "center", gap: 2, flex: 1, overflow: "hidden" },
  breadBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px 6px", borderRadius: 4, fontSize: 12, transition: "all .15s", whiteSpace: "nowrap" },
  searchBox: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "4px 10px", width: 220 },
  searchInput: { background: "none", border: "none", color: "#e2e8f0", outline: "none", fontSize: 12, width: "100%" },
  clearBtn: { background: "none", border: "none", color: "#666", cursor: "pointer", padding: "0 2px", fontSize: 15 },
  actionBar: { display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", background: "#0e0e1c", borderBottom: "1px solid #ffffff06", flexWrap: "wrap" },
  actionBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#c7d2fe", borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontSize: 11, transition: "all .15s" },
  dangerBtn: { color: "#fca5a5", borderColor: "#ef444430" },
  sep: { width: 1, height: 18, background: "#ffffff10", margin: "0 4px" },
  sortSelect: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#c7d2fe", borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer" },
  body: { display: "flex", flex: 1, overflow: "hidden" },
  sidebar: { width: 175, background: "#0c0c1a", borderRight: "1px solid #ffffff06", padding: "8px 0", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 },
  sideSection: { padding: "8px 14px 4px", fontSize: 9, letterSpacing: 2, color: "#ffffff30", fontWeight: 700 },
  sideBtn: { display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", width: "100%", textAlign: "left", fontSize: 12, transition: "all .15s" },
  sideBtnActive: { background: "rgba(99,102,241,0.15)", color: "#a5b4fc", borderLeft: "2px solid #6366f1" },
  main: { flex: 1, overflowY: "auto", padding: 16, position: "relative" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 },
  card: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 8px 8px", borderRadius: 10, border: "1px solid transparent", cursor: "pointer", transition: "all .15s", textAlign: "center" },
  cardName: { fontSize: 11, color: "#e2e8f0", wordBreak: "break-word", lineHeight: 1.3, maxWidth: "100%" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "6px 12px", textAlign: "left", fontSize: 11, color: "#6366f1", borderBottom: "1px solid #ffffff08", cursor: "pointer", fontWeight: 600, letterSpacing: 1 },
  td: { padding: "7px 12px", borderBottom: "1px solid #ffffff04", fontSize: 13, verticalAlign: "middle" },
  renameInput: { background: "#1a1a2e", border: "1px solid #6366f1", color: "#e2e8f0", borderRadius: 4, padding: "2px 6px", fontSize: 11, outline: "none", width: "90%" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, backdropFilter: "blur(4px)" },
  dialog: { background: "#16162a", border: "1px solid #6366f140", borderRadius: 12, padding: "20px 24px", minWidth: 280, boxShadow: "0 20px 60px #0008" },
  createInput: { width: "100%", background: "#0d0d14", border: "1px solid #6366f1", color: "#e2e8f0", borderRadius: 6, padding: "6px 10px", fontSize: 13, outline: "none", boxSizing: "border-box" },
  confirmBtn: { background: "#6366f1", border: "none", color: "#fff", borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontSize: 12 },
  cancelBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 12 },
  propPanel: { width: 220, background: "#0e0e1c", borderLeft: "1px solid #ffffff06", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" },
  propHeader: { display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 10px", borderBottom: "1px solid #ffffff08" },
  closeBtn: { background: "none", border: "none", color: "#6b7280", cursor: "pointer", marginLeft: "auto", fontSize: 16 },
  smallBtn: { background: "rgba(99,102,241,0.3)", border: "1px solid rgba(99,102,241,0.5)", color: "#a5b4fc", borderRadius: 4, cursor: "pointer", transition: "all .15s" },
  statusBar: { display: "flex", alignItems: "center", gap: 16, padding: "4px 16px", background: "#0a0a12", borderTop: "1px solid #ffffff06", fontSize: 11, color: "#64748b", minHeight: 26 },
  ctxMenu: { position: "fixed", background: "#16162a", border: "1px solid #6366f130", borderRadius: 10, padding: "4px 0", zIndex: 1000, minWidth: 190, boxShadow: "0 16px 48px #000a" },
  ctxItem: { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: "#c7d2fe", padding: "7px 16px", cursor: "pointer", fontSize: 12, transition: "background .1s" },
  ctxDiv: { height: 1, background: "#ffffff08", margin: "3px 0" },
  toast: { position: "fixed", bottom: 40, right: 24, zIndex: 2000, background: "#16162a", border: "1px solid", borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#e2e8f0", boxShadow: "0 8px 32px #000a", display: "flex", alignItems: "center", gap: 10, animation: "toastIn .2s ease" },
  loadingBar: { height: 2, background: "#6366f120", borderRadius: 2, marginBottom: 12, overflow: "hidden" },
  loadingFill: { height: "100%", width: "40%", background: "#6366f1", borderRadius: 2, animation: "loading 1s infinite" },
  errorBox: { background: "rgba(239,68,68,0.1)", border: "1px solid #ef444440", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13 },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #6366f140; border-radius: 3px; }
  .file-card:hover { background: rgba(99,102,241,0.12) !important; border-color: rgba(99,102,241,0.3) !important; transform: translateY(-1px); }
  .list-row:hover { background: rgba(99,102,241,0.08) !important; }
  .ctx-item:hover { background: rgba(99,102,241,0.15) !important; }
  button:hover:not(:disabled) { opacity: 0.85; }
  @keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes loading { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
  select option { background: #16162a; }
  .drag-region { -webkit-app-region: drag; }
  .no-drag { -webkit-app-region: no-drag; }
`;

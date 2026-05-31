
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Simulated Filesystem ────────────────────────────────────────────────────
const createFS = () => ({
  "/": {
    type: "folder", name: "root", modified: "2026-05-01", size: null,
    children: ["home", "usr", "etc", "var", "tmp"]
  },
  "/home": {
    type: "folder", name: "home", modified: "2026-05-20", size: null,
    children: ["usuario"]
  },
  "/home/usuario": {
    type: "folder", name: "usuario", modified: "2026-05-29", size: null,
    children: ["Documents", "Downloads", "Pictures", "Music", "Videos", "Projects", "Desktop"]
  },
  "/home/usuario/Documents": {
    type: "folder", name: "Documents", modified: "2026-05-28", size: null,
    children: ["Tesis.docx", "Apuntes_SO.pdf", "Presupuesto.xlsx", "Notas.txt", "Contratos"]
  },
  "/home/usuario/Documents/Contratos": {
    type: "folder", name: "Contratos", modified: "2026-04-10", size: null,
    children: ["Contrato_2026.pdf", "NDA.docx"]
  },
  "/home/usuario/Documents/Tesis.docx": { type: "file", name: "Tesis.docx", ext: "docx", modified: "2026-05-25", size: "2.4 MB" },
  "/home/usuario/Documents/Apuntes_SO.pdf": { type: "file", name: "Apuntes_SO.pdf", ext: "pdf", modified: "2026-05-20", size: "1.1 MB" },
  "/home/usuario/Documents/Presupuesto.xlsx": { type: "file", name: "Presupuesto.xlsx", ext: "xlsx", modified: "2026-04-30", size: "340 KB" },
  "/home/usuario/Documents/Notas.txt": { type: "file", name: "Notas.txt", ext: "txt", modified: "2026-05-29", size: "12 KB" },
  "/home/usuario/Documents/Contratos/Contrato_2026.pdf": { type: "file", name: "Contrato_2026.pdf", ext: "pdf", modified: "2026-03-01", size: "890 KB" },
  "/home/usuario/Documents/Contratos/NDA.docx": { type: "file", name: "NDA.docx", ext: "docx", modified: "2026-02-14", size: "210 KB" },
  "/home/usuario/Downloads": {
    type: "folder", name: "Downloads", modified: "2026-05-29", size: null,
    children: ["ubuntu-24.04.iso", "setup.exe", "react-docs.zip", "photo_edit.png", "song.mp3"]
  },
  "/home/usuario/Downloads/ubuntu-24.04.iso": { type: "file", name: "ubuntu-24.04.iso", ext: "iso", modified: "2026-05-10", size: "4.7 GB" },
  "/home/usuario/Downloads/setup.exe": { type: "file", name: "setup.exe", ext: "exe", modified: "2026-05-15", size: "85 MB" },
  "/home/usuario/Downloads/react-docs.zip": { type: "file", name: "react-docs.zip", ext: "zip", modified: "2026-05-18", size: "12 MB" },
  "/home/usuario/Downloads/photo_edit.png": { type: "file", name: "photo_edit.png", ext: "png", modified: "2026-05-22", size: "3.2 MB" },
  "/home/usuario/Downloads/song.mp3": { type: "file", name: "song.mp3", ext: "mp3", modified: "2026-05-27", size: "6.8 MB" },
  "/home/usuario/Pictures": {
    type: "folder", name: "Pictures", modified: "2026-05-28", size: null,
    children: ["Vacaciones", "wallpaper.jpg", "avatar.png", "screenshot.png"]
  },
  "/home/usuario/Pictures/Vacaciones": {
    type: "folder", name: "Vacaciones", modified: "2026-04-20", size: null,
    children: ["playa01.jpg", "playa02.jpg", "montaña.jpg"]
  },
  "/home/usuario/Pictures/Vacaciones/playa01.jpg": { type: "file", name: "playa01.jpg", ext: "jpg", modified: "2026-04-15", size: "4.1 MB" },
  "/home/usuario/Pictures/Vacaciones/playa02.jpg": { type: "file", name: "playa02.jpg", ext: "jpg", modified: "2026-04-15", size: "3.9 MB" },
  "/home/usuario/Pictures/Vacaciones/montaña.jpg": { type: "file", name: "montaña.jpg", ext: "jpg", modified: "2026-04-16", size: "5.2 MB" },
  "/home/usuario/Pictures/wallpaper.jpg": { type: "file", name: "wallpaper.jpg", ext: "jpg", modified: "2026-05-01", size: "8.7 MB" },
  "/home/usuario/Pictures/avatar.png": { type: "file", name: "avatar.png", ext: "png", modified: "2026-03-10", size: "1.2 MB" },
  "/home/usuario/Pictures/screenshot.png": { type: "file", name: "screenshot.png", ext: "png", modified: "2026-05-28", size: "2.1 MB" },
  "/home/usuario/Music": {
    type: "folder", name: "Music", modified: "2026-05-15", size: null,
    children: ["Lo-fi Beats", "Classics", "playlist.m3u"]
  },
  "/home/usuario/Music/Lo-fi Beats": {
    type: "folder", name: "Lo-fi Beats", modified: "2026-05-10", size: null,
    children: ["track01.mp3", "track02.mp3", "track03.flac"]
  },
  "/home/usuario/Music/Lo-fi Beats/track01.mp3": { type: "file", name: "track01.mp3", ext: "mp3", modified: "2026-05-01", size: "7.2 MB" },
  "/home/usuario/Music/Lo-fi Beats/track02.mp3": { type: "file", name: "track02.mp3", ext: "mp3", modified: "2026-05-02", size: "6.5 MB" },
  "/home/usuario/Music/Lo-fi Beats/track03.flac": { type: "file", name: "track03.flac", ext: "flac", modified: "2026-05-03", size: "24.1 MB" },
  "/home/usuario/Music/Classics": {
    type: "folder", name: "Classics", modified: "2026-04-01", size: null,
    children: ["beethoven.mp3", "mozart.mp3"]
  },
  "/home/usuario/Music/Classics/beethoven.mp3": { type: "file", name: "beethoven.mp3", ext: "mp3", modified: "2026-01-01", size: "9.4 MB" },
  "/home/usuario/Music/Classics/mozart.mp3": { type: "file", name: "mozart.mp3", ext: "mp3", modified: "2026-01-01", size: "8.1 MB" },
  "/home/usuario/Music/playlist.m3u": { type: "file", name: "playlist.m3u", ext: "m3u", modified: "2026-05-15", size: "2 KB" },
  "/home/usuario/Videos": {
    type: "folder", name: "Videos", modified: "2026-05-20", size: null,
    children: ["tutorial_react.mp4", "vacation_clip.mov", "demo.avi"]
  },
  "/home/usuario/Videos/tutorial_react.mp4": { type: "file", name: "tutorial_react.mp4", ext: "mp4", modified: "2026-05-20", size: "1.2 GB" },
  "/home/usuario/Videos/vacation_clip.mov": { type: "file", name: "vacation_clip.mov", ext: "mov", modified: "2026-04-18", size: "890 MB" },
  "/home/usuario/Videos/demo.avi": { type: "file", name: "demo.avi", ext: "avi", modified: "2026-03-30", size: "340 MB" },
  "/home/usuario/Projects": {
    type: "folder", name: "Projects", modified: "2026-05-29", size: null,
    children: ["file-explorer", "portfolio", "so-kernel"]
  },
  "/home/usuario/Projects/file-explorer": {
    type: "folder", name: "file-explorer", modified: "2026-05-29", size: null,
    children: ["src", "package.json", "README.md", ".gitignore"]
  },
  "/home/usuario/Projects/file-explorer/src": {
    type: "folder", name: "src", modified: "2026-05-29", size: null,
    children: ["App.jsx", "index.js", "styles.css"]
  },
  "/home/usuario/Projects/file-explorer/src/App.jsx": { type: "file", name: "App.jsx", ext: "jsx", modified: "2026-05-29", size: "18 KB" },
  "/home/usuario/Projects/file-explorer/src/index.js": { type: "file", name: "index.js", ext: "js", modified: "2026-05-29", size: "1 KB" },
  "/home/usuario/Projects/file-explorer/src/styles.css": { type: "file", name: "styles.css", ext: "css", modified: "2026-05-28", size: "4 KB" },
  "/home/usuario/Projects/file-explorer/package.json": { type: "file", name: "package.json", ext: "json", modified: "2026-05-25", size: "2 KB" },
  "/home/usuario/Projects/file-explorer/README.md": { type: "file", name: "README.md", ext: "md", modified: "2026-05-24", size: "5 KB" },
  "/home/usuario/Projects/file-explorer/.gitignore": { type: "file", name: ".gitignore", ext: "gitignore", modified: "2026-05-20", size: "1 KB" },
  "/home/usuario/Projects/portfolio": {
    type: "folder", name: "portfolio", modified: "2026-05-10", size: null,
    children: ["index.html", "style.css", "script.js"]
  },
  "/home/usuario/Projects/portfolio/index.html": { type: "file", name: "index.html", ext: "html", modified: "2026-05-10", size: "8 KB" },
  "/home/usuario/Projects/portfolio/style.css": { type: "file", name: "style.css", ext: "css", modified: "2026-05-10", size: "6 KB" },
  "/home/usuario/Projects/portfolio/script.js": { type: "file", name: "script.js", ext: "js", modified: "2026-05-09", size: "3 KB" },
  "/home/usuario/Projects/so-kernel": {
    type: "folder", name: "so-kernel", modified: "2026-05-15", size: null,
    children: ["kernel.c", "memory.c", "scheduler.c", "Makefile"]
  },
  "/home/usuario/Projects/so-kernel/kernel.c": { type: "file", name: "kernel.c", ext: "c", modified: "2026-05-14", size: "42 KB" },
  "/home/usuario/Projects/so-kernel/memory.c": { type: "file", name: "memory.c", ext: "c", modified: "2026-05-13", size: "28 KB" },
  "/home/usuario/Projects/so-kernel/scheduler.c": { type: "file", name: "scheduler.c", ext: "c", modified: "2026-05-12", size: "19 KB" },
  "/home/usuario/Projects/so-kernel/Makefile": { type: "file", name: "Makefile", ext: "makefile", modified: "2026-05-10", size: "3 KB" },
  "/home/usuario/Desktop": {
    type: "folder", name: "Desktop", modified: "2026-05-29", size: null,
    children: ["acceso_directo.lnk", "tareas_pendientes.txt"]
  },
  "/home/usuario/Desktop/acceso_directo.lnk": { type: "file", name: "acceso_directo.lnk", ext: "lnk", modified: "2026-05-01", size: "1 KB" },
  "/home/usuario/Desktop/tareas_pendientes.txt": { type: "file", name: "tareas_pendientes.txt", ext: "txt", modified: "2026-05-29", size: "3 KB" },
  "/usr": { type: "folder", name: "usr", modified: "2026-01-01", size: null, children: ["bin", "lib"] },
  "/usr/bin": { type: "folder", name: "bin", modified: "2026-01-01", size: null, children: ["bash", "python3", "gcc"] },
  "/usr/bin/bash": { type: "file", name: "bash", ext: "", modified: "2026-01-01", size: "1.2 MB" },
  "/usr/bin/python3": { type: "file", name: "python3", ext: "", modified: "2026-01-01", size: "3.4 MB" },
  "/usr/bin/gcc": { type: "file", name: "gcc", ext: "", modified: "2026-01-01", size: "8.9 MB" },
  "/usr/lib": { type: "folder", name: "lib", modified: "2026-01-01", size: null, children: [] },
  "/etc": { type: "folder", name: "etc", modified: "2026-05-01", size: null, children: ["hosts", "fstab", "passwd"] },
  "/etc/hosts": { type: "file", name: "hosts", ext: "", modified: "2026-05-01", size: "1 KB" },
  "/etc/fstab": { type: "file", name: "fstab", ext: "", modified: "2026-01-01", size: "2 KB" },
  "/etc/passwd": { type: "file", name: "passwd", ext: "", modified: "2026-05-01", size: "4 KB" },
  "/var": { type: "folder", name: "var", modified: "2026-05-29", size: null, children: ["log", "tmp"] },
  "/var/log": { type: "folder", name: "log", modified: "2026-05-29", size: null, children: ["syslog", "auth.log"] },
  "/var/log/syslog": { type: "file", name: "syslog", ext: "log", modified: "2026-05-29", size: "12 MB" },
  "/var/log/auth.log": { type: "file", name: "auth.log", ext: "log", modified: "2026-05-29", size: "4 MB" },
  "/var/tmp": { type: "folder", name: "tmp", modified: "2026-05-29", size: null, children: [] },
  "/tmp": { type: "folder", name: "tmp", modified: "2026-05-29", size: null, children: ["session_tmp.dat"] },
  "/tmp/session_tmp.dat": { type: "file", name: "session_tmp.dat", ext: "dat", modified: "2026-05-29", size: "128 KB" },
});

// ─── File Type Config ────────────────────────────────────────────────────────
const FILE_TYPES = {
  pdf: { icon: "📄", color: "#ff6b6b", label: "PDF" },
  docx: { icon: "📝", color: "#4dabf7", label: "Word" },
  doc: { icon: "📝", color: "#4dabf7", label: "Word" },
  xlsx: { icon: "📊", color: "#51cf66", label: "Excel" },
  xls: { icon: "📊", color: "#51cf66", label: "Excel" },
  txt: { icon: "📃", color: "#adb5bd", label: "Text" },
  md: { icon: "📋", color: "#74c0fc", label: "Markdown" },
  jpg: { icon: "🖼️", color: "#ffd43b", label: "Image" },
  jpeg: { icon: "🖼️", color: "#ffd43b", label: "Image" },
  png: { icon: "🖼️", color: "#ffd43b", label: "Image" },
  gif: { icon: "🎞️", color: "#ffd43b", label: "GIF" },
  mp3: { icon: "🎵", color: "#cc5de8", label: "Audio" },
  flac: { icon: "🎵", color: "#cc5de8", label: "Audio" },
  m3u: { icon: "🎵", color: "#cc5de8", label: "Playlist" },
  mp4: { icon: "🎬", color: "#ff8787", label: "Video" },
  mov: { icon: "🎬", color: "#ff8787", label: "Video" },
  avi: { icon: "🎬", color: "#ff8787", label: "Video" },
  zip: { icon: "📦", color: "#f08c00", label: "Archive" },
  iso: { icon: "💿", color: "#868e96", label: "Disk Image" },
  exe: { icon: "⚙️", color: "#e03131", label: "Executable" },
  jsx: { icon: "⚛️", color: "#61dafb", label: "React" },
  js: { icon: "📜", color: "#f7df1e", label: "JavaScript" },
  css: { icon: "🎨", color: "#264de4", label: "CSS" },
  html: { icon: "🌐", color: "#e34c26", label: "HTML" },
  json: { icon: "🔧", color: "#89e051", label: "JSON" },
  c: { icon: "⚙️", color: "#a8b9cc", label: "C Source" },
  py: { icon: "🐍", color: "#3572A5", label: "Python" },
  makefile: { icon: "🔨", color: "#427819", label: "Makefile" },
  log: { icon: "📋", color: "#868e96", label: "Log" },
  lnk: { icon: "🔗", color: "#adb5bd", label: "Shortcut" },
  dat: { icon: "💾", color: "#868e96", label: "Data" },
  gitignore: { icon: "🚫", color: "#f05032", label: "Git Ignore" },
  default: { icon: "📄", color: "#adb5bd", label: "File" },
};

const getFileType = (ext) => FILE_TYPES[ext?.toLowerCase()] || FILE_TYPES.default;

const SIDEBAR_SHORTCUTS = [
  { label: "Inicio", path: "/home/usuario", icon: "🏠" },
  { label: "Escritorio", path: "/home/usuario/Desktop", icon: "🖥️" },
  { label: "Documentos", path: "/home/usuario/Documents", icon: "📁" },
  { label: "Descargas", path: "/home/usuario/Downloads", icon: "⬇️" },
  { label: "Imágenes", path: "/home/usuario/Pictures", icon: "🖼️" },
  { label: "Música", path: "/home/usuario/Music", icon: "🎵" },
  { label: "Videos", path: "/home/usuario/Videos", icon: "🎬" },
  { label: "Proyectos", path: "/home/usuario/Projects", icon: "💻" },
];

// ─── Helper: path join ──────────────────────────────────────────────────────
const joinPath = (base, name) => (base === "/" ? `/${name}` : `${base}/${name}`);

const getParent = (path) => {
  if (path === "/") return "/";
  const parts = path.split("/");
  parts.pop();
  return parts.join("/") || "/";
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function FileExplorer() {
  const [fs, setFs] = useState(createFS);
  const [currentPath, setCurrentPath] = useState("/home/usuario");
  const [history, setHistory] = useState(["/home/usuario"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selected, setSelected] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [sortBy, setSortBy] = useState("name"); // name | type | modified | size
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const [creating, setCreating] = useState(null); // "folder" | "file"
  const [createName, setCreateName] = useState("");
  const [toast, setToast] = useState(null);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [clipboard, setClipboard] = useState(null); // { items, op }
  const [properties, setProperties] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [trash, setTrash] = useState([]);
  const [trashOpen, setTrashOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const mainRef = useRef(null);
  const renameRef = useRef(null);
  const createRef = useRef(null);

  // ── Derived: current folder entries ──
  const currentNode = fs[currentPath];
  const entries = currentNode?.children || [];

  const getEntryNodes = useCallback(() => {
    if (searchActive && search.trim()) return searchResults;
    return entries
      .map((name) => {
        const path = joinPath(currentPath, name);
        return { ...fs[path], path, name };
      })
      .filter(Boolean)
      .filter((e) =>
        search ? e.name.toLowerCase().includes(search.toLowerCase()) : true
      )
      .sort((a, b) => {
        // folders first
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        let cmp = 0;
        if (sortBy === "name") cmp = a.name.localeCompare(b.name);
        else if (sortBy === "modified") cmp = a.modified?.localeCompare(b.modified || "") || 0;
        else if (sortBy === "type") cmp = (a.ext || "").localeCompare(b.ext || "");
        else if (sortBy === "size") cmp = (a.size || "").localeCompare(b.size || "");
        return sortAsc ? cmp : -cmp;
      });
  }, [fs, currentPath, entries, search, searchActive, searchResults, sortBy, sortAsc]);

  const visibleEntries = getEntryNodes();

  // ── Toast helper ──
  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Navigation ──
  const navigate = (path, pushHistory = true) => {
    if (!fs[path] || fs[path].type !== "folder") return;
    setCurrentPath(path);
    setSelected([]);
    setSearch("");
    setSearchActive(false);
    if (pushHistory) {
      const newHistory = [...history.slice(0, historyIdx + 1), path];
      setHistory(newHistory);
      setHistoryIdx(newHistory.length - 1);
    }
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      setCurrentPath(history[newIdx]);
      setSelected([]);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      setCurrentPath(history[newIdx]);
      setSelected([]);
    }
  };

  const goUp = () => navigate(getParent(currentPath));

  // ── Breadcrumbs ──
  const breadcrumbs = currentPath === "/"
    ? [{ label: "/", path: "/" }]
    : currentPath.split("/").reduce((acc, seg, i, arr) => {
        if (i === 0) return [{ label: "raíz", path: "/" }];
        const path = arr.slice(0, i + 1).join("/");
        return [...acc, { label: seg, path }];
      }, []);

  // ── Selection ──
  const toggleSelect = (path, e) => {
    if (e?.shiftKey && selected.length > 0) {
      const paths = visibleEntries.map((e) => e.path);
      const lastIdx = paths.indexOf(selected[selected.length - 1]);
      const thisIdx = paths.indexOf(path);
      const [a, b] = [Math.min(lastIdx, thisIdx), Math.max(lastIdx, thisIdx)];
      setSelected([...new Set([...selected, ...paths.slice(a, b + 1)])]);
    } else if (e?.ctrlKey || e?.metaKey) {
      setSelected((s) => s.includes(path) ? s.filter((p) => p !== path) : [...s, path]);
    } else {
      setSelected([path]);
    }
  };

  const selectAll = () => setSelected(visibleEntries.map((e) => e.path));

  // ── Open / Double-click ──
  const openItem = (node) => {
    if (node.type === "folder") {
      navigate(node.path);
    } else {
      showToast(`Abriendo "${node.name}"…`, "info");
    }
  };

  // ── Create ──
  const startCreate = (type) => {
    setCreating(type);
    setCreateName(type === "folder" ? "Nueva Carpeta" : "Nuevo Archivo.txt");
    setTimeout(() => createRef.current?.select(), 50);
  };

  const confirmCreate = () => {
    if (!createName.trim()) { setCreating(null); return; }
    const newPath = joinPath(currentPath, createName.trim());
    if (fs[newPath]) { showToast("Ya existe un elemento con ese nombre", "error"); return; }
    const newNode = creating === "folder"
      ? { type: "folder", name: createName.trim(), modified: "2026-05-29", size: null, children: [] }
      : { type: "file", name: createName.trim(), ext: createName.split(".").pop(), modified: "2026-05-29", size: "0 KB" };
    setFs((prev) => {
      const updated = { ...prev, [newPath]: newNode };
      updated[currentPath] = {
        ...updated[currentPath],
        children: [...(updated[currentPath].children || []), createName.trim()]
      };
      return updated;
    });
    showToast(`${creating === "folder" ? "Carpeta" : "Archivo"} "${createName}" creado`, "success");
    setCreating(null);
    setCreateName("");
  };

  // ── Rename ──
  const startRename = (path) => {
    setRenaming(path);
    setRenameVal(fs[path]?.name || "");
    setTimeout(() => renameRef.current?.select(), 50);
  };

  const confirmRename = () => {
    if (!renameVal.trim() || !renaming) { setRenaming(null); return; }
    const oldName = fs[renaming]?.name;
    if (oldName === renameVal.trim()) { setRenaming(null); return; }
    const parent = getParent(renaming);
    const newPath = joinPath(parent, renameVal.trim());
    if (fs[newPath]) { showToast("Ya existe un elemento con ese nombre", "error"); return; }
    setFs((prev) => {
      const node = { ...prev[renaming], name: renameVal.trim() };
      const updated = { ...prev };
      delete updated[renaming];
      updated[newPath] = node;
      updated[parent] = {
        ...updated[parent],
        children: updated[parent].children.map((c) => (c === oldName ? renameVal.trim() : c))
      };
      return updated;
    });
    showToast(`Renombrado a "${renameVal}"`, "success");
    setRenaming(null);
  };

  // ── Delete ──
  const deleteItems = (paths) => {
    const items = paths.map((p) => ({ path: p, node: fs[p] }));
    setTrash((t) => [...t, ...items]);
    setFs((prev) => {
      const updated = { ...prev };
      paths.forEach((p) => {
        const parent = getParent(p);
        const name = prev[p]?.name;
        delete updated[p];
        if (updated[parent]) {
          updated[parent] = { ...updated[parent], children: updated[parent].children.filter((c) => c !== name) };
        }
      });
      return updated;
    });
    setSelected([]);
    showToast(`${paths.length} elemento(s) enviado(s) a la papelera`, "warning");
  };

  // ── Copy / Paste ──
  const copyItems = (op = "copy") => {
    setClipboard({ paths: selected, op });
    showToast(`${selected.length} elemento(s) ${op === "copy" ? "copiado(s)" : "cortado(s)"}`, "info");
  };

  const pasteItems = () => {
    if (!clipboard) return;
    clipboard.paths.forEach((srcPath) => {
      const node = fs[srcPath];
      if (!node) return;
      const newPath = joinPath(currentPath, node.name);
      setFs((prev) => {
        const updated = { ...prev, [newPath]: { ...node } };
        updated[currentPath] = {
          ...updated[currentPath],
          children: [...new Set([...(updated[currentPath].children || []), node.name])]
        };
        if (clipboard.op === "cut") {
          const oldParent = getParent(srcPath);
          delete updated[srcPath];
          updated[oldParent] = {
            ...updated[oldParent],
            children: updated[oldParent].children.filter((c) => c !== node.name)
          };
        }
        return updated;
      });
    });
    showToast(`Pegado(s) ${clipboard.paths.length} elemento(s)`, "success");
    if (clipboard.op === "cut") setClipboard(null);
  };

  // ── Search ──
  const doSearch = (query) => {
    if (!query.trim()) { setSearchActive(false); return; }
    setSearchActive(true);
    const results = Object.entries(fs)
      .filter(([, node]) => node.name?.toLowerCase().includes(query.toLowerCase()))
      .map(([path, node]) => ({ ...node, path }));
    setSearchResults(results);
  };

  // ── Context Menu ──
  const showCtxMenu = (e, path) => {
    e.preventDefault();
    const isSelected = selected.includes(path);
    if (!isSelected) setSelected([path]);
    setCtxMenu({ x: e.clientX, y: e.clientY, path });
  };

  const showBgCtxMenu = (e) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, path: null });
  };

  // Close menus
  useEffect(() => {
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (renaming || creating) return;
      if (e.key === "F2" && selected.length === 1) startRename(selected[0]);
      if (e.key === "Delete" && selected.length > 0) deleteItems(selected);
      if ((e.ctrlKey || e.metaKey) && e.key === "c") copyItems("copy");
      if ((e.ctrlKey || e.metaKey) && e.key === "x") copyItems("cut");
      if ((e.ctrlKey || e.metaKey) && e.key === "v") pasteItems();
      if ((e.ctrlKey || e.metaKey) && e.key === "a") { e.preventDefault(); selectAll(); }
      if (e.key === "Backspace" && !e.target.matches("input")) goBack();
      if (e.key === "Escape") { setSelected([]); setSearch(""); setSearchActive(false); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [renaming, creating, selected, clipboard]);

  // Update status bar
  useEffect(() => {
    const total = visibleEntries.length;
    const sel = selected.length;
    setStatusMsg(sel > 0 ? `${sel} elemento(s) seleccionado(s) de ${total}` : `${total} elemento(s)`);
  }, [visibleEntries, selected]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* ── TITLEBAR ── */}
      <div style={S.titlebar}>
        <div style={S.titlebarLeft}>
          <div style={S.trafficDot("#ff5f57")} />
          <div style={S.trafficDot("#ffbd2e")} />
          <div style={S.trafficDot("#28c840")} />
          <span style={S.appName}>⬡ NexusFiles</span>
        </div>
        <div style={S.titlebarCenter}>
          <span style={{ opacity: 0.4, fontSize: 12 }}>
            {currentPath}
          </span>
        </div>
        <div style={S.titlebarRight}>
          <span style={S.osBadge}>Linux / Windows</span>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div style={S.toolbar}>
        <div style={S.toolbarGroup}>
          <button style={S.iconBtn} onClick={goBack} disabled={historyIdx === 0} title="Atrás (Backspace)">
            ←
          </button>
          <button style={S.iconBtn} onClick={goForward} disabled={historyIdx === history.length - 1} title="Adelante">
            →
          </button>
          <button style={S.iconBtn} onClick={goUp} disabled={currentPath === "/"} title="Subir">
            ↑
          </button>
        </div>

        {/* Breadcrumbs */}
        <div style={S.breadcrumbs}>
          {breadcrumbs.map((bc, i) => (
            <span key={bc.path} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color: "#ffffff30" }}>/</span>}
              <button
                style={{ ...S.breadBtn, fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}
                onClick={() => navigate(bc.path)}
              >
                {bc.label}
              </button>
            </span>
          ))}
        </div>

        {/* Search */}
        <div style={S.searchBox}>
          <span style={{ opacity: 0.4, marginRight: 6 }}>🔍</span>
          <input
            style={S.searchInput}
            placeholder="Buscar archivos…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); doSearch(e.target.value); }}
            onKeyDown={(e) => e.key === "Escape" && setSearch("")}
          />
          {search && (
            <button style={S.clearSearch} onClick={() => { setSearch(""); setSearchActive(false); }}>×</button>
          )}
        </div>

        <div style={S.toolbarGroup}>
          <button style={S.iconBtn} onClick={() => setViewMode("grid")} title="Vista cuadrícula"
            className={viewMode === "grid" ? "active-btn" : ""}>⊞</button>
          <button style={S.iconBtn} onClick={() => setViewMode("list")} title="Vista lista"
            className={viewMode === "list" ? "active-btn" : ""}>☰</button>
        </div>
      </div>

      {/* ── ACTION BAR ── */}
      <div style={S.actionBar}>
        <button style={S.actionBtn} onClick={() => startCreate("folder")}>＋ Carpeta</button>
        <button style={S.actionBtn} onClick={() => startCreate("file")}>＋ Archivo</button>
        <div style={S.sep} />
        <button style={{ ...S.actionBtn, ...S.dangerBtn }} onClick={() => selected.length && deleteItems(selected)} disabled={!selected.length}>
          🗑 Eliminar
        </button>
        <button style={S.actionBtn} onClick={() => selected.length && copyItems("copy")} disabled={!selected.length}>⎘ Copiar</button>
        <button style={S.actionBtn} onClick={() => selected.length && copyItems("cut")} disabled={!selected.length}>✂ Cortar</button>
        <button style={S.actionBtn} onClick={pasteItems} disabled={!clipboard}>⎙ Pegar</button>
        <button style={S.actionBtn} onClick={selectAll}>◻ Seleccionar todo</button>
        <div style={S.sep} />
        <select style={S.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Nombre</option>
          <option value="modified">Modificado</option>
          <option value="type">Tipo</option>
          <option value="size">Tamaño</option>
        </select>
        <button style={S.iconBtn} onClick={() => setSortAsc((a) => !a)} title="Invertir orden">
          {sortAsc ? "↑" : "↓"}
        </button>
        <div style={{ flex: 1 }} />
        <button style={S.trashBtn} onClick={() => setTrashOpen(!trashOpen)}>
          🗑 Papelera {trash.length > 0 && <span style={S.badge}>{trash.length}</span>}
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={S.body}>
        {/* SIDEBAR */}
        <aside style={S.sidebar}>
          <div style={S.sidebarSection}>ACCESOS RÁPIDOS</div>
          {SIDEBAR_SHORTCUTS.map((s) => (
            <button
              key={s.path}
              style={{ ...S.sidebarBtn, ...(currentPath === s.path ? S.sidebarBtnActive : {}) }}
              onClick={() => navigate(s.path)}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
          <div style={{ ...S.sidebarSection, marginTop: 16 }}>DISPOSITIVOS</div>
          <button style={S.sidebarBtn} onClick={() => navigate("/")}>
            <span>💾</span><span>Sistema (/) </span>
          </button>
          <button style={S.sidebarBtn}>
            <span>💿</span><span>USB Drive</span>
          </button>
        </aside>

        {/* MAIN AREA */}
        <main
          ref={mainRef}
          style={{ ...S.main, background: dragOver ? "rgba(99,102,241,0.08)" : undefined }}
          onContextMenu={showBgCtxMenu}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); showToast("Archivo(s) recibido(s)", "success"); }}
          onClick={(e) => { if (e.target === mainRef.current) setSelected([]); }}
        >
          {/* Create input overlay */}
          {creating && (
            <div style={S.createOverlay}>
              <div style={S.createDialog}>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#a5b4fc" }}>
                  Nuevo {creating === "folder" ? "📁 Carpeta" : "📄 Archivo"}
                </p>
                <input
                  ref={createRef}
                  style={S.createInput}
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmCreate();
                    if (e.key === "Escape") setCreating(null);
                  }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button style={S.confirmBtn} onClick={confirmCreate}>Crear</button>
                  <button style={S.cancelBtn} onClick={() => setCreating(null)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {/* Search banner */}
          {searchActive && (
            <div style={S.searchBanner}>
              🔍 Resultados para "<b>{search}</b>" — {searchResults.length} encontrado(s)
              <button style={S.cancelBtn} onClick={() => { setSearch(""); setSearchActive(false); }}>✕ Cerrar búsqueda</button>
            </div>
          )}

          {/* File Grid / List */}
          {viewMode === "grid" ? (
            <div style={S.grid}>
              {visibleEntries.map((node) => (
                <FileCard
                  key={node.path}
                  node={node}
                  selected={selected.includes(node.path)}
                  renaming={renaming === node.path}
                  renameVal={renameVal}
                  renameRef={renameRef}
                  onRenameChange={setRenameVal}
                  onRenameConfirm={confirmRename}
                  onClick={(e) => toggleSelect(node.path, e)}
                  onDoubleClick={() => openItem(node)}
                  onCtxMenu={(e) => showCtxMenu(e, node.path)}
                  onRenameKeyDown={(e) => {
                    if (e.key === "Enter") confirmRename();
                    if (e.key === "Escape") setRenaming(null);
                  }}
                />
              ))}
              {visibleEntries.length === 0 && (
                <div style={S.empty}>📂 Carpeta vacía</div>
              )}
            </div>
          ) : (
            <ListTable
              entries={visibleEntries}
              selected={selected}
              renaming={renaming}
              renameVal={renameVal}
              renameRef={renameRef}
              onRenameChange={setRenameVal}
              onRenameConfirm={confirmRename}
              onClick={toggleSelect}
              onDoubleClick={openItem}
              onCtxMenu={showCtxMenu}
              sortBy={sortBy}
              sortAsc={sortAsc}
              onSort={(col) => { if (sortBy === col) setSortAsc((a) => !a); else { setSortBy(col); setSortAsc(true); } }}
              onRenameKeyDown={(e) => {
                if (e.key === "Enter") confirmRename();
                if (e.key === "Escape") setRenaming(null);
              }}
            />
          )}
        </main>

        {/* PROPERTIES PANEL */}
        {properties && (
          <PropertiesPanel node={fs[properties]} path={properties} onClose={() => setProperties(null)} />
        )}

        {/* TRASH DRAWER */}
        {trashOpen && (
          <TrashDrawer
            trash={trash}
            onRestore={(item) => {
              setFs((prev) => {
                const updated = { ...prev, [item.path]: item.node };
                const parent = getParent(item.path);
                if (updated[parent]) {
                  updated[parent] = { ...updated[parent], children: [...updated[parent].children, item.node.name] };
                }
                return updated;
              });
              setTrash((t) => t.filter((i) => i.path !== item.path));
              showToast(`"${item.node.name}" restaurado`, "success");
            }}
            onEmpty={() => { setTrash([]); showToast("Papelera vaciada", "warning"); }}
            onClose={() => setTrashOpen(false)}
          />
        )}
      </div>

      {/* ── STATUS BAR ── */}
      <div style={S.statusBar}>
        <span>{statusMsg}</span>
        {clipboard && (
          <span style={{ color: "#a5b4fc" }}>
            📋 {clipboard.paths.length} elemento(s) en portapapeles ({clipboard.op === "copy" ? "copiar" : "cortar"})
          </span>
        )}
        <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: 11 }}>
          {currentPath}
        </span>
      </div>

      {/* ── CONTEXT MENU ── */}
      {ctxMenu && (
        <CtxMenu
          x={ctxMenu.x} y={ctxMenu.y}
          isFile={!!ctxMenu.path}
          selected={selected}
          onOpen={() => ctxMenu.path && openItem(fs[ctxMenu.path] ? { ...fs[ctxMenu.path], path: ctxMenu.path } : null)}
          onRename={() => ctxMenu.path && startRename(ctxMenu.path)}
          onDelete={() => selected.length && deleteItems(selected)}
          onCopy={() => copyItems("copy")}
          onCut={() => copyItems("cut")}
          onPaste={pasteItems}
          onProperties={() => { setProperties(ctxMenu.path || currentPath); }}
          onNewFolder={() => startCreate("folder")}
          onNewFile={() => startCreate("file")}
          clipboard={clipboard}
        />
      )}

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

// ─── FileCard ─────────────────────────────────────────────────────────────────
function FileCard({ node, selected, renaming, renameVal, renameRef, onRenameChange, onRenameConfirm, onClick, onDoubleClick, onCtxMenu, onRenameKeyDown }) {
  const ft = node.type === "folder" ? { icon: "📁", color: "#fbbf24" } : getFileType(node.ext);
  return (
    <div
      style={{
        ...S.card,
        background: selected ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.03)",
        borderColor: selected ? "#6366f1" : "rgba(255,255,255,0.06)",
        boxShadow: selected ? "0 0 0 2px #6366f180" : "none",
      }}
      className="file-card"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onCtxMenu}
    >
      <div style={{ ...S.cardIcon, color: ft.color }}>{ft.icon}</div>
      {renaming ? (
        <input
          ref={renameRef}
          style={S.renameInput}
          value={renameVal}
          onChange={(e) => onRenameChange(e.target.value)}
          onBlur={onRenameConfirm}
          onKeyDown={onRenameKeyDown}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span style={S.cardName} title={node.name}>{node.name}</span>
      )}
      {node.type === "file" && <span style={{ ...S.cardExt, background: ft.color + "30", color: ft.color }}>{node.ext?.toUpperCase() || "—"}</span>}
      {node.type === "folder" && <span style={S.cardFolderBadge}>{node.children?.length ?? 0} items</span>}
    </div>
  );
}

// ─── ListTable ───────────────────────────────────────────────────────────────
function ListTable({ entries, selected, renaming, renameVal, renameRef, onRenameChange, onRenameConfirm, onClick, onDoubleClick, onCtxMenu, sortBy, sortAsc, onSort, onRenameKeyDown }) {
  const TH = ({ col, label }) => (
    <th style={S.th} onClick={() => onSort(col)}>
      {label} {sortBy === col ? (sortAsc ? "↑" : "↓") : ""}
    </th>
  );
  return (
    <table style={S.table}>
      <thead>
        <tr>
          <TH col="name" label="Nombre" />
          <TH col="type" label="Tipo" />
          <TH col="size" label="Tamaño" />
          <TH col="modified" label="Modificado" />
        </tr>
      </thead>
      <tbody>
        {entries.map((node) => {
          const ft = node.type === "folder" ? { icon: "📁", color: "#fbbf24", label: "Carpeta" } : getFileType(node.ext);
          return (
            <tr
              key={node.path}
              style={{
                ...S.tr,
                background: selected.includes(node.path) ? "rgba(99,102,241,0.2)" : "transparent",
              }}
              className="list-row"
              onClick={(e) => onClick(node.path, e)}
              onDoubleClick={() => onDoubleClick(node)}
              onContextMenu={(e) => onCtxMenu(e, node.path)}
            >
              <td style={S.td}>
                <span style={{ color: ft.color, marginRight: 8 }}>{ft.icon}</span>
                {renaming === node.path ? (
                  <input
                    ref={renameRef}
                    style={S.renameInput}
                    value={renameVal}
                    onChange={(e) => onRenameChange(e.target.value)}
                    onBlur={onRenameConfirm}
                    onKeyDown={onRenameKeyDown}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  node.name
                )}
              </td>
              <td style={{ ...S.td, color: ft.color, fontSize: 12 }}>{ft.label || (node.type === "folder" ? "Carpeta" : "Archivo")}</td>
              <td style={{ ...S.td, opacity: 0.6, fontSize: 12 }}>{node.size || "—"}</td>
              <td style={{ ...S.td, opacity: 0.6, fontSize: 12 }}>{node.modified}</td>
            </tr>
          );
        })}
        {entries.length === 0 && (
          <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", padding: 40, opacity: 0.4 }}>Carpeta vacía</td></tr>
        )}
      </tbody>
    </table>
  );
}

// ─── CtxMenu ─────────────────────────────────────────────────────────────────
function CtxMenu({ x, y, isFile, selected, onOpen, onRename, onDelete, onCopy, onCut, onPaste, onProperties, onNewFolder, onNewFile, clipboard }) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ x, y });

  useEffect(() => {
    if (menuRef.current) {
      const r = menuRef.current.getBoundingClientRect();
      const nx = x + r.width > window.innerWidth ? x - r.width : x;
      const ny = y + r.height > window.innerHeight ? y - r.height : y;
      setPos({ x: nx, y: ny });
    }
  }, [x, y]);

  const Item = ({ label, onClick, danger, disabled }) => (
    <button
      style={{ ...S.ctxItem, ...(danger ? S.ctxDanger : {}), opacity: disabled ? 0.4 : 1 }}
      onClick={disabled ? undefined : (e) => { e.stopPropagation(); onClick(); }}
      disabled={disabled}
    >{label}</button>
  );

  return (
    <div ref={menuRef} style={{ ...S.ctxMenu, left: pos.x, top: pos.y }} onClick={(e) => e.stopPropagation()}>
      {isFile && <Item label="↗ Abrir" onClick={onOpen} />}
      {isFile && selected.length === 1 && <Item label="✏️ Renombrar (F2)" onClick={onRename} />}
      <Item label="⎘ Copiar (Ctrl+C)" onClick={onCopy} disabled={!isFile} />
      <Item label="✂ Cortar (Ctrl+X)" onClick={onCut} disabled={!isFile} />
      <Item label="⎙ Pegar (Ctrl+V)" onClick={onPaste} disabled={!clipboard} />
      <div style={S.ctxDivider} />
      <Item label="＋ Nueva Carpeta" onClick={onNewFolder} />
      <Item label="＋ Nuevo Archivo" onClick={onNewFile} />
      <div style={S.ctxDivider} />
      <Item label="🗑 Eliminar (Del)" onClick={onDelete} danger disabled={!isFile} />
      <div style={S.ctxDivider} />
      <Item label="ℹ️ Propiedades" onClick={onProperties} />
    </div>
  );
}

// ─── PropertiesPanel ──────────────────────────────────────────────────────────
function PropertiesPanel({ node, path, onClose }) {
  if (!node) return null;
  const ft = node.type === "folder" ? { icon: "📁", color: "#fbbf24", label: "Carpeta" } : getFileType(node.ext);
  return (
    <div style={S.propPanel}>
      <div style={S.propHeader}>
        <span style={{ fontSize: 28 }}>{ft.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{node.name}</div>
          <div style={{ fontSize: 11, opacity: 0.5 }}>{ft.label}</div>
        </div>
        <button style={S.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div style={S.propBody}>
        <PropRow label="Ruta" val={path} />
        <PropRow label="Tipo" val={node.type === "folder" ? "Carpeta" : ft.label} />
        {node.size && <PropRow label="Tamaño" val={node.size} />}
        <PropRow label="Modificado" val={node.modified} />
        {node.type === "folder" && <PropRow label="Elementos" val={node.children?.length ?? 0} />}
        {node.ext && <PropRow label="Extensión" val={`.${node.ext}`} />}
      </div>
    </div>
  );
}

const PropRow = ({ label, val }) => (
  <div style={S.propRow}>
    <span style={{ opacity: 0.5, fontSize: 12 }}>{label}</span>
    <span style={{ fontWeight: 500, fontSize: 12, wordBreak: "break-all" }}>{val}</span>
  </div>
);

// ─── TrashDrawer ──────────────────────────────────────────────────────────────
function TrashDrawer({ trash, onRestore, onEmpty, onClose }) {
  return (
    <div style={S.trashDrawer}>
      <div style={S.propHeader}>
        <span style={{ fontSize: 20 }}>🗑</span>
        <span style={{ fontWeight: 700 }}>Papelera ({trash.length})</span>
        <button style={S.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
        {trash.length === 0 && <div style={{ padding: 20, opacity: 0.4, textAlign: "center" }}>Papelera vacía</div>}
        {trash.map((item, i) => {
          const ft = item.node.type === "folder" ? { icon: "📁" } : getFileType(item.node.ext);
          return (
            <div key={i} style={S.trashItem}>
              <span>{ft.icon}</span>
              <span style={{ flex: 1, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.node.name}</span>
              <button style={S.restoreBtn} onClick={() => onRestore(item)}>↩</button>
            </div>
          );
        })}
      </div>
      {trash.length > 0 && (
        <button style={{ ...S.actionBtn, ...S.dangerBtn, margin: 8 }} onClick={onEmpty}>Vaciar papelera</button>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  const colors = { info: "#6366f1", success: "#22c55e", warning: "#f59e0b", error: "#ef4444" };
  return (
    <div style={{ ...S.toast, borderColor: colors[type] }}>
      <div style={{ width: 4, borderRadius: 4, background: colors[type], alignSelf: "stretch" }} />
      <span>{msg}</span>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  root: {
    display: "flex", flexDirection: "column", height: "100vh", width: "100%",
    background: "#0d0d14", color: "#e2e8f0",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: 13, overflow: "hidden", userSelect: "none",
  },
  titlebar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 16px", height: 38,
    background: "linear-gradient(90deg,#12121e,#1a1a2e)",
    borderBottom: "1px solid #ffffff0f",
  },
  titlebarLeft: { display: "flex", alignItems: "center", gap: 8 },
  trafficDot: (c) => ({ width: 12, height: 12, borderRadius: "50%", background: c }),
  appName: { marginLeft: 10, fontWeight: 700, fontSize: 14, color: "#a5b4fc", letterSpacing: 2 },
  titlebarCenter: { position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: 11 },
  titlebarRight: {},
  osBadge: { fontSize: 10, background: "#6366f120", color: "#a5b4fc", padding: "2px 8px", borderRadius: 20, border: "1px solid #6366f140" },

  toolbar: {
    display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
    background: "#111120", borderBottom: "1px solid #ffffff08",
  },
  toolbarGroup: { display: "flex", gap: 2 },
  iconBtn: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    color: "#c7d2fe", borderRadius: 6, padding: "4px 10px", cursor: "pointer",
    fontSize: 14, transition: "all .15s",
  },
  breadcrumbs: { display: "flex", alignItems: "center", gap: 2, flex: 1, overflow: "hidden" },
  breadBtn: {
    background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
    padding: "2px 6px", borderRadius: 4, fontSize: 12, transition: "all .15s",
  },
  searchBox: {
    display: "flex", alignItems: "center",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: "4px 10px", width: 220,
  },
  searchInput: {
    background: "none", border: "none", color: "#e2e8f0", outline: "none",
    fontSize: 12, width: "100%",
  },
  clearSearch: { background: "none", border: "none", color: "#666", cursor: "pointer", padding: "0 2px" },

  actionBar: {
    display: "flex", alignItems: "center", gap: 4, padding: "4px 12px",
    background: "#0e0e1c", borderBottom: "1px solid #ffffff06",
    flexWrap: "wrap",
  },
  actionBtn: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    color: "#c7d2fe", borderRadius: 5, padding: "3px 10px", cursor: "pointer",
    fontSize: 11, transition: "all .15s",
  },
  dangerBtn: { color: "#fca5a5", borderColor: "#ef444430" },
  sep: { width: 1, height: 18, background: "#ffffff10", margin: "0 4px" },
  sortSelect: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    color: "#c7d2fe", borderRadius: 5, padding: "3px 8px", fontSize: 11, cursor: "pointer",
  },
  trashBtn: {
    background: "rgba(239,68,68,0.08)", border: "1px solid #ef444430",
    color: "#fca5a5", borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontSize: 11,
    display: "flex", alignItems: "center", gap: 4,
  },
  badge: {
    background: "#ef4444", color: "#fff", borderRadius: 10, padding: "0 5px", fontSize: 10,
  },

  body: { display: "flex", flex: 1, overflow: "hidden", position: "relative" },

  sidebar: {
    width: 180, background: "#0c0c1a", borderRight: "1px solid #ffffff06",
    padding: "8px 0", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0,
  },
  sidebarSection: { padding: "8px 14px 4px", fontSize: 9, letterSpacing: 2, color: "#ffffff30", fontWeight: 700 },
  sidebarBtn: {
    display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
    background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
    width: "100%", textAlign: "left", fontSize: 12, transition: "all .15s", borderRadius: 0,
  },
  sidebarBtnActive: { background: "rgba(99,102,241,0.15)", color: "#a5b4fc", borderLeft: "2px solid #6366f1" },

  main: {
    flex: 1, overflowY: "auto", padding: 16, position: "relative",
    transition: "background .2s",
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 },

  card: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
    padding: "12px 8px 8px", borderRadius: 10, border: "1px solid transparent",
    cursor: "pointer", transition: "all .15s", position: "relative", textAlign: "center",
  },
  cardIcon: { fontSize: 34, lineHeight: 1, marginBottom: 2 },
  cardName: { fontSize: 11, color: "#e2e8f0", wordBreak: "break-word", lineHeight: 1.3, maxWidth: "100%" },
  cardExt: { fontSize: 9, padding: "1px 6px", borderRadius: 10, fontWeight: 700, marginTop: 2 },
  cardFolderBadge: { fontSize: 9, color: "#ffffff40", marginTop: 2 },

  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "6px 12px", textAlign: "left", fontSize: 11, color: "#6366f1",
    borderBottom: "1px solid #ffffff08", cursor: "pointer", fontWeight: 600, letterSpacing: 1,
  },
  tr: { transition: "background .1s", cursor: "pointer" },
  td: { padding: "7px 12px", borderBottom: "1px solid #ffffff04", fontSize: 13, verticalAlign: "middle" },

  renameInput: {
    background: "#1a1a2e", border: "1px solid #6366f1", color: "#e2e8f0",
    borderRadius: 4, padding: "2px 6px", fontSize: 11, outline: "none", width: "90%",
  },

  createOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 20, backdropFilter: "blur(4px)",
  },
  createDialog: {
    background: "#16162a", border: "1px solid #6366f140", borderRadius: 12,
    padding: "20px 24px", minWidth: 280, boxShadow: "0 20px 60px #0008",
  },
  createInput: {
    width: "100%", background: "#0d0d14", border: "1px solid #6366f1",
    color: "#e2e8f0", borderRadius: 6, padding: "6px 10px", fontSize: 13, outline: "none",
    boxSizing: "border-box",
  },
  confirmBtn: {
    background: "#6366f1", border: "none", color: "#fff", borderRadius: 6,
    padding: "6px 16px", cursor: "pointer", fontSize: 12,
  },
  cancelBtn: {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#94a3b8", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 12,
  },

  searchBanner: {
    background: "rgba(99,102,241,0.1)", border: "1px solid #6366f140", borderRadius: 8,
    padding: "8px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12, fontSize: 12,
  },

  empty: { gridColumn: "1/-1", textAlign: "center", padding: 60, opacity: 0.3, fontSize: 16 },

  ctxMenu: {
    position: "fixed", background: "#16162a", border: "1px solid #6366f130",
    borderRadius: 10, padding: "4px 0", zIndex: 1000, minWidth: 190,
    boxShadow: "0 16px 48px #000a", backdropFilter: "blur(12px)",
  },
  ctxItem: {
    display: "block", width: "100%", textAlign: "left", background: "none",
    border: "none", color: "#c7d2fe", padding: "7px 16px", cursor: "pointer",
    fontSize: 12, transition: "background .1s",
  },
  ctxDanger: { color: "#fca5a5" },
  ctxDivider: { height: 1, background: "#ffffff08", margin: "3px 0" },

  propPanel: {
    width: 220, background: "#0e0e1c", borderLeft: "1px solid #ffffff06",
    display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto",
  },
  propHeader: {
    display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 10px",
    borderBottom: "1px solid #ffffff08",
  },
  propBody: { padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  propRow: { display: "flex", flexDirection: "column", gap: 2 },
  closeBtn: { background: "none", border: "none", color: "#6b7280", cursor: "pointer", marginLeft: "auto", fontSize: 16 },

  trashDrawer: {
    width: 220, background: "#0e0e1c", borderLeft: "1px solid #ffffff06",
    display: "flex", flexDirection: "column", flexShrink: 0,
  },
  trashItem: {
    display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
    borderBottom: "1px solid #ffffff06", fontSize: 12,
  },
  restoreBtn: {
    background: "rgba(99,102,241,0.1)", border: "1px solid #6366f130",
    color: "#a5b4fc", borderRadius: 4, padding: "2px 7px", cursor: "pointer", fontSize: 12,
  },

  statusBar: {
    display: "flex", alignItems: "center", gap: 16, padding: "4px 16px",
    background: "#0a0a12", borderTop: "1px solid #ffffff06", fontSize: 11, color: "#64748b",
    minHeight: 26,
  },

  toast: {
    position: "fixed", bottom: 40, right: 24, zIndex: 2000,
    background: "#16162a", border: "1px solid",
    borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#e2e8f0",
    boxShadow: "0 8px 32px #000a", display: "flex", alignItems: "center", gap: 10,
    animation: "toastIn .2s ease",
  },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #6366f140; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #6366f170; }
  .file-card:hover { background: rgba(99,102,241,0.12) !important; border-color: rgba(99,102,241,0.3) !important; transform: translateY(-1px); }
  .list-row:hover { background: rgba(99,102,241,0.08) !important; }
  button:hover:not(:disabled) { background: rgba(99,102,241,0.2) !important; color: #a5b4fc !important; }
  button.active-btn { background: rgba(99,102,241,0.3) !important; color: #a5b4fc !important; }
  .ctx-item:hover { background: rgba(99,102,241,0.15); }
  @keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  select option { background: #16162a; }
`;

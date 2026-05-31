const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");

const isDev = process.env.NODE_ENV !== "production";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    backgroundColor: "#0d0d14",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "public/icon.png"),
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

  // Ventana personalizada: minimize, maximize, close
  ipcMain.on("win-minimize", () => win.minimize());
  ipcMain.on("win-maximize", () => {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
  ipcMain.on("win-close", () => win.close());
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ── Listar drives de Windows ─────────────────────────────────────────────────
ipcMain.handle("list-drives", async () => {
  const drives = [];
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const drivePath = `${letter}:\\`;
    try {
      fs.accessSync(drivePath);
      drives.push({ label: `Disco (${letter}:)`, path: drivePath, letter });
    } catch {}
  }
  return drives;
});

// ── Leer directorio ──────────────────────────────────────────────────────────
ipcMain.handle("read-dir", async (_, dirPath) => {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries.map((e) => {
      const fullPath = path.join(dirPath, e.name);
      let size = null;
      let modified = null;
      try {
        const stat = fs.statSync(fullPath);
        modified = stat.mtime.toISOString().split("T")[0];
        if (stat.isFile()) {
          const bytes = stat.size;
          if (bytes < 1024) size = `${bytes} B`;
          else if (bytes < 1024 * 1024) size = `${(bytes / 1024).toFixed(1)} KB`;
          else if (bytes < 1024 * 1024 * 1024) size = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
          else size = `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        }
      } catch {}
      return {
        name: e.name,
        path: fullPath,
        type: e.isDirectory() ? "folder" : "file",
        ext: e.isFile() ? path.extname(e.name).replace(".", "").toLowerCase() : "",
        size,
        modified,
      };
    });
  } catch (err) {
    return { error: err.message };
  }
});

// ── Crear carpeta ────────────────────────────────────────────────────────────
ipcMain.handle("create-folder", async (_, folderPath) => {
  try {
    fs.mkdirSync(folderPath);
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Crear archivo ────────────────────────────────────────────────────────────
ipcMain.handle("create-file", async (_, filePath) => {
  try {
    fs.writeFileSync(filePath, "");
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Renombrar ────────────────────────────────────────────────────────────────
ipcMain.handle("rename-item", async (_, oldPath, newPath) => {
  try {
    fs.renameSync(oldPath, newPath);
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Eliminar (mover a papelera) ──────────────────────────────────────────────
ipcMain.handle("delete-item", async (_, itemPath) => {
  try {
    await shell.trashItem(itemPath);
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Copiar ───────────────────────────────────────────────────────────────────
ipcMain.handle("copy-item", async (_, srcPath, destPath) => {
  try {
    copyRecursive(srcPath, destPath);
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
});

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// ── Mover ────────────────────────────────────────────────────────────────────
ipcMain.handle("move-item", async (_, srcPath, destPath) => {
  try {
    fs.renameSync(srcPath, destPath);
    return { ok: true };
  } catch (err) {
    // Si falla (distintas unidades), copiar y borrar
    try {
      copyRecursive(srcPath, destPath);
      fs.rmSync(srcPath, { recursive: true, force: true });
      return { ok: true };
    } catch (err2) {
      return { error: err2.message };
    }
  }
});

// ── Abrir archivo con app predeterminada ─────────────────────────────────────
ipcMain.handle("open-file", async (_, filePath) => {
  try {
    await shell.openPath(filePath);
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Propiedades del item ──────────────────────────────────────────────────────
ipcMain.handle("get-properties", async (_, itemPath) => {
  try {
    const stat = fs.statSync(itemPath);
    return {
      path: itemPath,
      size: stat.size,
      created: stat.birthtime.toISOString(),
      modified: stat.mtime.toISOString(),
      isDirectory: stat.isDirectory(),
      isReadOnly: !(stat.mode & 0o200),
    };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Rutas especiales de Windows ───────────────────────────────────────────────
ipcMain.handle("get-special-paths", async () => {
  return {
    home: os.homedir(),
    desktop: path.join(os.homedir(), "Desktop"),
    documents: path.join(os.homedir(), "Documents"),
    downloads: path.join(os.homedir(), "Downloads"),
    pictures: path.join(os.homedir(), "Pictures"),
    music: path.join(os.homedir(), "Music"),
    videos: path.join(os.homedir(), "Videos"),
  };
});

// ── Diálogo para seleccionar carpeta ─────────────────────────────────────────
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  return result.canceled ? null : result.filePaths[0];
});

// ── Cambiar permisos (solo lectura) ──────────────────────────────────────────
ipcMain.handle("change-permissions", async (_, itemPath, readOnly) => {
  try {
    const mode = readOnly ? 0o444 : 0o644;
    fs.chmodSync(itemPath, mode);
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Duplicar archivo/carpeta ──────────────────────────────────────────────────
ipcMain.handle("duplicate-item", async (_, srcPath) => {
  try {
    const dirname = path.dirname(srcPath);
    const basename = path.basename(srcPath);
    const ext = path.extname(basename);
    const name = ext.length > 0 ? basename.slice(0, -ext.length) : basename;
    
    let destPath = path.join(dirname, `${name} (copia)${ext}`);
    let counter = 1;
    
    while (fs.existsSync(destPath)) {
      destPath = path.join(dirname, `${name} (copia ${counter++})${ext}`);
    }
    
    copyRecursive(srcPath, destPath);
    return { ok: true, newPath: destPath };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Comprimir a ZIP ───────────────────────────────────────────────────────────
ipcMain.handle("compress-item", async (_, itemPath) => {
  try {
    const archiver = require('archiver');
    const stat = fs.statSync(itemPath);
    const dirname = path.dirname(itemPath);
    const basename = path.basename(itemPath);
    const zipPath = path.join(dirname, `${basename}.zip`);
    
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    await new Promise((resolve, reject) => {
      archive.on('error', reject);
      output.on('error', reject);
      output.on('finish', resolve);
      
      archive.pipe(output);
      
      if (stat.isDirectory()) {
        archive.directory(itemPath, basename);
      } else {
        archive.file(itemPath, { name: basename });
      }
      
      archive.finalize();
    });
    
    return { ok: true, zipPath };
  } catch (err) {
    return { error: err.message };
  }
});

// ── Extraer ZIP ──────────────────────────────────────────────────────────────
ipcMain.handle("extract-item", async (_, zipPath, destDir) => {
  try {
    const extract = require('extract-zip');
    await extract(zipPath, { dir: destDir });
    return { ok: true };
  } catch (err) {
    return { error: err.message };
  }
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Navegación y sistema
  listDrives: () => ipcRenderer.invoke("list-drives"),
  getSpecialPaths: () => ipcRenderer.invoke("get-special-paths"),

  // Operaciones de archivos
  readDir: (path) => ipcRenderer.invoke("read-dir", path),
  createFolder: (path) => ipcRenderer.invoke("create-folder", path),
  createFile: (path) => ipcRenderer.invoke("create-file", path),
  renameItem: (oldPath, newPath) => ipcRenderer.invoke("rename-item", oldPath, newPath),
  deleteItem: (path) => ipcRenderer.invoke("delete-item", path),
  copyItem: (src, dest) => ipcRenderer.invoke("copy-item", src, dest),
  moveItem: (src, dest) => ipcRenderer.invoke("move-item", src, dest),
  duplicateItem: (path) => ipcRenderer.invoke("duplicate-item", path),
  changePermissions: (path, readOnly) => ipcRenderer.invoke("change-permissions", path, readOnly),
  compressItem: (path) => ipcRenderer.invoke("compress-item", path),
  extractItem: (zipPath, destDir) => ipcRenderer.invoke("extract-item", zipPath, destDir),
  openFile: (path) => ipcRenderer.invoke("open-file", path),
  getProperties: (path) => ipcRenderer.invoke("get-properties", path),
  selectFolder: () => ipcRenderer.invoke("select-folder"),

  // Control de ventana
  minimize: () => ipcRenderer.send("win-minimize"),
  maximize: () => ipcRenderer.send("win-maximize"),
  close: () => ipcRenderer.send("win-close"),
});

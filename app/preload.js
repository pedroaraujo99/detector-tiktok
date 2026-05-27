const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

  iniciar: () => {
    ipcRenderer.send("iniciar-analise");
  }

});
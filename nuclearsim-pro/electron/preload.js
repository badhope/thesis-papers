const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    db: {
        run: (sql, params) => ipcRenderer.invoke('db-run', sql, params),
        get: (sql, params) => ipcRenderer.invoke('db-get', sql, params),
        all: (sql, params) => ipcRenderer.invoke('db-all', sql, params)
    },

    window: {
        minimize: () => ipcRenderer.invoke('window-minimize'),
        maximize: () => ipcRenderer.invoke('window-maximize'),
        close: () => ipcRenderer.invoke('window-close')
    },

    export: {
        pdf: (options) => ipcRenderer.invoke('export-pdf', options),
        image: (dataUrl, defaultName) => ipcRenderer.invoke('save-image', dataUrl, defaultName)
    },

    app: {
        getVersion: () => ipcRenderer.invoke('get-app-version'),
        getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
        openExternal: (url) => ipcRenderer.invoke('open-external', url)
    },

    update: {
        download: () => ipcRenderer.invoke('download-update'),
        install: () => ipcRenderer.invoke('install-update'),
        onChecking: (callback) => ipcRenderer.on('update-checking', callback),
        onAvailable: (callback) => ipcRenderer.on('update-available', (event, info) => callback(info)),
        onNotAvailable: (callback) => ipcRenderer.on('update-not-available', (event, info) => callback(info)),
        onProgress: (callback) => ipcRenderer.on('update-progress', (event, progress) => callback(progress)),
        onDownloaded: (callback) => ipcRenderer.on('update-downloaded', (event, info) => callback(info)),
        onError: (callback) => ipcRenderer.on('update-error', (event, error) => callback(error))
    },

    menu: {
        onNewSimulation: (callback) => ipcRenderer.on('menu-new-simulation', callback),
        onSaveScenario: (callback) => ipcRenderer.on('menu-save-scenario', callback),
        onExportReport: (callback) => ipcRenderer.on('menu-export-report', callback),
        onHistory: (callback) => ipcRenderer.on('menu-history', callback),
        onDataManagement: (callback) => ipcRenderer.on('menu-data-management', callback),
        onSettings: (callback) => ipcRenderer.on('menu-settings', callback),
        onKnowledgeBase: (callback) => ipcRenderer.on('menu-knowledge-base', callback),
        onHistoricalEvents: (callback) => ipcRenderer.on('menu-historical-events', callback),
        onTutorials: (callback) => ipcRenderer.on('menu-tutorials', callback),
        onQuiz: (callback) => ipcRenderer.on('menu-quiz', callback)
    }
});

console.log('Preload script loaded successfully');

const { app, BrowserWindow, ipcMain, dialog, Menu, shell, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { autoUpdater } = require('electron-updater');

class NuclearSimApp {
    constructor() {
        this.mainWindow = null;
        this.db = null;
        this.isQuitting = false;
    }

    async init() {
        await app.whenReady();
        
        this.initDatabase();
        this.createWindow();
        this.setupIPC();
        this.createMenu();
        this.setupAutoUpdater();
        this.setupAppEvents();
    }

    initDatabase() {
        try {
            const dbPath = path.join(app.getPath('userData'), 'nuclearsim.db');
            console.log('Database path:', dbPath);
            
            this.db = new Database(dbPath);
            this.db.pragma('journal_mode = WAL');
            
            this.createTables();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Failed to initialize database:', error);
            dialog.showErrorBox('数据库错误', '无法初始化数据库: ' + error.message);
        }
    }

    createTables() {
        const schema = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                settings JSON,
                achievements JSON
            );

            CREATE TABLE IF NOT EXISTS simulations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name VARCHAR(100),
                weapon_type VARCHAR(50),
                yield_kt REAL,
                location_lat REAL,
                location_lng REAL,
                location_name VARCHAR(100),
                burst_height VARCHAR(20),
                results JSON,
                weather JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS event_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                event_id VARCHAR(50),
                event_type VARCHAR(20),
                decisions JSON,
                outcome VARCHAR(50),
                duration_seconds INTEGER,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS custom_scenarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name VARCHAR(100),
                description TEXT,
                scenario_data JSON,
                is_public BOOLEAN DEFAULT 0,
                downloads INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS achievements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                achievement_id VARCHAR(50),
                unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS knowledge_base (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(200),
                category VARCHAR(50),
                content TEXT,
                tags JSON,
                views INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS map_cache (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tile_key VARCHAR(100) UNIQUE,
                tile_data BLOB,
                zoom_level INTEGER,
                lat_min REAL,
                lat_max REAL,
                lng_min REAL,
                lng_max REAL,
                cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS settings (
                key VARCHAR(100) PRIMARY KEY,
                value JSON
            );

            CREATE INDEX IF NOT EXISTS idx_simulations_user ON simulations(user_id);
            CREATE INDEX IF NOT EXISTS idx_simulations_date ON simulations(created_at);
            CREATE INDEX IF NOT EXISTS idx_events_user ON event_history(user_id);
        `;

        this.db.exec(schema);
    }

    createWindow() {
        nativeTheme.themeSource = 'dark';

        this.mainWindow = new BrowserWindow({
            width: 1600,
            height: 900,
            minWidth: 1200,
            minHeight: 700,
            frame: false,
            titleBarStyle: 'hiddenInset',
            backgroundColor: '#0a0a1a',
            icon: path.join(__dirname, '../assets/icons/icon.png'),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
                webSecurity: true,
                enableRemoteModule: false
            },
            show: false
        });

        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();
        });

        if (process.env.NODE_ENV === 'development') {
            this.mainWindow.loadFile(path.join(__dirname, '../src/renderer/index.html'));
            this.mainWindow.webContents.openDevTools();
        } else {
            this.mainWindow.loadFile(path.join(__dirname, '../src/renderer/index.html'));
        }
    }

    createMenu() {
        const template = [
            {
                label: '文件',
                submenu: [
                    {
                        label: '新建模拟',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => this.mainWindow.webContents.send('menu-new-simulation')
                    },
                    {
                        label: '保存场景',
                        accelerator: 'CmdOrCtrl+S',
                        click: () => this.mainWindow.webContents.send('menu-save-scenario')
                    },
                    {
                        label: '导出报告',
                        accelerator: 'CmdOrCtrl+E',
                        click: () => this.mainWindow.webContents.send('menu-export-report')
                    },
                    { type: 'separator' },
                    {
                        label: '退出',
                        accelerator: 'CmdOrCtrl+Q',
                        click: () => app.quit()
                    }
                ]
            },
            {
                label: '编辑',
                submenu: [
                    { role: 'undo', label: '撤销' },
                    { role: 'redo', label: '重做' },
                    { type: 'separator' },
                    { role: 'cut', label: '剪切' },
                    { role: 'copy', label: '复制' },
                    { role: 'paste', label: '粘贴' },
                    { role: 'selectAll', label: '全选' }
                ]
            },
            {
                label: '视图',
                submenu: [
                    { role: 'reload', label: '重新加载' },
                    { role: 'forceReload', label: '强制重新加载' },
                    { role: 'toggleDevTools', label: '开发者工具' },
                    { type: 'separator' },
                    { role: 'resetZoom', label: '重置缩放' },
                    { role: 'zoomIn', label: '放大' },
                    { role: 'zoomOut', label: '缩小' },
                    { type: 'separator' },
                    { role: 'togglefullscreen', label: '全屏' }
                ]
            },
            {
                label: '工具',
                submenu: [
                    {
                        label: '历史记录',
                        accelerator: 'CmdOrCtrl+H',
                        click: () => this.mainWindow.webContents.send('menu-history')
                    },
                    {
                        label: '数据管理',
                        accelerator: 'CmdOrCtrl+D',
                        click: () => this.mainWindow.webContents.send('menu-data-management')
                    },
                    {
                        label: '设置',
                        accelerator: 'CmdOrCtrl+,',
                        click: () => this.mainWindow.webContents.send('menu-settings')
                    }
                ]
            },
            {
                label: '教育',
                submenu: [
                    {
                        label: '知识库',
                        click: () => this.mainWindow.webContents.send('menu-knowledge-base')
                    },
                    {
                        label: '历史事件',
                        click: () => this.mainWindow.webContents.send('menu-historical-events')
                    },
                    {
                        label: '交互式教程',
                        click: () => this.mainWindow.webContents.send('menu-tutorials')
                    },
                    {
                        label: '测验',
                        click: () => this.mainWindow.webContents.send('menu-quiz')
                    }
                ]
            },
            {
                label: '帮助',
                submenu: [
                    {
                        label: '关于 NuclearSim Pro',
                        click: () => this.showAboutDialog()
                    },
                    {
                        label: '检查更新',
                        click: () => autoUpdater.checkForUpdatesAndNotify()
                    },
                    { type: 'separator' },
                    {
                        label: '文档',
                        click: () => shell.openExternal('https://github.com/badhope/bumb/wiki')
                    },
                    {
                        label: '报告问题',
                        click: () => shell.openExternal('https://github.com/badhope/bumb/issues')
                    }
                ]
            }
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    setupIPC() {
        ipcMain.handle('db-run', (event, sql, params) => {
            try {
                return this.db.prepare(sql).run(...(params || []));
            } catch (error) {
                console.error('Database run error:', error);
                throw error;
            }
        });

        ipcMain.handle('db-get', (event, sql, params) => {
            try {
                return this.db.prepare(sql).get(...(params || []));
            } catch (error) {
                console.error('Database get error:', error);
                throw error;
            }
        });

        ipcMain.handle('db-all', (event, sql, params) => {
            try {
                return this.db.prepare(sql).all(...(params || []));
            } catch (error) {
                console.error('Database all error:', error);
                throw error;
            }
        });

        ipcMain.handle('window-minimize', () => {
            this.mainWindow.minimize();
        });

        ipcMain.handle('window-maximize', () => {
            if (this.mainWindow.isMaximized()) {
                this.mainWindow.unmaximize();
            } else {
                this.mainWindow.maximize();
            }
        });

        ipcMain.handle('window-close', () => {
            this.mainWindow.close();
        });

        ipcMain.handle('export-pdf', async (event, options) => {
            try {
                const pdfData = await this.mainWindow.webContents.printToPDF({
                    printBackground: true,
                    ...options
                });
                
                const { filePath } = await dialog.showSaveDialog(this.mainWindow, {
                    title: '保存PDF报告',
                    defaultPath: `nuclearsim-report-${Date.now()}.pdf`,
                    filters: [{ name: 'PDF', extensions: ['pdf'] }]
                });

                if (filePath) {
                    fs.writeFileSync(filePath, pdfData);
                    return { success: true, path: filePath };
                }
                return { success: false, error: 'User cancelled' };
            } catch (error) {
                console.error('Export PDF error:', error);
                return { success: false, error: error.message };
            }
        });

        ipcMain.handle('save-image', async (event, dataUrl, defaultName) => {
            try {
                const { filePath } = await dialog.showSaveDialog(this.mainWindow, {
                    title: '保存图片',
                    defaultPath: defaultName || `nuclearsim-${Date.now()}.png`,
                    filters: [
                        { name: 'PNG', extensions: ['png'] },
                        { name: 'JPEG', extensions: ['jpg', 'jpeg'] }
                    ]
                });

                if (filePath) {
                    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
                    return { success: true, path: filePath };
                }
                return { success: false, error: 'User cancelled' };
            } catch (error) {
                console.error('Save image error:', error);
                return { success: false, error: error.message };
            }
        });

        ipcMain.handle('get-app-version', () => {
            return app.getVersion();
        });

        ipcMain.handle('get-user-data-path', () => {
            return app.getPath('userData');
        });

        ipcMain.handle('open-external', (event, url) => {
            shell.openExternal(url);
        });
    }

    setupAutoUpdater() {
        autoUpdater.logger = console;
        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = true;

        autoUpdater.on('checking-for-update', () => {
            this.mainWindow?.webContents.send('update-checking');
        });

        autoUpdater.on('update-available', (info) => {
            this.mainWindow?.webContents.send('update-available', info);
        });

        autoUpdater.on('update-not-available', (info) => {
            this.mainWindow?.webContents.send('update-not-available', info);
        });

        autoUpdater.on('download-progress', (progress) => {
            this.mainWindow?.webContents.send('update-progress', progress);
        });

        autoUpdater.on('update-downloaded', (info) => {
            this.mainWindow?.webContents.send('update-downloaded', info);
        });

        autoUpdater.on('error', (error) => {
            this.mainWindow?.webContents.send('update-error', error.message);
        });

        ipcMain.handle('download-update', async () => {
            try {
                await autoUpdater.downloadUpdate();
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        ipcMain.handle('install-update', () => {
            autoUpdater.quitAndInstall();
        });

        if (process.env.NODE_ENV !== 'development') {
            app.whenReady().then(() => {
                setTimeout(() => {
                    autoUpdater.checkForUpdates();
                }, 3000);
            });
        }
    }

    setupAppEvents() {
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });

        app.on('before-quit', () => {
            this.isQuitting = true;
            if (this.db) {
                this.db.close();
            }
        });
    }

    showAboutDialog() {
        dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: '关于 NuclearSim Pro',
            message: 'NuclearSim Pro v' + app.getVersion(),
            detail: '专业级核武器效应模拟器\n\n用于教育和研究目的\n\n© 2026 NuclearSim Team\n\n本模拟器基于公开的物理模型和历史数据，结果仅供参考。'
        });
    }
}

const nuclearApp = new NuclearSimApp();
nuclearApp.init().catch(error => {
    console.error('Failed to initialize app:', error);
    dialog.showErrorBox('启动错误', '应用初始化失败: ' + error.message);
    app.quit();
});

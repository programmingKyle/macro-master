const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let isMaximized = false;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS macros (
    id INTEGER PRIMARY KEY,
    title TEXT,
    startDelay INT,
    loopCount TEXT,
    loopDelay TEXT,
    hotKey TEXT,
    macro TEXT
  )
`);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 815,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle('database-handler', (req, data) => {
  if (!data || !data.request) return;
  switch (data.request) {
    case 'Add':
      const addSuccess = addToDatabase(data.title);
      return addSuccess;
  }
});

function addToDatabase(title){
  const sql = 'INSERT INTO macros (title, startDelay, loopCount, loopDelay, hotKey, macro) VALUES (?, 0, 0, 0, ?, NULL)';

  return new Promise((resolve, reject) => {
    db.run(sql, [title, 'CTRL + F9'], (error) => {
      if (error) {
        console.error(error);
        reject(false);
      } else {
        resolve(true);
      }
    })
  });
}

ipcMain.handle('frame-handler', (req, data) => {
  if (!data || !data.request) return;
  switch(data.request){
    case 'Minimize':
      mainWindow.minimize();
      break;
    case 'Maximize':
      toggleMaximize();
      break;
    case 'Exit':
      mainWindow.close();
      break;
    }
});

function toggleMaximize(){
  if (isMaximized){
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
  isMaximized = !isMaximized;
}

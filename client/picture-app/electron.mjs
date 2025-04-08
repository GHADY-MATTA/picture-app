import { app, BrowserWindow } from 'electron';

console.log("💥 electron.js started");

function createWindow() {
  console.log("🪟 Creating a window...");

  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  console.log("🌐 Loading localhost:5173");
  win.loadURL('http://localhost:5174');

}

app.whenReady().then(() => {
  console.log("✅ App ready");
  createWindow();
});

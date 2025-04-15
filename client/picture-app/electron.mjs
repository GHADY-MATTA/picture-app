import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

console.log("💥 electron.js started");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preloadPath = path.resolve(__dirname, 'preload.js'); // ✅ note .js now

console.log("📦 Using preload from:", preloadPath);
function createWindow() {
  console.log("🪟 Creating a window...");

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false, // try this temporarily
      preload: preloadPath,
    },
  });

  console.log("🌐 Loading localhost:5173");
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  console.log("✅ App ready");
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ✅ Save image to local folder
ipcMain.handle('save-image', async (event, { name, data }) => {
  const picturesDir = path.join(os.homedir(), 'PicturesApp', 'images');
  fs.mkdirSync(picturesDir, { recursive: true });

  const filePath = path.join(picturesDir, name);
  fs.writeFileSync(filePath, Buffer.from(data));

  return `✅ Image saved to: ${filePath}`;
});

// ✅ Return all image paths with correct file:/// formatting
ipcMain.handle('get-images', () => {
  const dir = path.join(os.homedir(), 'PicturesApp', 'images');
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir);
  return files
    .filter(f => /\.(png|jpe?g|gif|bmp|webp)$/i.test(f))
    .map(f => ({
      name: f,
      path: 'file:///' + path.join(dir, f).replace(/\\/g, '/')
    }));
});

// ✅ Handle image deletion
ipcMain.handle('delete-image', async (event, { name }) => {
  try {
    const picturesDir = path.join(os.homedir(), 'PicturesApp', 'images');
    const filePath = path.join(picturesDir, name);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the image file
      console.log(`✅ Image deleted: ${filePath}`);
      return { success: true, message: 'Image deleted successfully.' };
    } else {
      console.log(`❌ Image not found: ${filePath}`);
      return { success: false, message: 'Image not found.' };
    }
  } catch (error) {
    console.log(`❌ Error deleting image: ${error.message}`);
    return { success: false, message: 'Failed to delete image.', error };
  }
});

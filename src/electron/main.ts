import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import {isDev} from './util.js';
import {getPreloadPath} from './pathResolver.js';
import { getSummonerData, getProfileData,getRankedData } from './summonerData.js';

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        }
    });

    ipcMain.handle('getSummonerData', async (event, username: string) => {
        try {
            return await getSummonerData(username);
        } 
        catch (err: unknown) {
            if (err instanceof Error) {
                return { error: err.message };
            } 
            else {
                return { error: String(err) };
            }
        }
    });


    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } 
    else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }

});
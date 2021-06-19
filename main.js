// Modules to control application life and create native browser window
const {
    app,
    dialog,
    ipcMain,
    BrowserWindow,
    Menu
} = require('electron');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

function readFileContents(filePath) {
    const lastSlashIndex = process.platform == 'win32' ? filePath.lastIndexOf("\\") : filePath.lastIndexOf("/");
    const fileName = filePath.substring(lastSlashIndex+1);
    const fileContent = readFileSync(filePath);
    // console.log(fileContent.toString());
    mainWindow.webContents.send('file-content', {
        fileName: fileName,
        filePath: filePath,
        fileContent: fileContent.toString()
    });
}

function openFile() {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then((file_paths) => {
        if(!file_paths.canceled) {
            readFileContents(file_paths.filePaths[0]); // Read the file contents of the first file selected
            // Enable save menu option
            mainMenuTemplate[0].submenu[1].enabled = true;
            // Rebuild menu
            const menu = Menu.buildFromTemplate(mainMenuTemplate);
            Menu.setApplicationMenu(menu);
        }
    });
}

function saveFile() {
    dialog.showMessageBox(
        mainWindow,
        {
            title: "Confirm Save",
            message: "Are you sure you want to save the file?",
            buttons: ["Save", "Cancel"],
            noLink: true
        }).then(response => {
            if(response.response === 0) {
                // Save
                mainWindow.webContents.send('save-file', null);
                ipcMain.on('save-file-content', (event, data) => {
                    const { fileContent, filePath } = data;
                    writeFileSync(filePath, fileContent);
                });
            } else {
                // Do nothing since it was cancelled
            }
        });
}

const mainMenuTemplate = [
    // Each object is a dropdown
    {
        label: 'File',
        submenu: [{
                label: 'Open',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click() {
                    openFile();
                }
            },
            {
                label: 'Save',
                accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                enabled: false,
                click() {
                    saveFile();
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Command+E' : 'Ctrl+E',
                click() {
                    app.quit();
                }
            }
        ]
    }
];


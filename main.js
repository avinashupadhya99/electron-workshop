// Modules to control application life and create native browser window
const {
    app,
    dialog,
    BrowserWindow,
    Menu
} = require('electron');
const { readFileSync } = require('fs');
const path = require('path')

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

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
    const fileContent = readFileSync(filePath);
    console.log(fileContent.toString());
}

function openFile() {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then((file_paths) => {
        if(!file_paths.canceled) {
            readFileContents(file_paths.filePaths[0]); // Read the file contents of the first file selected
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
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Command+E' : 'Ctrl+E',
                click() {
                    app.quit();
                }
            }
        ]
    }
];


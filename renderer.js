const electron = require('electron');
const {ipcRenderer} = electron;

const mainElement = document.getElementsByTagName('main')[0];
let filePath;

ipcRenderer.on('file-content', (event, data) => {
    mainElement.innerHTML = `
        <h1>${data.fileName}</h1>
        <div class="editor" contenteditable="true">${data.fileContent}</div>
    `;
    filePath = data.filePath;
});

ipcRenderer.on('save-file', (event, data) => {
    const newFileContent = document.getElementsByClassName("editor")[0].textContent;
    ipcRenderer.send('save-file-content', {
        fileContent: newFileContent,
        filePath: filePath
    });
});
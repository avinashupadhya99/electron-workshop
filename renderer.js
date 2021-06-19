const electron = require('electron');
const {ipcRenderer} = electron;

const mainElement = document.getElementsByTagName('main')[0];

ipcRenderer.on('file-content', (event, data) => {
    mainElement.innerHTML = `
        <h1>${data.fileName}</h1>
        <div class="editor" contenteditable="true">${data.fileContent}</div>
    `;
});
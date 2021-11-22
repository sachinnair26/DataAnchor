const { getToken } = require("./auth")
const { createFile, updateRequestFile } = require("./files")
const multer = require('multer');
const { processWebhook } = require("./processWebhook");
let upload = multer({ dest: '/' });
module.exports = (app) => {

    app.get('/auth', getToken)
    app.post('/createFile', upload.single('file'), createFile)
    app.post('/updateFile', upload.single('file'), updateRequestFile)
    app.post('/createdWebhook', processWebhook)
}
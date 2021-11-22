const { updateFile } = require("./utils")

function createFile(req, res) {
    if (req.file) {

        let filename = req.file.originalname
        req.client.api(`/drive/root:/Sachin/${filename}:/content`).put(req.file).then(value => {
            res.status(200)
            res.send(value)
        }).catch(error => {
            res.status(400)
            res.send(error)
        })
    } else {
        res.status(400)
        res.send({ message: 'File not found' })
    }
}

function updateRequestFile(req, res) {
    if (req.file) {
        updateFile(req, req.file, req.query.id).then(fileUpdated => {
            res.status(200)
            res.send(fileUpdated)
        }).catch(error => {
            res.status(400)
            res.send(error)
        })
    } else {
        res.status(400)
        res.send({ message: 'File not found' })
    }
}

module.exports = {
    createFile,
    updateRequestFile
}
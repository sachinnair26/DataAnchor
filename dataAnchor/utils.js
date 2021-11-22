const { default: axios } = require("axios")
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
const fs = require('fs');
const updateFile = async(req, file, id) => {
    return await req.client.api(`/drive/items/${id}/content`).put(file)
}

const getFileById = async(req, id) => {
    return await req.client.api(`/drive/items/${id}`).get()
}
const downloadFile = async(file) => {
    return await axios.get(`${file['@microsoft.graph.downloadUrl']}`, { responseType: 'arraybuffer' })
}

const getDelta = async(req) => {
    return await req.client.api(`/drive/root/delta`).get()
}

function encrypt(buffer) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted;
}

function decrypt(buffer) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return dec;
}
module.exports = {
    updateFile,
    getFileById,
    downloadFile,
    getDelta,
    encrypt,
    decrypt
}
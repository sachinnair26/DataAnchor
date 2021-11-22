const { default: axios } = require("axios");

const { updateFile, getFileById, downloadFile, getDelta, encrypt } = require("./utils");



async function processWebhook(req, res) {

    req.redis.get("delta", async(err, delta) => {
        if (err) {
            return err
        }
        delta = JSON.parse(delta)
        let new_delta = await getDelta(req) //getting latest delta values
        new_delta.value.forEach(async single_file => {

            const found = delta.value.find(single_delta_file => single_delta_file.parentReference.path === '/drive/root:/Sachin' ? single_delta_file.lastModifiedDateTime !== single_file.lastModifiedDateTime && single_delta_file.id === single_file.id && single_delta_file.parentReference.path === single_file.parentReference.path : false) //filtering delta values on the bases of lastmodifed 

            if (found) {
                let file = await getFileById(req, found.id)
                if (file['@microsoft.graph.downloadUrl']) {
                    let downloadedFile = await downloadFile(file) //Downloading the file using the download URL
                    var hw = encrypt(downloadedFile.data) //encrypting
                    await updateFile(req, hw, found.id)
                    let updated_delta = await getDelta(req) //updating file in the drive
                    req.redis.set('delta', JSON.stringify(updated_delta)) //updating delta to the latest
                }

            }
        })

    })

    res.status(200)
    res.send(req.query.validationToken)
}






module.exports = {
    processWebhook
}
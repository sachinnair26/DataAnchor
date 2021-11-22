const express = require('express')
const app = express()

// const axios = require('axios')
// axios.defaults.baseURL = 'https://graph.microsoft.com/v1.0';
const redis = require("redis");
const redisClient = redis.createClient({
    port: 6379,
    host: 'db'
});
redisClient.on("error", function(error) {
    console.error(error);
});
app.use(express.json())
app.use(express.urlencoded())

require('dotenv').config();
require('isomorphic-fetch')
const {
    Client
} = require("@microsoft/microsoft-graph-client");
const {
    TokenCredentialAuthenticationProvider
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const {
    ClientSecretCredential
} = require("@azure/identity");

const credential = new ClientSecretCredential(process.env.TENANT_ID, process.env.CLIENT_ID, process.env.CLIENT_SECRET);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default']
});

const client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider
});

function mid(req, res, next) {

    req.client = client
    req.redis = redisClient
    return next();
}
app.use(mid)

async function getDelta() {
    await client.api(`/drive/root/delta`).get().then(value => {

        redisClient.set('delta', JSON.stringify(value))
        return value
    }).catch(error => {
        return error
    })
}

getDelta()

require('./routes')(app)
app.get('/', (req, res) => {
    res.status(200)
    res.send({ message: "You reached the end of the world" })
})
app.listen(3000, () => {

    console.log('listening to PORt', 3000);
})
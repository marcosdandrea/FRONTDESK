

function begin (express){

    const backendApp = express;
    const backendServer = require('http').createServer(backendApp);

    socket.initSocket(backendServer);

    backendApp.use('/', express.static(path.join(__dirname, '../../backend')));

}


module.exports = {begin}
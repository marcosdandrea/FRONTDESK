  const express = require('express');
  const ChromeLauncher = require('chrome-launcher');
  const clientApp = express();
  const clientServer = require('http').createServer(clientApp);
  const path = require('path');
  const socket = require('./socket.js');
  const backendManager = require('./backend/backendManager')
  const logger = require("./logger")

  socket.initSocket(clientServer);
  backendManager.init();
  

  //path.join(path.dirname(process.execPath),
  clientApp.use(express.static(path.join(__dirname, '../public')));
  logger.info(path.join(__dirname, '../public'))

  clientServer.listen(3000, "0.0.0.0", () => {
    logger.info('Client server listening at port ' + 3000);
    //launchChrome()
  });

  function launchChrome() {
    ChromeLauncher.launch({
      port: 14687,
      startingUrl: 'http://localhost:3000',
      chromeFlags: ['--kiosk']
    }).then(chrome => {
      chrome.process.on('close', handleExit)
      logger.info(`Chrome debugging port running on ${chrome.port}`);
    });
  }

  function handleExit() {
    logger.warn("Chrome has exited... relaunching now");
    setTimeout(launchChrome, 1000);
  }


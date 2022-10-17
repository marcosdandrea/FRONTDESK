
const assetServices = require('./assetsServices')

function begin (app){

    app.get('/assets/comunications/icons', 
    assetServices.getAllIcons
    )

}

module.exports = { begin }
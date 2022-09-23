const assetsDAO = require('./assetsDAO')
const logger = require('../../../logger')

async function getAllIcons(req, res, next) {
    try{
        res.send(await assetsDAO.getAllIcons())
    }catch(err){
        logger.error(err.message)
        res.status(500).send(err.message)
    }
}

module.exports = { getAllIcons }
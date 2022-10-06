const assetsDAO = require('./assetsDAO')
const logger = require('../../../logger')

async function getAllIcons(req, res, next) {
    try{
        const answ = await assetsDAO.getAllIcons()
        const index = answ.findIndex( element => element.includes("videoNotAvailable"))
        answ.splice(index, 1)
        res.send (answ)
    }catch(err){
        logger.error(err.message)
        res.status(500).send(err.message)
    }
}

module.exports = { getAllIcons }
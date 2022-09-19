const DAO = require("./comunicationsDAO")

async function getComunication(req, res, next) {
    try{
        res.status(200).send(await DAO.getComunication())
    }catch(err){
        res.status(500)
    }
}

async function editComunication(req, res, next) {
    try{
        const data = req.body
        res.status(200).send(await DAO.editComunication(data))
    }catch(err){
        res.status(304)
    }
}

async function newComunication(req, res, next) {
    try{
        const title = req.body.title
        const paragraph = req.body.paragraph
        const media = req.body.media
        const show_new_badge_until = req.body.show_new_badge_until
        const data = {title, paragraph, media, show_new_badge_until}
        res.status(200).send(await DAO.newComunication(data))
    }catch(err){
        res.status(304)
    }
}

async function deleteComunication(req, res, next) {
    try{
        const id = req.body.id
        res.status(200).send(await DAO.deleteComunication(id))
    }catch(err){
        res.status(304)
    }
}

module.exports = { getComunication, editComunication, newComunication, deleteComunication }
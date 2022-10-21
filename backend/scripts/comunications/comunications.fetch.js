
async function makeFetch(URL, port, options) {
    return new Promise(async (resolve, reject) => {
        try {
            const endpoint = serverULR + ":" + port + URL
            const res = await fetch(endpoint, options)
            let parsedRes = res.json()
            resolve(parsedRes)
        } catch (err) {
            console.log (err.message)
            reject(err.message)
        }
    })
}

export default makeFetch  
async function makeFetch(URL, options) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(URL, options)
            let parsedRes
            parsedRes = res.json()
            resolve(parsedRes)
        } catch (err) {
            reject(err.message)
        }
    })
}

export default makeFetch  
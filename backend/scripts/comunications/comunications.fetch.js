async function makeFetch(URL, options) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(URL, options)
            if (res.stats != 200) return
            let parsedRes = res.json()
            resolve(parsedRes)
        } catch (err) {
            console.log (err.message)
            reject(err.message)
        }
    })
}

export default makeFetch  
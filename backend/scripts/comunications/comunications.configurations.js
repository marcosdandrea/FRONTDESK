
function printConfig(configData) {


    //const configTitle = document.getElementById('configTitle');
    //const configFooter = document.getElementById('configFooter');
    //const comunication_duration = document.getElementById('comunication_duration');
    //const comunication_interval = document.getElementById('comunication_interval');
    //const configId = document.getElementsByClassName('comunicationsConfig')[0]
    configId.setAttribute("id", configData.id);

    configTitle.value = configData.title
    configFooter.value = configData.footer
    comunication_duration.value = configData.comunication_duration
    comunication_interval.value = configData.comunication_interval

    for (let i = 0; i < configInputs.length; i++) {
        configInputs[i].addEventListener('change', waitToSendConfig)

    }

}

async function getConfig() {

    try {
        const res = await fetch("http://localhost:3100/comunications/config")
        configs = await res.json();
        return configs
    } catch (error) {
        console.log(error);
    }

}

function waitToSendConfig() {

    if (sender) clearTimeout(sender);
    sender = setTimeout(sendConfig(this), delayToSend)

}

function sendConfig(selectedInput) {
    const inputsToSend = selectedInput.closest('.comunicationsConfig')

    const title = inputsToSend.querySelector('#configTitle').value
    const footer = inputsToSend.querySelector('#configFooter').value
    const comunication_duration = inputsToSend.querySelector('#comunication_duration').value
    const comunication_interval = inputsToSend.querySelector('#comunication_interval').value
    /*     let show_new_badge_until = inputsToSend.querySelector('#show_new_badge_until').value
        const today = new Date().toLocaleDateString('en-ca')
        const splitedDate = show_new_badge_until.split('-')
        const show_new_badge_untilParsed = splitedDate[2] + '/' + splitedDate[1] + '/' + splitedDate[0] */

    const id = inputsToSend.id

    const data = {
        title,
        footer,
        comunication_duration,
        comunication_interval
    }

    const options = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch("http://localhost:3100/comunications/config", options)

}

export { getConfig, printConfig }
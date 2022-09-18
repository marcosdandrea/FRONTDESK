
const endDate = new Date("Wed Sep 21 2022 09:46:44 GMT-0300 (hora estándar de Argentina)")
//const endDate = new Date("Thu Sep 8 2022 09:46:44 GMT-0300 (hora estándar de Argentina)")

const today = new Date()

if (today > endDate ){
    const comunications = document.querySelector(".comunications")
    comunications.style.display = "none"
}


// Very weird bug, cant change '#calc_on' to '#calc', popup page will not show checkboxes.
import doCheckBoxStuff from "./check.js"

let calc = document.querySelector("#calc_on")
let google = document.querySelector("#google_on")

doCheckBoxStuff(calc)
doCheckBoxStuff(google)

/* ======================= */
/* global scoped variables */
/* ======================= */
let toggleFlag = false
let urlIncludesModules = location.href.includes("modules")

function onTripleClick(element, callback) {
    var timer,
        timeout = 200

    // Listen for double click
    element.addEventListener("dblclick", () => {
        timer = setTimeout(() => {
            timer = null
        }, timeout)
    })

    // Listen for single click right after
    element.addEventListener("click", () => {
        if (timer) {
            clearTimeout(timer)
            timer = null
            callback()
        }
    })
}

function toggle(element, transitionTime = 500) {
    // turn off
    if (toggleFlag == false) {
        element.style.opacity = "0"
        setTimeout(() => {
            element.style.display = "none"
            toggleFlag = true
        }, transitionTime + 100)

        saveToggleState()
        // Unneeded
        console.log("off")
    }

    // turn on
    if (toggleFlag == true) {
        element.style.display = "flex"
        setTimeout(() => {
            element.style.opacity = "1"
            toggleFlag = false
        }, 50)

        saveToggleState()
        // Unneeded
        console.log("on")
    }
}

// save toggle state to localStorage
function saveToggleState() {
    let tempFlag = toggleFlag ? "off" : "on"
    localStorage.setItem("state", tempFlag)
}

// decide which element to inject widget into
function findInjectElement() {
    var element
    if (window.location.pathname == "/") {
        // If on home page
        element = document.querySelector("#right-side-wrapper")
    } else if (urlIncludesModules) {
        // If on course home page
        element = document.querySelector("#left-side")
    } else {
        // assignments page, quiz page
        element = document.querySelector("#right-side-wrapper #right-side")
    }
    return element
}

function element(type) {
    return document.createElement(type)
}

function calculateWidgetHeight() {
    let windowHeight = document.body.scrollHeight
    let contentHeight = document.querySelector("#not_right_side").clientHeight
    let rightSide = document.querySelector("#right-side")
    let rightSideHeight = rightSide.clientHeight
    let CanvasNotes = document.querySelector("#CanvasNotes")

    if (rightSide.hasChildNodes() && !CanvasNotes) {
        if (CanvasNotes) {
            rightSideHeight += CanvasNotes.clientHeight
        }
    }
}
calculateWidgetHeight()
// Create and inject widget
let injectELement = findInjectElement()
let container = element("div")
let textarea = element("textarea")
container.id = "CanvasNotes"

container.appendChild(textarea)
injectELement.appendChild(container)

// Restore notes
let content = localStorage.getItem("notes")
if (content) {
    textarea.textContent = content
}

// listen for triple click
onTripleClick(window, () => {
    toggle(container)
    saveToggleState()
})

// Store notes
textarea.addEventListener("keydown", () =>
    localStorage.setItem("notes", textarea.value)
)

// If on modules page, do some styling stuff
if (urlIncludesModules) {
    container.style = "margin-left: 2em"
}

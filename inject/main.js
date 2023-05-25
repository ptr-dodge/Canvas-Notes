let urlIncludesModules = location.href.includes("modules")

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

function calculateWidgetHeight(widgetContainer) {
    // let windowHeight = document.body.scrollHeight
    // let contentHeight = document.querySelector("#not_right_side").clientHeight

    // sidebar element
    let rightSide = document.getElementById("right-side")
    let rightSideHeight = rightSide.clientHeight

    // 
    if (rightSide.hasChildNodes() && !widgetContainer) {
        if (widgetContainer) {
            rightSideHeight += widgetContainer.clientHeight
        }
    }

    return rightSideHeight
}

function createWidget(id) {
    // create a div
    let container = element("div")

    // set the id
    container.id = id

    // create textarea
    let textarea = element("textarea")

    // make textarea a child of container
    container.appendChild(textarea)

    return container
}

function listenForTripleClick(element, callback) {
    // counter
    let clickCount = 0;

    // number of clicks we want
    const clickThreshold = 3;

    // Adjust the duration as needed (in milliseconds)
    const timeoutDuration = 350;

    // for keeping track of the intervals
    let timeoutID;

    function handleClick() {
        // increment the counter
        clickCount++;

        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            if (clickCount === clickThreshold) {
                callback();
            }
            // reset counter after we check if we clicked enough times
            clickCount = 0;
        }, timeoutDuration);
    }

    // attach listener for element
    element.addEventListener('click', handleClick);
}

// toggle the visibility of an element
function toggle(toggleElement) {
    // get the toggle state of the element
    getFromStorage('toggle', storage => {

        let isVisible = storage.toggle

        if (isVisible === undefined) {
            // if the toggle state hasn't been set yet, set it to false
            sendToStorage({toggle: false})
        } else {
            // if its visible (true), hide it
            // if its invisible (false), show it
            if (isVisible == false) {
                showElement(toggleElement)
            } else if (isVisible == true) {
                hideElement(toggleElement)
            }

            function showElement(e) {
                /*
                    interesting note:
                    if you triple click before the page is done loading,
                    the transition will be choppy, because the page
                    hasn't finished loading the stylesheet.

                    oh yeah, the fading transition is handled in the CSS, not here
                */

                // show the element
                e.style.display = "flex"

                setTimeout(() => {
                    e.style.opacity = "1"

                    // invert the flag
                    isVisible = !isVisible

                    // save the flag in storage, to be retrieved next triple click
                    sendToStorage({toggle: isVisible})
                    // we need just enough time for the element to be placed back in the DOM
                }, 75)

                // console.log("on")
            }

            function hideElement(e) {
                // hide the element
                e.style.opacity = "0"

                setTimeout(() => {
                    e.style.display = "none"

                    // invert the flag
                    isVisible = !isVisible

                    // save the flag in storage, to be retrieved next triple click
                    sendToStorage({toggle: isVisible})
                    // remove the element 500 ms after it is not visible
                }, 500)

                // console.log("off")
            }
        }
    });
}

function getFromStorage(item, callback) {
    chrome.storage.sync.get(item, result => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            callback(result)
        }
    })
}

function sendToStorage(object, callback) {
    chrome.storage.sync.set(object, () => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            if(callback) callback()
        }
    })
}


// Create and inject widget
let container = createWidget("CanvasNotes")
let textarea = container.querySelector("textarea")
let injectELement = findInjectElement()
injectELement.appendChild(container)

container.clientHeight = calculateWidgetHeight(container)

// Restore notes
getFromStorage('notes', storage => {
    textarea.textContent = storage?.notes
})

// Store notes
textarea.addEventListener("keydown", () =>
    sendToStorage({ 'notes': textarea.value })
)

// listen for triple click
listenForTripleClick(window, () => {
    toggle(container)
});

// If on modules page, do some styling stuff
if (urlIncludesModules) {
    container.style = "margin-left: 2em"
}


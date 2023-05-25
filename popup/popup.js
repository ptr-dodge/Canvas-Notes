// build a list of true and false values based on the checkboxes
// set the list in storage
// call the list and update the checks

function setChecks() {
    document.querySelector(".checkBoxes").addEventListener('change', e => {
        let checkBox = e.target
        let storage = {checks: [].push(checkBox.checked)}
        chrome.storage.sync.set(storage)
        updateChecks()
    })
}

function updateChecks() {
    chrome.storage.sync.get('checks', checksObj => {
        console.log(checksObj)
    })
}

setChecks()
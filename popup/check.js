export default function doCheckBoxStuff(element) {
  let val = localStorage.getItem(`${element.id}_state`)
  // needs JSON.parse() to convert string 'true' to bool true
  element.checked = JSON.parse(val)

  element.addEventListener("change", () => {
    // console.log(element.checked)
    localStorage.setItem(`${element.id}_state`, element.checked)
  })
}

const errorMsgBox = document.querySelector('#errorMsgBox')

const showErrorMsg = () => {
  errorMsgBox.classList.add('hidden')
}

setTimeout(() => {
  showErrorMsg()
}, 3000)

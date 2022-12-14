const editBtnList = document.querySelectorAll('.editBtn')
const cancelBtnList = document.querySelectorAll('.cancelModalBtn')
const dltBtnList = document.querySelectorAll('.dltBtn')
const editModalList = document.querySelectorAll('.editModal')
const dltModalList = document.querySelectorAll('.dltModal')

const editBtnHandler = (e) => {
  editBtnList.forEach((btn, index) => {
    if (btn === e.target.parentElement) {
      editModalList[index].classList.replace('hidden', 'flex')
    }
  })
}
const cancelBtnHandler = (e) => {
  e.target.parentElement.parentElement.parentElement.parentElement.classList.replace(
    'flex',
    'hidden'
  )
}
const dltBtnHandler = (e) => {
  dltBtnList.forEach((btn, index) => {
    if (btn === e.target.parentElement) {
      dltModalList[index].classList.replace('hidden', 'flex')
    }
  })
}

editBtnList.forEach((btn) => {
  btn.addEventListener('click', editBtnHandler)
})
dltBtnList.forEach((btn) => {
  btn.addEventListener('click', dltBtnHandler)
})
cancelBtnList.forEach((btn) => {
  btn.addEventListener('click', cancelBtnHandler)
})

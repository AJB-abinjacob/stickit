const addressDiv = document.querySelectorAll('.addressDiv')
const addressBtn = document.querySelectorAll('.addressBtn')
const addressIndicator = document.querySelectorAll('.addressIndicator')
const changeAddressBtn = document.querySelector('#changeAddressBtn')
const addNewAddressDiv = document.querySelector('#addNewAddressDiv')
const addNewAddressForm = document.querySelector('#addNewAddressForm')
const addressCancelBtn = document.querySelector('#addressCancelBtn')

const addressBtnHandler = (e) => {
  addressDiv.forEach((item) => {
    if (item !== e.target.parentNode) {
      item.classList.add('hidden') // hiding all other addresses
    }
  })
  e.target.parentNode.classList.remove('border-t') // removing the border-t from the current address
  e.target.parentNode.children[0].children[0].children[0].classList.replace(
    'bg-veryLightGray',
    'bg-turquoise'
  ) // changing the background of the span near the address title
  changeAddressBtn.classList.remove('hidden') // showing the change address button
  e.target.classList.add('hidden') // hiding the current deliver here button
  addNewAddressDiv.classList.add('hidden')
  addNewAddressForm.classList.add('hidden')
}

const changeAddressBtnHandler = (e) => {
  addressDiv.forEach((item) => {
    item.classList.remove('hidden')
    e.target.classList.add('hidden')
  })
  addressBtn.forEach((btn) => {
    btn.classList.remove('hidden')
  })
  addressIndicator.forEach((item) => {
    item.classList.replace('bg-turquoise', 'bg-veryLightGray')
  })
  addNewAddressDiv.classList.remove('hidden')
}

const addNewAddressDivHandler = (e) => {
  if (addNewAddressForm.classList.contains('hidden')) {
    addNewAddressForm.classList.remove('hidden')
  } else {
    addNewAddressForm.classList.add('hidden')
  }
}
const addressCancelBtnHandler = (e) => {
  addNewAddressForm.classList.add('hidden')
}

// event handlers
if (addressBtn) {
  addressBtn.forEach((btn) => {
    btn.addEventListener('click', addressBtnHandler)
  })
}
if (changeAddressBtn) {
  changeAddressBtn.addEventListener('click', changeAddressBtnHandler)
}
if (addNewAddressDiv) {
  addNewAddressDiv.addEventListener('click', addNewAddressDivHandler)
}

addressCancelBtn.addEventListener('click', addressCancelBtnHandler)

// total price div
const paynowBtn = document.querySelector('#paynowBtn')
const totalPrice = document.querySelectorAll('.totalPrice')
const subTotalPrice = document.querySelector('#subTotalPrice')
const toalPayable = document.querySelector('#toalPayable')
const discount = document.querySelector('#discount')
const amountInput = document.querySelector('#amountInput')

let sum = 0
totalPrice.forEach((item) => {
  sum += parseInt(item.innerText)
})

subTotalPrice.innerText = sum
toalPayable.innerText = sum - parseInt(discount.innerText)
paynowBtn.innerText = sum - parseInt(discount.innerText)
amountInput.value = sum - parseInt(discount.innerText)

// apply coupon code
const applyBtn = document.querySelector('#applyBtn')
const coupon = document.querySelector('#coupon')
const discountDiv = document.querySelector('#discountDiv')

const applyCouponHandler = (e) => {
  const amount =
    coupon.options[coupon.selectedIndex].getAttribute('data-amount')
  discountDiv.classList.replace('hidden', 'flex')
  discount.innerText = amount
  toalPayable.innerText = sum - parseInt(discount.innerText)
  paynowBtn.innerText = sum - parseInt(discount.innerText)
  amountInput.value = sum - parseInt(discount.innerText)
}

applyBtn.addEventListener('click', applyCouponHandler)

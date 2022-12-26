const subtotal = document.getElementById('subtotal')
const subTotalPrice = document.getElementById('subTotalPrice')
const decrementButtons = document.querySelectorAll(
  'button[data-action="decrement"]'
)
const incrementButtons = document.querySelectorAll(
  'button[data-action="increment"]'
)
const values = []

document.querySelectorAll('.totalPrice').forEach((el) => {
  values.push(parseInt(el.textContent.replace(/,/g, '').trim()))
})
const sum = values.reduce((a, b) => a + b, 0)

subtotal.value = sum
subTotalPrice.innerText = sum

// increment and decrement
const decrement = async (e) => {
  const productId =
    e.target.parentElement.parentElement.parentElement.parentElement.children[1]
      .value
  const btn = e.target.parentNode.parentElement.querySelector(
    'button[data-action="decrement"]'
  )
  const target = btn.nextElementSibling
  let value = Number(target.value)
  if (value > 1) {
    value--
    target.value = value
    const response = await fetch(`/decrement-quantity/${productId}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    })
    const responseValue = await response.json()
    console.log(responseValue)
    const prodPrice = parseInt(
      e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[1].innerText.slice(
        1,
        -3
      )
    )
    const totalPriceEl =
      e.target.parentElement.parentElement.parentElement.children[1].children[0]
    const totalPrice = parseInt(totalPriceEl.innerText)
    const updatedProdPrice = totalPrice - prodPrice
    totalPriceEl.innerText = updatedProdPrice
    subTotalPrice.innerText = parseInt(subTotalPrice.innerText) - prodPrice
  }
}
const increment = async (e) => {
  const productId =
    e.target.parentElement.parentElement.parentElement.parentElement.children[1]
      .value
  const data = { quantity: 1 }
  const btn = e.target.parentNode.parentElement.querySelector(
    'button[data-action="decrement"]'
  )
  const target = btn.nextElementSibling
  let value = Number(target.value)
  if (value < 10) {
    value++
    target.value = value
    const response = await fetch(`/add-to-cart/${productId}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const responseValue = await response.json()
    console.log(responseValue)
    const prodPrice = parseInt(
      e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[1].innerText.slice(
        1,
        -3
      )
    )
    const totalPriceEl =
      e.target.parentElement.parentElement.parentElement.children[1].children[0]
    const totalPrice = parseInt(totalPriceEl.innerText)
    const updatedProdPrice = totalPrice + prodPrice
    totalPriceEl.innerText = updatedProdPrice
    subTotalPrice.innerText = parseInt(subTotalPrice.innerText) + prodPrice
  }
}

decrementButtons.forEach((btn) => {
  btn.addEventListener('click', decrement)
})

incrementButtons.forEach((btn) => {
  btn.addEventListener('click', increment)
})

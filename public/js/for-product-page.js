const addToCartBtn = document.querySelector('#addToCartBtn')
const addToWishlistBtn = document.querySelector('#addToWishlistBtn')
const removeFromWishlistBtn = document.querySelector('#removeFromWishlistBtn')
const addedToCartAlert = document.querySelector('#addedToCartAlert')
const productId = document.querySelector('#productId').value

const addToCartBtnHandler = async (e) => {
  const quantity = document.getElementById('quantity').value
  const data = { quantity }
  const response = await fetch(`/add-to-cart/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const value = await response.json()
  console.log(value)
  addedToCartAlert.classList.replace('hidden', 'flex')
  setTimeout(() => {
    addedToCartAlert.classList.replace('flex', 'hidden')
  }, 1100)
}

async function addToWishlistBtnHandler (e) {
  const data = { productId }
  const response = await fetch(`/add-to-wishlist/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const value = await response.json()
  console.log(value)
  const heartEl = document.createElement('i')
  heartEl.setAttribute('id', 'removeFromWishlistBtn')
  heartEl.classList.add(
    'bi',
    'bi-heart-fill',
    'cursor-pointer',
    'text-2xl',
    'text-red-500',
    'hover:text-red-600',
    'transition-all'
  )
  heartEl.addEventListener('click', removeFromWishlistBtnHandler)
  e.target.parentNode.replaceChild(heartEl, e.target)
}

async function removeFromWishlistBtnHandler (e) {
  const data = { productId }
  const response = await fetch(`/remove-from-wishlist/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const value = await response.json()
  console.log(value)
  const heartOutlineEl = document.createElement('i')
  heartOutlineEl.classList.add(
    'bi',
    'bi-heart',
    'cursor-pointer',
    'text-2xl',
    'hover:text-red-600',
    'transition-all'
  )
  heartOutlineEl.setAttribute('id', 'addToWishlistBtn')
  heartOutlineEl.addEventListener('click', addToWishlistBtnHandler)
  e.target.parentNode.replaceChild(heartOutlineEl, e.target)
}

addToCartBtn.addEventListener('click', addToCartBtnHandler)
addToWishlistBtn.addEventListener('click', addToWishlistBtnHandler)
removeFromWishlistBtn.addEventListener('click', removeFromWishlistBtnHandler)

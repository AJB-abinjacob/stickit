// should add buy now

const addToCartBtns = document.querySelectorAll('.addToCartBtn')
const addToWishlistBtns = document.querySelectorAll('.addToWishlist')
const removeFromWishlistBtns = document.querySelectorAll('.removeFromWishlist')
const quantity = document.querySelector('#quantity').value

async function ajaxAddToCart (e) {
  const productId =
    e.target.parentElement.parentElement.parentElement.children[1].value
  const data = {
    quantity
  }
  const response = await fetch(`/add-to-cart/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const value = await response.json()
  console.log(value)
  e.target.parentElement.parentElement.parentElement.children[2].classList.replace(
    'hidden',
    'flex'
  )
  setTimeout(() => {
    e.target.parentElement.parentElement.parentElement.children[2].classList.replace(
      'flex',
      'hidden'
    )
  }, 1100)
}

async function ajaxAddToWishlist (e) {
  const productId =
    e.target.parentElement.parentElement.parentElement.children[1].value
  const data = {
    productId
  }
  const response = await fetch(`/add-to-wishlist/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const value = await response.json()
  console.log(value)
  const heartEl = document.createElement('i')
  heartEl.classList.add('removeFromWishlist', 'bi', 'bi-heart-fill', 'cursor-pointer', 'text-2xl', 'text-red-500', 'hover:text-red-600', 'transition-all', 'animate-slide-down')
  heartEl.addEventListener('click', ajaxRemoveFromWishlist)
  e.target.parentNode.replaceChild(heartEl, e.target)
}

async function ajaxRemoveFromWishlist (e) {
  const productId =
    e.target.parentElement.parentElement.parentElement.children[1].value
  const data = {
    productId
  }
  const response = await fetch(`/remove-from-wishlist/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const value = await response.json()
  console.log(value)
  const heartOutlineEl = document.createElement('i')
  heartOutlineEl.classList.add('addToWishlist', 'bi', 'bi-heart', 'cursor-pointer', 'text-2xl', 'hover:text-red-600', 'transition-all', 'animate-slide-down')
  heartOutlineEl.addEventListener('click', ajaxAddToWishlist)
  e.target.parentNode.replaceChild(heartOutlineEl, e.target)
}

addToCartBtns.forEach((addToCartBtn) =>
  addToCartBtn.addEventListener('click', ajaxAddToCart)
)
addToWishlistBtns.forEach((addToWishlistBtn) => {
  addToWishlistBtn.addEventListener('click', ajaxAddToWishlist)
})
removeFromWishlistBtns.forEach((removeFromWishlistBtn) => {
  removeFromWishlistBtn.addEventListener('click', ajaxRemoveFromWishlist)
})

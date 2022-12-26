const addToCartBtns = document.querySelectorAll('.addToCartBtn')
const removeFromWishlistBtns = document.querySelectorAll('.removeFromWishlist')
const addedToCartAlert = document.querySelector('#addedToCartAlert')
const removedFromWishlist = document.querySelector('#removedFromWishlist')

async function addToCartHandler (e) {
  const productId = e.target.nextElementSibling.value
  const data = {
    quantity: 1
  }
  const wishlistData = {
    productId
  }
  const cartResponse = await fetch(`/add-to-cart/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const cartValue = await cartResponse.json()
  console.log(cartValue)

  const wishlistResponse = await fetch(`/remove-from-wishlist/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wishlistData)
  })
  const wishlistValue = await wishlistResponse.json()
  console.log(wishlistValue)
  addedToCartAlert.classList.replace('hidden', 'flex')
  setTimeout(() => {
    addedToCartAlert.classList.replace('flex', 'hidden')
  }, 1100)
  e.target.parentElement.parentElement.remove()
}

async function removeFromWishlistHandler (e) {
  const productId = e.target.previousElementSibling.value
  console.log(productId)
  const wishlistData = {
    productId
  }
  const wishlistResponse = await fetch(`/remove-from-wishlist/${productId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wishlistData)
  })
  const wishlistValue = await wishlistResponse.json()
  console.log(wishlistValue)
  removedFromWishlist.classList.replace('hidden', 'flex')
  setTimeout(() => {
    removedFromWishlist.classList.replace('flex', 'hidden')
  }, 1100)
  e.target.parentElement.parentElement.remove()
}

addToCartBtns.forEach((addToCartBtn) => {
  addToCartBtn.addEventListener('click', addToCartHandler)
})
removeFromWishlistBtns.forEach((removeFromWishlistBtn) => {
  removeFromWishlistBtn.addEventListener('click', removeFromWishlistHandler)
})

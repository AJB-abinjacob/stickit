const selectInput = document.getElementById('orderStatus')
const orderId = document.getElementById('orderId')

selectInput.addEventListener('change', async (e) => {
  const data = {
    id: orderId.value,
    status: selectInput.value
  }
  await fetch('/admin/update-order-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  location.reload()
})

const deleteProduct = btn => {
  const id = btn.parentNode.querySelector('[name=productId]').value,
    csrf = btn.parentNode.querySelector('[name=_csrf]').value,
    element = btn.closest('article');
  fetch('/admin/product' + id, {
    method: 'DELETE',
    headers: { 'csrf-token': csrf }
  }).then(element.remove()).catch(console.log);
}
const elements = []

export function addElement(element) {
  console.log('add', element)
  elements.push(element)
}

export function removeElement(element) {
  console.log('remove', element)
  const index = elements.findIndex(item => item == element)
  elements.splice(index, 1)
}

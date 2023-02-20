import { gridX, gridY } from "./canvas.js"

const elements = []

function nextId() {
  if(elements.length === 0) return "e0"
  return `e${Math.max(...elements.map(elm => parseInt(elm.id.slice(1), 10)))+1}`  
}

export function nextInput() {
  const inputs = elements.filter(elm => elm.type === 'INPUT')
  if(inputs.length === 0) return "in0"
  return `in${Math.max(...inputs.map(elm => parseInt(elm.getLabel().slice(2), 10)))+1}`
}

export function nextOutput() {
  const outputs = elements.filter(elm => elm.type === 'OUTPUT')
  if(outputs.length === 0) return "out0"
  return `out${Math.max(...outputs.map(elm => parseInt(elm.getLabel().slice(3), 10)))+1}`
}

export function addElement(element) {
  const id = nextId()
  element.id = id
  elements.push(element)
  setTimeout(() => {
    console.log(toObj())
  }, 100)
}

export function removeElement(element) {
  const index = elements.findIndex(item => item == element)
  elements.splice(index, 1)
  setTimeout(() => {
    console.log(toObj())
  }, 100)
}

export function toObj() {
  const res = []
  for(const elm of elements) {
    const obj = elm.toObj()
    res.push(obj)
  }
  return res
}

export function toJson() {
  return JSON.stringify(toObj())
}

export function fromObj(objs) {

}

export function fromJson(json) {
  fromObj(JSON.parse(json))
}

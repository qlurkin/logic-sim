import { Connector } from './connector.js'
import { UiChip } from './ui_chip.js'
import { grid2X, grid2Y, gridX, gridY } from './canvas.js'
import { dirty } from './current.js'
import { addJob } from './randomExecutionQueue.js'

export function NOT() {
  const in0 = Connector('in')
  const out = Connector('out')

  function compute() {
      const a = in0.getState()
      out.setState(!a)
  }

  function observer() {
    addJob(compute)
  }

  function outObserver() {
    setTimeout(compute, 100)
  }

  in0.connect(observer)
  out.connect(outObserver)

  return {
    inputs: [in0],
    outputs: [out],
    destroy: () => {
      in0.disconnect(observer)
      out.disconnect(outObserver)
      in0.destroy()
      out.destroy()
    }
  }
}

function ui(canvas, x, y, logic, id) {
  const element = UiChip(canvas, 'NOT', logic, '#f55', id).move(x, y)
  element.type = 'NOT'
  element.toObj = () => {
    return {
      id: element.id,
      type: element.type,
      x: gridX(element.x()),
      y: gridY(element.y())
    }
  }
  return element
}

function create(canvas, x, y) {
  const logic = NOT()
  const elem = ui(canvas, x, y, logic)
  dirty()
  return elem
}

function logicFromObj(_obj) {
  return NOT()
}

function createFromObj(canvas, obj) {
  const logic = logicFromObj(obj)
  return ui(canvas, grid2X(obj.x), grid2Y(obj.y), logic, obj.id)
}

export default {
  logic: NOT,
  ui,
  create,
  logicFromObj,
  createFromObj,
}

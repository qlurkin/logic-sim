import {timing} from './config.js'
import { Color } from './svg.esm.js'


export function Wire(in0, out) {
    function inObserver(state) {
        setTimeout(() => {
            out.setState(state)
        }, timing)
        
    }

    in0.connect(inObserver)

    function outObserver() {
        setTimeout(() => {
            out.setState(in0.getState())
        }, timing)
    }
    out.connect(outObserver)

    return {
        destroy: () => {
            in0.disconnect(inObserver)
            out.disconnect(outObserver)
            out.reset()
        },
        inputs: [in0],
        outputs: [out]
    }
}

function ui(canvas, uiConnector0, uiConnector1, wire) {
    const line = canvas.line(uiConnector0.x(), uiConnector0.y(), uiConnector1.x(), uiConnector1.y())
    const width = 2

    function observer() {
        let count = 0
        if(uiConnector0.connector.getState()) {
            count += 1
        }
        if(uiConnector1.connector.getState()) {
            count += 1
        }
        line.stroke({width, color: (new Color({r: (count/2)*255, g:0, b:0})).toHex()})
    }

    uiConnector0.connector.connect(observer)
    uiConnector1.connector.connect(observer)

    function positionObserver() {
        line.plot(uiConnector0.x(), uiConnector0.y(), uiConnector1.x(), uiConnector1.y())
    }

    uiConnector0.connect(positionObserver)
    uiConnector1.connect(positionObserver)

    function destroyObserver() {
        uiConnector0.connector.disconnect(observer)
        uiConnector1.connector.disconnect(observer)
        uiConnector0.disconnect(positionObserver)
        uiConnector1.disconnect(positionObserver)
        uiConnector0.off('destroy', destroyObserver)
        uiConnector1.off('destroy', destroyObserver)
        wire.destroy()
        line.remove()
    }

    uiConnector0.on('destroy', destroyObserver)
    uiConnector1.on('destroy', destroyObserver)

    const that = {
        ends: [
            uiConnector0,
            uiConnector1
        ]
    }

    return that
}

function create(canvas, uiConnector0, uiConnector1) {
    const uiConnectorIn = uiConnector0.isInput() ? uiConnector1 : uiConnector0
    const uiConnectorOut = uiConnector0.isInput() ? uiConnector0 : uiConnector1
    const logic = Wire(uiConnectorIn.connector, uiConnectorOut.connector)
    return ui(canvas, uiConnectorIn, uiConnectorOut, logic)
}

export default {
    logic: Wire,
    ui,
    create
}
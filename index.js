
class TuringMachine {
    width = 10
    height = 10
    fillWith = 0

    carriageX = 0
    carriageY = 0

    constructor(w, h, f) {
        this.width = w
        this.height = h
        this.fillWith = f
        this.state = Array(w).fill(Array(h).fill(f))
    }

}


let tm = new TuringMachine(10, 10, 0)

const parametersLayout = {
    "type": "container",
    "title": "Parameters",
    "items": [
        {
            "type": "container",
            "title": "Grid",
            "items": [
                {
                    "type": "input",
                    "title": "Width",
                    "valueType": "int",
                    "default": tm.width,
                },
                {
                    "type": "input",
                    "title": "Height",
                    "valueType": "int",
                    "default": tm.height,
                },
                {
                    "type": "input",
                    "title": "Fill with",
                    "valueType": "text",
                    "default": tm.fillWith,
                }
            ]
        },
        {
            "type": "button",
            "title": "Apply",
            "action": onApplySettingsButton
        },
        {
            "type": "container",
            "title": "Turing Machine",
            "items": [
                {
                    "type": "textarea",
                    "title": "Rules",
                    "valueType": "text"
                },
                {
                    "type": "button",
                    "title": "Step",
                    "action": ()=>alert("Step")
                },
                {
                    "type": "button",
                    "title": "Run",
                    "action": ()=>alert("Run")
                }
            ]
        }
    ]
}

function onApplySettingsButton() {
    const prms = getParameters(parametersLayout)
    console.log(prms)
    const { width, height, fill_with } = prms["grid"]
    tm = new TuringMachine(width, height, fill_with)
    render()
}

function renderParameters(prms) {
    const left_bar = document.getElementById("left-bar")
    left_bar.innerHTML = ''
    const x = parameters2Html(prms)
    left_bar.appendChild(x)
}

function getParameters(prm, parentId = "") {
    const elementId = getParameterId(prm, parentId)
    switch (prm.type) {
        case "container": {
            return prm.items
                .filter(i => !["button"].includes(i.type))
                .reduce((acc, i) => {
                    acc[i.title.toLowerCase().replace(" ", "_")] = getParameters(i, elementId)
                    return acc
                }, {})
        }
        case "input":
        case "textarea": {
            const v = document.getElementById(elementId).value
            switch (prm.valueType) {
                case "int":
                    x = Number(v)
                    if (isNaN(x)) {
                        alert(`Value in field \"${prm["title"]}\" is not Integer`)
                        throw `Value in field \"${prm["title"]}\" is not Integer`
                    }
                    return x
                case "text":
                    return v
            }
        }
        case "button": break
    }
}

function getParameterId(prm, parentId = "") {
    return (parentId == "" ? "" : (parentId + "-")) + prm.title.toLowerCase()
}


function parameters2Html(prm, parentId = "") {
    switch (prm.type) {
        case "container": {
            const div = document.createElement('div');
            div.className = "container"
            const title = document.createElement("p")
            title.textContent = prm.title
            const items = document.createElement("div")
            items.className = "items"
            prm.items.forEach(i => items.appendChild(parameters2Html(i, getParameterId(prm, parentId))))
            div.appendChild(title)
            div.appendChild(items)
            return div

        }
        case "input": {
            const div = document.createElement('div');
            div.className = "input"
            const title = document.createElement("p")
            title.textContent = prm.title
            const input = document.createElement("input")
            input.type = "text"
            input.value = prm.default
            input.id = getParameterId(prm, parentId)
            div.appendChild(title)
            div.appendChild(input)
            return div
        }
        case "textarea": {
            const div = document.createElement('div');
            div.className = "textarea"
            const title = document.createElement("p")
            title.textContent = prm.title
            const input = document.createElement("textarea")
            input.type = "text"
            input.placeholder = "Type rules here"
            input.rows = 10
            input.cols = 40
            input.id = getParameterId(prm, parentId)
            div.appendChild(title)
            div.appendChild(input)
            return div
        }
        case "button": {
            const div = document.createElement('div');
            div.className = "textarea"
            const btn = document.createElement("button")
            btn.textContent = prm.title
            btn.addEventListener("click", prm.action)
            div.appendChild(btn)
            return div
        }
    }

}

window.onload = () => {
    renderParameters(parametersLayout)

    onResize()
    window.addEventListener("resize", onResize)

}

function onResize() {
    canvas = document.getElementById("canvas")
    canvas_container = document.getElementById("canvas-container")

    canvas.width = canvas_container.clientWidth
    canvas.height = canvas_container.clientHeight

    render()
}

function render() {
    if (tm.width == 0) {
        alert("Grid width must be grater than 0")
        throw "Grid width must be grater than 0"
    }
    if (tm.height == 0) {
        alert("Grid height must be grater than 0")
        throw "Grid height must be grater than 0"
    }
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const cellSize = Math.min(canvas.width / tm.width, canvas.height / tm.height)

    const gridWidth = cellSize * tm.width
    const gridHeight = cellSize * tm.height

    const offsetX = (canvas.width - gridWidth) / 2
    const offsetY = (canvas.height - gridHeight) / 2

    for (let x = 0; x < tm.width; x++) {
        for (let y = 0; y < tm.height; y++) {
            ctx.fillStyle = "rgb(200, 200, 200)"
            ctx.strokeStyle = "rgb(20, 20, 20)"
            if(x == tm.carriageX && y == tm.carriageY){
                ctx.fillStyle = "rgb(200, 255, 200)"

            }
            const px = x * cellSize + offsetX
            const py = y * cellSize + offsetY
            ctx.fillRect(px, py, cellSize, cellSize)
            ctx.strokeRect(px, py, cellSize, cellSize)
            ctx.fillStyle = "rgb(20, 20, 20)"
            ctx.font = `${cellSize}px Georgia`;
            const w = ctx.measureText(tm.state[x][y]).width
            ctx.fillText(tm.state[x][y], px + (cellSize - w) / 2, py + cellSize - cellSize / 5)
        }
    }
}


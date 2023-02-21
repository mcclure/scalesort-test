import { h, render, Component } from "preact"
import { hsla } from "color2k"

declare let require:any

const parentNode = document.getElementById("content")
const replaceNode = document.getElementById("initial-loading")

// State:
// algo: string
// xmin, xmax, ymin, ymax: number

const signedLog = (x:number) => {
  const l = Math.log(Math.abs(x)+1)
  if (x>=0) return l
  return -l
}

const positiveFloat = (x:number) => {
  const p = x + 9007199254740992
  if (p>=0) return p
  return 0
}

const algos = {
  add: (a:number,b:number) => a + b,
  mult: (a:number,b:number) => a * b,
  multSigned: (a:number,b:number) => positiveFloat(a) * positiveFloat(b),
  logAddSigned: (a:number,b:number) => signedLog(a) + signedLog(b),
  logMult: (a:number,b:number) => Math.log(a) * Math.log(b),
  logMultSigned: (a:number,b:number) => signedLog(a) * signedLog(b)
}

const algosExplain:any = {
  add: "x + y",
  mult: "x * y",
  multSigned: "f(x) * f(y) [where f(a) = a+2^52, any result<0 = 0]",
  logAddSigned: "f(x) + f(y) [where f(a) = log(|x|+1)*sign(x)]",
  logMult: "log(x) * log(y)",
  logMultSigned: "f(x) * f(y) [where f(a) = log(|x|+1)*sign(x)]",
}

const side = 11
const sideMax = (side-1)
const iidxMax = (side*side-1)

type Sortee = {idx:number, value:number, sidx?:number}

class Content extends Component<any, any> {
  constructor(props:{}) {
    super(props)
    this.state = {algo:"add", ymin:0, ymax:10, xmin:10, xmax:100}
  }

  render() {
    const {algo, ymin, ymax, xmin, xmax} = this.state

    const inOrder: Array<Sortee> = new Array()
    const sorted: Array<Sortee> = new Array()
    for (let y = 0; y < side; y++) {
      for (let x = 0; x < side; x++) {
        const sx = xmin + (x/sideMax)*(xmax-xmin)
        const sy = ymin + (y/sideMax)*(ymax-ymin)
        const t:Sortee = {idx:inOrder.length, value:(algos as any)[algo](sx,sy)}
        let {idx, value} = t; console.log({x, y, sx, sy, idx, value})
        inOrder.push(t)
        sorted.push(t)
      }
    }

    // Sort array
    sorted.sort((a:Sortee,b:Sortee) => a.value - b.value)

    // Reverse engineer which index each member of sorted array has
    for (const [index, t] of sorted.entries()) {
      t.sidx=index
    }

    // Display sorted indexes in original inOrder order
    const tableGrid:preact.JSX.Element[] = new Array()
    for (let y = 0; y < side; y++) {
      const tableRow:preact.JSX.Element[] = new Array()
      for (let x = 0; x < side; x++) {
        const idx = y*side + x   // array idx
        const t = inOrder[idx]
        const sidx = t.sidx      // sorted idx
        const value = Math.round(t.value*100)/100
        const color = isFinite(value) ? hsla((sidx / iidxMax)*240, 1, 0.75, 1) : "white"

        tableRow.push(<td style={{padding:"10px", background:color}}><b>{sidx}</b><br /><small>({algo=="multSigned"?"...":value})</small></td>)
      }
      tableGrid.push(<tr>{tableRow}</tr>)
    }

    return (
      <div>
        <p>Don't worry about this. <a href="https://github.com/mcclure/scalesort-test">Source code</a></p>
        <p>
          Algorithm: <select onChange={_ => this.setState({algo:(event.target as any).value})}>
            <option value="add">Add</option>
            <option value="mult">Multiply</option>
            <option value="multSigned">Multiply (sign-aware)</option>
            <option value="logAddSigned">Add log (sign-aware)</option>
            <option value="logMult">Multiply log</option>
            <option value="logMultSigned">Multiply log (sign-aware)</option>
          </select>
          {" "}
          ({algosExplain[algo]})
        </p>
        <table>
          <tr>
            <td> {/* Y axis controls */}
              Y-min <input type="text" value={ymin} onChange={_ => this.setState({ymin:Number((event.target as any).value)})} /><br /><br />
              Y-max <input type="text" value={ymax} onChange={_ => this.setState({ymax:Number((event.target as any).value)})} />
            </td>
            <td> {/* table */}
              <table style="border-spacing:5px">{tableGrid}</table>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td> {/* X axis controls */}
              X-min <input type="text" value={xmin} onChange={_ => this.setState({xmin:Number((event.target as any).value)})} />
              {" "}
              X-max <input type="text" value={xmax} onChange={_ => this.setState({xmax:Number((event.target as any).value)})}  />
            </td>
          </tr>
        </table>
        <p>The goal is for the gradient red-to-blue to be more or less diagonal ↘ regardless of input ranges.</p>
      </div>
    )
  }
}

render(
  <Content />,
  parentNode, replaceNode
);

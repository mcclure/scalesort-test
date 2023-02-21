import { h, render, Component } from "preact";

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

const algos = {
  add: (a:number,b:number) => a + b,
  mult: (a:number,b:number) => a * b,
  logMult: (a:number,b:number) => Math.log(a) * Math.log(b),
  logMultSigned: (a:number,b:number) => signedLog(a) * signedLog(b)
}

class Content extends Component<any, any> {
  constructor(props:{}) {
    super(props)
    this.state = {algo:"add", ymin:0, ymax:10, xmin:10, xmax:100}
  }

  render() {
    let {algo, ymin, ymax, xmin, xmax} = this.state

    let tableGrid:preact.JSX.Element[] = new Array()
    for (let y of Array(11).keys()) {
      let tableRow:preact.JSX.Element[] = new Array()
      for (let x of Array(11).keys()) {
        tableRow.push(<td>{x},{y}</td>)
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
            <option value="logMult">Multiply log</option>
            <option value="logMultSigned">Multiply log (sign-aware)</option>
          </select>
        </p>
        <table>
          <tr>
            <td> {/* Y axis controls */}
              Y-min <input type="text" value={ymin} onChange={_ => this.setState({ymin:(event.target as any).value})} /><br /><br />
              Y-max <input type="text" value={ymax} onChange={_ => this.setState({ymax:(event.target as any).value})} />
            </td>
            <td> {/* table */}
              <table>{tableGrid}</table>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td> {/* X axis controls */}
              X-min <input type="text" value={xmin} onChange={_ => this.setState({xmin:(event.target as any).value})} />
              {" "}
              X-max <input type="text" value={xmax} onChange={_ => this.setState({xmax:(event.target as any).value})}  />
            </td>
          </tr>
        </table>
        <p>The goal is for the gradient to be more or less diagonal ↘ regardless of input ranges.</p>
      </div>
    )
  }
}

render(
  <Content />,
  parentNode, replaceNode
);

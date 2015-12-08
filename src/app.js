/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'

class App extends React.Component {
  handleClick (segment, e) {
    segment.strokeWidth *= e.event.shiftKey ? 0.9 : 1.15
  }

  resetLogo () {
    let logo = window.paper.project.layers[0] ? window.paper.project.layers[0].children['logo'] : false
    logo.children.map((segment) => {
      segment.strokeWidth = 10
    })
    paper.view.update()
  }

  componentWillMount () {
    window.paper = paper.setup(canvas)
    paper.project.importSVG('./assets/htb.svg', (logo) => {
      // Define some skin colors
      let skintones = [
        '#f9da9d',
        '#d8ae84',
        '#664d3c'
      ]
      let currentColor = skintones[Math.floor(Math.random() * skintones.length)]

      // Place the logo 50px from the corner
      logo.name = 'logo'
      logo.pivot = logo.bounds.topLeft
      logo.position = new paper.Point(50, 50)
      logo.children.map((segment) => {
        segment.strokeColor = currentColor
        segment.strokeWidth = 10
        segment.on('click', (event) => {
          this.handleClick(segment, event)
        })
      })
    })
  }

  render () {
    return (
      <button onClick={this.resetLogo}>Reset</button>
    )
  }
}

ReactDOM.render(<App />, app)

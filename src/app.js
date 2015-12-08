/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'

class App extends React.Component {
  regenerateSegments () {
    let logo = window.paper.project.layers[0] ? window.paper.project.layers[0].children['logo'] : false
    let skintones = [
      '#f9da9d',
      '#d8ae84',
      '#664d3c'
    ]
    let currentColor = skintones[Math.floor(Math.random() * skintones.length)]

    logo.children.map((segment) => {
      // Store old state, generate a new one
      let oldWidth = segment.strokeWidth
      let newWidth = Math.random() * 50

      // Set a color
      segment.strokeColor = currentColor

      // Animate until the values are correct
      segment.onFrame = (event) => {
        if (segment.strokeWidth > newWidth && oldWidth > newWidth) {
          segment.strokeWidth *= 0.9
        } else if (segment.strokeWidth < newWidth && oldWidth < newWidth) {
          segment.strokeWidth *= 1.1
        } else {
          segment.strokeWidth = newWidth
          segment.onFrame = () => {}
        }
      }
    })
    paper.view.update()
  }

  componentWillMount () {
    window.paper = paper.setup(canvas)
    paper.project.importSVG('./assets/htb.svg', (logo) => {
      // Place the logo 50px from the corner
      logo.name = 'logo'
      logo.pivot = logo.bounds.topLeft
      logo.position = new paper.Point(50, 50)

      // Give all segments a color and stroke width
      this.regenerateSegments()
    })
  }

  render () {
    return (
      <button onClick={this.regenerateSegments}>Another one bites the dust</button>
    )
  }
}

ReactDOM.render(<App />, app)

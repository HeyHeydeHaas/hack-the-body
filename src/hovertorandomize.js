/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'

class App extends React.Component {
  constructor (props) {
    super(props)

    // Set default state
    this.state = {
      skintone: 0
    }

    // Bind methods
    this.regenerateSegments = this.regenerateSegments.bind(this)
  }
  regenerateSegments (event) {
    let logo = window.paper.project.layers[0] ? window.paper.project.layers[0].children['logo'] : false
    if (logo && (!event || Math.abs((event.movementX + event.movementY) / 2) > 15)) {
      logo.children.map((segment) => {
        segment.strokeColor = this.state.skintone
        segment.strokeWidth = 40 * Math.random()
      })
    }

    window.paper.view.update()
  }

  componentWillMount () {
    window.paper = paper.setup(canvas)
    paper.project.importSVG('./assets/htb.svg', (logo) => {
      // Place the logo 50px from the corner
      logo.name = 'logo'
      logo.pivot = logo.bounds.topLeft
      logo.position = new paper.Point(50, 50)

      // Set the current color
      let skintones = [
        '#f9da9d',
        '#d8ae84',
        '#664d3c'
      ]
      this.setState({skintone: skintones[Math.floor(Math.random() * skintones.length)]})

      // Do the random generation
      this.regenerateSegments()
      window.addEventListener('mousemove', this.regenerateSegments)
    })
  }

  render () {
    return false
  }
}

ReactDOM.render(<App />, app)

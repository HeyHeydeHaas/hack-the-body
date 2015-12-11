/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'

class App extends React.Component {
  constructor (props) {
    super(props)

    // Store skintones
    this.skintones = [
      '#f9da9d',
      '#d8ae84',
      '#664d3c'
    ]

    // Set state
    this.state = {
      currentColor: this.skintones[Math.floor(Math.random() * this.skintones.length)]
    }

    // Bind methods
    this.resizeSegment = this.resizeSegment.bind(this)
    this.regenerateSegments = this.regenerateSegments.bind(this)
  }

  regenerateSegments (width) {
    let logo = window.paper.project.layers[0] ? window.paper.project.layers[0].children['logo'] : false

    logo.children.map((segment) => {
      // Store old state, generate a new one
      let oldWidth = segment.strokeWidth
      let newWidth = typeof width === 'number' ? width : Math.random() * 50

      // Set a color
      segment.strokeColor = this.state.currentColor

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

  resizeSegment (segment, newWidth) {
    let oldWidth = segment.strokeWidth

    segment.onFrame = (event) => {
      // If we're increasing in size
      if (newWidth > oldWidth && segment.strokeWidth < newWidth) {
        segment.strokeWidth *= 1.1
      // If we're decreasing in size
      } else if (newWidth < oldWidth && segment.strokeWidth > newWidth) {
        segment.strokeWidth *= 0.9
      } else if ((newWidth < oldWidth && segment.strokeWidth <= newWidth) ||
        (newWidth > oldWidth && segment.strokeWidth >= newWidth)) {
        // Stop animating once we're there
        segment.strokeWidth = newWidth
        segment.onFrame = () => {}
      }
    }
  }

  componentWillMount () {
    window.paper = paper.setup(canvas)
    paper.project.importSVG('./assets/htb.svg', (logo) => {
      // Place the logo 50px from the corner
      logo.name = 'logo'
      logo.pivot = logo.bounds.topLeft
      logo.position = new paper.Point(50, 50)

      // Bind mouse events
      logo.children.map((segment) => {
        segment.on('mouseenter', (event) => {
          segment.strokeCap = 'butt'
          this.resizeSegment(segment, 3)
        })
        segment.on('mouseleave', (event) => {
          this.resizeSegment(segment, Math.random() * 50 + 3)
          segment.strokeCap = 'round'
          segment.onFrame = () => {}
        })
      })

      paper.view.onFrame = (event) => {
        if (event.count % 50 === 0) {
          this.regenerateSegments()
        }
      }

      // Give all segments a color and stroke width
      this.regenerateSegments()
    })
  }

  render () {
    return false
  }
}

ReactDOM.render(<App />, app)

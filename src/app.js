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
    this.infectLogo = this.infectLogo.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.regenerateSegments = this.regenerateSegments.bind(this)
  }

  infectLogo () {
    this.regenerateSegments('square')
  }

  regenerateSegments (caps) {
    let logo = window.paper.project.layers[0] ? window.paper.project.layers[0].children['logo'] : false
    if (logo.children['clone']) logo.children['clone'].remove()

    logo.children.map((segment) => {
      // Store old state, generate a new one
      let oldWidth = segment.strokeWidth
      let newWidth = Math.random() * 50 + 3

      // Set a color
      segment.strokeColor = this.state.currentColor

      // Set the stroke caps
      segment.strokeCap = typeof caps === 'string' ? caps : 'round'

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

  handleClick (segment, event) {
    this.randomizeSegment(segment, false)
  }

  handleMouseEnter (segment, event) {
    let clone = segment.clone()
    clone.strokeWidth = Math.random() * 50 + 3
    clone.rotation = 90
    clone.scaling = 0.5
    clone.name = 'clone'
  }

  randomizeSegment (segment, loop) {
    let oldWidth = segment.strokeWidth
    let newWidth = Math.random() * 50

    segment.onFrame = (event) => {
      // If we're increasing in size
      if (newWidth > oldWidth && segment.strokeWidth < newWidth) {
        segment.strokeWidth *= 1.1
      // If we're decreasing in size
      } else if (newWidth < oldWidth && segment.strokeWidth > newWidth) {
        segment.strokeWidth *= 0.9
      } else if ((newWidth < oldWidth && segment.strokeWidth <= newWidth) ||
        (newWidth > oldWidth && segment.strokeWidth >= newWidth)) {
        // If we want to loop, just pick a new random value
        if (loop) {
          newWidth = Math.random() * 50
        // Otherwise, unbind this function
        } else {
          segment.onFrame = () => {}
        }
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
        segment.on('click', (event) => {
          this.handleClick(segment, event)
        })
        segment.on('mouseenter', (event) => {
          this.handleMouseEnter(segment, event)
        })
        segment.on('mouseleave', (event) => {
          segment.onFrame = () => {}
        })
      })

      // Give all segments a color and stroke width
      this.regenerateSegments()
    })
  }

  render () {
    return (
      <section>
        <p><button onClick={this.regenerateSegments}>Regenerate</button></p>
        <p><button onClick={this.infectLogo}>Infect</button></p>
      </section>
    )
  }
}

ReactDOM.render(<App />, app)

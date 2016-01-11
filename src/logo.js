/* global logo */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'

export default class Logo extends React.Component {
  /**
   * Initializes the component
   */
  constructor (props) {
    super(props)

    // Set state
    this.state = {
      color: logo.dataset.color || 0,
      variant: logo.dataset.variant || 'htb',
      factor: logo.dataset.factor || 50,
      margin: logo.dataset.margin || 50
    }

    // Bind methods
    this.setSize = this.setSize.bind(this)
    this.regenerateSegments = this.regenerateSegments.bind(this)
  }

  /**
   * Forces the viewSize to be 700x700, for a scalable canvas
   */
  setSize () {
    paper.view.viewSize = {
      width: 700,
      height: 700
    }
  }

  /**
   * Sets a new random width for all segments
   */
   regenerateSegments (width) {
     let logo = window.paper.project.layers[0] ? window.paper.project.layers[0].children['logoVector'] : false

     if (logo) {
       logo.children.map((segment) => {
         // Store old state, generate a new one
         let oldWidth = segment.strokeWidth
         let newWidth = typeof width === 'number' ? width : Math.random() * this.state.factor

         // Set a color
         segment.strokeColor = this.state.color

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
   }

  /**
   * Initializes the component
   */
  componentWillMount () {
    // Set up Paper
    window.paper = paper.setup(logo)

    // Bind listeners
    window.addEventListener('resize', this.setSize)
    paper.view.onFrame = (event) => {
      if (event.count % 200 === 0) {
        this.regenerateSegments()
      }
    }

    // Import the SVG file
    let path = './assets/' + this.state.variant + '.svg'

    paper.project.importSVG(path, (logoVector) => {
      // Place the logo vector
      logoVector.name = 'logoVector'
      logoVector.pivot = logoVector.bounds.topLeft
      logoVector.position.x = this.state.margin
      logoVector.position.y = this.state.margin

      // Bind mouse events
      logoVector.children.map((segment) => {
        segment.on('mousedrag', (event) => {
          if (
            segment.position.x + event.delta.x > 0 && segment.position.x + event.delta.x < 700 &&
            segment.position.y + event.delta.y > 0 && segment.position.y + event.delta.y < 700
          ) {
            segment.position.x += event.delta.x
            segment.position.y += event.delta.y
          }
        })
      })

      // Give all segments a color and stroke width
      this.regenerateSegments()

      // Update the view
      paper.view.update()
    })
  }

  // No DOM element is returned, since Paper handles the actual rendering
  render () {
    this.setSize()
    return false
  }
}

ReactDOM.render(<Logo />, logo)

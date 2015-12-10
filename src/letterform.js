import React from 'react'
import paper from 'paper/dist/paper-full'

export default class LetterForm extends React.Component {
  constructor (props) {
    super(props)

    // Set default state
    this.state = {
      iterator: props.iterator,
      name: 'letter-' + props.iterator
    }

    // Bind methods
    this.place = this.place.bind(this)
    this.resetLogo = this.resetLogo.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.regenerateSegments = this.regenerateSegments.bind(this)
  }

  resetLogo () {
    this.regenerateSegments(10)
  }

  regenerateSegments (width) {
    let letter = window.paper.project.layers[0] ? window.paper.project.layers[0].children[this.state.name] : false

    letter.children.map((segment) => {
      // Store old state, generate a new one
      let oldWidth = segment.strokeWidth
      let newWidth = typeof width === 'number' ? width : Math.random() * 50 + 3

      // Set a color
      segment.strokeColor = this.props.color

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

  randomizeSegment (segment, loop) {
    let oldWidth = segment.strokeWidth
    let newWidth = Math.random() * 50 + 3

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
          newWidth = Math.random() * 50 + 3
        // Otherwise, unbind this function
        } else {
          segment.onFrame = () => {}
        }
      }
    }
  }

  componentWillMount () {
    let paper = window.paper
    let char = this.props.char === ' ' ? 'space' : this.props.char
    let path = './assets/letters/' + char + '.svg'

    paper.project.importSVG(path, (letter) => {
      // Place the letter 50px from the corner
      letter.name = this.state.name
      letter.pivot = letter.bounds.topCenter

      // Give it a position
      this.place(letter)

      // Bind mouse events
      letter.children.map((segment) => {
        segment.on('click', (event) => {
          this.handleClick(segment, event)
        })
        segment.on('mouseenter', (event) => {
          segment.opacity = 0.8
        })
        segment.on('mouseleave', (event) => {
          segment.opacity = 1
        })
      })

      // Give all segments a color and stroke width
      this.regenerateSegments()

      // Update the view
      paper.view.update()
    })
  }

  /**
   * Removes the letterform
   */
  componentWillUnmount () {
    // Remove the vector
    let vector = window.paper.project.activeLayer.children[this.state.name]
    if (vector) vector.remove()

    // Update to reflect the changes
    window.paper.view.update()
  }

  /**
   * Updates the letterform's position
   */
  place (letter) {
    // Get the col and row based on the iterator
    let col = (this.state.iterator + 1) % this.props.cols
    let row = Math.floor(this.state.iterator / this.props.cols)
    if (col === 0) col = this.props.cols

    letter.position.x = this.props.margin + this.props.spacing * (col - 0.5)
    letter.position.y = this.props.margin + this.props.lineheight * row
  }

  render () {
    // Get the letterform of this object
    let letter = window.paper.project.activeLayer.children[this.state.name]

    // Do the repositioning
    if (letter) this.place(letter)

    // Update the Paper view
    window.paper.view.update()

    // No element is returned, because Paper handles all the rendering
    return false
  }
}

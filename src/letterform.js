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
    this.importLetter = this.importLetter.bind(this)
    this.regenerateSegments = this.regenerateSegments.bind(this)
  }

  regenerateSegments (width) {
    let letter = window.paper.project.layers[0] ? window.paper.project.layers[0].children[this.state.name] : false

    if (letter) {
      letter.children.map((segment) => {
        // Store old state, generate a new one
        let oldWidth = segment.strokeWidth
        let newWidth = typeof width === 'number' ? width : Math.random() * this.props.factor + 3

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
  }

  /**
   * Imports the letter and generates widths for each segment
   */
  importLetter (newChar) {
    let paper = window.paper
    let char = newChar ? newChar : this.props.char
    char = char === ' ' ? 'space' : char.toLowerCase()
    let pathSuffix = this.props.variant ? '-' + this.props.variant : ''
    let path = './assets/letters' + pathSuffix + '/' + char + '.svg'

    paper.project.importSVG(path, (letter) => {
      // Place the letter 50px from the corner
      letter.name = this.state.name
      letter.pivot = letter.bounds.topCenter

      // Give it a position
      this.place(letter)

      // Bind mouse events
      letter.children.map((segment) => {
        segment.on('mousedrag', (event) => {
          segment.position.x += event.delta.x
          segment.position.y += event.delta.y
        })
      })

      // Give all segments a color and stroke width
      this.regenerateSegments()

      // Update the view
      paper.view.update()
    })
  }

  componentWillMount () {
    this.importLetter()
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
   * Updates if there is a new letter
   */
  componentWillReceiveProps (nextProps) {
    if (
      nextProps.char !== this.props.char ||
      nextProps.iterator !== this.props.iterator ||
      nextProps.color !== this.props.color
    ) {
      this.componentWillUnmount()
      this.importLetter(nextProps.char)
    } else if (nextProps.step !== this.props.step && nextProps.step > 0) {
      this.regenerateSegments()
    }
  }

  /**
   * Updates the letterform's position
   */
  place (letter) {
    // Get the col and row based on the iterator
    let col = (this.state.iterator + 1) % this.props.cols
    let row = Math.floor(this.state.iterator / this.props.cols)
    if (col === 0) col = this.props.cols

    letter.position.x = this.props.spacing * (col - 0.5)
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

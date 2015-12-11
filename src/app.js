/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'
import LetterForm from './letterform'

class App extends React.Component {
  /**
   * Initializes the component
   */
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
      color: 0,
      backgroundColor: 0,
      text: 'Hack the  Body',
      width: 0,
      height: 0,
      center: 0,
      rows: 0,
      cols: 0,
      margin: 50,
      spacing: 120,
      lineheight: 200,
      size: '',
      editing: false,
      showOverlay: false
    }

    // Bind methods
    this.update = this.update.bind(this)
    this.setSize = this.setSize.bind(this)
    this.toggleEditing = this.toggleEditing.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  /**
   * Universal update function that catches events from children
   */
  update (event) {
    this.setState({
      [event.target.id]: event.target.value,
      unsavedChanges: true
    })
  }

  /**
   * Saves the size of the canvas to the state
   */
  setSize () {
    let cols = Math.floor(paper.view.bounds.width / this.state.spacing)
    let rows = Math.floor(paper.view.bounds.height / this.state.lineheight)

    this.setState({
      width: paper.view.bounds.width,
      height: paper.view.bounds.height,
      center: paper.view.center,
      cols,
      rows
    })
  }

  /**
   * Toggles the state between editing and viewing
   */
  toggleEditing () {
    this.setState({
      editing: !this.state.editing
    })
  }

  /**
   * Shows the overlay if not editing
   */
  handleMouseEnter () {
    if (this.state.editing) return

    this.setState({
      showOverlay: true
    })
  }

  /**
   * Hides the overlay
   */
  handleMouseLeave () {
    this.setState({
      showOverlay: false
    })
  }

  /**
   * Initializes the App
   */
  componentWillMount () {
    // Set up Paper
    window.paper = paper.setup(canvas)

    // Set initial size
    this.setSize()

    // Set colors
    let colorIndex = Math.floor(Math.random() * this.skintones.length)
    let backgroundColorIndex = colorIndex - 1 < 0 ? this.skintones.length - 1 : colorIndex - 1

    this.setState({
      color: this.skintones[colorIndex],
      backgroundColor: this.skintones[backgroundColorIndex]
    })

    // Bind listeners
    window.addEventListener('resize', this.setSize)
    canvas.addEventListener('click', this.toggleEditing)
    canvas.addEventListener('mouseenter', this.handleMouseEnter)
    canvas.addEventListener('mouseleave', this.handleMouseLeave)
  }

  render () {
    let letters = []

    if (window.paper) {
      let paper = window.paper

      // Create elements for all letters
      letters = Array.prototype.map.call(this.state.text, (char, index) => {
        return <LetterForm
                  char={char}
                  fulltext={this.state.text}
                  color={this.state.color}
                  margin={this.state.margin}
                  spacing={this.state.spacing}
                  lineheight={this.state.lineheight}
                  cols={this.state.cols}
                  rows={this.state.rows}
                  iterator={index}
                  key={index} />
      })

      // Handle zooming
      paper.view.update()
    }

    let backdropStyle = {
      background: this.state.backgroundColor
    }

    let editOverlay = this.state.showOverlay ? <figure className='edit-overlay'>Edit</figure> : false
    let editorVisibility = this.state.editing ? 'show' : 'hide'

    return (
      <div>
        {editOverlay}
        <figure className='backdrop' style={backdropStyle}></figure>
        <textarea className={editorVisibility} value={this.state.text} onChange={this.update} id='text' />
        {letters}
      </div>
    )
  }
}

ReactDOM.render(<App />, app)

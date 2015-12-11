/* global canvas, app, editor */
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
      [
        '#493357',
        '#000000',
        '#f0d1c8'
      ],
      [
        '#f0d1c8',
        '#a48278',
        '#473b33'
      ],
      [
        '#f0d1c8',
        '#e6b3a4',
        '#000000'
      ],
      [
        '#ac6879',
        '#f0d1c8',
        '#503a21'
      ],
      [
        '#934440',
        '#dc8682',
        '#ffffff'
      ],
      [
        '#493357',
        '#eaeaea',
        '#9266ad'
      ],
      [
        '#453a2d',
        '#814e5b',
        '#f4e6d0'
      ],
      [
        '#b38d75',
        '#f1cb9a',
        '#453a2d'
      ]
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
    this.setColors = this.setColors.bind(this)
    this.openEditor = this.openEditor.bind(this)
    this.toggleEditor = this.toggleEditor.bind(this)
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
   * Sets the current color scheme
   */
  setColors () {
    // Set colors
    let baseIndex = Math.floor(Math.random() * this.skintones.length)
    let colorIndex = Math.floor(Math.random() * this.skintones[baseIndex].length)
    let backgroundColorIndex = colorIndex - 1 < 0 ? this.skintones[baseIndex].length - 1 : colorIndex - 1
    let textColorIndex = colorIndex - 2 < 0 ? this.skintones[baseIndex].length - 2 : colorIndex - 2
    let background = this.skintones[baseIndex][backgroundColorIndex]
    if (background === '#000000') background = '#333333'

    this.setState({
      color: this.skintones[baseIndex][colorIndex],
      backgroundColor: background,
      textColor: this.skintones[baseIndex][textColorIndex]
    })
  }

  /**
   * Opens the editor
   */
  openEditor () {
    this.setState({
      editing: true
    })
  }

  /**
   * Toggles the state between editing and viewing
   */
  toggleEditor () {
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

    // Set color scheme
    this.setColors()

    // Bind listeners
    window.addEventListener('resize', this.setSize)
    canvas.addEventListener('click', this.openEditor)
    editor.addEventListener('mouseenter', this.handleMouseEnter)
    editor.addEventListener('mouseleave', this.handleMouseLeave)
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
                  editing={this.state.editing}
                  iterator={index}
                  key={index} />
      })

      // Handle zooming
      paper.view.update()
    }

    let backdropStyle = {
      background: this.state.backgroundColor
    }

    let editorVisibility = this.state.editing ? 'show' : 'hide'
    let overlayLabel = this.state.editing ? 'Close' : 'Edit'
    let editOverlay = this.state.showOverlay || this.state.editing
      ? <figure className='edit-overlay' onClick={this.toggleEditor}>{overlayLabel}</figure> : false

    return (
      <div>
        {editOverlay}
        <figure className='backdrop' style={backdropStyle}></figure>
        <textarea className={editorVisibility} value={this.state.text} onChange={this.update} id='text' />
        <button onClick={this.setColors}>Change color scheme</button>
        {letters}
      </div>
    )
  }
}

ReactDOM.render(<App />, app)

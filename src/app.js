/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'
import reqwest from 'reqwest'
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
      showOverlay: false,
      projects: []
    }

    // Bind methods
    this.update = this.update.bind(this)
    this.setSize = this.setSize.bind(this)
    this.setText = this.setText.bind(this)
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
    paper.view.viewSize = {
      width: 600,
      height: 600
    }
    this.setState({
      width: paper.view.bounds.width,
      height: paper.view.bounds.height,
      center: paper.view.center,
      cols: 5,
      rows: 5
    })
  }

  /**
   * Sets the text to the project that was clicked
   */
  setText (event) {
    this.setState({
      text: event.target.textContent
    })
  }

  /**
   * Sets the current color scheme
   */
  setColors () {
    // Set colors
    let baseIndex = Math.floor(Math.random() * this.skintones.length)

    this.setState({
      color: this.skintones[baseIndex][0],
      backgroundColor: this.skintones[baseIndex][1],
      textColor: this.skintones[baseIndex][2]
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
  handleMouseEnter (event) {
    if (this.state.editing) return

    this.setState({
      showOverlay: true
    })
  }

  /**
   * Hides the overlay
   */
  handleMouseLeave (event) {
    this.setState({
      showOverlay: false
    })
  }

  /**
   * Initializes the App
   */
  componentDidMount () {
    // Set up Paper
    window.paper = paper.setup(canvas)

    // Set initial size
    this.setSize()

    // Set color scheme
    this.setColors()

    // Bind listeners
    window.addEventListener('resize', this.setSize)
    canvas.addEventListener('click', this.openEditor)
    canvas.addEventListener('mouseenter', this.handleMouseEnter)
    canvas.addEventListener('mouseleave', this.handleMouseLeave)

    // Load data
    reqwest('./projects.json', (projects) => {
      this.setState({projects})
    })
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
    let overlayStyle = this.state.editing ? {
      zIndex: 100
    } : {}
    let editOverlay = this.state.showOverlay || this.state.editing
      ? <figure className='edit-overlay' style={overlayStyle} onClick={this.toggleEditor}>{overlayLabel}</figure> : false
    let projects = this.state.projects.map((project, index) => {
      return <li key={index} onClick={this.setText}>{project}</li>
    })

    return (
    <div>
      <style>{`
        body {
          color: ${this.state.textColor}
        }
      `}</style>

      <figure className='logo-editor' id='editor'>
        <figure className='logo'>
          <canvas id='canvas'></canvas>
        </figure>
        <div>
          {editOverlay}
          <figure className='backdrop' style={backdropStyle}></figure>
          <textarea className={editorVisibility} value={this.state.text} onChange={this.update} id='text' />
          {letters}
        </div>
      </figure>

      <article>
        <time>Fri 11 Dec 13:55 &middot; <a href='./'>Back to the list</a></time>
        <p className='lead'>
          A program on the intersection of art, science technology and society
        </p>
        <h3>Projects</h3>
        <ul>
          {projects}
        </ul>
      </article>
    </div>
    )
  }
}

ReactDOM.render(<App />, app)

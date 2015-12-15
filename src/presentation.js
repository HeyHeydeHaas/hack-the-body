/* global canvas, app, editor */
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
      factor: 20,
      step: 0
    }

    // Bind methods
    this.update = this.update.bind(this)
    this.setSize = this.setSize.bind(this)
    this.setColors = this.setColors.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.regenerateSegments = this.regenerateSegments.bind(this)
  }

  /**
   * Universal update function that catches events from children
   */
  update (event) {
    this.setState({
      [event.target.id]: event.target.value
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
   * Toggles the window between fullscreen and windowed
   */
  toggleFullscreen () {
    var rfs = editor.requestFullScreen ||
              editor.webkitRequestFullScreen ||
              editor.mozRequestFullScreen
    rfs.call(editor)
  }

  /**
   * Increases the step count, forcing a rerender for all letters
   */
  regenerateSegments () {
    this.setState({
      step: this.state.step + 1
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

    // Load data
    setInterval(() => {
      reqwest('./visitors.json', (data) => {
        let factor = data.visitors * 3
        this.setState({factor})
      })
    })

    // Bind listeners
    window.addEventListener('resize', this.setSize)
    paper.view.onFrame = (event) => {
      if (event.count % 50 === 0) {
        this.regenerateSegments()
      }
    }
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
                  step={this.state.step}
                  factor={this.state.factor}
                  iterator={index}
                  key={index} />
      })

      // Handle zooming
      paper.view.update()
    }

    let backdropStyle = {
      background: this.state.backgroundColor
    }

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
          <figure className='backdrop' style={backdropStyle}></figure>
          <button className='fullscreen-button' onClick={this.toggleFullscreen}>Fullscreen</button>
          {letters}
        </div>
      </figure>
    </div>
    )
  }
}

ReactDOM.render(<App />, app)

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
      paused: false,
      factor: 50,
      step: 0
    }

    // Bind methods
    this.update = this.update.bind(this)
    this.setSize = this.setSize.bind(this)
    this.setText = this.setText.bind(this)
    this.download = this.download.bind(this)
    this.setColors = this.setColors.bind(this)
    this.toggleRegen = this.toggleRegen.bind(this)
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

    // Bind listeners
    window.addEventListener('resize', this.setSize)
    window.paper.view.onFrame = (event) => {
      if (event.count % 100 === 0 && !this.state.paused) {
        this.regenerateSegments()
      }
    }
  }

  /**
   * Submits the form to ECHO which returns a downloadable file
   */
  download () {
    formContent.value = window.paper.project.exportSVG().outerHTML
    downloadForm.submit()
  }

  /**
   * Toggles the auto-regen state
   */
  toggleRegen () {
    this.setState({
      paused: !this.state.paused
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
                  factor={this.state.factor}
                  step={this.state.step}
                  variant='mono-split'
                  iterator={index}
                  key={index} />
      })

      // Handle zooming
      paper.view.update()
    }

    let backdropStyle = {
      background: this.state.backgroundColor
    }

    let toggleLabel = this.state.paused ? <i className='fa fa-play'></i> : <i className='fa fa-pause'></i>

    return (
    <div>
      <style>{`
        body {
          color: ${this.state.textColor}
        }
      `}</style>

      <figure className='logo-editor' id='editor'>
        <figure className='logo'>
          <canvas id='canvas'>{letters}</canvas>
          <figure className='backdrop' style={backdropStyle}></figure>
        </figure>

        <footer>
          <textarea value={this.state.text} onChange={this.update} id='text' />
          <form action='http://io.accommodavid.sexy/echo' method='post' id='downloadForm'>
            <input type='hidden' name='filename' value='hack.svg' />
            <input type='hidden' name='type' value='image/svg+xml' />
            <input type='hidden' name='content' id='formContent' />
            <button onClick={this.download}><i className='fa fa-download'></i></button>
          </form>

          <button onClick={this.setColors}><i className='fa fa-refresh'></i></button>
          <button onClick={this.toggleRegen}>{toggleLabel}</button>
          <input type='range' id='factor' onChange={this.update} value={this.state.factor} />

          <a href='./'><i className='fa fa-close'></i></a>
        </footer>
      </figure>
    </div>
    )
  }
}

ReactDOM.render(<App />, app)

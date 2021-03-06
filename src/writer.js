/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'
import LetterForm from './letterform'

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
      color: 0,
      text: 'Hack the Body',
      width: 0,
      height: 0,
      center: 0,
      rows: 0,
      cols: 0,
      margin: 100,
      spacing: 100,
      lineheight: 300,
      size: ''
    }

    // Bind methods
    this.update = this.update.bind(this)
    this.setSize = this.setSize.bind(this)
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
   * Initializes the App
   */
  componentWillMount () {
    // Set up Paper
    window.paper = paper.setup(canvas)

    // Set initial size
    this.setSize()

    this.setState({
      color: this.skintones[Math.floor(Math.random() * this.skintones.length)]
    })

    // Recenter on window resize
    window.addEventListener('resize', this.setSize)
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
    return (
      <div>
        <textarea value={this.state.text} onChange={this.update} id='text' />
        {letters}
      </div>
    )
  }
}

ReactDOM.render(<App />, app)

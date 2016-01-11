/* global logo */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'
import LetterForm from './letterform'

export default class Logo extends React.Component {
  /**
   * Initializes the component
   */
  constructor (props) {
    super(props)

    // Set state
    this.state = {
      color: logo.dataset.color || 0,
      text: logo.dataset.text || 'Hack the  Body',
      variant: logo.dataset.variant || 'mono-split',
      width: 0,
      height: 0,
      center: 0,
      rows: 0,
      cols: 0,
      margin: 50,
      spacing: 120,
      lineheight: 150,
      factor: 35,
      step: 0
    }

    // Bind methods
    this.update = this.update.bind(this)
    this.setSize = this.setSize.bind(this)
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
   * Saves the size of the logo to the state
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
   * Increases the step count, forcing a rerender for all letters
   */
  regenerateSegments () {
    this.setState({
      step: this.state.step + 1
    })
  }

  /**
   * Initializes the component
   */
  componentDidMount () {
    // Set up Paper
    window.paper = paper.setup(logo)

    // Set initial size
    this.setSize()

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
                  factor={this.state.factor}
                  step={this.state.step}
                  variant={this.state.variant}
                  iterator={index}
                  key={index} />
      })

      // Handle zooming
      paper.view.update()
    }

    return (
      <figure>
        {letters}
      </figure>
    )
  }
}

ReactDOM.render(<Logo />, logo)

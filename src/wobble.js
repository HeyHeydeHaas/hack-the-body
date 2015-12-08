/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'

class App extends React.Component {
  resetLogo () {
    let logo = window.paper.project.layers[0] ? window.paper.project.layers[0].children['logo'] : false
    logo.children.map((segment) => {
      let oldWidth = segment.strokeWidth
      segment.onFrame = (event) => {
        if (segment.strokeWidth > 10 && oldWidth > 10) {
          segment.strokeWidth *= 0.9
        } else if (segment.strokeWidth < 10 && oldWidth < 10) {
          segment.strokeWidth *= 1.1
        } else {
          segment.strokeWidth = 10
          segment.onFrame = () => {}
        }
      }
    })
    paper.view.update()
  }

  handleMouseEnter (segment, event) {
    let oldWidth = segment.strokeWidth
    let newWidth = Math.random() * 50

    segment.onFrame = (event) => {
      if (newWidth > oldWidth && segment.strokeWidth < newWidth) {
        segment.strokeWidth *= 1.1
      } else if (newWidth < oldWidth && segment.strokeWidth > newWidth) {
        segment.strokeWidth *= 0.9
      } else if ((newWidth < oldWidth && segment.strokeWidth <= newWidth) ||
        (newWidth > oldWidth && segment.strokeWidth >= newWidth)) {
        newWidth = Math.random() * 50
      }
    }
  }

  componentWillMount () {
    window.paper = paper.setup(canvas)
    paper.project.importSVG('./assets/htb.svg', (logo) => {
      // Define some skin colors
      let skintones = [
        '#f9da9d',
        '#d8ae84',
        '#664d3c'
      ]
      let currentColor = skintones[Math.floor(Math.random() * skintones.length)]

      // Place the logo 50px from the corner
      logo.name = 'logo'
      logo.pivot = logo.bounds.topLeft
      logo.position = new paper.Point(50, 50)
      logo.children.map((segment) => {
        segment.strokeColor = currentColor
        segment.strokeWidth = 10
        segment.on('mouseenter', (event) => {
          this.handleMouseEnter(segment, event)
        })
        segment.on('mouseleave', (event) => {
          segment.onFrame = () => {}
        })
      })
    })
  }

  render () {
    return (
      <button onClick={this.resetLogo}>Reset</button>
    )
  }
}

ReactDOM.render(<App />, app)

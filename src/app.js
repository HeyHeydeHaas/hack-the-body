/* global canvas, app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'

class App extends React.Component {
  regenerateSegments () {
    let logo = window.paper.project.layers[0] ? window.paper.project.layers[0].children['logo'] : false
    if (logo) {
      logo.children.map((segment) => {
        segment.strokeWidth = 40 * Math.random()
      })
    }
    window.paper.view.update()
  }

  componentWillMount () {
    window.paper = paper.setup(canvas)
    paper.project.importSVG('./assets/htb.svg', (logo) => {
      // Place the logo 50px from the corner
      logo.name = 'logo'
      logo.pivot = logo.bounds.topLeft
      logo.position = new paper.Point(50, 50)
      // Do the random generation
      this.regenerateSegments()
    })
  }

  render () {
    return (
      <button onClick={this.regenerateSegments}>Regenerate</button>
    )
  }
}

ReactDOM.render(<App />, app)

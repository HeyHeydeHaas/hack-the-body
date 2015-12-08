/* global app */
import React from 'react'
import ReactDOM from 'react-dom'
import paper from 'paper/dist/paper-full'

class App extends React.Component {
  componentWillMount () {
    paper.setup(app)
    paper.project.importSVG('./assets/htb.svg')
  }

  render () {
    return false
  }
}

ReactDOM.render(<App />, app)

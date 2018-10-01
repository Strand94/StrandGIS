import React, { Component } from 'react';
import Map from "./Map/Map"
import Sidebar from "./sidebar/Sidebar"
import "./App.css"

class App extends Component {
    render() {
        return ([
          <div id='page_content'>
            <div id='map'>
              <Map key='map'/>
            </div>
            <div id='sidebar'>
              <Sidebar key='sidebar'/>
            </div>
          </div>
        ])
      }
}

export default App;
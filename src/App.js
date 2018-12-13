import React, { Component } from 'react';
import MainMap from "./Map/MainMap"
import Sidebar from "./sidebar/Sidebar"
import "./App.css"

class App extends Component {
    render() {
        return ([
          <div id='page_content'>
            <MainMap key='mainmap_key'/>
            <div id='sidebar'>
              <Sidebar key='sidebar_key'/>
            </div>
          </div>
        ])
      }
}

export default App;

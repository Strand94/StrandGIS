import React, { Component } from 'react';
import MainMap from "./Map/MainMap"
import Sidebar from "./sidebar/Sidebar"
import ExtractFeatureWindow from './sidebar/ExtractFeatureWindow'
import "./App.css"

class App extends Component {
    render() {
        return ([
          <div id='page_content'>
            <div id='map_window'>
              <div id='extract_feature_window' hidden>
                <ExtractFeatureWindow key='extract_feature_window_key'/>
              </div>
              <MainMap key='mainmap_key'/>
            </div>
            <div id='sidebar'>
              <Sidebar key='sidebar_key'/>
            </div>
          </div>
        ])
      }
}

export default App;

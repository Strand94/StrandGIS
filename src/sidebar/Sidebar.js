import React, { Component } from 'react';
import Layers from "./Layers"
import "./Sidebar.css"

class Sidebar extends Component {
    render() {
        return ([
            <div id="sidebar_content">
                <div id="sidebar_tsitle_div">
                    <h1 id="title">App name</h1>
                </div>
                <div id='Layers'>
                    <Layers key='layers'/>
                </div>
            </div>   
        ])
      }
}

export default Sidebar;
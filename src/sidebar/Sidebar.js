import React, { Component } from 'react';
import Layers from "./Layers";
import "./Sidebar.css";
import Buffer from './tools/Buffer';
import Dissolve from './tools/Dissolve';
import { get_newgeojson } from '../Map/MainMap'
var buffer = require('@turf/buffer')
var turf = require('@turf/turf')

export function updateBuffer(buffer_radius, geojson_file) {
  this.setState({buffer_radius})
}

export function new_geojsonToParent(new_geojson, newest_file_key) {
  console.log("new_geojsonToParent")
  console.log(newest_file_key)
  get_newgeojson(new_geojson, newest_file_key)
}

class Sidebar extends Component {
  constructor(props){
    super(props)
    this.state = {
      buffer_radius: 10,
      buffer_geojson: null,
    }
    updateBuffer = updateBuffer.bind(this)
    new_geojsonToParent = new_geojsonToParent.bind(this)

  }

  render() {
    return ([
      <div id="sidebar_content">
          <div id="sidebar_title_div">
              <h1 id="title">App name</h1>
          </div>
          <div id="tools">
              <p id="subtitle">Tools</p>
              <ul id="tool_layer">
                  <li className="buffer">
                      Buffer {this.state.buffer_radius}
                  </li>
                  <li hidden className="buffer_content"><Buffer/></li>
                  <li className="dissolve">
                      Dissolve
                  </li>
                  <li hidden className="dissolve_content"><Dissolve/></li>
                  <li className="union">
                      Union
                  </li>
                  <li hidden className="union_content"></li>
                  <li className="intersection">
                      Intersection
                  </li>
                  <li hidden className="intersection_content"></li>
                  <li className="diffrence">
                      Diffrence
                  </li>
                  <li hidden className="diffrence_content"></li>
                  <li className="extract">
                      Extract Feature
                  </li>
                  <li hidden className="extract_content"></li>
              </ul>
          </div>
          <div id='Layers'>
              <Layers/>
          </div>
      </div>
    ])
  }
}

export default Sidebar;

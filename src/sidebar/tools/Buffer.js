import React, { Component } from 'react';
import "./Buffer.css"
import MainMap from '../../Map/MainMap'

import L from 'leaflet'
import { updateBuffer } from '../Sidebar.js'
import geojson from '../../geojson/sor_trondelag.json';
var buffer = require('@turf/buffer')
var turf = require('@turf/turf')


class Buffer extends Component{
  constructor(props) {
    super(props)
  }
    render(){
        return(
        <div>
           <div id="tool_title">Distance:</div>
           <input id="buffer_number" type="number" placeholder="Buffer in meters"></input>
           <br></br>
           <button onClick={(param) => this.executeBuffer(param)}>Apply</button>
        </div>
        )
    }

    executeBuffer(){
      var number = document.getElementById('buffer_number').value;
      var layers = document.getElementById('sortable_layers')
      updateBuffer(number)
    }
}



export default Buffer;

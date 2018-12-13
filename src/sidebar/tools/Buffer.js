import React, { Component } from 'react';
import "./Buffer.css"
import MainMap from '../../Map/MainMap'
import L from 'leaflet'
import { callBuffer } from '../Sidebar.js'
import geojson from '../../geojson/sor_trondelag.json';
import $ from "jquery";
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

    // Sends call to Sidebar to run Buffer code.
    executeBuffer(){
      var buffer_radius = document.getElementById('buffer_number').value;
      var layer_key= ($('li.active').attr('id'));
      callBuffer(buffer_radius, layer_key)
    }
}



export default Buffer;

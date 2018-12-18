import React, { Component } from 'react';
import "./Buffer.css"
import MainMap from '../../Map/MainMap'
import L from 'leaflet'
import { callBuffer } from '../Sidebar.js'
import $ from "jquery";



class Buffer extends Component{
  constructor(props) {
    super(props)
  }
    render(){
        return(
        <div>
            <p>Select layer by clicking on it.</p>
            <div id="tool_title">Distance: [meters]</div>
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

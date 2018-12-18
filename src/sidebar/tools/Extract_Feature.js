import React, { Component } from 'react';
import "./Extract_Feature.css"
import MainMap from '../../Map/MainMap'
import L from 'leaflet'
import { callExtract } from '../Sidebar.js'
import $ from "jquery";



class Extract_Feature extends Component{
  constructor(props) {
    super(props)
  }
    render(){
        return(
        <div>
            <p>Select layer by clicking on it.</p>
            <button onClick={(param) => this.executeExtract(param)}>Apply</button>


        </div>
        )
    }

    // Sends call to Sidebar to run Extract code.
    executeExtract(){
      var layer_key= ($('li.active').attr('id'));
      callExtract(layer_key)
    }

}



export default Extract_Feature;

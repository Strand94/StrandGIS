import React, { Component } from 'react';
import "./Extract_Feature.css"
import MainMap from '../../Map/MainMap'
import L from 'leaflet'
import { getProperties } from '../Sidebar.js'
import $ from "jquery";


class Extract_Feature extends Component{
  constructor(props) {
    super(props)
  }

  render(){

  return(
    <div>
      <p>Select layer by clicking on it and click "Open Extract"</p>
      <button onClick={(param) => this.executeExtract(param)}>Open Extract</button>
    </div>
  )
}


    // Sends call to Sidebar to run Extract code.
    executeExtract(){
      var layer_key= ($('li.active').attr('id'));
      var extract_options = document.getElementById("extract_feature_window")
      $(extract_options).show();
      getProperties(layer_key)
    }

}



export default Extract_Feature;

import React, { Component } from 'react';
import "./Intersect.css"
import { callIntersect } from '../Sidebar.js'
import $ from "jquery";


// Fetches layer_list from layers, in order to get selection data.
export function getLayerListIntersect(layer_list) {
  this.setState({ layer_list })
}

class Intersect extends Component{
  constructor(props){
    super(props)
    this.state = {
      layer_list: []
    }
    getLayerListIntersect = getLayerListIntersect.bind(this);
  }

  render(){
    // Parses through all layers stored in memory and add them to the select lists.
    const layer_data_list = this.state.layer_list
    var data = []
    for (var i = 0; i < layer_data_list.length; i++) {
      data.push({"name":layer_data_list[i][0],"key":layer_data_list[i][1]})
    }
    const listItems = data.map((d) => <option className={d.key} value={d.key}>{d.name.slice(0,30)}</option>)

    return(
      <div>
        <p>Select the 2 layers you want to intersect.</p>
        <select id="intersect_select_geojson1">
          {listItems}
        </select>
        <select id="intersect_select_geojson2">
          {listItems}
        </select>
        <button onClick={(param) => this.executeIntersect(param)}>Apply</button>
      </div>
    )
}

    // Sends call to Sidebar to run Intersect.
    executeIntersect(){
      // Collects chosen layers from select list.
      var intersect_select1 = document.getElementById("intersect_select_geojson1");
      var geojson1 = intersect_select1.options[intersect_select1.selectedIndex].value;
      var intersect_select2 = document.getElementById("intersect_select_geojson2");
      var geojson2 = intersect_select2.options[intersect_select2.selectedIndex].value;
      callIntersect(geojson1, geojson2)
    }


}

export default Intersect;

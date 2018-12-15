import React, { Component } from 'react';
import "./Difference.css"
import { callDifference } from '../Sidebar.js'
import $ from "jquery";


// Fetches layer_list from layers, in order to get selection data.
export function getLayerListDifference(layer_list) {
  this.setState({ layer_list })
}

class Difference extends Component{
  constructor(props){
    super(props)
    this.state = {
      layer_list: []
    }
    getLayerListDifference = getLayerListDifference.bind(this);
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
        <p>Select the 2 layers you want to difference.</p>
        <select id="difference_select_geojson1">
          {listItems}
        </select>
        <select id="difference_select_geojson2">
          {listItems}
        </select>
        <button onClick={(param) => this.executeDifference(param)}>Apply</button>
      </div>
    )
}

    // Sends call to Sidebar to run Intersect.
    executeDifference(){
      // Collects chosen layers from select list.
      var difference_select1 = document.getElementById("difference_select_geojson1");
      var geojson1 = difference_select1.options[difference_select1.selectedIndex].value;
      var difference_select2 = document.getElementById("difference_select_geojson2");
      var geojson2 = difference_select2.options[difference_select2.selectedIndex].value;
      callDifference(geojson1, geojson2)
    }


}

export default Difference;

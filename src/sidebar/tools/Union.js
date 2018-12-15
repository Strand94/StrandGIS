import React, { Component } from 'react';
import "./Union.css"
import { callUnion } from '../Sidebar.js'
import $ from "jquery";


// Fetches layer_list from layers, in order to get selection data.
export function getLayerListUnion(layer_list) {
  this.setState({ layer_list })
}

class Union extends Component{
  constructor(props){
    super(props)
    this.state = {
      layer_list: []
    }
    getLayerListUnion = getLayerListUnion.bind(this);
  }

  render(){
    // Parses through all layers stored in memory and add them to the select lists.
    const layer_data_list = this.state.layer_list
    var data = []
    for (var i = 0; i < layer_data_list.length; i++) {
      data.push({"name":layer_data_list[i][0],"key":layer_data_list[i][1]})
    }
    const listItems = data.map((d) => <option value={d.key}>{d.name.slice(0,30)}</option>)

    return(
      <div>
        <p>Select the 2 layers you want to unite.</p>
        <select id="union_select_geojson1">
          {listItems}
        </select>
        <select id="union_select_geojson2">
          {listItems}
        </select>
        <button onClick={(param) => this.executeUnion(param)}>Apply</button>
      </div>
    )
}

    // Sends call to Sidebar to run Union code.
    executeUnion(){
      // Collects chosen layers from select list.
      var union_select1 = document.getElementById("union_select_geojson1");
      var geojson1 = union_select1.options[union_select1.selectedIndex].value;
      var union_select2 = document.getElementById("union_select_geojson2");
      var geojson2 = union_select2.options[union_select2.selectedIndex].value;
      callUnion(geojson1, geojson2)
    }


}

export default Union;

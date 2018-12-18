import React, { Component } from 'react';
import "./ExtractFeatureWindow.css"
import $ from "jquery";


// Fetches properties from layers, in order to get selected data.
export function getPropertiesList(properties_list, layerName) {
  this.setState({ properties_list, layerName })
}


class ExtractFeatureWindow extends Component{
  constructor(props) {
    super(props)
    this.state = {
      properties_list: [],
      layerName: null
    }
    getPropertiesList = getPropertiesList.bind(this)
  }
    render(){

        return(
        <div className="Extract_window">
            <p>Extracting features from {this.state.layerName} </p>
            New Layer name: <input className="extract_name" type="text"/>
            <button onClick={(param) => this.addRule(param)}>Add Rule</button>
            <button onClick={(param) => this.executeExtract(param)}>Extract</button>
            <button onClick={(param) => this.closeWindow(param)}>Close Window</button>
            <div id="extract_feature_rules">

            </div>

        </div>

        )
    }

    closeWindow() {
      var extract_options = document.getElementById("extract_feature_window")
      $(extract_options).hide();
    }

    addRule() {
      const layer_data_list = this.state.properties_list

      var properties = ""
      for (var i = 0; i < layer_data_list.length; i++) {
        properties += "<option value='"+ layer_data_list[i][0] +"'>"+ layer_data_list[i][0] +"</option>"
      }

      var extract_rules = document.getElementById("extract_feature_rules")
      var rule_html = "<div className='active_rule'><p>Select feature:</p><select className='properties_select'>"+properties+"</select></div><div><select><option value='=='>Equals</option><option value='!='>Not Equal to</option><option value='<'>Above</option><option value='>'>Below</option><option value='<='>Equals or above</option><option value='>='>Equals or below</option></select></div><div><input className='property_value' type='text'/></div>"

      $(extract_rules).append(rule_html)
    }


    executeExtract() {
      var $html = $('#extract_feature_rules')

      console.log(sta);


    }
}



export default ExtractFeatureWindow;

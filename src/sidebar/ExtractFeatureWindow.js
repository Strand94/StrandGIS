import React, { Component } from 'react'
import "./ExtractFeatureWindow.css"
import { callExtract } from "./Sidebar"
import $ from "jquery";


// Fetches properties from layers, in order to get selected data.
export function getPropertiesList(properties_list, layerName, layerKey) {
  this.setState({ properties_list, layerName, layerKey })
}


class ExtractFeatureWindow extends Component{
  constructor(props) {
    super(props)
    this.state = {
      properties_list: [],
      layerName: null,
      layerKey: null,
      rules: [],

    }
    getPropertiesList = getPropertiesList.bind(this)
    this.collectAddData = this.collectAddData.bind(this)
  }
    render(){

        const layer_data_list = this.state.properties_list
        var properties = ""
        for (var i = 0; i < layer_data_list.length; i++) {
         properties += "<option value='"+ layer_data_list[i][0] +"'>"+ layer_data_list[i][0] +"</option>"
        }
        $( "#propertySelect" ).append(properties);

        const rule_list = this.state.rules
        var ruleString = ""
        for (var i = 0; i < rule_list.length; i++) {
         ruleString += "<li>"+rule_list[i][0]+" "+rule_list[i][1]+" "+rule_list[i][2]+"</li>"
        }
        $( "#rule_list" ).empty();
        $( "#rule_list" ).append(ruleString);


        return(
        <div className="Extract_window">
            <p>Extracting features from {this.state.layerName} </p>
            New Layer name: <input id="extract_name" type="text"/>
            <button onClick={(param) => this.toggleAddRulePanel(param)}>Add Rule</button>
            <button onClick={(param) => this.executeExtract(param)}>Extract</button>
            <button onClick={(param) => this.closeWindow(param)}>Close Window</button>
            <div>
              <ul id="rule_list">
              </ul>
            </div>
            <div id="addRulePanel" hidden>
              <select id="propertySelect">
              </select>
              <select id="symbolSelect">
                <option value='=='>Equals</option>
                <option value='!='>Not Equal to</option>
                <option value='>'>Above</option>
                <option value='<'>Below</option>
                <option value='>='>Equals or above</option>
                <option value='<='>Equals or below</option>
              </select>
              <input id="value_input" type="text"/>
              <button onClick={(param) => this.collectAddData(param)}>Add</button>
            </div>

        </div>

        )
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.rules !== prevState.rules ){
      }
    }

    collectAddData(){
      var value = document.getElementById('value_input').value
      var property = document.getElementById('propertySelect').value
      var symbol = document.getElementById('symbolSelect').value
      var rule = [property, symbol, value]
      $('#addRulePanel').hide();


      this.setState(prevState => ({
        rules: [...prevState.rules, rule]
      }))


    }

    closeWindow() {
      var extract_options = document.getElementById("extract_feature_window")
      var layerName = null;
      $(extract_options).hide();
      this.setState({ layerName })
      $('#addRulePanel').hide();

      // TODO Slett alle eksisterende "rules"
    }

    toggleAddRulePanel() {
      var value = $('#addRulePanel').is(":visible");
      if (value) {
        $('#addRulePanel').hide();
      } else {
        $('#addRulePanel').show();
      }
    }

    executeExtract() {
      const rule_list = this.state.rules
      const layer_key = this.state.layerKey
      const new_name = document.getElementById('extract_name').value


      // clears out the rule list.
      $( "#rule_list" ).empty();

      callExtract(new_name, layer_key, rule_list)

      // Resets the rules.
      this.setState({rules: []});
    }
}



export default ExtractFeatureWindow;

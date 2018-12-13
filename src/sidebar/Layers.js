import React, { Component } from 'react';
import './Layers.css';
import { new_geojsonToParent } from './Sidebar.js'


class Layers extends Component{
  constructor(props){
    super(props)
    this.state = {
      newest_file_name: null,
      layer_list: []
    }
    this.readGeoJSONFile = this.readGeoJSONFile.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // Appending new file name to Layer list with a unique key value.
    if (this.state.newest_file_name !== prevState.newest_file_name ){
      this.setState({
        layer_list: [...this.state.layer_list, [this.state.newest_file_name, Math.random().toString(36).substr(2, 9)]]
        //NOTE: Math.random should be unique (with less than 10.000 simulatanious layers) because of its seeding algorithm.
      })
    }

  }

  componentDidMount() {
    // Do nothing
  }

  onChange(state) {
  // Add new layer for the newest, uploaded geojson file.
  }


  render(){
    const layer_list = this.state.layer_list
    var data = []
    for (var i = 0; i < layer_list.length; i++) {
      data.push({"name":layer_list[i][0],"key":layer_list[i][1]})
    }
    const listItems = data.map((d) => <li className="layer" id={d.key}>{d.name}</li>)

      return(
      <div id="layers">
          <p id="subtitle">Layers</p>
          <p id='sub_info'>Click to select, drag to reorder.</p>
          <div>
              <ul id="sortable_layers" className="ui-sortable">
                  <li className="T1 layer active">Trondheim</li>
                  <li className="T2 layer">Trondheim 2</li>
                  {listItems}
              </ul>
          </div>
          <div>
            <p id="subtitle">Add Layer</p>
            <p id='sub_info'>Click button and upload GeoJSON file.</p>
            <div>
              {/* Hidden input field to handle file upload on button click. */}
              <input id='fileid' type='file' onChange={(param) => this.readGeoJSONFile(param)} accept=".GeoJSON,.JSON" hidden/>
              <button onClick={(param) => this.activateFileUpload(param)}>GEOJSON</button>
            </div>
          </div>
      </div>
      )
  }

  createLayer(){

  }

  activateFileUpload(){
    document.getElementById('fileid').click();
    document.getElementById('fileid').addEventListener('change', this.readGeoJSONFile, true);
  }

 //TODO: ADD EXCEPTION HANDELING FOR FILE UPLOAD.

  // Adding file reading code in Layers as this is the only place it is used.
  readGeoJSONFile(file_upload){
    //Retrieving the first (and only!) File from the FileList object
    var file = file_upload.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        const new_geojson = JSON.parse(e.target.result)

        // Sending the JSON extracted from file to Parent component.
        new_geojsonToParent(new_geojson)

      }
      reader.readAsText(file);
    } else {
      alert("Failed to load file");
    }
    // fetching file name for adding layer.
    const newest_file_name = file.name;
    this.setState({newest_file_name})

  }
}

export default Layers;

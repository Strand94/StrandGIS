import React, { Component } from 'react';
import Sortable from 'sortablejs';
import './Layers.css';
import { new_geojsonToParent, getLayerList, deleteLayerCall } from './Sidebar.js'
import { reorderLayers } from '../Map/MainMap'
import { getLayerListUnion } from './tools/Union.js'
import { getLayerListIntersect } from './tools/Intersect.js'
import { getLayerListDifference } from './tools/Difference.js'
import $ from "jquery";


// Class that handles layer logic and uploading of files.
class Layers extends Component{
  constructor(props){
    super(props)
    this.state = {
      layer_list: []
    }
    this.readGeoJSONFile = this.readGeoJSONFile.bind(this);
    createLayer = createLayer.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {

    // Appending new file name to Layer list with a unique key value.
    if (this.state.layer_list !== prevState.layer_list ){
      getLayerList(this.state.layer_list)
      getLayerListUnion(this.state.layer_list)
      getLayerListIntersect(this.state.layer_list)
      getLayerListDifference(this.state.layer_list)

      // Sets a click listener for the newest layer's checkbox event.
      var id = this.state.layer_list[this.state.layer_list.length-1][1];
      var element = document.getElementById('checkbox_'+id);


      element.addEventListener('click', function(event) {
        // adding stopPropagation so layer is not selected when checkbox is clicked.
        event.stopPropagation();
        // To check whether the checkbox is clicked or not.
        var element = document.getElementById('checkbox_'+id);
        // To get the correct layer on the map to hide.
        var map_element = document.getElementsByClassName("map-path "+id);
        if (element.checked == true) {
          $(map_element).show();
        } else {
          $(map_element).hide();
        }
      });
    }

    // Make all the new layers selectable and dragable.
    addLayerProperties()


  }

  componentDidMount() {
    // Make the initial layers selectable and dragable.
    addLayerProperties()

  }

  render(){
    // Parses through all layers stored in memory and add them to the Layer list.
    const layer_data_list = this.state.layer_list
    var data = []
    for (var i = 0; i < layer_data_list.length; i++) {
      data.push({"name":layer_data_list[i][0],"key":layer_data_list[i][1]})
    }
    const listItems = data.map((d) =>
      <li className="layer" id={d.key}>
        <input type="checkbox" defaultChecked={true} id={"checkbox_"+d.key} />
        {d.name.slice(0,30)}
      </li>
  )

    return(
      <div id="layers">
          <p id="subtitle">Layers</p>
          <button id="delete" onClick={(param) => this.deleteLayer(param)}>🗑️</button>
          <p id='sub_info'>Click to select, drag to reorder.</p>
          <div>
              <ul id="sortable_layers" className="ui-sortable">
                  {listItems}
              </ul>
          </div>
          <div>
            <p id="subtitle">Add Layer</p>
            <div>
              {/* Hidden input field to handle file upload on button click. */}
              <input id='fileid' type='file' onChange={(param) => this.readGeoJSONFile(param)} accept=".GeoJSON,.JSON" hidden/>
              <button id="upload" onClick={(param) => this.activateFileUpload(param)}>Upload file</button>
            </div>
            <p id='sub_info'>Click button and upload GeoJSON or JSON file.</p>

          </div>
      </div>
    )
  }

  // Checks if upload GeoJSON button has been clicked, and file has been selected.
  activateFileUpload(){
    document.getElementById('fileid').click();
  }

  // Sends call to Sidebar to delete selected layer, when delete button is clicked.
  deleteLayer(){
    var delete_layer_key= ($('li.active').attr('id'));
    deleteLayerCall(delete_layer_key)
  }

  // Code running when checkbox is clicked.
  handleChangeChk(){
    console.log("HandleClick")
  }

  // Adding file reading code in Layers as this is the only place it is used.
  readGeoJSONFile(file_upload){
    //Retrieving the first (and only!) File from the FileList object
    var file = file_upload.target.files[0];
    const newest_file_key = Math.random().toString(36).substr(2, 9);
    //NOTE: Math.random should be unique (with less than 10.000 simulatanious layers) because of its seeding algorithm.
    const newest_file_name = file.name;

    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        const new_geojson = JSON.parse(e.target.result)

        // Sending the JSON extracted from file to Parent component.
        new_geojsonToParent(new_geojson, newest_file_key)
        createLayer(newest_file_name, newest_file_key, new_geojson)


      }
      reader.readAsText(file);
    } else {
      alert("Failed to load file");
    }


  }
}

// helper function that collect read data and sets new state.
export function createLayer(newest_file_name, newest_file_key, new_geojson){
  this.setState({
    layer_list: [...this.state.layer_list, [newest_file_name, newest_file_key, new_geojson]]
  })
}

function addLayerProperties() {
  // Gets the class name for the layer list.
  var layer_list = document.getElementById("sortable_layers");

  // Makes the sidebar layer list selectable.
  var layer = layer_list.getElementsByClassName("layer");
  for (var i = 0; i < layer.length; i++) {
      layer[i].addEventListener("click", function() {
          var current = document.getElementsByClassName("active");
          if (current[0]){
          current[0].className = current[0].className.replace(" active", "");
          }
          this.className += " active";
      });
  }

  // Makes the sidebar layer list sortable
  Sortable.create(layer_list,{
      onEnd: function (e){
          // Reorders the layers based on ID name ordering.
          reorderLayers(getLayers())
      }
  })

  // Function that returns all layers (and their order.)
  function getLayers(){
      var i;
      var list_order = [];
      var a = document.getElementsByClassName("layer")
      for (i=0; i < a.length; i++){
          var class_name = ((a[i].className).split(" "))
          list_order.push(class_name[0])
      }
      return list_order;
  }
}

export default Layers;

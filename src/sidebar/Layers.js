import React, { Component } from 'react';
import Sortable from 'sortablejs';
import './Layers.css';
import { new_geojsonToParent, getLayerList, deleteLayerCall, geojsonMultiPolygonToPolygon } from './Sidebar.js'
import { reorderLayers } from '../Map/MainMap'
import { getLayerListUnion } from './tools/Union.js'
import { getLayerListIntersect } from './tools/Intersect.js'
import { getLayerListDifference } from './tools/Difference.js'
import $ from "jquery";
import FileSaver from 'file-saver';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
var turf = require('@turf/turf')


// Class that handles layer logic and uploading of files.
class Layers extends Component{
  constructor(props){
    super(props)
    this.state = {
      layer_list: [],
      selected_layer: null,
    }
    this.readGeoJSONFile = this.readGeoJSONFile.bind(this);
    download = download.bind(this)
    createLayer = createLayer.bind(this);
    changeName = changeName.bind(this);
    updateSelected = updateSelected.bind(this);
    this.disableInvalidButtons = this.disableInvalidButtons.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    this.disableInvalidButtons()
    // Appending new file name to Layer list with a unique key value.
    if (this.state.layer_list !== prevState.layer_list ){
      getLayerList(this.state.layer_list)
      getLayerListUnion(this.state.layer_list)
      getLayerListIntersect(this.state.layer_list)
      getLayerListDifference(this.state.layer_list)

      // Sets a click listener for the newest layer's checkbox event.
      var id = this.state.layer_list[this.state.layer_list.length-1][1];
      var hide_map_element = document.getElementById('checkbox_'+id);
      var edit_layer_element = document.getElementById('customize_'+id);

      // Adding hide/show when clicking checkbox on layer.
      hide_map_element.addEventListener('click', function(event) {
        // adding stopPropagation so layer is not selected when checkbox is clicked.
        event.stopPropagation();
        // To check whether the checkbox is clicked or not.
        var hide_map_element = document.getElementById('checkbox_'+id);
        // To get the correct layer on the map to hide.
        var map_element = document.getElementsByClassName("map-path "+id);

        if (hide_map_element.checked == true) {
          $(map_element).show();
        } else {
          $(map_element).hide();
        }
      });

      edit_layer_element.addEventListener('click', function(event) {
        // adding stopPropagation so layer is not selected when checkbox is clicked.
        event.stopPropagation();
        // To check whether the checkbox is clicked or not.
        var edit_layer_element = document.getElementById('customize_'+id);
        var hide_status = 'customizeDiv_'+id
        var value = $('.'+hide_status).is(":visible");
        var list_element = document.getElementsByClassName("layer "+id);

        if (value) {
          $('.'+hide_status).hide();
          $(list_element).css("height", "65px");
        } else {
          $('.'+hide_status).show();
          $(list_element).css("height", "200px");

        }
      });

    }

    // Make all the new layers selectable and dragable.
    addLayerProperties()


  }

  componentDidMount() {
    // Make the initial layers selectable and dragable.
    addLayerProperties()
    this.disableInvalidButtons()

  }

  render(){
    // Parses through all layers stored in memory and add them to the Layer list.
    const layer_data_list = this.state.layer_list
    var data = []
    for (var i = 0; i < layer_data_list.length; i++) {
      data.push({"name":layer_data_list[i][0],"key":layer_data_list[i][1]})
    }
    const listItems = data.map((d) =>
      <li className={"layer "+d.key} id={d.key}>
        <div className="LayerContainer">
          <div className="LayerData">
          <p className="LayerName dont-break-out" id={"name_"+d.key}>
            {d.name.slice(0,30)}
          </p>
            <input className="toggleShow" type="checkbox" defaultChecked={true} id={"checkbox_"+d.key} />
            <input className="customize" type="button" value="⚙️" id={"customize_"+d.key} />

          </div>
          <div className={"customizeDiv_"+d.key} hidden >
            <div>
              <p id={"edit_text"}>Change name:</p>
              <input type="text" value={d.name} onChange={(param) => changeName(d.key)} id={"change_name_"+d.key} />
              <p id={"edit_text"}>Change colors:</p>
              <div id="container">
                <div id="fill">
                  <p>Fill</p><ColorPicker className={d.key} color={'#0ad'} onChange={customizeFill} alpha={50}/>
                </div>
                <div id="stroke">
                  <p>Stroke</p><ColorPicker className={d.key} color={'#0ad'} onChange={customizeStroke} alpha={50}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )

    return(
      <div id="layers">
        <p id="subtitle">Layers</p>
        <button id="delete" onClick={(param) => this.deleteLayer(param)}>🗑️</button>
        <button id="save" onClick={(param) => download(param)}>💾</button>
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
  // Makes buttons unclickable if no layer is selected.
  disableInvalidButtons() {
    if (this.state.selected_layer == null) {
       $('#delete').prop('disabled', true);
       $('#delete').css( 'cursor', 'not-allowed' );
       $('#save').prop('disabled', true);
       $('#save').css( 'cursor', 'not-allowed' );

    } else {
      $('#delete').prop('disabled', false);
      $('#delete').css( 'cursor', 'pointer' );
      $('#save').prop('disabled', false);
      $('#save').css( 'cursor', 'pointer' );

    }

  }

  // Checks if upload GeoJSON button has been clicked, and file has been selected.
  activateFileUpload(){
    document.getElementById('fileid').click();
  }

  // Sends call to Sidebar to delete selected layer, when delete button is clicked.
  deleteLayer(){
    var delete_layer_key= ($('li.active').attr('id'));
    deleteLayerCall(delete_layer_key)
    this.setState({
      selected_layer: null
    })

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

        // Checks the uploaded file, and cleans the data, making everything on same format.
        if (new_geojson.type == 'FeatureCollection') {
          var geojson_features = new_geojson.features
          var new_features = []

          for (var i = 0; i < geojson_features.length; i++) {
            if(geojson_features[i].geometry.type == 'Polygon') {
              new_features.push(geojson_features[i])
            }
            else if(geojson_features[i].geometry.type == 'MultiPolygon') {
              for (var j = 0; j < geojson_features[i].geometry.coordinates.length; j++) {
                var feature = {"type": "Feature", "properties": {},  "geometry": { "type": "Polygon", "coordinates": geojson_features[i].geometry.coordinates[j] }}
                feature.properties = geojson_features[i].properties
                new_features.push(feature)
              }
            }
            else if(geojson_features[i].geometry.type == 'Point') {
              var circle = turf.circle(geojson_features[i].geometry.coordinates, 0.0025)
              circle.properties = geojson_features[i].properties
              new_features.push(circle)
            } else if(geojson_features[i].geometry.type == 'LineString') {
              new_features.push(geojson_features[i])
            }
          }
          var clean_geojson = {"type":"FeatureCollection","features": new_features };
        } else if (new_geojson.type == 'Feature') {
            var clean_geojson = {"type":"FeatureCollection","features": new_geojson };
        } else {
          var clean_geojson = clean_data(new_geojson)
        }
        // Sending the JSON extracted from file to Parent component.
        new_geojsonToParent(clean_geojson, newest_file_key)
        createLayer(newest_file_name, newest_file_key, clean_geojson)


      }
      reader.readAsText(file);
    } else {
      alert("Failed to load file");
    }

  }
}


// Call to change layer name.
export function changeName(id) {
  var input_element = $('#change_name_'+id).val();
  if (input_element == undefined) {
  } else {

    for (var i = 0; i < this.state.layer_list.length; i++) {
      if (id == this.state.layer_list[i][1]){
        var position = i
      }
    }

    var layers = [...this.state.layer_list]
    layers[position][0] = input_element
    this.setState( {layers} )
  }
}

// Add the customization of Layer fill (inner) to ther map.
function customizeFill(colors) {
  var map_element = document.getElementsByClassName("map-path "+this.className);
  $(map_element).css("fill", colors.color);
  $(map_element).css("fill-opacity", colors.alpha/100);
}


// Add the customization of Layer stroke (border) to ther map.
function customizeStroke(colors) {
  var map_element = document.getElementsByClassName("map-path "+this.className);
  $(map_element).css("stroke", colors.color);
  $(map_element).css("stroke-opacity", colors.alpha/100);
}

// Function that creates a file for selected layer to download.
export function download(geojson_key) {
  var download_layer_key= ($('li.active').attr('id'));
  for (var i = 0; i < this.state.layer_list.length; i++) {
    if (download_layer_key == this.state.layer_list[i][1]){
      var layer_position = i
    }
  }
  var geojson_file = this.state.layer_list[layer_position][2]
  var geojson_file_name = this.state.layer_list[layer_position][0]
  var filename = geojson_file_name.split(' ').join('_');
  var filename = filename.replace('.geojson', '');

  var blob = new Blob([JSON.stringify(geojson_file)], {type: "geojson;charset=utf-8"});
  FileSaver.saveAs(blob, filename+".geojson");
}

// Function that takes in all kinds of GeoJSON/JSON map data and cleans it.
export function clean_data(new_geojson) {
  if (new_geojson.type == 'Polygon') {
    var geojson = {"type":"FeatureCollection","features":[{"type": "Feature", "properties": {},  "geometry": { "type": "Polygon", "coordinates": new_geojson.coordinates }}]};
    return geojson
  } else if (new_geojson.type == 'MultiPolygon') {
      return geojsonMultiPolygonToPolygon(new_geojson)
  } else if (new_geojson.type == 'Point') {
    var circle = turf.circle(new_geojson.coordinates, 2)
    var geojson = {"type":"FeatureCollection","features": circle };
    return geojson
  }

}


// helper function that collect read data and sets new state.
export function createLayer(newest_file_name, newest_file_key, new_geojson){
  this.setState({
    layer_list: [...this.state.layer_list, [newest_file_name, newest_file_key, new_geojson]]
  })
}

// helper function that returns selected layer.
export function updateSelected(){
  var selected_key= ($('li.active').attr('id'));
  for (var i = 0; i < this.state.layer_list.length; i++) {
    if (selected_key == this.state.layer_list[i][1]){
      var layer_position = i
    }
  }
  var geojson_file_name = this.state.layer_list[layer_position][0]
  this.setState({
    selected_layer: geojson_file_name
  })
}

// Adds sortable and selectable options to layers.
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
          updateSelected()

      });
  }

  reorderLayers(getLayers())



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
      list_order.push(class_name[1])
  }
  return list_order;
}

}

export default Layers;

import React, { Component } from 'react';
import Layers from "./Layers";
import "./Sidebar.css";
import Buffer from './tools/Buffer';
import Dissolve from './tools/Dissolve';
import Union from './tools/Union';
import { get_newgeojson } from '../Map/MainMap'
import { createLayer } from './Layers'
import $ from "jquery";
import L from 'leaflet';
var buffer = require('@turf/buffer')
var turf = require('@turf/turf')
var fs = require('fs');

// Gets call from Buffer and sends data to MainMap and Layer
export function callBuffer(buffer_radius, geojson_file_key) {
  var layer_position = find_called_geojson(geojson_file_key)
  var selected_layer_geojson = collect_called_geojson(layer_position)
  var selected_layer_name = this.state.layer_list[layer_position][0]
  var buffered = turf.buffer(selected_layer_geojson, buffer_radius, {units: 'meters'});
  const buffer_layer_key = generateKey()
  get_newgeojson(buffered, buffer_layer_key)
  createLayer(selected_layer_name+' '+buffer_radius+' m buffer', buffer_layer_key, buffered)
}

// Gets call from Dissolve and sends data to MainMap and Layer
export function callDissolve(geojson_file_key) {
  var layer_position = find_called_geojson(geojson_file_key)
  var selected_layer_geojson = collect_called_geojson(layer_position)
  var selected_layer_name = this.state.layer_list[layer_position][0]
  var dissolved = turf.dissolve(selected_layer_geojson)
  const dissolve_layer_key = generateKey()
  get_newgeojson(dissolved, dissolve_layer_key)
  createLayer(selected_layer_name+' dissolved', dissolve_layer_key, dissolved)
}

// Gets call from Union and sends data to MainMap and Layer

export function callUnion(geojson_file_key1, geojson_file_key2) {
  /*NOTE:  As the union function uses polygons not geojson files as input,
  we need to seperate the geojson files into features and merge all of them. */

  // gets the data for the first geojson file stored in memory.
  var layer_position1 = find_called_geojson(geojson_file_key1)
  var selected_layer_geojson1 = collect_called_geojson(layer_position1)
  var selected_layer_name1 = this.state.layer_list[layer_position1][0]
  // gets the data for the second geojson file stored in memory.
  var layer_position2 = find_called_geojson(geojson_file_key2)
  var selected_layer_geojson2 = collect_called_geojson(layer_position2)
  var selected_layer_name2 = this.state.layer_list[layer_position2][0]

  // combines the geojson files into one, in case we have mulitple features in one of them.
  var unionLayer = {
    "type" : "FeatureCollection",
    "features": [... selected_layer_geojson1.features, ... selected_layer_geojson2.features]
  }

  const union_layer_key = generateKey()
  get_newgeojson(unionLayer, union_layer_key)
  createLayer('union '+selected_layer_name1+' & '+selected_layer_name2, union_layer_key, unionLayer)

}

export function deleteLayerCall(geojson_file_key) {
  var layer_position = find_called_geojson(geojson_file_key)
  var selected_layer_geojson = this.state.layer_list[layer_position][2]
  // Removes the layer for the selected geojson file in sidebar.
  $( "#"+geojson_file_key+"" ).remove();
  // Removes the geojson layers from the map.
  $( "."+geojson_file_key+"" ).remove();

  // TODO: Remove layer from UNION
}

// Finds position in layer list for geojson based on key value.
function find_called_geojson(geojson_file_key){
  for (var i = 0; i < this.state.layer_list.length; i++) {
    if (geojson_file_key == this.state.layer_list[i][1]){
      return i
    }
  }
}

// Returns the geojson file, in a format suited for the operations.
export function collect_called_geojson(geojson_file_position){
  var geojson_file = this.state.layer_list[geojson_file_position][2]
  // If file is a FeatureCollection, we can simply return it.
  if (geojson_file.type == "FeatureCollection"){
    return geojson_file
  }
  // If file is only a Polygon, we need to convert it into a FeatureCollection.
  else if (geojson_file.type == "Polygon") {
    var lg = new L.LayerGroup();
    var geojson = {"type":"FeatureCollection","features":[{"type": "Feature", "properties": {},  "geometry": { "type": "Polygon", "coordinates": geojson_file.coordinates }}]};
    return geojson
  }

}

// Generate new layer layer key
function generateKey() {
  return Math.random().toString(36).substr(2, 9);
}

// Fetches GeoJSON properties from Layer and passes them on to MainMap.
export function new_geojsonToParent(new_geojson, newest_file_key) {
  get_newgeojson(new_geojson, newest_file_key)
}

// Fetches layer_list from layers, in order to send geojson data to MainMap.
export function getLayerList(layer_list) {
  this.setState({ layer_list })
}

class Sidebar extends Component {
  constructor(props){
    super(props)
    this.state = {
      layer_list: []
    }
    callBuffer = callBuffer.bind(this)
    callDissolve = callDissolve.bind(this)
    callUnion = callUnion.bind(this)
    new_geojsonToParent = new_geojsonToParent.bind(this)
    getLayerList = getLayerList.bind(this)
    find_called_geojson = find_called_geojson.bind(this)
    deleteLayerCall = deleteLayerCall.bind(this)
    collect_called_geojson = collect_called_geojson.bind(this)

  }

  render() {
    return ([
      <div id="sidebar_content">
          <div id="sidebar_title_div">
              <h1 id="title">App name</h1>
          </div>
          <div id="tools">
              <p id="subtitle">Tools</p>
              <ul id="tool_layer">
                  <li className="buffer">
                      Buffer {this.state.buffer_radius}
                  </li>
                  <li hidden className="buffer_content"><Buffer/></li>
                  <li className="dissolve">
                      Dissolve
                  </li>
                  <li hidden className="dissolve_content"><Dissolve/></li>
                  <li className="union">
                      Union
                  </li>
                  <li hidden className="union_content"><Union/></li>
                  <li className="intersection">
                      Intersection
                  </li>
                  <li hidden className="intersection_content"></li>
                  <li className="diffrence">
                      Diffrence
                  </li>
                  <li hidden className="diffrence_content"></li>
                  <li className="extract">
                      Extract Feature
                  </li>
                  <li hidden className="extract_content"></li>
              </ul>
          </div>
          <div id='Layers'>
              <Layers/>
          </div>
      </div>
    ])
  }
}

export default Sidebar;

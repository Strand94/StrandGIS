import React, { Component } from 'react';
import Layers from "./Layers";
import "./Sidebar.css";
import Buffer from './tools/Buffer';
import Dissolve from './tools/Dissolve';
import Union from './tools/Union';
import Intersect from './tools/Intersect';
import Difference from './tools/Difference';
import Extract_Feature from './tools/Extract_Feature'
import { getPropertiesList } from './ExtractFeatureWindow'
import { get_newgeojson } from '../Map/MainMap'
import { createLayer } from './Layers'
import $ from "jquery";
import L from 'leaflet';
var turf = require('@turf/turf')

// Gets call from Buffer and sends data to MainMap and Layer
export function callBuffer(buffer_radius, geojson_file_key) {
  var layer_position = find_called_geojson(geojson_file_key)
  var selected_layer_geojson = collect_called_geojson(layer_position)
  var selected_layer_name = this.state.layer_list[layer_position][0]
  var buffered = turf.buffer(selected_layer_geojson, buffer_radius, {units: 'meters'});

  // Runs dissolve on the buffer, so we don't get overlapping buffer zones.
  var buffer_dissolved = buffered.features[0]
  for (var i = 1; i < buffered.features.length; i++) {
    buffer_dissolved = turf.union(buffer_dissolved, buffered.features[i])
  }

  // Cleans the returned dissolve data.
  if (buffer_dissolved.geometry.type == 'MultiPolygon') {
    var multipolygon = {"type":"FeatureCollection","features": [buffer_dissolved]};
    final_buffer = geojsonMultiPolygonToPolygon(multipolygon)
  } else {
    var final_buffer = {"type":"FeatureCollection","features": [buffer_dissolved]};
  }


  const buffer_layer_key = generateKey()
  get_newgeojson(final_buffer, buffer_layer_key)
  createLayer(selected_layer_name+' '+buffer_radius+' m buffer', buffer_layer_key, final_buffer)
}

// Gets call from Dissolve and sends data to MainMap and Layer
export function callDissolve(geojson_file_key) {
  /* The Turf.JS code for dissolve is not working as intended (said by author).
  Therefore we use union instead, on all polygons within geojson file. */
  var layer_position = find_called_geojson(geojson_file_key)
  var selected_layer_geojson = collect_called_geojson(layer_position)
  var selected_layer_name = this.state.layer_list[layer_position][0]

  var dissolveLayer = selected_layer_geojson.features[0]

  for (var i = 1; i < selected_layer_geojson.features.length; i++) {
    dissolveLayer = turf.union(dissolveLayer, selected_layer_geojson.features[i])
  }

  // Cleans the returned dissolve data.
  if (dissolveLayer.geometry.type == 'MultiPolygon') {
    var multipolygon = {"type":"FeatureCollection","features": [dissolveLayer]};
    final_dissolve = geojsonMultiPolygonToPolygon(multipolygon)
  } else {
    var final_dissolve = {"type":"FeatureCollection","features": [dissolveLayer]};
  }

  const dissolve_layer_key = generateKey()
  get_newgeojson(final_dissolve, dissolve_layer_key)
  createLayer(selected_layer_name+' dissolved', dissolve_layer_key, final_dissolve)
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
    "features": [...selected_layer_geojson1.features, ...selected_layer_geojson2.features]
  }

  const union_layer_key = generateKey()
  get_newgeojson(unionLayer, union_layer_key)
  createLayer('union '+selected_layer_name1+' & '+selected_layer_name2, union_layer_key, unionLayer)

}

export function callIntersect(geojson_file_key1, geojson_file_key2) {
  /*NOTE: Intersect also uses features, so we need to do a similar combination as with union. */

  // gets the data for the first geojson file stored in memory.
  var layer_position1 = find_called_geojson(geojson_file_key1)
  var selected_layer_geojson1 = collect_called_geojson(layer_position1)
  var selected_layer_name1 = this.state.layer_list[layer_position1][0]
  // gets the data for the second geojson file stored in memory.
  var layer_position2 = find_called_geojson(geojson_file_key2)
  var selected_layer_geojson2 = collect_called_geojson(layer_position2)
  var selected_layer_name2 = this.state.layer_list[layer_position2][0]

  // Make a list of all the features in both Geojson files.
  var f1 = selected_layer_geojson1.features
  var f2 = selected_layer_geojson2.features

  console.log(f1)
  console.log(f2)


  var conflictlist = [];

  for (var i = 0; i < f1.length; i++) {
      var parcel1 = f1[i];

      for (var j = 0; j <f2.length; j++) {

          var parcel2 = f2[j];

            console.log(parcel1)
            console.log(parcel2)

              var conflict = turf.intersect(parcel1, parcel2);
              console.log(conflict)
              if (conflict != null) {
                  conflictlist.push(conflict);
              }
      }
  }
  console.log("conflicts:")
  console.log(conflictlist)

  var lg = new L.LayerGroup();
  var intersectLayer = {"type":"FeatureCollection","features": conflictlist};

  const intersect_layer_key = generateKey()
  get_newgeojson(intersectLayer, intersect_layer_key)
  createLayer('intersect '+selected_layer_name1+' & '+selected_layer_name2, intersect_layer_key, intersectLayer)
}

export function callDifference(geojson_file_key1, geojson_file_key2) {
  /*NOTE: Difference also uses features (single Polygon or MultiPolygon), so we need to make sure all features are either a singe polygon
    or a geojson file with a MultiPolygon geometry type.*/

  // gets the data for the first geojson file stored in memory.
  var layer_position1 = find_called_geojson(geojson_file_key1)
  var selected_layer_geojson1 = collect_called_geojson(layer_position1)
  var selected_layer_name1 = this.state.layer_list[layer_position1][0]
  // gets the data for the second geojson file stored in memory.
  var layer_position2 = find_called_geojson(geojson_file_key2)
  var selected_layer_geojson2 = collect_called_geojson(layer_position2)
  var selected_layer_name2 = this.state.layer_list[layer_position2][0]

  // Takes the selected geojson files and converts them to MultiPolygon geometry.
  var difference1 = geojsonPolygonToMultiPolygon(selected_layer_geojson1)
  var difference2 = geojsonPolygonToMultiPolygon(selected_layer_geojson2)

  // Runs the difference algorithm on the two multipolygon files.
  var difference = turf.difference(difference1.features[0], difference2.features[0])


  // Merges the difference layer into a new geojson file.
  if (difference == null) {
    difference = null
  } else {
    var differenceLayer_multipolygon = {"type":"FeatureCollection","features": [difference]};
    var differenceLayer = geojsonMultiPolygonToPolygon(differenceLayer_multipolygon)
  }


  const difference_layer_key = generateKey()
  get_newgeojson(differenceLayer, difference_layer_key)
  createLayer(selected_layer_name1+' - '+selected_layer_name2, difference_layer_key, differenceLayer)

}

// Gets geojson file and rule set on which to run extract on.
export function callExtract(new_name, geojson_file_key, rule_set) {
  // gets the data for the geojson file stored in memory.
  var layer_position = find_called_geojson(geojson_file_key)
  var selected_layer_geojson = collect_called_geojson(layer_position)

  var features = []
  // building a custom logical operator checker, since our operator is a variable.
  var operators = {
    '==': function(a, b) { return a == b },
    '!=': function(a, b) { return a != b },
    '<': function(a, b) { return a > b },
    '>': function(a, b) { return a < b },
    '<=': function(a, b) { return a >= b },
    '>=': function(a, b) { return a <= b },
  };

  // for each layer, checking the first rule initially.
  for (var j = 0; j < selected_layer_geojson.features.length; j++ ){
    // for each feature in geojson layer
    for (var property in selected_layer_geojson.features[j].properties){
      // if the property is same as defined in rule:
      if(property == rule_set[0][0]) {
        // if property has a value we collect it, otherwise the rule is invalid
        if(selected_layer_geojson.features[j].properties.hasOwnProperty(property)) {
          var value = selected_layer_geojson.features[j].properties[property]
          var properties = selected_layer_geojson.features[j].properties
          var coordinates = selected_layer_geojson.features[j].geometry.coordinates[0]
          // Running a check to see if value is okay for rule.
          if (operators[rule_set[0][1]](rule_set[0][2],value)) {
            var feature = {"type":"Feature","properties": properties,"geometry":{"type":"Polygon","coordinates": [coordinates] }}
            features.push(feature)
          }
        }
      }
    }
  }

  // If there are more than one rule, we update the feature list by removing those not
  if (rule_set.length > 1) {
    // For each additional rule we need to check the accepted features from the first rule.
    for (var i = 1; i <rule_set.length; i++ ){
      var dummy_array = []
      for (var j = 0; j < features.length; j++ ){
        // for each feature in geojson layer
        for (var property in features[j].properties){
                  // if the property is same as defined in rule:
          if(property == rule_set[i][0]) {
              var value = features[j].properties[property]
              var properties = features[j].properties
              var coordinates = features[j].geometry.coordinates[0]
              // Running a check to see if value is okay for rule.
              if (operators[rule_set[i][1]](rule_set[i][2],value)) {
                var feature = {"type": "Feature", "properties":properties,"geometry":{ "type": "Polygon", "coordinates": [coordinates] }}
                console.log(feature)
                dummy_array.push(feature)
              }
            }
          }
        }
        features = dummy_array;
      }
    }

    var new_geojson = {"type":"FeatureCollection","features": features };
    var dissolveLayer = new_geojson.features[0]

    for (var i = 1; i < new_geojson.features.length; i++) {
      dissolveLayer = turf.union(dissolveLayer, new_geojson.features[i])
    }

    // Cleans the returned dissolve data.
    if (dissolveLayer.geometry.type == 'MultiPolygon') {
      var multipolygon = {"type":"FeatureCollection","features": [dissolveLayer]};
      final_dissolve = geojsonMultiPolygonToPolygon(multipolygon)
    } else {
      var final_dissolve = {"type":"FeatureCollection","features": [dissolveLayer]};
    }



    console.log(final_dissolve)
    const extract_key = generateKey()
    //get_newgeojson(final_dissolve, extract_key)
    createLayer(new_name, extract_key, final_dissolve)
}

// Getting the properties for selected GeoJSON file.
export function getProperties(geojson_file_key) {
  // gets the data for the geojson file stored in memory.
  var layer_position = find_called_geojson(geojson_file_key)
  var selected_layer_geojson = collect_called_geojson(layer_position)
  var selected_layer_name = this.state.layer_list[layer_position][0]

  var properties = []
  var valuearray = []
  // Getting all unique properties and their values.
  for (var i = 0; i < selected_layer_geojson.features.length; i++ ){
    for (var property in selected_layer_geojson.features[i].properties){
      if(selected_layer_geojson.features[i].properties.hasOwnProperty(property)) {
       var value = selected_layer_geojson.features[i].properties[property]
      }
      if(properties.indexOf(property) === -1) {
        properties.push(property)
        valuearray.push([value])
      } else {
        if(valuearray[properties.indexOf(property)].indexOf(value) === -1){
          valuearray[properties.indexOf(property)].push(value)
        }
      }
    }
  }
  // Combining the arrays, so we get data sorted in a neat matter.
  var property_data = []
  for (var i = 0; i < properties.length; i++ ){
    property_data.push([properties[i], valuearray[i]])
  }

  getPropertiesList(property_data, selected_layer_name, geojson_file_key)
}

// Converts a geojson consisting with mulitple polygons into a geojson file with MultiPolygon geometry for difference function.
export function geojsonPolygonToMultiPolygon(geojson) {
  var geojson_features = geojson.features

  var coordinates = []

  for (var i = 0; i < geojson_features.length; i++) {
      if(geojson_features[i].geometry.type == 'Polygon') {
        coordinates.push(geojson_features[i].geometry.coordinates)
      } else if(geojson_features[i].geometry.type == 'LineString') {
        var feature = turf.buffer(geojson_features[i].geometry, 0.5)
        coordinates.push(feature.geometry.coordinates)
      } else if (geojson_features[i].geometry.type == 'MultiPolygon'){
        coordinates.push(geojson_features[i].geometry.coordinates)
      } else if(geojson_features[i].geometry.type == 'Point') {
        var feature = turf.buffer(geojson_features[i].geometry, 0.5)
        coordinates.push(feature.geometry.coordinates)
      }
  }
  var new_geojson = {"type":"FeatureCollection","features":[{"type": "Feature", "properties": {},  "geometry": { "type": "MultiPolygon", "coordinates": coordinates }}]};
  return new_geojson
}

/* Converts a geojson consisting of MultiPolygon to  a geojson file separate Polygons.
Note: This function exists to revert geojson files back to single polygons, in order to:
a) Keep the data consistent. b) Single polygons are required for some functions (e.g Dissolve) */
export function geojsonMultiPolygonToPolygon(geojson) {
  var geojson_features = geojson.features

  var new_features = []
  for (var i = 0; i < geojson_features.length; i++) {
    if(geojson_features[i].geometry.type == 'Polygon') {
      new_features.push(geojson_features[i])
    } else if(geojson_features[i].geometry.type == 'MultiPolygon') {
      for (var j = 0; j < geojson_features[i].geometry.coordinates.length; j++) {
        var feature = {"type": "Feature", "properties": {},  "geometry": { "type": "Polygon", "coordinates": geojson_features[i].geometry.coordinates[j] }}
        new_features.push(feature)
      }
    }
  }
  var new_geojson = {"type":"FeatureCollection","features": new_features };
  console.log(new_geojson)
  return new_geojson

}

export function deleteLayerCall(geojson_file_key) {
  var layer_position = find_called_geojson(geojson_file_key)
  var selected_layer_geojson = this.state.layer_list[layer_position][2]
  // Removes the layer for the selected geojson file in sidebar and in the selection part of the Tools.
  $( "#"+geojson_file_key+"" ).remove();
  $( "#layer_"+geojson_file_key+"" ).remove();

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
  return geojson_file


}

// Generate new layer layer key
function generateKey() {
  return Math.random().toString(36).substr(2, 9);
}

// Fetches GeoJSON properties from Layer and passes them on to MainMap.
export function new_geojsonToParent(new_geojson, newest_file_key) {
  get_newgeojson(new_geojson, newest_file_key)
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
    callIntersect = callIntersect.bind(this)
    callDifference = callDifference.bind(this)
    getProperties = getProperties.bind(this)
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
              <a href="http://www.anstra.no/" target="_blank" id="title">StrandGIS</a>
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
                  <li className="intersect">
                      Intersect
                  </li>
                  <li hidden className="intersect_content"><Intersect/></li>
                  <li className="difference">
                      Difference
                  </li>
                  <li hidden className="difference_content"><Difference/></li>
                  <li className="extract">
                      Extract Feature
                  </li>
                  <li hidden className="extract_content"><Extract_Feature/></li>
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

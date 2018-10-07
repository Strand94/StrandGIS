import React, { Component } from 'react';
import "./Buffer.css"
import map from '../../Map/MainMap'
import L from 'leaflet'

var buffer = require('@turf/buffer')
var turf = require('@turf/turf')

class Buffer extends Component{
    render(){
        return(
        <div>
           <div id="tool_title">Distance:</div>
           <input id="buffer_number" type="number" placeholder="Buffer in meters"></input>
           <br></br>
           <button id="apply_buffer">Apply</button>
        </div>
        )       
    }
}

export function setBuffer(geojson, meters){
    console.log(meters+"m buffer on layer: "+geojson)
    var point = turf.point([-90.548630, 14.616599]);
    var buffered = turf.buffer(point, 500, {units: 'miles'});
}

export default Buffer;


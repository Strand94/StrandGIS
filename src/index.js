import React from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';
import Sortable from 'sortablejs';
import registerServiceWorker from './registerServiceWorker';
import {reorderLayers} from './Map/MainMap'
import $ from "jquery";
import {setBuffer} from './sidebar/tools/Buffer'


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Gets the class name for the layer list.
var layer_list = document.getElementById("sortable_layers");

// Makes the sidebar layer list selectable.
var layer = layer_list.getElementsByClassName("layer");
for (var i = 0; i < layer.length; i++) {
    layer[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
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

$( '.buffer' ).click(function() {
    $('.buffer_content').toggle();
});

$( '.dissolve' ).click(function() {
    $('.dissolve_content').toggle();
});

$( '.intersection' ).click(function() {
   console.log(getLayers())
});

$( '#apply_buffer' ).click(function() {
    var selected_layer = document.getElementsByClassName("layer active");
    var meters = document.getElementById('buffer_number');
    setBuffer(selected_layer[0].innerHTML, meters.value)
});

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

import React from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';
import Sortable from 'sortablejs';
import registerServiceWorker from './registerServiceWorker';
import {reorderLayers} from './Map/MainMap'

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
        // Collects the ID names for the layers
        var i;
        var list_order = [];
        var a = document.getElementsByClassName("layer")
        for (i=0; i < a.length; i++){
            var class_name = ((a[i].className).split(" "))
            list_order.push(class_name[0])
        }
        // Reorders the layers based on ID name ordering.
        reorderLayers(list_order)
        
    }
})


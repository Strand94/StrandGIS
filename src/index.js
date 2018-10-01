import React from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';
import Sortable from 'sortablejs';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Makes the sidebar layer list selectable.
var layer_list = document.getElementById("sortable_layers");
var layer = layer_list.getElementsByClassName("layer");
for (var i = 0; i < layer.length; i++) {
    layer[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

// Makes the sidebar layer list sortable
Sortable.create(layer_list)

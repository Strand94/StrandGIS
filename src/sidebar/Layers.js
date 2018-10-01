import React, { Component } from 'react';
import './Layers.css';
import Sortable from 'sortablejs';

class Layers extends Component{
    render(){
        return(
        <div id="layers">
            <p id="subtitle">Layers</p>
            <div>
                <ul id="sortable_layers" class="ui-sortable">
                    <li class="layer active">Trondheim</li>
                    <li class="layer">Trondheim 2</li>
                    <li class="layer">Line</li>
                </ul>
            </div>
        </div>
        )       
    }
}

export default Layers;
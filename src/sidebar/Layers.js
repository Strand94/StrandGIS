import React, { Component } from 'react';
import './Layers.css';

class Layers extends Component{
    render(){
        return(
        <div id="layers">
            <p id="subtitle">Layers</p>
            <div>
                <ul id="sortable_layers" className="ui-sortable">
                    <li className="layer active">Trondheim</li>
                    <li className="layer">Trondheim 2</li>
                    <li className="layer">Line</li>
                </ul>
            </div>
        </div>
        )       
    }
}

export default Layers;
import React, { Component } from 'react';
import './Layers.css';

class Layers extends Component{
    render(){
        return(
        <div id="layers">
            <p id="subtitle">Layers</p>
            <p id='sub_info'>Click to select, drag to reorder.</p>
            <div>
                <ul id="sortable_layers" className="ui-sortable">
                    <li className="T1 layer active">Trondheim</li>
                    <li className="T2 layer">Trondheim 2</li>
                    <li className="Line layer">Line</li>
                </ul>
            </div>
        </div>
        )       
    }
}

export default Layers;
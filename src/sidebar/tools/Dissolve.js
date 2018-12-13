import React, { Component } from 'react';
import "./Dissolve.css"
import { callDissolve } from '../Sidebar.js'
import $ from "jquery";


class Dissolve extends Component{
    render(){
        return(
        <div>
           <button onClick={(param) => this.executeDissolve(param)}>Apply</button>
        </div>
        )
    }

    // Sends call to Sidebar to run Buffer code.
    executeDissolve(){
      var layer_key= ($('li.active').attr('id'));
      callDissolve(layer_key)
    }
}

export default Dissolve;

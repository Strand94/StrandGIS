import React, { Component } from 'react';
import "./Union.css"
import { callUnion } from '../Sidebar.js'
import $ from "jquery";


class Union extends Component{
    render(){
        return(
        <div>
           <button onClick={(param) => this.executeUnion(param)}>Apply</button>
        </div>
        )
    }

    // Sends call to Sidebar to run Buffer code.
    executeDissolve(){
      console.log("I GOT A UNION")
    }
}

export default Union;

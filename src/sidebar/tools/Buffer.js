import React, { Component } from 'react';
import "./Buffer.css"

class Buffer extends Component{
    render(){
        return(
        <div>
           Distance:<br></br>
           <input type="number" placeholder="Buffer in meters"></input>
           <br></br>
           <button>apply</button>
        </div>
        )       
    }
}

export default Buffer;
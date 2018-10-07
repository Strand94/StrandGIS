import React, { Component } from 'react';
import Layers from "./Layers";
import "./Sidebar.css";
import Buffer from './tools/Buffer';
import Dissolve from './tools/Dissolve';

class Sidebar extends Component {
    render() {
        return ([
            <div id="sidebar_content">
                <div id="sidebar_title_div">
                    <h1 id="title">App name</h1>
                </div>
                <div id="tools">
                    <p id="subtitle">Tools</p>
                    <ul id="tool_layer">
                        <li className="buffer">
                            Buffer
                        </li>
                        <li hidden className="buffer_content"><Buffer/></li>
                        <li className="dissolve">
                            Dissolve
                        </li>
                        <li hidden className="dissolve_content"><Dissolve/></li>
                        <li className="union">
                            Union
                        </li>
                        <li hidden className="union_content"></li>
                        <li className="intersection">
                            Intersection
                        </li>
                        <li hidden className="intersection_content"></li>
                        <li className="diffrence">
                            Diffrence
                        </li>
                        <li hidden className="diffrence_content"></li>
                        <li className="extract">
                            Extract Feature
                        </li>
                        <li hidden className="extract_content"></li>
                    </ul>
                </div>
                <div id='Layers'>
                    <Layers/>
                </div>
            </div>   
        ])
      }
}

export default Sidebar;
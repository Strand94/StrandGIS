import React from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import $ from "jquery";


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();



$( '.buffer' ).click(function() {
    $('.buffer_content').toggle();
});

$( '.dissolve' ).click(function() {
    $('.dissolve_content').toggle();
});

$( '.intersection' ).click(function() {
   console.log("Intersect")
});

$( '.union' ).click(function() {
  $('.union_content').toggle();
});

$( '.intersect' ).click(function() {
  $('.intersect_content').toggle();
});

$( '.difference' ).click(function() {
  $('.difference_content').toggle();
});

$( '.extract' ).click(function() {
  $('.extract_content').toggle();
});

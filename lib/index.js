require('babel-polyfill');

// main.js
const React = require('react');
const ReactDOM = require('react-dom');
const app = document.querySelector('#app');

const LandingPage = require('./ui/LandingPage');
const Background = require('./ui/Background');

start();

function start () {
  ReactDOM.render(
    <div>
      <LandingPage />
    </div>,
    app
  );
}
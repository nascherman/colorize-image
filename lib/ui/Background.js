const React = require('react');
const ReactDOM = require('react-dom');
const loadImg = require('load-img');
const gsap = require('gsap');

const Background = React.createClass({

  propTypes: {
  },

  getDefaultProps () {
    return {
    };
  },

  getInitialState () {
    return {
    };
  },

  componentDidMount () {
    // const el = ReactDOM.findDOMNode(this.refs.background);
    // gsap.set(el, { opacity: 0 });
  },

  render () {
    return (
      <div ref='background' className='background'></div>
    );
  }
});

module.exports = Background;

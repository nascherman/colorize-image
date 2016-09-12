const React = require('react');
const ReactDOM = require('react-dom');

const noop = () => {};
const gsap = require('gsap');

const STAGGER = 0.05;
const STAGGER_OUT = 0.25;

const ImageComp = React.createClass({

  propTypes: {
    suggestions: React.PropTypes.array
  },

  getDefaultProps () {
    return {
      imageData: ''
    };
  },

  getInitialState () {
    return {
    };
  },

  componentDidMount () {
    
  },
  componentWillUnmount () {
    
  },

  componentWillUpdate(nextProps, nextState) {
    
  },

  animateOut (cb) {
    
  },

  render () {
    const { imageData } = this.props;
    return (
      <div ref='image-container' className='image-container'>
        { 
          imageData.length > 0 ?
          <img 
            src={imageData}
          />
          :
          <div 
            className='empty-image'
          />
        }
      </div>
    );
  }
});

module.exports = ImageComp;

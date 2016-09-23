const React = require('react');
const ReactDOM = require('react-dom');
const Lightbox = require('react-image-lightbox');

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
      isOpen: false
    };
  },

  closeLightbox () {
    this.setState({ isOpen: false });
  },

  openLightbox(imageData) {
    if(imageData.length > 0 ) {
      this.setState({ isOpen: true });
    }
  },

  componentWillUpdate(nextProps, nextState) {
    
  },

  animateIn (cb) {

  },

  animateOut (cb) {
    
  },

  render () {
    const { imageData, extension } = this.props;

    if(extension.split('/')[0] === 'video') {
      return (
        <div ref='image-container' className='image-container'>
          { 
            imageData.length > 0 ?
            <video 
              className='image'
              src={imageData}
              autoPlay
              loop
              muted
            />
            :
            <img
              className='image'
              src={'/assets/images/empty-image.png'}
            />
          }
        </div>
      )
    }
    else {
      let lightbox = '';
      if (this.state.isOpen) {
        lightbox = (
          <Lightbox
            mainSrc={imageData}
            onCloseRequest={this.closeLightbox}
          />  
        );
      }
      return (
        <div ref='image-container' className='image-container'>
            <img 
              className='image'
              src={imageData.length > 0 ? imageData : '/assets/images/empty-image.png'}
              onClick={() => this.openLightbox(imageData)}
            />
            {lightbox}
        </div>
      );  
    }
  }
});

module.exports = ImageComp;

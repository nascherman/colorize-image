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
      imageData: {
        type: '',
        path: ''
      }
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

  render () {
    const { imageData, extension,  } = this.props;

    if(extension.split('/')[0] === 'video' || imageData.type === 'video') {
      return (
        <div ref='image-container' className='image-container'>
          { 
            imageData.path.length > 0 ?
            <video 
              className='image'
              src={imageData.path}
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
        <div 
          ref='image-container' 
          className={imageData.path.length > 0 ? 'image-container' : 'image-container empty-image'}
        >
            <img 
              className='image'
              src={imageData.path.length > 0 ? imageData.path : '/assets/images/empty-image.png'}
              onClick={() => this.openLightbox(imageData)}
            />
            {lightbox}
        </div>
      );  
    }
  }
});

module.exports = ImageComp;

const React = require('react');
const ReactDOM = require('react-dom');
const FileInput = require('react-file-input');
const ImageComp = require('./ImageComp');
const Loader = require('./Loader');
const gsap = require('gsap');

const noop = () => {};

const Uploader = React.createClass({

  propTypes: {

  },

  getDefaultProps () {
    return {
      visible: false,
      imageData: {
        type: '',
        path: ''
      },
      uploadedImage: {
        type: '',
        path: ''
      }
    };
  },

  getInitialState () {
    return {
      message: ''
    };
  },

  componentDidMount () {
    if(this.props.visible === true) {
      this.animateIn();
    }
  },

  componentWillUpdate(nextProps, nextState) {
    const overlay = ReactDOM.findDOMNode(this.refs.overlay);
    if(nextProps.visible !== this.props.visible) {
      if(nextProps.visible) {
        this.animateIn();
      }
      else {
        this.animateOut();
      }
    }

    if(nextProps.loading) {
      console.log('overlay');
      gsap.to(overlay, 0.5, { css: { opacity: 1 }});
    }
    else if(!nextProps.loading && overlay !== null){
      console.log('done loading');
      gsap.to(overlay, 0.5, { css: { opacity: 0 }});
    }
  },

  animateOut (cb) {
    console.log('animate out');
    const modal = ReactDOM.findDOMNode(this.refs['uploader-container']);
    gsap.to(modal, 0.5, { css: { top: '200vh' } });
  },

  animateIn (cb) {
    console.log('animate in');
    const modal = ReactDOM.findDOMNode(this.refs['uploader-container']);
    gsap.to(modal, 0.5, { css: { top: '10vh' } });
  },

  render () {
    const { copy, handleChange, imageData, uploadedImage, extension, loading, message } = this.props;
    return (
      <div 
        ref='uploader-container' 
        className='uploader-container'
      > 
        <div className='uploader-title'>{copy.title}</div>
        <div className='uploader-body'>{message.length > 0 ? message : copy.body}</div>
        <FileInput 
          name="imageUpload"
          accept=".png,.gif, .mp4, .mpeg4, .mov, .jpg, .jpeg"
          placeholder="Upload image or video"
          className="input-class"
          onChange={handleChange}
        />
        <div className='images-container'>
          <ImageComp
            itemIndex={1}
            extension={extension}
            imageData={uploadedImage}
          />
          <ImageComp
            itemIndex={2}
            extension={extension}
            imageData={imageData}
          />
        </div>
        <div ref="overlay" className="images-loader" >
          <Loader
            loading={loading}
          />
        </div>
      </div>
    );
  }
});

module.exports = Uploader;

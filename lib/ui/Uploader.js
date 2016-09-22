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
      visible: false
    };
  },

  getInitialState () {
    return {
    };
  },

  componentDidMount () {
    if(this.props.visible === true) {
      this.animateIn();
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if(nextProps.visible !== this.props.visible) {
      if(nextProps.visible) {
        this.animateIn();
      }
      else {
        this.animateOut();
      }
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
    const { copy, handleChange, imageData, uploadedImage, extension, loading } = this.props;
    return (
      <div 
        ref='uploader-container' 
        className='uploader-container'
      > 
        <div className='uploader-title'>{copy.title}</div>
        <div className='uploader-body'>{copy.body}</div>
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
          <div className="images-loader" >
            <Loader
              loading={loading}
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Uploader;

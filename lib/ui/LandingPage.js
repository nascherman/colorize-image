const React = require('react');
const ReactDOM = require('react-dom');
const request = require('../util/request');
const classNames = require('classnames');
const noop = () => {};
const gsap = require('gsap');
const xtend = require('xtend');

const FileInput = require('react-file-input');
const ImageComp = require('./ImageComp');

const STAGGER = 0.05;
const STAGGER_OUT = 0.25;

const LandingPage = React.createClass({

  propTypes: {
    suggestions: React.PropTypes.array
  },

  getDefaultProps () {
    return {
    };
  },

  getInitialState () {
    return {
      imageData: ''
    };
  },

  componentWillUpdate(nextProps, nextState) {
    if(nextState.imageData !== this.state.imageData) {
      //
    }
  },

  animateOut (cb) {
    
  },

  handleChange: function(event) {
    var _this = this;
    var reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        let src = reader.result.toString();
        let type = reader.result.split(':')[1].split(';')[0]
        src = src.split(';')[1];
        src = src.split(',')[1];
        if(type.indexOf('image') !== -1) {
          request.image(src, '.' + type.split('/')[1], (err, resp, body) => {
            let uri_prefix = 'data:' + type + ';base64,'
            _this.setState({
              imageData: uri_prefix + resp.body
            });
          });
        }
        else if(type.indexOf('video') !== -1) {
          request.video(src, '.' + type.split('/')[1], (err, resp, body) => {
            let uri_prefix = 'data:' + type + ';base64,'
            _this.setState({
              videoData: uri_prefix + resp.body
            });
          });   
        }
        
      } catch (e) {
        console.error(e.message);
      }
    });
    let image = event.target.files[0];
    if(image) {
      reader.readAsDataURL(image);
    }
  },

  render () {
    const { imageData } = this.state;
    return (
      <div ref='content' className='landing-content'>
        <FileInput 
          name="imageUpload"
          accept=".png,.gif, .mp4, .mpeg4, .mov"
          placeholder="Upload image or video"
          className="inputClass"
          onChange={this.handleChange}
        />
        <div className='images-container'>
          <ImageComp
            imageData={imageData}
          />
        </div>   
      </div>
    );
  }
});

module.exports = LandingPage;

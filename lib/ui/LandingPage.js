const React = require('react');
const ReactDOM = require('react-dom');
const request = require('../util/request');
const classNames = require('classnames');
const noop = () => {};
const gsap = require('gsap');
const xtend = require('xtend');

const Header = require('./Header');
const Footer = require('./Footer');
const Uploader = require('./Uploader');
const Background = require('./Background');
const Instructions = require('./Instructions');

const copy = require('../config/copy.json');
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
      imageData: '',
      uploadedImage: '',
      extension: '',
      loading: false,
      modalVisible: false,
      message: '' 
    };
  },

  handleChange: function(event) {
    var _this = this;
    var reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        let src = reader.result.toString();
        let type = reader.result.split(':')[1].split(';')[0];
        console.log(type);
        _this.setState({
          uploadedImage: src, 
          extension: type,
          message: 'You\'ve uploaded a ' + type,
        });
        src = src.split(';')[1];
        src = src.split(',')[1];
        if(type.indexOf('image') !== -1) {
          request.image(src, '.' + type.split('/')[1], (err, resp) => {
            if(err) {
              console.log(err.message);
              _this.setState({
                loading: false,
                message: err.message
              });
            }
            else {
              let uri_prefix = 'data:' + type + ';base64,'
              _this.setState({
                imageData: uri_prefix + resp.body,
                loading: false,
                message: resp.message ? resp.message :  'Image colorization successfull'
              });  
            }
          });
        }
        else if(type.indexOf('video') !== -1) {
          request.video(src, '.' + type.split('/')[1], (err, resp) => {
            if(err) {
              console.log(err.message);
              _this.setState({
                loading: false,
                message: err.message
              });

            }
            else {
              let uri_prefix = 'data:' + type + ';base64,'
              _this.setState({
                imageData: uri_prefix + resp.body,
                loading: false,
                message: resp.message ? resp.message : 'Image colorization successfull'
              });
            }
          });   
        }
        
      } catch (e) {
        this.setState({
          loading: false
        })
        console.error(e.message);
      }
    });
    let image = event.target.files[0];
    if(image) {
      this.setState({loading: true});
      reader.readAsDataURL(image);
    }
  },

  changeModalVisible(modalVisible) {
    console.log('changing modal visibility', modalVisible);
    this.setState({modalVisible})
  },

  handleBodyClick(event) {   
    let targets = [
      'footer-button', 
      'footer-button-copy', 
      'uploader-container',
      'uploader-title',
      'uploader-body',
      'input-class',
      'images-container',
      'image-container',
      'empty-image',
      'image',
      'images-loader'
    ];
    let className = event.target.className;
    console.log(className);
    if(this.state.modalVisible !== false && targets.indexOf(className) === -1) {
      this.changeModalVisible(false);
    }
  },

  render () {
    const { imageData, uploadedImage, extension, loading, message } = this.state;
    return (
      <div 
        ref='content' 
        className='landing-content'
        onClick={(event) => this.handleBodyClick(event)}
      >
        <Background />
        <Header 
          copy={copy.header}
        />
        <Uploader 
          visible={this.state.modalVisible}
          copy={copy.uploader}
          handleChange={this.handleChange}
          extension={extension}
          imageData={imageData}
          uploadedImage={uploadedImage}
          loading={loading}
          message={message}
        />
        <Footer 
          copy={copy.footer}
          start={this.changeModalVisible}
          visible={this.state.modalVisible}
        />
        <Instructions
          copy={copy.instructions}
        />
      </div>
    );
  }
});

module.exports = LandingPage;

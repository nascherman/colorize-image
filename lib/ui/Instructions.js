const React = require('react');
const ReactDOM = require('react-dom');
const ImageComp = require('./ImageComp');

const noop = () => {};

const Instructions = React.createClass({

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


  render () {
    const { copy } = this.props;
    return (
      <div ref='instructions-container' className='instructions-container no-select'>
        <div className='instructions-title'><h1>{copy.title}</h1></div>
        <div className='instructions-body'><p>{copy.body}</p></div>
        <div className='instructions-images'>
          {
            copy['images-before'].map((image, i) => {
              return (
                <div key={i} className='instructions-images'>
                  <div className='image-left'>
                    <ImageComp
                      extension=''
                      imageData={copy['images-before'][i]}
                    />
                  </div>
                  <div className='image-right'>
                    <ImageComp
                      extension=''
                      imageData={copy['images-after'][i]}
                    />
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
});

module.exports = Instructions;

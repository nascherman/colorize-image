const React = require('react');
const ReactDOM = require('react-dom');

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

  componentDidMount () {
    
  },
  componentWillUnmount () {
    
  },

  componentWillUpdate(nextProps, nextState) {
    
  },

  animateOut (cb) {
    
  },

  render () {
    const { copy } = this.props;
    return (
      <div ref='instructions-container' className='instructions-container'>
        <div className='instructions-title'><h1>{copy.title}</h1></div>
        <div className='instructions-body'><p>{copy.body}</p></div>
        <div className='instructions-images'>
          {
            copy['images-before'].map((image, i) => {
              <div className='instructions-images'>
                <div className='image-left'>
                  <img 
                    src={copy['images-before'][i]}
                  />
                </div>
                <div className='image-right'>
                  <img 
                    src={copy['images-after'][i]}
                  />
                </div>
              </div>
            })
          }
        </div>
      </div>
    );
  }
});

module.exports = Instructions;

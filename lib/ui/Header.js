const React = require('react');
const ReactDOM = require('react-dom');

const noop = () => {};

const Header = React.createClass({

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
      <div ref='header-container' className='header-container'>
        <div className='header-title'><h1>{copy.title}</h1></div>
        <div className='header-body'><p>{copy.body}</p></div>
      </div>
    );
  }
});

module.exports = Header;

const React = require('react');
const ReactDOM = require('react-dom');

const noop = () => {};

const Footer = React.createClass({
  render () {
    const { copy, start, visible } = this.props;
    return (
      <div ref='footer-container' className='footer-container'>
        <div 
          className='footer-button'
          onClick={() => start(!visible)}
        >
          <h1 className='footer-button-copy'>{copy.button}</h1>
        </div>
      </div>
    );
  }
});

module.exports = Footer;

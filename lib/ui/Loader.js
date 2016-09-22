const React = require('react');
const Halogen = require('halogen/RingLoader');

const Loader = React.createClass({
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
    const { loading } = this.props;
    if(loading) {
      return (
        <div>
          <Halogen color="#999999" size="75px" margin="1px" />
          <p ref="text" className="loader-text" >{'Loading please wait. this will take a long time for video'}</p>
        </div>
      );  
    }
    else {
      return (
        <div></div>
      );
    }
  }
})

module.exports = Loader;
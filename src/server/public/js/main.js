// require("../assets/css/normalize.css");
// require("../assets/vendor/bootstrap-3.3.5-dist/css/bootstrap.min.css");
// require("../assets/css/main.css");
// require("../assets/css/tt.css");
// require("./vendor/modernizr-2.8.3.min.js");
// require("./vendor/jquery-2.1.1.min.js");
require("../assets/vendor/bootstrap-3.3.5-dist/js/bootstrap.min.js");
require("../assets/vendor/react.js");

var PrizeList = React.createClass({
  getInitialState: function() {
    return {prizes: []};
  },
  
  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, 2000);
  },
  
  loadFromServer: function() {
    var self = this;
    $.ajax({
      url: '/api/v1/prizes',
      dataType: 'json',
      cache: false,
      success: function(data) {
        self.setState({prizes: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/v1/prizes', status, err.toString());
      }.bind(this)
    });
  },
  
  render: function() {
    var prizes = [];
    this.state.prizes.forEach(function(prize) {
      prizes.push(React.createElement(Prize, {prize: prize, key: prize._id}));
    });
      
    return (React.createElement("div", {className: "prize-container"}, prizes));
  }
});

var Prize = React.createClass({
  getInitialState: function() {
    return this.props.prize;
  },
  
  clickButt: function() {
    console.log('this.state: ', this.state);
    $.ajax({
      url: '/api/v1/prize/dec/' + this.state._id,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data);
        // do nothing?
        // this.setState({prizes: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/v1/prize/dec/' + this.state._id, status, err.toString());
      }.bind(this)
    });
    
  },
  
  render: function() {
    var prize = this.state;
    var imgUrl = prize.imageUrl;
    var numAvail = prize.numAvailable - prize.numClaimed
    var avail = numAvail > 0 ? true : false;
    var soldOutImage = avail ? React.createElement("span", null) : React.createElement("img", {src: "http://tonguetied.rocks.s3.amazonaws.com/images/prizes/sold-out-stamp.png", className: "img-responsive sold-out", alt: "Responsive image"});
    var buttonClass = avail ? ' btn-primary ' : ' disabled ';
    var labelClasses = avail ? 'label label-primary' : 'label label-default';
    var claimText = avail ? "CLAIM ME!" : "sorry, all claimed.";
    var decButton = window.location.search.match(/blah/) ? React.createElement("button", {className: 'btn btn-danger', onClick: this.clickButt}, "subtract 1") : "";
    
    return (
      React.createElement("div", {className: "panel panel-default prize"}, 
        React.createElement("div", {className: "panel-body"}, 
          soldOutImage, 
          React.createElement("img", {src: imgUrl, className: "center-block img-responsive", alt: "Responsive image"}), 
          React.createElement("p", {className: "lead"}, prize.name, " ", React.createElement("span", {className: labelClasses}, "Available ", numAvail, " ")),
          decButton
        )
      )
    )
  }
})


React.render(
  // React.createElement(PrizeList, {prizes: prizes}),
  React.createElement(PrizeList, {}),
//  <PrizeList url='/api/v1/phones' />,
  document.getElementById('content')
);



/*
var classString = "claim-btn btn btn-block btn-lg " + buttonClass;
<button type="button" className={classString}>{claimText}<span className="badge">{numAvail} available</span></button>
*/


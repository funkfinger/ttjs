// require("../assets/css/normalize.css");
// require("../assets/vendor/bootstrap-3.3.5-dist/css/bootstrap.min.css");
// require("../assets/css/main.css");
// require("../assets/css/tt.css");
// require("./vendor/modernizr-2.8.3.min.js");
// require("./vendor/jquery-2.1.1.min.js");
require("../assets/vendor/bootstrap-3.3.5-dist/js/bootstrap.min.js");
require("../assets/vendor/react.js");

var PrizeBox = React.createClass({
  loadFromServer: function() {
    var self = this;
    $.ajax({
      url: '/api/v1/prizes',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/v1/prizes', status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, 3000);
  },
  render: function() {
    return React.createElement("div", {className: "prize-box"}, React.createElement(PrizeList, {data: this.state.data}))
  }
});

var PrizeList = React.createClass({
  render: function() {
    var prizes = this.props.data.map(function(prize) {
      return React.createElement(Prize, {prize: prize, key: prize._id});
    });
    // this.state.prizes.forEach(function(prize) {
    //   this.prizes.push(React.createElement(Prize, {prize: prize, key: prize._id}));
    // }.bind(this));
    return (React.createElement("div", {className: "prize-container"}, prizes));
  }
});

var Prize = React.createClass({
  getInitialState: function() {
    return this.props.prize;
  },
  clickButt: function() {
    $.ajax({
      url: '/api/v1/prize/dec/' + this.props.prize._id,
      dataType: 'json',
      cache: false,
      success: function(data) {
        // do nothing?
        // this.setState({prize: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/v1/prize/dec/' + this.props.prize._id, status, err.toString());
      }.bind(this)
    });
  },
  
  render: function() {
    console.log('this.props: ', this.props);
    var prize = this.props.prize;
    console.log('prize: ', prize)
    var avail = this.props.prize.numRemaining > 0 ? true : false;
    var soldOutImage = avail ? React.createElement("span", null) : React.createElement("img", {src: "http://tonguetied.rocks.s3.amazonaws.com/images/prizes/sold-out-stamp.png", className: "img-responsive sold-out", alt: "Responsive image"});
    var buttonClass = avail ? ' btn-primary ' : ' disabled ';
    var labelClasses = avail ? 'label label-primary' : 'label label-default';
    var claimText = avail ? "CLAIM ME!" : "sorry, all claimed.";
    var decButton = window.location.search.match(/blah/) ? React.createElement("button", {className: 'btn btn-danger', onClick: this.clickButt}, "subtract 1") : "";
    
    return (
      React.createElement("div", {className: "panel panel-default prize"}, 
        React.createElement("div", {className: "panel-body"}, 
          soldOutImage, 
          React.createElement("img", {src: this.props.prize.imageUrl, className: "center-block img-responsive", alt: "Responsive image"}), 
          React.createElement("p", {className: "lead"}, this.props.prize.name, " ", React.createElement("span", {className: labelClasses}, "Available ", this.props.prize.numRemaining, " ")),
          decButton
        )
      )
    )
  }
})


React.render(
  // React.createElement(PrizeList, {prizes: prizes}),
  React.createElement(PrizeBox, {}),
//  <PrizeList url='/api/v1/phones' />,
  document.getElementById('content')
);



/*
var classString = "claim-btn btn btn-block btn-lg " + buttonClass;
<button type="button" className={classString}>{claimText}<span className="badge">{numAvail} available</span></button>
*/


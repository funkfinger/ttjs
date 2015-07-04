

var PrizeList = React.createClass({
  getInitialState: function() {
    return {prizes: []};
  },
  
  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, 2000);
  },
  
  loadFromServer: function() {
    $.ajax({
      url: '/prizes.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({prizes: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/prizes.json', status, err.toString());
      }.bind(this)
    });
  },
  
  render: function() {
    var prizeNodes = this.state.prizes.map(function (prize) {
      var imgUrl = prize.imageUrl;
      var numAvail = prize.numAvailable - prize.numClaimed
      var avail = numAvail > 0 ? true : false;
      var soldOutImage = avail ? React.createElement("span", null) : React.createElement("img", {src: "http://tonguetied.rocks.s3.amazonaws.com/images/prizes/sold-out-stamp.png", className: "img-responsive sold-out", alt: "Responsive image"});
      var buttonClass = avail ? ' btn-primary ' : ' disabled ';
      var labelClasses = avail ? 'label label-primary' : 'label label-default';
      var claimText = avail ? "CLAIM ME!" : "sorry, all claimed.";
      return (
        React.createElement("div", {className: "prize-container", key: prize.id}, 
          React.createElement("div", {className: "panel panel-default prize"}, 
            React.createElement("div", {className: "panel-body"}, 
              soldOutImage, 
              React.createElement("img", {src: imgUrl, className: "center-block img-responsive", alt: "Responsive image"}), 
              React.createElement("p", {className: "lead"}, prize.name, " ", React.createElement("span", {className: labelClasses}, "Available ", numAvail, " "))
            )
          )
        )
      )
    });
    return (React.createElement("div", {className: "prizes"}, prizeNodes));
  }
});

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


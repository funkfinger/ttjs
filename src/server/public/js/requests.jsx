require("../assets/vendor/bootstrap-3.3.5-dist/js/bootstrap.min.js");
// require("../assets/vendor/modernizr-2.8.3-respond-1.4.2.min.js");
require("react");
var moment = require("moment");

var RequestList = React.createClass({
  loadFromServer: function() {
    var self = this;
    $.ajax({
      url: '/admin/requests.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/admin/requests.json', status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, 2000);
  },
  render: function() {
    return (
      <div className="prize-list list-group">
        <RequestListItems data={this.state.data} /> 
      </div>
    );
  }
});

var RequestListItems = React.createClass({
  render: function() {
    var items = this.props.data.map(function(item, i) {
      return (
        <li className="list-group-item"><strong>{item.body}</strong> - <small>{moment(item.createdAt).calendar()}</small></li>
      );
    });
    return (
      <ul className="list-group">
        {items}
      </ul>
    );
  }
});


ReactDOM.render(
  <RequestList />,
  document.getElementById('content')
);
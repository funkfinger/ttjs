require("../assets/vendor/bootstrap-3.3.5-dist/js/bootstrap.min.js");
// require("../assets/vendor/modernizr-2.8.3-respond-1.4.2.min.js");
require("react");

var KeywordList = React.createClass({
  loadFromServer: function() {
    var self = this;
    $.ajax({
      url: '/admin/keywords.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/admin/keywords.json', status, err.toString());
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
    var items = this.props.data.map(function(item, i) {
      return (
        <option key={i} value={item._id}>{item.keyword}</option>
      );
    });
    return (
      <div className="keyword-list">
        <select className="form-control">
          {items}
        </select>      
      </div>
    );
  }
});

ReactDOM.render(
  <KeywordList />,
  document.getElementById('content')
);

var phones = [
  {number: 18005551212, active: true},
  {number: 18005551213, active: true},
  {number: 18005551214, active: false}
];

var PhoneList = React.createClass({
  render: function() {
    var phoneNodes = this.props.phones.map(function (phone) {
      return (
        <li>phone: {phone.number}</li>
      )
    });
    return (<ul>{phoneNodes}</ul>);
  }
});

React.render(
//  <PhoneList phones={phones} />,
  <PhoneList url='/api/v1/phones' />,
  document.getElementById('content')
);
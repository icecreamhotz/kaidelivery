import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import './button.scss'
import PropTypes from 'prop-types';
import { loginFacebook } from "../../actions/user";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

class Facebook extends Component {
  state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    email: "",
    picture: ""
  };

  responseFacebook = async (response) => {
    const data = {
        email: response.email,
        provider_id: response.id,
        name: response.name,
        image: response.picture.data.url
    }
    
    this.props.loginFacebook(data).then(() => this.props.history.replace('/profile'))
  };

  render() {
    return (
      <div>
        <FacebookLogin
          appId="2500531690173363"
          autoLoad={false}
          fields="name,email,picture.type(large)"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
          cssClass="social-button facebook-connect"
          textButton={<FormattedMessage id="popup.facebookauth" />}
        />
      </div>
    );
  }
}

Facebook.propTypes = {
    loginFacebook: PropTypes.func.isRequired
}

export default connect(null , { loginFacebook })(withRouter(Facebook));

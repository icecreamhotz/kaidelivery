import React, { Component } from 'react'
import 'sweetalert/dist/sweetalert.css';

import { IntlProvider } from 'react-intl'
import { Switch, HashRouter  } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import messages from './locale/messages'

import Welcome from './components/homepage/Welcome'
import Info from './components/user/Info'
import Layout from './components/Layout'
import ForgotPassword from './components/user/ForgotPassword'
import ResetPassword from './components/user/ResetPassword'
import MyRestaurant from './components/managerestaurant/create/CreateRestaurant'

import UserRoute from './components/router/UserRoute'
import GuestRoute from './components/router/GuestRoute'

class App extends Component {
  render() {
    const { location, lang } = this.props
    return (
      <HashRouter>
        <IntlProvider key={lang} locale={lang} messages={messages[lang]}>
          <Layout>
                <Switch>
                    <GuestRoute location={location} path='/' component={Welcome} exact/>
                    <GuestRoute location={location} path='/reset/:token' component={ForgotPassword} exact/>
                    <UserRoute location={location} path='/profile' component={Info} exact/>
                    <UserRoute location={location} path='/reset' component={ResetPassword} exact/>
                    <UserRoute location={location} path='/myrestaurant' component={MyRestaurant} exact/>
                     <UserRoute location={location} path='/myrestaurant/:id' component={MyRestaurant} exact/>
                </Switch>
          </Layout>
        </IntlProvider>
       </HashRouter>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  lang: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    lang: state.locale.lang
  }
}

export default connect(mapStateToProps, null)(App);

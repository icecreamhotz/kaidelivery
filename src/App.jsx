import React, { Component } from 'react'
import 'sweetalert/dist/sweetalert.css';

import { IntlProvider } from 'react-intl'
import { Switch  } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import messages from './locale/messages'

import Welcome from './components/homepage/Welcome'
import Info from './components/user/Info'
import Layout from './components/Layout'
import ForgotPassword from './components/user/ForgotPassword'
import ResetPassword from './components/user/ResetPassword'
import MyRestaurant from './components/managerestaurant/create/CreateRestaurant'
import IndexRestaurant from './components/managerestaurant/IndexRestaurant'

import Restaurant from './components/restaurant/RestaurantDetail'

import UserRoute from './components/router/UserRoute'
import GuestRoute from './components/router/GuestRoute'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Color } from './variable/Color';

const theme = createMuiTheme({
    overrides: {
        MuiFormLabel: {
            focused: {
                "&$focused": {
                    color: Color.kaidelivery
                }
            }
        },
        MuiInput: {
            underline: {
                "&:after": {
                    borderBottomColor: Color.kaidelivery,
                }
            },
        },
        MuiCheckbox: {
            colorSecondary: {
                color: Color.kaidelivery,
                '&$checked': {
                    color: Color.kaidelivery,
                }
            }
        },
        MuiListItem: {
            root: {
                '&$selected, &$selected:hover, &$selected:focus': {
                    backgroundColor: Color.kaideliveryLight
                }
            }
        }
    },
    typography: {
        useNextVariants: true,
    },
})


class App extends Component {
  render() {
    const { location, lang } = this.props
    return (
    <IntlProvider key={lang} locale={lang} messages={messages[lang]}>
        <MuiThemeProvider theme={theme}>
          <Layout>
                <Switch>
                    <GuestRoute exact location={location} path='/' component={Welcome} />
                    <GuestRoute location={location} path='/reset/:token' component={ForgotPassword} />
                    <UserRoute location={location} path='/profile' component={Info} />
                    <UserRoute location={location} path='/reset' component={ResetPassword} />
                    <UserRoute  exact location={location} path='/myrestaurant' component={MyRestaurant} />
                    <UserRoute location={location} path='/myrestaurant/:resname' component={IndexRestaurant} />
                    <GuestRoute location={location} path='/restaurant/:resid' component={Restaurant} />
                </Switch>
          </Layout>
        </MuiThemeProvider>
    </IntlProvider>
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

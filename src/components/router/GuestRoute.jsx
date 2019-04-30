import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom' 
import UnAuthorization from "./UnAuthorization";

const GuestRoute = ({ component: Component, ...rest }) => (
    <Route 
        exact
        {...rest} 
        render={props => <UnAuthorization><Component {...props} /></UnAuthorization>}
    />
)

GuestRoute.propTypes = {
    component: PropTypes.func.isRequired,
}

export default GuestRoute
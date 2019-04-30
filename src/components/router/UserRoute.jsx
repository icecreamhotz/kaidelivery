import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom' 
import Authorization from "./Authorization";

const UserRoute = ({ isAuthenticated, component: Component, ...rest }) => (
    <Route 
        exact
        {...rest} 
        render={props => 
            isAuthenticated ? <Authorization><Component {...props} /></Authorization> : <Redirect to="/" /> }
    />
)

UserRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.user.token
    }
}

export default connect(mapStateToProps)(UserRoute)
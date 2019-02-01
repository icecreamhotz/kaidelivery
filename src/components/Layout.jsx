import React, {Component} from 'react'
import { connect } from 'react-redux'
import HeaderAuth from './header/Header'
import HeaderNAuth from './homepage/Header'
import PropTypes from 'prop-types'

class InfoPage extends Component {
    render() {
        const { isAuthenticated } = this.props
        return (
            <div>
                { 
                    isAuthenticated 
                        ?
                        <HeaderAuth>
                            {this.props.children}
                        </HeaderAuth>
                        :
                    <HeaderNAuth />
                }
                { !isAuthenticated && this.props.children }
            </div>
        )
    }
}

InfoPage.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.user.token
    }
}

export default connect(mapStateToProps, null)(InfoPage)
import React, {Component} from 'react'
import HeaderAuth from '../header/Header'

class Authorization extends Component {
    render() {
        return (
            <div>
                <HeaderAuth>
                    {this.props.children}
                </HeaderAuth>
            </div>
        )
    }
}

export default Authorization
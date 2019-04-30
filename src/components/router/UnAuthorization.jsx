import React, { Component } from 'react';
import Header from '../homepage/Header'

class UnAuthorization extends Component {
    render() {
        return (
            <div>
                <Header />
                {
                    this.props.children
                }
            </div>
        );
    }
}

export default UnAuthorization;
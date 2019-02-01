import React , { Component } from 'react'
import Loading from './loading'

const withLoading = (WrappedComponent) => {
    return class WithLoading extends Component {

        componentWillUnMount() {
            this.props.loading = false
        }
        
        render() {
            if(this.props.loading) return <Loading loaded={this.props.loading}/>
            return <WrappedComponent {...this.props} />
        }
    };
};

export default withLoading
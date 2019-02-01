import React from 'react'
import './loading.scss'

export default class Loading extends React.Component {
    render() {
        return(  
            <div className={"layer-preloader " + (this.props.loaded ? '' : 'hide-loader')}>
                <div className="loading">
                    <div className="loader firstColor">
                    <div className="loader secondColor">
                        <div className="loader thirdColor"></div> 
                    </div> 
                    </div> 
                </div> 
            </div>
        )
    }
}
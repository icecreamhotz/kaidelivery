import React from 'react'
import './loading.scss'

export default class Loading extends React.Component {
    render() {
        return(  
            <div className={"layer-preloader " + (this.props.loaded ? '' : 'hide-loader')}>
                <div class="loading">
                    <div class="loader firstColor">
                    <div class="loader secondColor">
                        <div class="loader thirdColor"></div> 
                    </div> 
                    </div> 
                </div> 
            </div>
        )
    }
}

import React, { Component } from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator';

const withRules = (WrappedComponent) => {
  return class WithRules extends Component {

        async componentDidMount() {

            ValidatorForm.addValidationRule('isUsername', (value) => {
                if(value.length < 8) {
                    return false
                }
                return true
            })
            ValidatorForm.addValidationRule('isPassword', (value) => {
                const regexRule = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")
                if(!regexRule.test(value)) {
                    return false
                }
                return true
            })
            ValidatorForm.addValidationRule('threeCharacters', (value) => {
                if(value.length < 3) {
                    return false
                }
                return true
            })
            ValidatorForm.addValidationRule('fourCharacters', (value) => {
                if(value.length < 4) {
                    return false
                }
                return true
            })

        }   

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export default withRules
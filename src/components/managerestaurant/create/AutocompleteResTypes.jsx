/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import ValidatedSelect from '../../validations/ValidatedSelect'
import withLoading from '../../loaders/WithLoading'

class AutocompleteResTypes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            multi: this.props.data
        };
    }

    handleChange = name => value => {
        this.setState({
            [name]: value,
        }, () => console.log(this.state.multi));
        this.props.setResTypesValueFromChild(value)
    };

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props.loading !== nextProps.loading) {
        return true;
      }
      if (this.props.resTypes !== nextProps.resTypes) {
        return true;
      }
      if (this.state.multi !== nextState.multi) {
        return true;
      }
      return false;
    }

    render() {
        const { resTypes } = this.props;
        const getResTypes = resTypes.map(types => ({
                value: types.restype_id,
                label: types.restype_name
            }))
        console.log(this.props.data)
        return (
        <div>
            <ValidatedSelect
                name="res_types"
                options={getResTypes}
                defaultValue={this.props.data}
                value={this.state.multi}
                onChange={this.handleChange('multi')}
                placeholder="Select multiple restaurant types"
                isMulti
                validators={['required']}
                errorMessages={['this field is required']}
            />
        </div>
        );
    }
}

AutocompleteResTypes.propTypes = {
  resTypes: PropTypes.arrayOf(PropTypes.shape({
      restype_id: PropTypes.number.isRequired,
      restype_name: PropTypes.string.isRequired,
  })).isRequired,
  setResTypesValueFromChild: PropTypes.func.isRequired
};

export default withLoading(AutocompleteResTypes);
/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import ValidatedSelect from '../../validations/ValidatedSelect'
import withLoading from '../../loaders/WithLoading'

class AutocompleteResTypes extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            multi: null,
        };
    }

    handleChange = name => value => {
        console.log(value)
        this.setState({
            [name]: value,
        });
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

        return (
        <div>
            <ValidatedSelect
                name="res_types"
                options={getResTypes}
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
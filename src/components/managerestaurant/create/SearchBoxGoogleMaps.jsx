import React from 'react'
import LocationSearching from '@material-ui/icons/LocationSearching';
import { Color } from '../../../variable/Color';
import '../../loaders/loading.scss'

const { compose, withProps } = require("recompose");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

const styles = {
  buttonInside: {
    position: 'relative',
    marginBottom: 10
  },
  getLocation: {
    position: 'absolute',
    background: 'transparent',
    right: 15,
    top: 4,
    border: 'none',
    height: 30,
    width: 30,
    outline: 'none',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 3,
    cursor: 'pointer'
  },
  loadingInside: {
    position: 'absolute',
    left: 15,
    top: 4,
  }
}

export const SearchBoxGoogleMaps = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCkgDceoiSbeWa29pNeJxmsNipUF7P3uw&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`}} />,
  }))(props =>
  <div data-standalone-searchbox="" style={{marginBottom: 20}}>
    <div style={styles.buttonInside}>
      <StandaloneSearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder={props.inputLoading ? '' : 'Search your restaurant.'}
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `100%`,
            height: `42px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
          value={props.searchValue}
          onChange={props.onChangeSearchBox}
        />
      </StandaloneSearchBox>
      <button type="button" style={styles.getLocation} onClick={props.onClickCurrentLocation}><LocationSearching style={{color: Color.kaidelivery}} /></button>
      { props.inputLoading && <span className="inside-input" style={styles.loadingInside}></span> }
    </div>
    {
      (props.latlng ? 'Please turn on navigator location on google chrome settings' : '')
    }
  </div>
);
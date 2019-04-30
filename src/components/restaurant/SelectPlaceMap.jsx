import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapWithAMarker = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={17}
    center={{ lat: props.center.lat, lng: props.center.lng }}
    onClick={props.onMapClick}
    onDragEnd={props.onDragEnd}
    defaultOptions={{
      streetViewControl: false,
      scaleControl: false,
      mapTypeControl: false,
      panControl: false,
      rotateControl: false,
      fullscreenControl: false
    }}
    disableDefaultUI
  >
    <Marker position={{ lat: props.center.lat, lng: props.center.lng }} />
    {props.loading && (
      <div className="loading-google">
        <div className="loading-google-spin" />
      </div>
    )}
  </GoogleMap>
));

class SelectPlaceMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            center: {
                lat: props.lat,
                lng: props.lng
            },
            loadingMap: props.loading
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.lat !== this.state.center.lat || nextProps.lng !== this.state.center.lng) {    
            this.setState(prevState => ({
                center: {
                ...prevState.center,
                lat: parseFloat(nextProps.lat),
                lng: parseFloat(nextProps.lng)
                }
            }))
        }
    }

    onMapMounted = map => {
        this._map = map;
    };

    onMapClick = e => {
        this.setState(
        prevState => ({
            center: {
            ...prevState.center,
            lat: parseFloat(e.latLng.lat()),
            lng: parseFloat(e.latLng.lng())
            }
        }),
        () => {
            this.props.setLatLngFromMaps(this.state.center.lat, this.state.center.lng)
            this.props.setValueToPlaceSearch(this.state.center.lat, this.state.center.lng)
        });
    };

    onDragMap = () => {
        this.setState(
        prevState => ({
            center: {
            ...prevState.center,
            lat: parseFloat(this._map.getCenter().lat()),
            lng: parseFloat(this._map.getCenter().lng())
            }
        }),
        () => {
            this.props.setLatLngFromMaps(this.state.center.lat, this.state.center.lng)
            this.props.setValueToPlaceSearch(this.state.center.lat, this.state.center.lng)
        });
    };

    render() {
        return (
            <div>
                <MapWithAMarker
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                        <div
                        style={{
                            height: `600px`,
                            display: "flex",
                            flexDirection: "column-reverse",
                            position: "relative"
                        }}
                        />
                    }
                    mapElement={<div style={{ height: `100%` }} />}
                    onMapLoad={this.onMapMounted}
                    center={this.state.center}
                    onMapClick={this.onMapClick}
                    onDragEnd={this.onDragMap}
                    loading={this.props.loading}
                />
            </div>
        );
    }
}

export default SelectPlaceMap;
/*global google*/
import React from 'react'
import '../../loaders/loading.scss' 
import scriptLoader from 'react-async-script-loader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles'

const { compose, lifecycle } = require("recompose");
const {
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");

const styles = theme => ({
  textFloat: {
    [theme.breakpoints.up('md')]: {
      float: 'left'
    },
  },
  buttonFloat: {
    [theme.breakpoints.up('md')]: {
      float: 'right'
    },
  }
})

const Maps = compose(
  lifecycle({
    componentWillMount() {
      const refs = {}
      this.setState({
        loading: true,
        location: {
          lat: this.props.lat,
          lng: this.props.lng
        },
        onMapMounted: ref => {
          refs.map = ref;
        },
        onMarkerMounted: ref => {
          refs.marker = ref;
        },
        setValueToPlaceSearch: (lat, lng) => {
          const geocoder = new google.maps.Geocoder();
          const latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
          
          geocoder.geocode({'location': latlng}, (results, status) => {
            if(status === google.maps.GeocoderStatus.OK) {
              if(results[0]) {
                const request = {
                  location: latlng,
                  radius: 10,
                  type : ["restaurant"]
                }
                if(refs.map) {
                  const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                  service.nearbySearch(request, (place, status) => {
                    if(status === google.maps.places.PlacesServiceStatus.OK) {
                      const myRestaurant = `${place[0].name} ${place[0].vicinity}`;
                      this.setState({
                        loading: false
                      }, () => this.props.setPlace(myRestaurant));
                    } else {
                      this.setState({
                        loading: false
                      }, () => this.props.setPlace(results[0].formatted_address));
                    }
                  });
                }
              }
            }
          });
        }
      })
    },
    componentDidMount() {
      this.mounted = true;
      this.state.setValueToPlaceSearch(this.state.location.lat, this.state.location.lng)
    },
    componentWillUnmount() {
      this.mounted = false;
    }
  }),
  withGoogleMap
)(props =>
    <div>
        <div style={{clear: 'both'}}></div>
          <GoogleMap
              ref={props.onMapMounted}
              defaultZoom={17}
              center={new google.maps.LatLng(props.location.lat, props.location.lng)}
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
          <Marker
            position={{ lat: parseFloat(props.location.lat), lng: parseFloat(props.location.lng) }} draggable={true} ref={props.onMarkerMounted}
          />
          </GoogleMap>
          {
            props.loading &&
            <div className="loading-google">
              <div className="loading-google-spin">
              </div>
            </div>
          }
    </div>
);

class GoogleMaps extends React.Component {
    constructor(props) {
      super(props) 
      this.state = {
        place: '', 
        lat: this.props.lat, 
        lng: this.props.lng, 
      }
    }

    setPlace = (value) => {
      this.setState({place: value})
    }

    reCenter = () => {
      this.setState({
          lat: this.props.lat,
          lng: this.props.lng
      })
    }

  render() {
    const {isScriptLoadSucceed, classes} = this.props; 
    return (
      <div>
        {isScriptLoadSucceed && 
          <div>
            <Typography variant="overline" gutterBottom className={classes.textFloat}>
              {this.state.place}
            </Typography>
            <Button variant="contained" size="small" color="primary" style={{backgroundColor: '#ff9100a8'}} className={classes.buttonFloat} onClick={this.reCenter}>
              RE CENTER
            </Button>
          <div style={{clear: 'both'}}></div>
          <Maps 
            loadingElement= {<div style={{ height: `100%` }} />}
            containerElement= {<div style={{ height: `400px`, display: 'flex', flexDirection: 'column-reverse',position: 'relative', marginTop: 15 }} />}
            mapElement={<div style={{ height: `100%`}} />}
            lat={this.state.lat}
            lng={this.state.lng}
            setPlace={this.setPlace}
            classes={classes}
          />
          </div>
        }
      </div>
    );
  }
}

export default scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyDCkgDceoiSbeWa29pNeJxmsNipUF7P3uw&v=3.exp&libraries=geometry,drawing,places')(withStyles(styles, { withTheme: true })(GoogleMaps));

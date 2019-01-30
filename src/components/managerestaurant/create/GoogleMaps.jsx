/*global google*/
import React from 'react'
import { SearchBoxGoogleMaps } from './SearchBoxGoogleMaps'
import '../../loaders/loading.scss'

const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");

export const GoogleMaps = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCkgDceoiSbeWa29pNeJxmsNipUF7P3uw&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, display: 'flex', flexDirection: 'column-reverse',position: 'relative' }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      this.setState({
        inputLoading: false,
        loading: false,
        isSearch: false,
        searchValue: '',
        bounds: null,
        center: {
          lat: 0, lng: 0, errorLatLng: true
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onMarkerMounted: ref => {
          refs.marker = ref;
        },
        onBoundsChanged: _.debounce(
            () => {
                this.setState(prevState => ({

                    bounds: refs.map.getBounds(),
                    center: {
                      ...prevState.center,
                      lat: parseFloat(refs.map.getCenter().lat()),
                      lng: parseFloat(refs.map.getCenter().lng())
                    } 
                }))
                let {
                    onBoundsChange
                } = this.props
                if(onBoundsChange) {
                    onBoundsChange(refs.map)
                }
            },
            100, {
                maxWait: 300
            }
        ),
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();

          for(let i = 0; i < places.length; i++) {
            if(places[i].types.some(item => item === 'restaurant')) {
              const nameRestaurant = `${places[i].name} ${places[i].formatted_address}`
              this.setState(prevState => ({
                center: {
                  ...prevState.center,
                  lat: parseFloat(places[i].geometry.location.lat()),
                  lng: parseFloat(places[i].geometry.location.lng())
                },
                searchValue: nameRestaurant
              }))
              break;
            }
          }
        },
        onMapClick: (e) => {
             this.setState({loading: true}, () => console.log(this.state.loading))
            this.setState(prevState => ({
                center: {
                  ...prevState.center,
                  lat: parseFloat(e.latLng.lat()),
                  lng: parseFloat(e.latLng.lng()),
                } 
            }), () => this.state.setValueToPlaceSearch(this.state.center.lat, this.state.center.lng))
        },
        getGeoLocation: () => {
          if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log(position.coords)
                    this.setState(prevState => ({
                        center: {
                            ...prevState.center,
                            lat: parseFloat(position.coords.latitude),
                            lng: parseFloat(position.coords.longitude),
                            errorLatLng: false
                        }   
                    }), () => {
                      if(this.state.isSearch) { this.state.onClickGetLocation() }
                      else { 
                        this.setState(prevState => ({ isSearch: true })) 
                        setTimeout(() => {
                          this.state.setValueToPlaceSearch(this.state.center.lat, this.state.center.lng)
                        }, 700);
                      }
                    })
                },
                error => console.log(error)
            )
          }
        },
        onClickGetLocation: () => { 
             this.setState({loading: true}, () => console.log(this.state.loading))
            const {lat, lng} = this.state.center;

            const bounds = new google.maps.LatLngBounds();
            const latlng = new google.maps.LatLng(lat + 0.001 , lng + 0.001);
            const latlng2 = new google.maps.LatLng(lat - 0.001 , lng - 0.001);
            bounds.extend(latlng);
            bounds.extend(latlng2);

            refs.map.fitBounds(bounds);
            this.state.setValueToPlaceSearch(lat, lng);
        },
        onDragMap: () => {
          this.setState(prevState => ({
              center: {
                ...prevState.center,
                lat: parseFloat(refs.map.getCenter().lat()),
                lng: parseFloat(refs.map.getCenter().lng())
              },
          }), () => this.state.setValueToPlaceSearch(this.state.center.lat, this.state.center.lng));
        },
        setValueToPlaceSearch: (lat, lng) => {
          if(!this.state.loading || !this.state.inputLoading || this.state.searchValue != '') {
            this.setState({loading: true, inputLoading: true, searchValue: ''})
          }

          const geocoder = new google.maps.Geocoder();
          const latlng = {lat: lat, lng: lng};
          
          geocoder.geocode({'location': latlng}, (results, status) => {
            if(status === google.maps.GeocoderStatus.OK) {
              if(results[1]) {
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
                        searchValue: myRestaurant,
                        loading: false,
                        inputLoading: false,
                      }, () => this.props.setPosition(this.state.center));
                    } else {
                      this.setState({
                        searchValue: results[1].formatted_address,
                        loading: false,
                        inputLoading: false,
                      }, () => this.props.setPosition(this.state.center));
                    }
                  });
                }
              }
            } else {
              this.setState({
                loading: false,
                inputLoading: false,
              }, () => this.props.setPosition(this.state.center));
            }
          });
        },
        onChangeSearchBox: (e) => {
            this.setState({
              searchValue : e.target.value
            })
        },
        shouldComponentUpdate(nextProps, nextState) {
          if (this.state.inputLoading !== nextProps.inputLoading) {
            return true;
          }
          if (this.props.loading !== nextProps.loading) {
            return true;
          }
          if (this.state.isSearch !== nextState.isSearch) {
            return true;
          }
          if (this.state.searchValue !== nextState.searchValue) {
            return true;
          }
          if (this.state.bounds !== nextState.bounds) {
            return true;
          }
          return false;
        }
      })
    },
    componentDidMount() {
      this.state.getGeoLocation()
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
    <div>
        <SearchBoxGoogleMaps 
            onSearchBoxMounted={props.onSearchBoxMounted} 
            bounds={props.bounds} 
            onPlacesChanged={props.onPlacesChanged}
            onClickCurrentLocation={props.getGeoLocation}
            latlng={props.center.errorLatLng}
            searchValue={props.searchValue}
            onChangeSearchBox={props.onChangeSearchBox}
            inputLoading={props.inputLoading}
        />
        <GoogleMap
            ref={props.onMapMounted}
            defaultZoom={17}
            center={props.center}
            onBoundsChanged={props.onBoundsChanged}
            onClick={props.onMapClick}
            onDragEnd={props.onDragMap}
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
              <Marker position={{lat: props.center.lat, lng: props.center.lng}} draggable={true} ref={props.onMarkerMounted}/>
        </GoogleMap>
        {
          props.loading &&
          <div className={"loading-google"}>
            <div class="loading-google-spin">
            </div>
          </div>
        }
    </div>
);

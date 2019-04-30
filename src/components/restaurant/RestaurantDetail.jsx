import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import scriptLoader from "react-async-script-loader";
import { Color } from "../../variable/Color";
import LocationSearching from "@material-ui/icons/LocationSearching";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import API from '../../helper/api.js'
import RestaurantDetailsLeftSide from './RestaurantDetailsLeftSide'
import RestaurantDetailsRightSide from './RestaurantDetailsRightSide'
import Loading from '../loaders/loading'
import SelectPlaceMap from './SelectPlaceMap'

const {
  StandaloneSearchBox
} = require("react-google-maps/lib/components/places/StandaloneSearchBox");

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class RestaurantDetail extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            restaurant: [],
            loading: true,
            lat: 0.0,
            lng: 0.0,
            bounds: null,
            inputLoading: false,
            searchValue: '',
            mOpen: false
        }
    }

    async componentDidMount() {
        await this.loadRestaurantDetails()
        this.loadCurrentLatLng()
    }

    loadCurrentLatLng = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.setState({
                        lat: parseFloat(position.coords.latitude),
                        lng: parseFloat(position.coords.longitude),
                    }, () => {
                        this.setValueToPlaceSearch(this.state.lat, this.state.lng)
                    })
                },
                error => console.log(error)
            );
        }
    }

    loadRestaurantDetails = async () => {
        const resId = this.props.match.params.resid
        const restaurant = await API.get(`restaurants/${resId}`)
        const { data } = await restaurant

        this.setState({
            restaurant: data.data,
            loading: false,
        })
    }

    onSearchBoxMounted = searchBox => {
        this._searchBox = searchBox;
    };

    onPlacesChanged = () => {
        this.setState({ inputLoading: true })
        const places = this._searchBox.getPlaces();

        if (places[0]) {
        const nameRestaurant = `${places[0].name} ${places[0].formatted_address}`;
            this.setState({
                lat: parseFloat(places[0].geometry.location.lat()),
                lng: parseFloat(places[0].geometry.location.lng()),
                searchValue: nameRestaurant,
                inputLoading: false
            });
        }
    };

    onChangeSearchBox = e => {
        this.setState({
            searchValue: e.target.value
        });
    };

    setValueToPlaceSearch = (lat, lng) => {
        this.setState({
            inputLoading: true
        })
        try {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: lat, lng: lng };

        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                const request = {
                location: latlng,
                radius: 10,
                type: ["restaurant"]
                };
                const service = new window.google.maps.places.PlacesService(
                    document.createElement('div')
                );
                service.nearbySearch(request, (place, status) => {
                    if (
                    status === window.google.maps.places.PlacesServiceStatus.OK
                    ) {
                    const myRestaurant = `${place[0].name} ${place[0].vicinity}`;
                    this.setState({
                        searchValue: myRestaurant,
                        inputLoading: false
                    });
                    } else {
                    this.setState({
                        searchValue: results[1].formatted_address,
                        inputLoading: false
                    });
                    }
                });
                }
            }
        });
        } catch (e) {
            console.log(e);
        }
    };

    setLatLngFromMaps = (lat, lng) => {
        this.setState({
            lat: lat,
            lng: lng
        })
    }

    getGeoLocation = () => {
        this.loadCurrentLatLng()
    }

    handleClickOpen = () => {
        this.setState({ mOpen: true });
    };

    handleClose = () => {
        this.setState({ mOpen: false });
    };

    setLoadingTrue = () => {
        this.setState({ loading: true })
    }

    setLoadingFalse = () => {
        this.setState({ loading: false })
    }

    render() {
        const { isScriptLoadSucceed } = this.props;
        return (
            <div className="content-start">
                { (this.state.loading ? <Loading loaded={this.state.loading} /> : '')}
                {
                    isScriptLoadSucceed && (
                            <Grid container spacing={24}>
                                <Grid item xs={10}>
                                    <div data-standalone-searchbox="" style={{width: "100%"}}>
                                        <div
                                        style={{
                                            position: "relative",
                                            marginBottom: 10,
                                            width: "100%"
                                        }}
                                        >
                                        <StandaloneSearchBox
                                            ref={this.onSearchBoxMounted}
                                            bounds={this.bounds}
                                            onPlacesChanged={this.onPlacesChanged}
                                        >
                                            <input
                                            type="text"
                                            placeholder={
                                                this.state.inputLoading
                                                ? ""
                                                : "Search your restaurant."
                                            }
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
                                                textOverflow: `ellipses`
                                            }}
                                            value={this.state.searchValue}
                                            onChange={this.onChangeSearchBox}
                                            />
                                        </StandaloneSearchBox>
                                        <button
                                            type="button"
                                            style={{
                                            position: "absolute",
                                            background: "transparent",
                                            right: 15,
                                            top: 4,
                                            border: "none",
                                            height: 30,
                                            width: 30,
                                            outline: "none",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            padding: 3,
                                            cursor: "pointer"
                                            }}
                                            onClick={this.getGeoLocation}
                                        >
                                            <LocationSearching
                                                style={{ color: Color.kaidelivery }}
                                            />
                                        </button>
                                        {this.state.inputLoading && (
                                            <span
                                            className="inside-input"
                                            style={{
                                                position: "absolute",
                                                left: 15,
                                                top: 4
                                            }}
                                            />
                                        )}
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="outlined" color="primary" onClick={this.handleClickOpen} style={{
                                        fontSize: 12,
                                        margin: "auto 0"
                                    }}>
                                        Choose Myself Location
                                    </Button>
                                </Grid>
                        </Grid>
                    )
                }
                <Dialog
                    fullScreen
                    open={this.state.mOpen}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                <AppBar style={{position: 'relative'}}>
                    <Toolbar>
                    <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" style={{flex: 1}}>
                        Choose a place...
                    </Typography>
                    <Button color="secondary" onClick={this.loadCurrentLatLng}>
                        current place
                    </Button>
                    <Button color="inherit" onClick={this.handleClose}>
                        save
                    </Button>
                    </Toolbar>
                </AppBar>
                    <SelectPlaceMap 
                        lat={this.state.lat}
                        lng={this.state.lng}
                        setValueToPlaceSearch={this.setValueToPlaceSearch}
                        loading={this.state.inputLoading}
                        setLatLngFromMaps={this.setLatLngFromMaps}
                    />
                </Dialog>
                <Grid container spacing={24}>
                    <Grid item container xs={4}>
                        {
                            this.state.restaurant.length !== 0 && this.state.lat !== 0.0 && this.state.lng !== 0.0 ?
                            <RestaurantDetailsLeftSide 
                                restaurant={this.state.restaurant}
                                lat={this.state.lat}
                                lng={this.state.lng}
                                searchValue={this.state.searchValue}
                                setLoadingTrue={this.setLoadingTrue}
                                setLoadingFalse={this.setLoadingFalse}
                            />
                            :
                            ""
                        }
                    </Grid>
                    <Grid item container xs={8}>
                        {
                            this.state.restaurant.length !== 0 && this.state.lat !== 0.0 && this.state.lng !== 0.0 ?
                            <RestaurantDetailsRightSide 
                                restaurant={this.state.restaurant} 
                            />
                            :
                            ""
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default scriptLoader(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB1wuvlSdpv395HjKYb1afXx_4S1c8ak4c&v=3.exp&libraries=geometry,drawing,places"
)(RestaurantDetail);
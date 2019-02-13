import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircle from '@material-ui/icons/CheckCircle';
import GoogleMaps from './GoogleMaps'
import moment from 'moment';
import 'moment/locale/th';

import API from '../../../helper/api'

import ContentLoader from "react-content-loader"

moment.locale('th')

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    logo: {
        width: 150,
        height: 150,
        margin: '0 auto'
    },
    chip: {
        margin: theme.spacing.unit,
    },
    content: {
        padding: '15px 0 0 40px'
    },
    contentInner: {
        padding: '0 40px'
    }
})

const MyLoader = props => (
  <ContentLoader 
    rtl
    height={400}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <circle cx="200" cy="60" r="30" /> 
    <rect x="140" y="100" rx="3" ry="3" width="120" height="4" /> 
    <rect x="170" y="110" rx="0" ry="0" width="60" height="4" />
    <rect x="10" y="135" rx="0" ry="0" width="100" height="4" /> 
    <rect x="10" y="145" rx="0" ry="0" width="380" height="4" /> 
    <rect x="10" y="155" rx="0" ry="0" width="200" height="4" /> 
    <rect x="10" y="165" rx="0" ry="0" width="280" height="4" /> 
    <rect x="10" y="175" rx="0" ry="0" width="330" height="4" /> 
    <rect x="10" y="205" rx="0" ry="0" width="100" height="4" /> 
    <rect x="10" y="215" rx="0" ry="0" width="380" height="4" /> 
    <rect x="10" y="225" rx="0" ry="0" width="200" height="4" /> 
    <rect x="10" y="235" rx="0" ry="0" width="280" height="4" /> 
    <rect x="10" y="245" rx="0" ry="0" width="330" height="4" /> 
    <rect x="10" y="275" rx="0" ry="0" width="100" height="4" /> 
    <rect x="10" y="285" rx="0" ry="0" width="380" height="4" /> 
    <rect x="10" y="295" rx="0" ry="0" width="200" height="4" /> 
    <rect x="10" y="305" rx="0" ry="0" width="280" height="4" /> 
    <rect x="10" y="315" rx="0" ry="0" width="330" height="4" /> 
    <rect x="10" y="345" rx="0" ry="0" width="100" height="4" /> 
    <rect x="10" y="355" rx="0" ry="0" width="380" height="4" /> 
    <rect x="10" y="365" rx="0" ry="0" width="200" height="4" /> 
    <rect x="10" y="375" rx="0" ry="0" width="280" height="4" /> 
    <rect x="10" y="385" rx="0" ry="0" width="330" height="4" /> 
  </ContentLoader>
)

class InfoRestaurant extends Component {

    constructor(props) {
        super(props)

        this.state = {
            restaurant: [],
            resType: [],
            loading: true,
            res_tel: '',
            contact_tel: '',
            holiday: []
        }
    }

    async componentDidMount() {
        await this.fetchRestaurantData(this.props.match.params.resname)
    }

    componentWillReceiveProps(newProps) {
        if(this.props.match.params.resname !== newProps.match.params.resname) {
            this.fetchRestaurantData(newProps.match.params.resname)
        }
    }

    fetchRestaurantData = async (resname) => {
        this.setState({
            loading: true
        })
        const res_id = this.props.res_id
        const restaurant = await API.get(`restaurants/${res_id}`)
        const { data } = await restaurant

        alert(data.data)
        
        if(data.data.length === 0) {
            this.props.history.push('/myrestaurant')
        } else {
            let resTypeAll = []

            if(data.data.restype_id.length > 0) {
                resTypeAll = await Promise.all(data.data.restype_id.map(async item => { 
                    const value = await this.fetchRestaurantTypes(item)
                    return {    
                        restype_id: value.restype_id,
                        restype_name: value.restype_name
                    }
                }))
            }

            this.setState({
                restaurant: data.data,
                resType: resTypeAll,
                loading: false,
            }, () => {
                if(this.state.restaurant.res_telephone.length > 0) {
                    this.splitTelephone()
                }
                if(this.state.restaurant.res_holiday.length > 0) {
                    this.setHoliday()
                }
                console.log(this.state.restaurant)
            })
        }
    }

    fetchRestaurantTypes = async (restype_id) => {
        const restaurantType = await API.get(`restauranttypes/${restype_id}`)
        const { data } = await restaurantType
        return {restype_name: data.data.restype_name, restype_id: data.data.restype_id}
    }

    splitTelephone = async () => {
        const { restaurant } = this.state
        
        const formatResTel = await `${restaurant.res_telephone[0].substring(0, 3)}-${restaurant.res_telephone[0].substring(3, 6)}-${restaurant.res_telephone[0].substring(6,10)}`
        const formatContactTel = await (restaurant.res_telephone[1] ? `${restaurant.res_telephone[1].substring(0, 3)}-${restaurant.res_telephone[1].substring(3, 6)}-${restaurant.res_telephone[1].substring(6,10)}` : '')

        this.setState({
            res_tel: formatResTel,
            contact_tel: formatContactTel
        })
    }
    
    setHoliday = async () => {
        const { restaurant } = this.state

        const holiday = await (restaurant.res_holiday.length > 0 ? restaurant.res_holiday.map(item => { return this.checkHolidayIsEqual(item) }) : []) 
        const sortDay = holiday.sort(this.s)

        const addIdToHoliday = sortDay.map((item, index) => {return { id: index + 1, holiday: item} })

        this.setState({
            holiday: addIdToHoliday
        })
    }

    s = (a,b) => {
            const listdays = ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์', 'วันอาทิตย์']
        return listdays.indexOf(a) - listdays.indexOf(b);
    }

    checkHolidayIsEqual = (days) => {
        let dayname
        if(days === 'จ') {
            dayname = 'วันจันทร์'
        } 
        if(days === 'อ') {
            dayname = 'วันอังคาร'
        }
        if(days === 'พ') {
            dayname = 'วันพุธ'
        }
        if(days === 'พฤ') {
            dayname = 'วันพฤหัสบดี'
        } 
        if(days === 'ศ') {
            dayname = 'วันศุกร์'
        }
        if(days === 'ส') {
            dayname = 'วันเสาร์'
        }
        if(days === 'อา') {
            dayname = 'วันอาทิตย์'
        }
        return dayname
    }

    render() {
        const { classes } = this.props
        const { restaurant, resType, loading, res_tel, contact_tel, holiday } = this.state
        const getImage = `http://localhost:3000/restaurants/${(restaurant.res_logo ? restaurant.res_logo : 'noimg.png')}`
        if(loading) return <MyLoader />
        return (
            <div>
                <Paper className={classes.paper}>
                    <Grid container spacing={24} style={{paddingTop: 30, paddingBottom: 30}}>
                        <Grid item xs={12} container justify="center">
                            <Grid item xs={12}>
                                <Avatar alt={this.state.name} src={getImage} className={classes.logo} />
                            </Grid>
                            <Grid item xs={12} style={{paddingTop: 20}}>
                                <Typography variant="h4" gutterBottom>
                                    {restaurant.res_name}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} style={{paddingTop: 15}}>
                                {
                                    resType.length > 0 ?
                                        resType.map(restype => {
                                            return <Chip key={restype.restype_id} label={restype.restype_name} color="secondary" className={classes.chip} />
                                        })
                                    :
                                        ''
                                }
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container align="left">
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                    Restaurant Details
                                </Typography>
                            </Grid>
                            <Divider style={{width: '100%'}} />
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Email
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.contentInner}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        { (restaurant.res_email !== null ? restaurant.res_email : 'Empty') }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={12} sm={6} container>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Restaurant number
                                        </Typography>
                                    </Grid>
                                    <Grid item className={classes.contentInner}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            { res_tel !== '' ? res_tel : 'Empty' }
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} container>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Contact number
                                        </Typography>
                                    </Grid>
                                    <Grid item className={classes.contentInner}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            { (contact_tel !== '') ? contact_tel : 'Empty' }
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Details
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.contentInner}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        { (restaurant.res_details !== null ? restaurant.res_details : 'Empty') }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Address
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.contentInner}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        { (restaurant.res_address !== null ? restaurant.res_address : 'Empty') }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Open and closed time
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.contentInner}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        { 
                                            (restaurant.res_open && restaurant.res_close !== null ? 
                                            `${moment(restaurant.res_open, 'HH:mm:ss').format('HH:mm น.')} - ${moment(restaurant.res_close, 'HH:mm:ss').format('HH:mm น.')}` 
                                            : 
                                            'Empty') 
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Closed day
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.contentInner}>
                                        { (
                                            holiday.length > 0
                                            ?
                                            holiday.map(item => {
                                                return (
                                                    <List key={item.id}>
                                                        <ListItem>
                                                         <ListItemIcon style={{color: '#ff9100a8'}}>
                                                            <CheckCircle />
                                                        </ListItemIcon>
                                                            <ListItemText
                                                                primary={item.holiday}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                )
                                            })
                                            :
                                            'ไม่มีวันหยุด'
                                        ) }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Location
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.contentInner}>
                                    {
                                        (restaurant.res_lat && restaurant.res_lng !== null ?
                                            <GoogleMaps lat={restaurant.res_lat} lng={restaurant.res_lng} />
                                            :
                                            'Empty'
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

InfoRestaurant.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(InfoRestaurant));
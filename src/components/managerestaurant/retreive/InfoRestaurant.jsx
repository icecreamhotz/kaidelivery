import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
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
        const restaurant = await API.get(`restaurants/${resname}`)
        const { data } = await restaurant

        console.log(data)

        if(data.data.length === 0) {
            this.props.history.push('/myrestaurant')
        } else {
            let resTypeAll = []

            if(JSON.parse(data.data.restype_id)) {
                const restype_id = JSON.parse(data.data.restype_id)
                resTypeAll = await Promise.all(restype_id.map(async item => { 
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
            }, () => this.splitTelephone())
        }
    }

    fetchRestaurantTypes = async (restype_id) => {
        const restaurantType = await API.get(`restauranttypes/${restype_id}`)
        const { data } = await restaurantType
        return {restype_name: data.data.restype_name, restype_id: data.data.restype_id}
    }

    splitTelephone = async () => {
        const { restaurant } = this.state
        const number = JSON.parse(restaurant.res_telephone)
        
        const formatResTel = await `${number[0].substring(0, 3)}-${number[0].substring(3, 6)}-${number[0].substring(6,10)}`
        const formatContactTel = await (number[1] !== '' ? `${number[1].substring(0, 3)}-${number[1].substring(3, 6)}-${number[1].substring(6,10)}` : '')

        this.setState({
            res_tel: formatResTel,
            contact_tel: formatContactTel
        })
    }

    checkHolidayIsEqual = (days) => {
        if(days === 'จ') {
            return 'วันจันทร์'
        } else if(days === 'อ') {
            return 'วันอังคาร'
        } else if(days === 'พ') {
            return 'วันอังคาร'
        } else if(days === 'พฤ') {
            return 'วันอังคาร'
        } else if(days === 'ศ') {
            return 'วันอังคาร'
        } else if(days === 'ส') {
            return 'วันอังคาร'
        }
        return 'วันอังคาร'
    }

    render() {
        const { classes } = this.props
        const { restaurant, resType, loading, res_tel, contact_tel } = this.state
        const getImage = `http://localhost:3000/restaurants/${(restaurant.res_logo ? restaurant.res_logo : 'noimg.png')}`
        if(loading) return <MyLoader />
        return (
            <div className="content-start">
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
                                        { restaurant.res_email }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={6} container>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Restaurant Number
                                        </Typography>
                                    </Grid>
                                    <Grid item className={classes.contentInner}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            { res_tel }
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6} container>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Contact Number
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
                                        { restaurant.res_details }
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
                                        { restaurant.res_address }
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
                                        { `${moment(restaurant.res_open, 'HH:mm:ss').format('HH:mm น.')} - ${moment(restaurant.res_close, 'HH:mm:ss').format('HH:mm น.')}` }
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
                                    <Typography variant="subtitle1" gutterBottom>
                                        { restaurant.res_email }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container className={classes.content}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Email
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={classes.contentInner}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        { restaurant.res_email }
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(withRouter(InfoRestaurant));
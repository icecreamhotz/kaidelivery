import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Home from '@material-ui/icons/Home';
import Edit from '@material-ui/icons/Edit';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'
import { updateTriggerComponent, updateRestaurantName } from '../../actions/restaurant'
import API from '../../helper/api'
import Loading from '../loaders/loading'
import SweetAlert from 'sweetalert-react';

import InfoRestaurant from './retreive/InfoRestaurant'
import EditRestaurant from './edit/EditRestaurant'

const styles = theme => ({
    paper: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    root: {
        flexGrow: 1
    },
    grid: {  
        height: 400
    },
    infoGrid: {
        height: 100
    },
    infoGridIcon: {
        backgroundColor: blue[400]
    },
    editGridIcon: {
        backgroundColor: green['A200']
    },
    deleteGridIcon: {
        backgroundColor: red[400]
    },
    largeIcon: {
        width: 60,
        height: 60
    },
    pointerHover: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
})

class IndexRestaurant extends Component {

    state = { component: 0, open: false, loading: false, type: 'info', text: 'Do you need delete ?', title: 'Warning', }

    changeValueComponent = (value) => {
        this.setState({ component: value })
    }

    componentWillReceiveProps (newProps) {
        if(newProps.resComponent) {
            this.setState({ component: 0}, () => this.props.updateTriggerComponent(false))
        }
    }

    sweetalert = () => {
        const { type } = this.state
        if(type === 'success') {
            this.setState({
                open: false
            }, () => {
                setTimeout(() => {
                    this.props.updateRestaurantName(true)
                    this.props.history.push('/myrestaurant')
                }, 100);
            })
        } 
        if (type === 'info' ){
            this.deleteRestaurant()
        }
    }

    askDelete = () => {
        this.setState({
            open: true
        }) 
    }

    deleteRestaurant = () => {
        this.setState({
            open: false,
            loading: true
        }, () => {
            API.post(`restaurants/delete`, {res_name: decodeURI(this.props.match.params.resname)}).then(() => {
                this.setState({
                        loading: false,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                type: 'success',
                                text: 'Deleted successful',
                                title: 'Success',
                                open: true
                            })
                        }, 100);
                    })
            })
        })
    }

    render() {
        const { classes } = this.props
        const { component } = this.state 
        return (
            <div className="content-start">
                { (this.state.loading ? <Loading loaded={this.state.loading} /> : '')}
                {
                component === 0 && 
                <Grid container className={classes.root}>
                    <Grid item container xs={12} className={classes.grid} alignItems="center">
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <Typography variant="h3" gutterBottom>
                                    Menu
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    {`${decodeURI(this.props.match.params.resname)}`}
                                </Typography>
                            </Grid>
                            <Divider style={{width: '100%'}}/>
                            <Grid item container spacing={24} style={{marginTop: 15}}>
                                <Grid item xs={12} sm={4} className={classes.pointerHover} onClick={() => this.changeValueComponent(1)}>
                                    <Paper className={classes.paper}>
                                        <Grid item className={classes.infoGrid} container>
                                            <Grid item className={classes.infoGridIcon} container sm={4} alignItems="center" justify="center">
                                                <Home className={classes.largeIcon} />
                                            </Grid>
                                            <Grid item container sm alignItems="center" justify="center">
                                                Infomations
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4} className={classes.pointerHover} onClick={() => this.changeValueComponent(2)}>
                                    <Paper className={classes.paper}>
                                        <Grid item className={classes.infoGrid} container>
                                            <Grid item className={classes.editGridIcon} container sm={4} alignItems="center" justify="center">
                                                <Edit className={classes.largeIcon} />
                                            </Grid>
                                            <Grid item container sm alignItems="center" justify="center">
                                                Edit Informations
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4} className={classes.pointerHover} onClick={() => this.askDelete()}>
                                    <Paper className={classes.paper}>
                                        <Grid item className={classes.infoGrid} container>
                                            <Grid item className={classes.deleteGridIcon} container sm={4} alignItems="center" justify="center">
                                                <DeleteForever className={classes.largeIcon} />
                                            </Grid>
                                            <Grid item container sm alignItems="center" justify="center">
                                                Permanent Delete
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                }
                {component === 1 && <InfoRestaurant />}
                {component === 2 && <EditRestaurant changeValueComponent={this.changeValueComponent}/>}
                {component === 3 && <InfoRestaurant />}
                <SweetAlert
                    show={this.state.open}
                    title={this.state.title}
                    text={this.state.text}
                    type={this.state.type}
                    onConfirm={() => { if(this.state.open) this.sweetalert() }}
                    onEscapeKey={() => { if(this.state.open) this.setState({open: !this.state.open}) }}
                    onOutsideClick={() => { if(this.state.open) this.setState({open: !this.state.open}) }}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        resComponent: state.update.resComponent
    }
}

IndexRestaurant.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps, {updateTriggerComponent: updateTriggerComponent, updateRestaurantName: updateRestaurantName})(withStyles(styles, {withTheme: true})(IndexRestaurant)));
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import { FormattedMessage } from 'react-intl'

const styles = theme => ({
    hero: {
        backgroundImage: 'url("http://ppcdn.500px.org/75319705/1991f76c0c6a91ae1d23eb94ac5c7a9f7e79c480/2048.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100vh',
        display: 'flex'
    },
    content: {
        width: 600,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 'auto',
        textAlign: 'center'
    },
    contentText: {
        color: '#FAFAFA',
        marginTop: 30
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#FAFAFA',
        '&:hover': {
        backgroundColor: '#FAFAFA',
        },
        marginLeft: 0,
        marginTop: 50,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit,
        width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 530,
            '&:focus': {
                width: 580,
            },
        },
        height: 35
    },
})

class Welcome extends Component {

    render() {
        const { classes } = this.props
        return(
            <div>
                <Grid container className={classes.hero}>
                    <Grid container className={classes.content}>
                        <Typography className={classes.contentText} variant="h2" gutterBottom>
                            <FormattedMessage 
                                id="welcome.name"
                            />
                        </Typography>
                        <Typography className={classes.contentText} variant="h4" gutterBottom>
                            <FormattedMessage 
                                id="welcome.guide"
                            />
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                                <InputBase
                                placeholder="Search restaurants near me ....."
                                classes={{
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

Welcome.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Welcome)
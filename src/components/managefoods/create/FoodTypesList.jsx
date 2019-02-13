import React, { Component } from 'react';
import green from '@material-ui/core/colors/green';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import withLoading from '../../loaders/WithLoading'

class FoodTypesList extends Component {
    render() {
        const { holder, index, classes, foodtypes } = this.props
        return (
            <div>
                <FormControl className={classes.formControl} style={{width: '100%'}}>
                    <InputLabel htmlFor="foodtype_id-label-placeholder" shrink={true} >Food Types</InputLabel>
                        <Select
                            name={`foodtype_id${index}`} 
                            value={holder.foodtype_id}
                            onChange={this.props.handleHoldersOnchange('foodtype_id')(index)} 
                            input={<Input name={`foodtype_id${index}`} id="foodtype_id-label-placeholder"/>}
                            displayEmpty
                            className={classes.selectEmpty}
                        >
                        <MenuItem value="">
                            <em>ไม่มี</em>
                        </MenuItem>
                            {
                                foodtypes.map((item) => (
                                    <MenuItem key={item.foodtype_id} value={item.foodtype_id}>{item.foodtype_name}</MenuItem>
                            ))
                            }
                        </Select>
                        <FormHelperText>
                            <Typography variant="caption" gutterBottom style={{color: green[300]}}>
                                *Optional
                            </Typography>
                        </FormHelperText>
                    </FormControl>
            </div>
        );
    }
}

export default withLoading(FoodTypesList);
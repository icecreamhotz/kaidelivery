import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Refresh from '@material-ui/icons/Refresh';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import API from '../../../helper/api.js'
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Edit from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import LastPageIcon from '@material-ui/icons/LastPage';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import FoodTypesList from '../create/FoodTypesList'
import SweetAlert from 'sweetalert-react';
import '../create/createfoods.scss'

const rows = [
  { id: 0, numeric: false, disablePadding: true, label: 'No' },
  { id: 1, numeric: true, disablePadding: false, label: 'Food Name' },
  { id: 2, numeric: true, disablePadding: false, label: 'Food Price' },
  { id: 3, numeric: true, disablePadding: false, label: 'Food Type' },
  { id: 4, numeric: true, disablePadding: false, label: 'Images' },
  { id: 5, numeric: true, disablePadding: false, label: 'Edit' },
];

class EnhancedTableHead extends React.Component {

  render() {
    const { onSelectAllClick, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
              >
                {row.label}
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Foods
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon onClick={props.deleteAll}/>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Refresh Table" onClick={props.onReload}>
            <IconButton aria-label="Refresh Table">
              <Refresh />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onReload: PropTypes.func.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  avatar: {
      marginRight: 10,
      display: 'inline-flex'
  },
  bgEdit: {
      color: '#ff9100a8',
      '&:hover': {
          cursor: 'pointer'
      }
  },
  checkIcon: {
      color: green['A400'],
      fontSize: 30,
      '&:hover': {
          cursor: 'pointer'
      }
  },
  closeIcon: {
      color: red['A200'],
      float: 'right',
      fontSize: 30,
      '&:hover': {
          cursor: 'pointer'
      }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
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
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    width: '100%',
    height: 30
  },
});

class InfoFoods extends React.Component {
    constructor(props) {
      super(props)
    
      this.state = {
            selected: [],
            data: [],
            backupData: [],
            page: 0,
            rowsPerPage: 10,
            foodtypes: [],
            deleteData: [],
            deleteImg: [],
            index: 0,
            loading: true,
            successAlert: false,
            confirmAlert: false,
            deleteAlert: false,
            deleteSuccessAlert: false,
            validate: false
      }
      this.imageInput = []
    } 

    async componentDidMount() {
        await this.fetchFoodsData()
        await this.fetchFoodTypesFromAPI()
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.validate) {
            this.setState({
                validate: false,
            }, () => this.handleSubmit())
        }
    }

    fetchFoodsData = async () => {
        const res_id = this.props.res_id
        const foods = await API.post(`foods`, {res_id: res_id})
        const { data } = await foods

        let i = 1
        const newFoods = data.data.map(item => {    
        const food_img = JSON.parse(item.food_img)
        let newFoodImg = ['', '']
        if(food_img !== null) {
            if(food_img.length === 1) {
                const splitDot = food_img[0].split('.')
                const subStr = splitDot[0].substr(splitDot[0].length -1)
                newFoodImg[(subStr - 1)] = food_img[0]
            } else {
                newFoodImg = food_img
            }
        }
        return {...item, 
            no: i++, 
            food_img: newFoodImg, 
            edit: false,
            preview: [null, null],
            image: [null, null],
            loading: false
        }})

        this.setState({
            data: newFoods,
            backupData: newFoods
        })
    }

    handleSelectAllClick = event => {
        
        let newDeleteImg = []
        for(let n of this.state.data) {
            newDeleteImg = newDeleteImg.concat(n.food_img)
        }

        if (event.target.checked) {
            this.setState(state => ({ 
                selected: state.data.map(n => (n.no - 1)), 
                deleteData: state.data.map(n => n.food_id),
                deleteImg: newDeleteImg
            }));
            return;
        }
        this.setState({ selected: [], deleteData: [], deleteImg: [] });
    };

    handleClick = (event, id, idx, food_id, food_img) => {
        let foods = [...this.state.data]
        let food = {...foods[idx]}
        if(food.edit) {
            return 
        }

        const { selected, deleteData, deleteImg } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
            } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        
        let oldDeleteData = deleteData
        let oldDeleteImg = deleteImg
        let newDeleteData = []
        let newDeleteImg = []
        if(selected.indexOf(id) > -1) {
            for(const image of food_img) {
                const indexDelete = oldDeleteImg.indexOf(image)
                oldDeleteImg.splice(indexDelete, 1)
                newDeleteImg = oldDeleteImg
            }
            const indexDelete = oldDeleteData.indexOf(food_id)
            oldDeleteData.splice(indexDelete, 1)
            newDeleteData = oldDeleteData
        } else {
            newDeleteData = oldDeleteData = [...oldDeleteData, food_id]
            newDeleteImg = oldDeleteImg.concat(food_img)
        }

        this.setState({ selected: newSelected, deleteData: newDeleteData, deleteImg: newDeleteImg });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    fetchFoodTypesFromAPI = async () => {
        const foodtypes = await API.get('foodtypes/')
        const { data } = await foodtypes
        const foodTypes = data.data
        this.setState({ foodtypes: foodTypes, loading: false  })
    }

    handleHoldersOnchange = name => idx => event => {
        const { data } = this.state
        const newHolders = data.map((holder, sidx) => {
            if(idx !== sidx) return holder
            return { ...holder, [name]: event.target.value }
        })

        this.setState({ data: newHolders })
    }

    handlePreviewImage = (idx, imgindx) => event => {
        event.preventDefault();

        const { data } = this.state

        const newData = data

        newData.filter((item, sidx) => sidx === idx).map((holder, sidx) => {
            const reader = new FileReader();
            const file = event.target.files[0]

            let imageArr = holder.image
            let preview = holder.preview
            let index = imgindx

            reader.onloadend = () => {
                imageArr[index] = file
                preview[index] = reader.result

                let holders = [...data]
                let holder = {...holders[idx]}

                holder.preview = preview
                holder.image = imageArr

                    
                holders[idx] = holder
                console.log(holders[idx])
                this.setState({data: holders})
            }   
            this.imageInput[idx + idx + imgindx].value = null
            return reader.readAsDataURL(file)
        }) 
    }

    handleEditRow = (event, idx) => {
        event.stopPropagation()
        let foods = [...this.state.data]
        let newFoods = foods.map((item, index) => {
            if(index !== idx) return {...item, edit: false}
            return {...item, edit: true}
        })

        let select = [...this.state.selected]
        let itemidx = select.indexOf(idx)
        select.splice(itemidx, 1)

        this.setState({ data: newFoods, selected: select })
    }

    handleCancelUpdate = (idx) => {
        const { data } = this.state;
        const newData = data.map((item, index) => {
            if(idx !== index) return item
            return {...item, edit: false}
        })
        this.setState({ data: newData})
    }

    handleSearchBox = (e) => {
        const searchValue = e.target.value
        const {  backupData } = this.state;

        const regexSpecialText = /[ !@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/;

        if(regexSpecialText.test(searchValue)) {
            return
        }

        const regexText = new RegExp(`^.*${searchValue}.*$`, 'i')
        const searchData = backupData.filter(({food_name}) => food_name.match(regexText))

        this.setState({ data: searchData })
    }

    handleDeleteAll = () => {
        this.setState({
            deleteAlert: true
        })
    }

    deleteData = async () => {
        this.setState({
            deleteAlert: false,
            loading: true
        })

        const { deleteData, deleteImg } = this.state;

        await API.post(`/foods/delete`, { food_id: deleteData, food_image: deleteImg }).then(() => {
            this.setState({
                loading: false,
                deleteData: [],
                selected: []
            }, () => setTimeout(() => {
                this.setState({
                    deleteSuccessAlert: true
                })
            }, 100))
            this.fetchFoodsData()
        }).catch((err) => {
            console.error(err)
        })
    }

    redoImage = (idx, imgidx) => {
        let getData = [...this.state.data]
        let newData = getData[idx]
        newData.preview[imgidx] = null
        newData.image[imgidx] = null
        getData[idx] = newData

        this.setState({ data: getData })
    }

    handleSubmit = async () => {
        const { index } = this.state;
        const getData = [...this.state.data]
        const loadData = getData[index]
        loadData.loading = true
        getData[index] = loadData

        console.log(loadData)
        
        this.setState({
            data: getData,
            confirmAlert: false,
            loadbutton: true
        })
    
        const fetchCountFood = await API.get(`foods/allfoods/${loadData.res_id}/${loadData.food_id}`)
        const { data } = fetchCountFood
        const countMyFoods = data.data
        let food_total = []

        let bodyFormData = new FormData()

        bodyFormData.set('food_id', loadData.food_id)
        bodyFormData.set('food_name', loadData.food_name)
        bodyFormData.set('food_price', loadData.food_price)
        bodyFormData.set('foodtype_id', loadData.foodtype_id)
        bodyFormData.set('food_img', JSON.stringify(loadData.food_img))
        bodyFormData.set('res_id', loadData.res_id)

        if(loadData.food_img !== null) {
            if(loadData.image[0] !== null || loadData.image[1] !== null) {
                if(loadData.image[0] !== null) {
                    bodyFormData.append('image', loadData.image[0])
                    food_total = [...food_total, `${countMyFoods}1`]
                }
                if(loadData.image[1] !== null) {
                    bodyFormData.append('image', loadData.image[1])
                    food_total = [...food_total, `${countMyFoods}2`]
                }
            } else {
                loadData.food_img.forEach((value , index) => {
                    const splitValue = value.split("_")
                    food_total = [...food_total, splitValue[1]]
                })
            }
        } else if(loadData.image[0] !== null || loadData.image[1] !== null) {
            if(loadData.image[0] !== null) {
                bodyFormData.append('image', loadData.image[0])
                food_total = [...food_total, `${countMyFoods}1`]
            }
            if(loadData.image[1] !== null) {
                bodyFormData.append('image', loadData.image[1])
                food_total = [...food_total, `${countMyFoods}2`]
            }
        }

        bodyFormData.set('food_total', JSON.stringify(food_total))

        for (var pair of bodyFormData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        await API.post(`foods/update/${loadData.food_id}`, bodyFormData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((foods) => {
            loadData.loading = false
            getData[index] = loadData
            this.setState({
                data: getData,
                index: 0
            }, () => {
                setTimeout(() => {
                    this.setState({
                        successAlert: true
                    })
                }, 100);
            })
        })
    }

    onSubmit = (idx) => {
        this.setState({
            index: idx
        }, () => this.refs['form'].submit())
    }

    getFoodTypeName = (foodtype_id) => {
        
        const foodtypes = [...this.state.foodtypes]
        const findFoodtypeName = foodtypes.filter(item => item.foodtype_id === foodtype_id)

        return (findFoodtypeName[0]) ? findFoodtypeName[0].foodtype_name : ""
    }

    afterSubmit = () => {
        this.setState({
            successAlert: false
        }, () => {
            this.fetchFoodsData()
            this.fetchFoodTypesFromAPI()
        })
    }

    render() {
        const { classes } = this.props;
        const { data, selected, rowsPerPage, page, loading, foodtypes } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        return (
        <div>
            <Paper>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                    <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search Foods..."
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        onChange={(e) => this.handleSearchBox(e)}
                    />
                </div>
            </Paper>
            <Paper className={classes.root}>
                <EnhancedTableToolbar numSelected={selected.length} onReload={this.fetchFoodsData} deleteAll={this.handleDeleteAll} />
                <ValidatorForm
                    ref="form"
                    onSubmit={() => this.setState({ validate: true })}
                    onError={errors => console.log(errors)}
                >
                <div className={classes.tableWrapper}>
                <Table aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        onSelectAllClick={this.handleSelectAllClick}
                        rowCount={data.length}
                    />
                    <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((n, index) => {
                        const isSelected = this.isSelected(index);
                        const newIndex = (rowsPerPage * page) + index
                        return (
                            <TableRow
                                hover
                                onClick={event => this.handleClick(event, index, newIndex, n.food_id, n.food_img)}
                                role="checkbox"
                                aria-checked={isSelected}
                                tabIndex={-1}
                                key={n.food_id}
                                selected={isSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isSelected} disabled={n.edit}/>
                                </TableCell>
                                <TableCell component="th" scope="row" padding="none">
                                    {n.no}
                                </TableCell>
                                <TableCell align="right" style={{width: 200}}>
                                    {
                                        n.edit ?
                                            <TextValidator 
                                                value={n.food_name}
                                                name={`food_name${n.no}`} 
                                                label="Food Name"
                                                onChange={this.handleHoldersOnchange(`food_name`)(newIndex)} 
                                                validators={['required']}
                                                errorMessages={['this field is required']}
                                                fullWidth
                                            />
                                        :   
                                        n.food_name
                                    }
                                </TableCell>
                                <TableCell align="right" style={{width: 200}}>
                                    {
                                        n.edit ?
                                            <TextValidator 
                                                value={n.food_price}
                                                name={`food_price${n.no}`} 
                                                label="Food Price"
                                                onChange={this.handleHoldersOnchange(`food_price`)(newIndex)} 
                                                validators={['required']}
                                                errorMessages={['this field is required']}
                                                fullWidth
                                            />
                                        :   
                                        n.food_price
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    {
                                        n.edit ?
                                        <FoodTypesList holder={n} index={newIndex} classes={classes} loading={loading} foodtypes={foodtypes} handleHoldersOnchange={this.handleHoldersOnchange}/>
                                        :   
                                        this.getFoodTypeName(n.foodtype_id)
                                    }
                                </TableCell>
                                <TableCell align="right" style={{width: 200}}>
                                    {
                                        n.edit ?
                                            n.preview !== null ?
                                                n.preview.map((img, imgidx) => {
                                                    let preview = n.preview[imgidx]
                                                    if(n.preview[imgidx] === null && n.food_img !== null) {
                                                        if(n.food_img[imgidx] !== '') {
                                                            preview = `https://kaidelivery-api.herokuapp.com/foods/${n.food_img[imgidx]}`
                                                        }
                                                    }
                                                    console.log(n.food_img)
                                                    return (
                                                    <div style={{position: 'relative'}} key={imgidx}>
                                                        <div className="avatar-wrapper">
                                                            <img className="food-pic" src={preview} alt={n.food_name} />
                                                            <div className="upload-button" onClick={() => this.imageInput[(newIndex + newIndex + imgidx)].click()}>
                                                                <i className="fas fa-plus" aria-hidden="true"></i>
                                                            </div>
                                                            <input className="file-upload" type="file" accept="image/*" ref={input => this.imageInput[(newIndex + newIndex + imgidx)] = input} onChange={this.handlePreviewImage(newIndex, imgidx)} />
                                                        </div>
                                                        {
                                                        img && 
                                                        <div className="circCont" style={{right: 30, top: 0}}>
                                                            <i className="fas fa-redo redo" onClick={() => this.redoImage(index, imgidx)}></i>
                                                        </div>
                                                        }
                                                    </div>
                                                    )
                                                })
                                            :
                                            ''
                                        :
                                        n.food_img !== null ?
                                            n.food_img.map((img, imgidx) => {
                                                return (<Avatar key={imgidx} alt={img} src={`https://kaidelivery-api.herokuapp.com/foods/${(img ? img : 'noimg.png')}`} className={classes.avatar} />)
                                            })
                                        :
                                        ''
                                    }
                                </TableCell>
                                <TableCell align="right" onClick={(event) => event.stopPropagation()}>
                                    {
                                        n.edit ?
                                            <div className="zoomIn">
                                                <Check className={classes.checkIcon} onClick={() => this.onSubmit(newIndex)}/>
                                                <Close className={classes.closeIcon} onClick={() => this.handleCancelUpdate(newIndex)}/>
                                            </div>
                                        :
                                            <Edit className={classes.bgEdit} onClick={(event) => this.handleEditRow(event, newIndex)}/>
                                    }   
                                    
                                </TableCell>
                            </TableRow>
                        );
                        })}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 49 * emptyRows }}>
                        <TableCell colSpan={6} />
                        </TableRow>
                    )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={7}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                ActionsComponent={TablePaginationActionsWrapped}
                                rowsPerPageOptions={[]}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
                </div>
                </ValidatorForm>
            </Paper>
            <SweetAlert
                show={this.state.confirmAlert}
                title="Warning"
                text="Do you need to update ?"
                type="warning"
                showCancelButton
                onConfirm={() => { this.onSubmit() }}
                onCancel={() => { this.setState({confirmAlert: false})  }}
                onEscapeKey={() => {if(this.state.confirmAlert) { this.setState({confirmAlert: false}) }}}
                onOutsideClick={() => {if(this.state.confirmAlert) { this.setState({confirmAlert: false}) }}}
            />
            <SweetAlert
                show={this.state.successAlert}
                title="Success"
                text="Updated successful"
                type="success"
                showCancelButton
                onConfirm={() => { this.afterSubmit() }}
                onEscapeKey={() => {if(this.state.successAlert) { this.afterSubmit() }}}
                onOutsideClick={() => {if(this.state.successAlert) { this.afterSubmit() }}}
            />
            <SweetAlert
                show={this.state.deleteAlert}
                title="Warning"
                text="Do you need to delete ?"
                type="error"
                showCancelButton
                onConfirm={() => { this.deleteData() }}
                onEscapeKey={() => {if(this.state.deleteAlert) { this.deleteData() }}}
                onOutsideClick={() => {if(this.state.deleteAlert) { this.deleteData() }}}
            />
            <SweetAlert
                show={this.state.deleteSuccessAlert}
                title="Success"
                text="Deleted successful"
                type="success"
                onConfirm={() => {if(this.state.deleteSuccessAlert) { this.setState({ deleteSuccessAlert: false }) }}}
                onEscapeKey={() => {if(this.state.deleteSuccessAlert) { this.setState({ deleteSuccessAlert: false }) }}}
                onOutsideClick={() => {if(this.state.deleteSuccessAlert) { this.setState({ deleteSuccessAlert: false }) }}}
            />
        </div>
        );
    }
}

InfoFoods.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoFoods);
import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Color } from '../../variable/Color';

const theme = createMuiTheme({
    overrides: {
        MuiFormLabel: {
            focused: {
                "&$focused": {
                    color: Color.kaidelivery
                }
            }
        },
        MuiInput: {
            underline: {
                "&:after": {
                    borderBottomColor: Color.kaidelivery,
                }
            },
        },
        MuiCheckbox: {
            colorSecondary: {
                color: Color.kaidelivery,
                '&$checked': {
                    color: Color.kaidelivery,
                }
            }
        }
    }
})

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;

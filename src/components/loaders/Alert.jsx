import React from 'react';
import PropTypes from 'prop-types'
import SweetAlert from 'sweetalert-react';

class Alert extends React.Component {

    shouldComponentUpdate(nextProps, nextState){
        if (this.props.open !== nextProps.open) {
            return true
        }
        if (this.props.close !== nextProps.close) {
            return true
        }
        if (this.props.type !== nextProps.type) {
            return true
        }
        if (this.props.content !== nextProps.content) {
            return true
        }
        if (this.props.title !== nextProps.title) {
            return true
        }
        return false
    }

    render() {
        const { open } = this.props
        const { title, content, type, close } = this.props
        return(
            <div>
                <SweetAlert
                    show={open}
                    title={title}
                    text={content}
                    type={type}
                    onConfirm={close}
                    onEscapeKey={close}
                    onOutsideClick={close}
                />
            </div>
        )
    }
}

Alert.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired
}

export default Alert
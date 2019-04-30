import React, { Component } from "react";
import "./chat.scss";
import firebase from "../../helper/firebase.js";
import "moment/locale/th";

import moment from "moment";

class ChatComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderName: props.orderName,
      message: [],
      newMessage: "",
      employee: props.employee,
      user: props.user
    };
  }
  componentDidMount() {
    this.loadChatEmployee();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  loadChatEmployee = () => {
    let chat = firebase
      .database()
      .ref("Chats")
      .child(this.state.orderName);
    chat.on("value", snapshotchat => {
      console.log(snapshotchat.val());
      if (snapshotchat.val() !== null) {
        let message = [];
        snapshotchat.forEach(item => {
          const data = item.val();
          message = [...message, data];
        });
        this.setState({
          message: message
        });
      }
    });
  };

  sendMessageToEmployee = () => {
    const { newMessage } = this.state;
    const data = {
      fromId: 86,
      message: newMessage,
      timestamp: moment().valueOf(),
      toId: 17,
      read: false
    };

    let chat = firebase
      .database()
      .ref(`/Chats/${this.state.orderName}`)
      .push();
    chat
      .set(data)
      .then(() => {
        this.setState({
          newMessage: ""
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { message, newMessage, employee, user } = this.state;
    console.log(this.state.message);
    return (
      <div>
        <div className="--dark-theme" id="chat">
          <div className="chat__conversation-board">
            {message.map((item, idx) => {
              return item.fromId === 86 ? (
                <div
                  className="chat__conversation-board__message-container reversed"
                  key={idx}
                >
                  <div className="chat__conversation-board__message__person">
                    <div className="chat__conversation-board__message__person__avatar">
                      <img
                        src={`http://localhost:3000/users/${user.avatar}`}
                        alt="Monika Figi"
                      />
                    </div>
                    <span className="chat__conversation-board__message__person__nickname">
                      Dennis Mikle
                    </span>
                  </div>
                  <div className="chat__conversation-board__message__context">
                    <div className="chat__conversation-board__message__bubble">
                      {" "}
                      <span>{item.message}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="chat__conversation-board__message-container"
                  key={idx}
                >
                  <div className="chat__conversation-board__message__person">
                    <div className="chat__conversation-board__message__person__avatar">
                      <img
                        src={`http://localhost:3000/employees/${
                          employee.emp_avatar
                        }`}
                        alt="Monika Figi"
                      />
                    </div>
                    <span className="chat__conversation-board__message__person__nickname">
                      Monika Figi
                    </span>
                  </div>
                  <div className="chat__conversation-board__message__context">
                    <div className="chat__conversation-board__message__bubble">
                      {"  "}
                      <span>{item.message}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="chat__conversation-panel">
            <div className="chat__conversation-panel__container">
              <input
                className="chat__conversation-panel__input panel-item"
                placeholder="Type a message..."
                value={newMessage}
                onChange={this.handleChange("newMessage")}
                type="text"
              />
              <button
                className="chat__conversation-panel__button panel-item btn-icon send-message-button"
                onClick={this.sendMessageToEmployee}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  data-reactid="1036"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatComponent;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

export default class Popup extends React.Component {
    render() {
      return (
        <div className='popup'>
          <div className='popup_inner'>
            {this.props.children}
          </div>
        </div>
      );
    }
  }
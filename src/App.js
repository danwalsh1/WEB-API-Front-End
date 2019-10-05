import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {Form} from 'antd'
import Login from './components/Login'

const LoginForm = Form.create({name: 'login'})(Login)

function App() {
  return (
    <div>
      Hello there lol
      <LoginForm />
    </div>
  );
}

export default App;

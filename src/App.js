import React from 'react';
//import logo from './logo.svg';
import './App.css';

import {Form} from 'antd'
import Login from './components/Login'
import SignUp from './components/SignUp';
import Calendar from './components/Calendar';
import ActivityList from './components/ActivityList';

const LoginForm = Form.create({name: 'login'})(Login)
const SignUpForm = Form.create({name: 'signup'})(SignUp);


function App() {
  return (
    <div>
      Hello there lol
      <LoginForm />
      <SignUpForm />
      <Calendar />
    <ActivityList />
    </div>
  );
}

export default App;

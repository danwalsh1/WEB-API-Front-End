import React from 'react';
import './App.css';

import {Form} from 'antd'
import Login from './components/Login'
import SignUp from './components/SignUp';
import CalendarClass from './components/Calendar';
import ActivityList from './components/ActivityList';

const LoginForm = Form.create({name: 'login'})(Login)
const SignUpForm = Form.create({name: 'signup'})(SignUp);
const Calendar = Form.create({name: 'composer'})(CalendarClass)


function App() {
  return (
    <div>
      Hello there lol
      <LoginForm />
      <SignUpForm />
      <ActivityList />
      <Calendar />
    </div>
  );
}

export default App;

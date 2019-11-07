import React from 'react';
import './App.css';

import {Form} from 'antd'
import Login from './components/Login'
import SignUp from './components/SignUp';
import CalendarClass from './components/Calendar';
import ActivityList from './components/ActivityList';
import ActivityComposer from './components/ActivityComposer';

const LoginForm = Form.create({name: 'login'})(Login)
const SignUpForm = Form.create({name: 'signup'})(SignUp);
const ActivityComposerForm = Form.create({name: 'ActivityComposer'})(ActivityComposer);
const Calendar = Form.create({name: 'composer'})(CalendarClass)


function App() {
  return (
    <div>
      Hello there lol
      <LoginForm />
      <SignUpForm />
      <ActivityComposerForm />
      <ActivityList />
      <Calendar />
    </div>
  );
}

export default App;

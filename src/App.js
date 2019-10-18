import React from 'react';
//import logo from './logo.svg';
import './App.css';

import {Form} from 'antd'
import Login from './components/Login'
import SignUp from './components/SignUp';
import ActivityComposer from './components/ActivityComposer';

const LoginForm = Form.create({name: 'login'})(Login)
const SignUpForm = Form.create({name: 'signup'})(SignUp);
const ActivityComposerForm = Form.create({name: 'activityComposer'})(ActivityComposer);


function App() {
  return (
    <div>
      Hello there lol
      <LoginForm />
      <SignUpForm />
      <ActivityComposerForm />
    </div>
  );
}

export default App;

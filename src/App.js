import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Form} from 'antd';
import SignUp from './components/SignUp';

const SignUpForm = Form.create({name: 'signup'})(SignUp);

function App() {
  return (
    <div>
      Hello there lol
      <SignUpForm />
    </div>
  );
}

export default App;

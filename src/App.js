import React from 'react';
import './App.css';

import {Form} from 'antd'
import Login from './components/Login'
import SignUp from './components/SignUp';
import CalendarClass from './components/Calendar';
import ActivityList from './components/ActivityList';
import TagRequestManager from './components/TagRequestManager';

const LoginForm = Form.create({name: 'login'})(Login)
const SignUpForm = Form.create({name: 'signup'})(SignUp);
const Calendar = Form.create({name: 'composer'})(CalendarClass);
const TagRequestForm = Form.create({name: 'tagRequest'})(TagRequestManager);


function App() {
  return (
    <div>
      <div className='loginsignup'>
        <div style={{float: 'left', paddingRight: '10px'}}>
          <TagRequestForm />
        </div>
        <LoginForm />
        <SignUpForm />
      </div>
      <div className='activityListDiv'>
        <ActivityList />
        
      </div>
      <Calendar />
    </div>
  );
}

export default App;

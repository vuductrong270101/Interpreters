import React, { useState } from 'react'

import ButtonFull from '../../../components/UI/Button/ButtonFull';
import Message from '../../../components/UI/Message/Message';
import ButtonBack from '../../../components/UI/Button/ButtonBack';
import Modals from "../../../components/UI/Modal/Modals";

import { Input } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'

import logo from '../../../assets/logo/LogoPage.png'
import { register } from '../../../services/authentication';

const RegisterEnterprise = (props) => {
  const [userInput, setUserInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    biz: false
  });
  const [showMessage, setShowMessage] = useState({
    status: false,
    type: '',
    content: '',
  })
  const [noti, setNoti] = useState({
    status: false,
    title: '',
    email: '',
    message: ''
  });

  const changeMessage = () => {
    setShowMessage({
      status: false,
      type: '',
      content: '',
    })
  }

  const createErrorMessage = (msg) => {
    setShowMessage({ status: true, type: 'error', content: msg })
  }

  const createSuccessNoti = (email) => {
    setNoti({ status: true, title: 'success', email: email })
  }

  const createWarningNoti = (msg) => {
    setNoti({ status: true, title: 'warning', message: msg })
  }

  const createErrorNoti = (msg) => {
    setNoti({ status: true, title: 'error', message: msg })
  }

  const changeNotificationHandler = () => {
    setNoti({ status: false })
  }

  const onClickBackHandler = () => {
    props.changeFormHandler(0)
  }

  const inputChangeHandler = (event) => {
    setUserInput((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const validateUserInput = (userInput) => {
    let res = true;
    let errMsg = '';
    if (!userInput.firstName) {
      errMsg = 'Hãy nhập tên';
    }
    else if (!userInput.lastName) {
      errMsg = 'Hãy nhập họ';
    }
    else if (!userInput.email) {
      errMsg = 'Hãy nhập email';
    }
    else if (userInput.email.indexOf('@') < 0) {
      errMsg = 'Cấu trúc mail sai phải có @';
    }
    else if (!userInput.password) {
      errMsg = 'Hãy nhập mật khẩu';
    }
    else if (userInput.password.length > 32 || userInput.password.length < 6) {
      errMsg = 'Độ dài mật khẩu từ 6 đến 36 ký tự';
    }
    else if (!userInput.confirmPassword) {
      errMsg = 'Hãy nhập mật khẩu để xác nhận';
    }
    else if (userInput.password !== userInput.confirmPassword) {
      errMsg = 'Nhập đúng mật khẩu';
    }
    if (errMsg) {
      createErrorMessage(errMsg)
      res = false;
    }
    return res;
  }

  const registerWithCredentials = (credentials) => {
    register(credentials)
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res)
        }
        else if (res.ok) {
          createSuccessNoti(userInput.email)
          return res.json();
        }
      })
      .then(data => {
        console.log(data);
        createWarningNoti(data.message)
      }).catch(err => {
        err.json().then(e => {
          createErrorNoti(e.message)
          console.log(e)
        })
      });
  }

  const handleRegister = (event) => {
    if (event) {
      event.preventDefault();
    }
    validateUserInput(userInput)
    if (validateUserInput(userInput)) { registerWithCredentials(userInput) }
  }

  return (
    <div>
      {noti.status &&
        <Modals status={noti.status} title={noti.title} email={noti.email} message={noti.message} changeNotification={changeNotificationHandler} />
      }
      <Message status={showMessage.status} type={showMessage.type} content={showMessage.content} changeMessage={changeMessage} />
      <ButtonBack onClickBackHandler={onClickBackHandler}>Trở lại</ButtonBack>
      <div className="register__logo">
        <img className='logo' src={logo} alt="" />
      </div>
      <form onSubmit={handleRegister} className="register-form">
        <div className='form-top'>
          <h1 style={{ textAlign: 'center' }}>Thông tin đăng ký Interpreters</h1>
          <div className="register-form__control">
            <input
              type="text"
              name="firstName"
              onChange={inputChangeHandler}
              placeholder='Enter your first name'
              className='input-register'
            ></input>
          </div>
          <div className="register-form__control">
            <input
              type="text"
              name="lastName"
              onChange={inputChangeHandler}
              placeholder='Enter your last name'
              className='input-register'
            ></input>
          </div>
          <div className="register-form__control">
            <input
              type="text"
              name="email"
              onChange={inputChangeHandler}
              placeholder='Enter your email'
              className='input-register'
            ></input>
          </div>
          <div className="register-form__control">
            <Input.Password
              name="password"
              onChange={inputChangeHandler}
              placeholder="Enter your password"
              className='input-register'
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </div>
          <div className="register-form__control">
            <Input.Password
              name="confirmPassword"
              onChange={inputChangeHandler}
              placeholder="Confirm your password"
              className='input-register'
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </div>
        </div>
        <div className='form-bottom'>
          <div className="register-form__control">
            <ButtonFull type="submit">Đăng ký</ButtonFull>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterEnterprise
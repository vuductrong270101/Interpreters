import React, { useEffect, useState } from "react";
import ButtonFull from "../../components/UI/Button/ButtonFull";
import "./style.css";
import { Input, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Message from "../../components/UI/Message/Message";
import AccountFactories from "../../services/AccountFactories";

import { toast } from "react-toastify";
import { ToastNotiError } from "../../utils/Utils";
import { useTranslation } from "react-i18next";

const Register = (props) => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [open, setIsOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    setIsOpen(props.isModalOpen)
  }, [props.isModalOpen])
  const handleCancel = () => {
    props.onClose();
  };
  const [showMessage, setShowMessage] = useState({
    status: false,
    type: '',
    content: '',
  })

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

    // Email validation with a more robust regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userInput.email || !emailRegex.test(userInput.email)) {
      errMsg = t('Validate_email');
    }

    // Password validation
    if (!userInput.password) {
      errMsg = t('Validate_pass1');
    } else if (userInput.password.length < 6 || userInput.password.length > 32) {
      errMsg = t('Validate_pass2');
    }

    // Confirm password validation
    if (!userInput.confirmPassword) {
      errMsg = t('Validate_pass3');
    } else if (userInput.password !== userInput.confirmPassword) {
      errMsg = t('Validate_pass4');
    }

    if (errMsg) {
      createErrorMessage(errMsg);
      res = false;
    }

    return res;
  }
  const registerWithCredentials = async ({ email, password }) => {
    setLoading(true)
    try {
      const response = await AccountFactories.requestLSignUp(userInput);
      if (response?.status === 200) {
        toast.success(t('resgiter_success'))
        setLoading(false)
        handleCancel()
      }
      else if (response?.status === 210) {
        toast.error(response?.message)
        setLoading(false)
      }
    } catch (error) {
      ToastNotiError();
      setLoading(false)
    }

    // try {
    //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //   const user = userCredential.user;
    //   if (user) {
    //     // await sendEmailVerification(user);
    //     const response = await AccountFactories.requestLSignUp(userInput);
    //     if (response?.status === 200) {
    //       toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')
    //     }
    //     else{
    //       toast.success('Có lỗi xảy ra. Vui lòng thử lại sau.')
    //     }
    //   }
    //   navigator('/login');
    // } catch (error) {
    //   setShowMessage({
    //     status: true,
    //     type: "error",
    //     content: `Đăng ký thất bại: Địa chỉ email đã được sử dụng`,
    //   });
    // }
  }


  const handleRegister = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (validateUserInput(userInput)) {
      registerWithCredentials(userInput);
    }
  }

  return (
    <>
      <Message
        status={showMessage.status}
        type={showMessage.type}
        content={showMessage.content}
        changeMessage={changeMessage}
      />
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={[
          <></>
        ]}
      >
        <form onSubmit={handleRegister} className="w-full">
          <div className='form-top flex flex-col gap-4'>
            <h1 className="font-bold text-3xl text-blue-500" style={{ textAlign: 'center' }}>{t('info_res')}</h1>
            <div className="register-form__control">
              <input
                type="email"
                name="email"
                onChange={inputChangeHandler}
                placeholder={t('enter_email')}
                className='input-register'
              >
              </input>
            </div>
            <div className="register-form__control">
              <Input.Password
                name="password"
                onChange={inputChangeHandler}
                placeholder={t('enter_pass')}
                className='input-register'
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </div>
            <div className="register-form__control ">
              <Input.Password
                name="confirmPassword"
                onChange={inputChangeHandler}
                placeholder={t('enter_pass2')}
                className='input-register'
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </div>
          </div>
          <div className='form-bottom mt-3'>
            <div className="register-form__control">
              <ButtonFull disabled={loading} type="submit" onClick={handleRegister}>{t('register')}</ButtonFull>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Register;

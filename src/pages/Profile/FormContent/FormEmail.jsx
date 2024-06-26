import { Col, Row } from "antd";
import {  useEffect, useState } from "react";
import Message from "../../../components/UI/Message/Message";
import classes from "./Form.module.css";
import AccountFactories from "../../../services/AccountFactories";
import { ToastNoti } from "../../../utils/Utils";
import { toast } from "react-toastify";
export default function FormEmail(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [email, setEmail] = useState();

  const [showMessage, setShowMessage] = useState({
    status: false,
    type: "",
    content: "",
  });

  const changeMessage = () => {
    setShowMessage({
      status: false,
      type: "",
      content: "",
    });
  };

  const createErrorMessage = (msg) => {
    setShowMessage({ status: true, type: "error", content: msg });
  };

  useEffect(() => {
    setEmail(user.email);
  }, []);

  const inputChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const validateFormData = (formData) => {
    let res = true;
    let errMsg = "";
    if (!formData) {
      errMsg = "Vui lòng nhập email!";
    } else if (formData.indexOf("@") < 0) {
      errMsg = "Email sai, email phải chứa @!";
    }
    if (errMsg) {
      createErrorMessage(errMsg);
      res = false;
    }
    return res;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!validateFormData(email)) return;
    try {
      const data = {
        email: email,
      }
      const response = await AccountFactories.requestUpdate(user?.id, data);
      if (response?.status === 200) {
        ToastNoti();
        setEmail(email);
        localStorage.setItem("user", JSON.stringify({ ...user, email }));
        window.dispatchEvent(new Event('storage'))
      }
    } catch (error) {
      console.log(error);
      toast.error('Hệ thống lỗi.')
    }

  };

  return (
    <Row>
      <Col span={16}>
        <Message
          status={showMessage.status}
          type={showMessage.type}
          content={showMessage.content}
          changeMessage={changeMessage}
        />
        <h1>Đổi Email</h1>
        <form className={classes.form} onSubmit={submitHandler}>
          <Row className={classes.form_control}>
            <Col span={4}>Email:</Col>
            <Col span={20}>
              <input
                placeholder="Nhập Email của bạn"
                className={classes.input_profile}
                onChange={inputChangeHandler}
                value={email}
              />
            </Col>
          </Row>

          <Row>
            <Col offset={4}></Col>
            <Col span={16}>
              <button className={classes.btnSubmit} type="submit">
                Thay đổi Email
              </button>
            </Col>
          </Row>
        </form>
      </Col>
    </Row>
  );
}

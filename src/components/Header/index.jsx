import React, { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Avatar, Select, Tooltip } from "antd";
import NotLogin from "../BtnNotLogin/NotLogin";
import NavBar from "../Navbar/NavBar";
import SearchModal from "./Search/SearchModal";
import "./style.css";
import logo from "../../assets/logo/LogoPage.png";

import Notification from "../Notification";
import { AuthContext } from "../../context/auth.context";
import { NotificationContext } from "../../context/Notification.context";
import { ToastInfo } from "../../utils/Utils";
import useOnClickOutside from "../../hook/use-onclick-outside";
import { Dropdown } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import { useTranslation } from "react-i18next";
import Login from "../../pages/Login";
import Register from "../../pages/Register/Register";
import CategoriesFactories from "../../services/CategoryFactories";
import Cookies from 'js-cookie';
import { MessageContext } from "../../context/Message.context";
import { MessageOutlined, NotificationOutlined } from "@ant-design/icons";
import { Badge } from "@nextui-org/react";
const Header = (props) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const { logout } = useContext(AuthContext)
  // const { user } = useContext(AuthContext);
  const [language, setLanguage] = useState('en')
  const [fields, setFields] = useState()
  const [user, setUser] = useState();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser({ ...JSON.parse(localStorage.getItem("user")) });
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const { t, i18n } = useTranslation()

  function handleChangeTrans(value) {
    setLanguage(value)
    i18n.changeLanguage(value);
    Cookies.set('i18next', value, { expires: 365 });
  }

  useEffect(() => {
    const newValue = Cookies.get('i18next');
    setLanguage(newValue)
  }, [])

  const logOutHandler = () => {
    logout()
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.replace("http://localhost:3000/");
  };

  const loginHandler = () => {
    setIsOpenLogin(true)
  };

  const registerHandler = () => {
    setIsOpenRes(true)
  };
  function handleOpen() {
    setIsOpen(!isOpen);
  }
  function handleClose() {
    setIsOpen(false);
  }
  const { notifications } = useContext(NotificationContext);
  const [countNotification, setCountNotification] = useState();
  const countNotificationRef = useRef(countNotification);
  useEffect(() => {
    if (notifications) {
      const unreadMessages = notifications.filter(message => message.read === false);
      const numUnreadMessages = unreadMessages.length;
      if (countNotificationRef.current === 0 && numUnreadMessages > 0) {
        ToastInfo(unreadMessages[unreadMessages.length - 1].title)
      }
      setCountNotification(numUnreadMessages);
      countNotificationRef.current = numUnreadMessages;
    }
  }, [notifications]);

  const dropRef = useRef();
  useOnClickOutside(dropRef, handleClickOutside);

  function handleClickOutside() {
    handleClose();
  }

  const items = [
    {
      label: (
        <div onClick={() => navigate('/field/3')} target="_blank" rel="noopener noreferrer" >
          Phiên Dịch Viên Hàn - Việt
        </div>
      ),
      key: '3',
    },
    {
      label: (
        <div onClick={() => navigate('/field/1')} target="_blank" rel="noopener noreferrer" >
          Phiên Dịch Viên Anh - Việt
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div onClick={() => navigate('/field/2')} target="_blank" rel="noopener noreferrer" >
          Phiên Dịch Viên Trung - Việt
        </div>
      ),
      key: '2',
    },
  ];

  const fetchDataFields = async (Keyword) => {
    const response = await CategoriesFactories.getListCategories(Keyword);
    // const itemsList = response.map((item, index) => {
    //   return {
    //     label: (
    //       <Link key={index} to={`/field/${item.id}`} target="_blank" rel="noopener noreferrer">
    //         {item.name}
    //       </Link>
    //     ),
    //     key: item.id,
    //   };
    // });
    // Thêm các mục từ itemsList vào mảng items
    // const updatedItems = items.concat(itemsList);
    // Cập nhật state fields với các mục đã được thêm vào
    // setFields(updatedItems);
  };

  const [countMes, setCountMes] = useState();
  const { messengerList } = useContext(MessageContext);
  const countMesRef = useRef(countMes);

  useEffect(() => {
    if (messengerList) {
      const unreadMessages = messengerList.filter(message => {
        return (parseInt(message?.userSendId) !== parseInt(user?.id) && message.read === false)
      })
      const numUnreadMessages = unreadMessages.length;
      // if (countMesRef.current === 0 && numUnreadMessages > 0) {
      //   ToastInfo(unreadMessages[unreadMessages.length - 1].lastMessage unreadMessages[unreadMessages.length - 1].lastMessage)
      // }
      setCountMes(numUnreadMessages);
      countMesRef.current = numUnreadMessages;
    }
  }, [messengerList]);

  const navigator = useNavigate()
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    fetchDataFields()
  }, [])
  return (
    <div className="header shadow">
      <div className="header__icon">
        <Link to="/" className="icon_box flex flex-row  gap-3">
          <div >
            <img
              className="icon-logo text-center align-middle "
              src={logo}
            />
          </div>
          <span className="text-2xl font-bold  text-black">HINT</span>
        </Link>
        <div className="flex flex-row gap-5 justify-center items-center">
          <Link to={'/'} className="hover:text-[#7733ff] text-xl font-bold border-b-[transparent] hover:border-b-2 hover:border-[#7733ff]">
            {t('HomePage')}
          </Link>
          <Dropdown menu={{ items }}>
            <Link className="hover:text-[#7733ff] text-xl font-bold border-b-[transparent] hover:border-b-2 hover:border-[#7733ff]">
              {t('all_categories')}
              {/* <DownOutlined className="font-bold" /> */}
            </Link>
          </Dropdown>
          <Link to='/destination' className="hover:text-[#7733ff] text-xl font-bold border-b-[transparent] hover:border-b-2 hover:border-[#7733ff]">
            {t('destination')}
            {/* <DownOutlined className="font-bold" /> */}
          </Link>
          <Link to='/post' className="hover:text-[#7733ff] text-xl font-bold border-b-[transparent] hover:border-b-2 hover:border-[#7733ff]">
            {t('moment')}
          </Link>
        </div>
      </div>



      {/* 
      <div className="header__room">
        <Menu icons={[home, campaign, chat]} />
      </div> */}
      <div className="header__button">


        <SearchModal />
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language}
          placeholder='LA'
          className="w-28"
          onChange={handleChangeTrans}
        >
          <MenuItem value={'en'}>English</MenuItem>
          <MenuItem value={'vi'}>Tiếng Việt</MenuItem>
          <MenuItem value={'ke'}>티엔한</MenuItem>
        </Select>
        {!user && (
          <NotLogin
            loginHandler={loginHandler}
            registerHandler={registerHandler}
          />
        )}
        {user &&
          <>
            {countNotification > 0 ?
              <Badge content={countNotification} shape="circle" color="primary">
                <Notification countNotification={countNotification}
                />
              </Badge>

              : <>
                <Notification countNotification={countNotification}
                />
              </>}
          </>
        }
        {user && (
          <div className="icon-room-guest">
            {countMes > 0 ?
              <Badge content={countMes} shape="circle" color="primary">
                <button
                  onClick={() => navigator('/chat')}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  <MessageOutlined />
                </button>
              </Badge>

              : <>
                <button
                  onClick={() => navigator('/chat')}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  <MessageOutlined />
                </button>
              </>}
          </div>
        )}
        {user && (
          <div className="avata" ref={dropRef}>
            <NavBar role={user?.role} isOpen={isOpen} logOutHandler={logOutHandler}></NavBar>
            <Avatar
              size={40}
              onClick={handleOpen}
              src={
                user?.avatar
              }
            >
              {user?.avatar ? "" : user?.firstName?.charAt(0)?.toUpperCase()}
            </Avatar>
          </div>
        )}
        {isOpenLogin &&
          <Login isModalOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)} />
        }
        {isOpenRes &&
          <Register isModalOpen={isOpenRes} onClose={() => setIsOpenRes(false)} />
        }
      </div>
    </div>
  );
};

export default Header;

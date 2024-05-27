import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDpTeJlncdCdwwUb4l6BGViT4UZ1DgZuo8",
    authDomain: "testdemo-29c75.firebaseapp.com",
    projectId: "testdemo-29c75",
    storageBucket: "testdemo-29c75.appspot.com",
    messagingSenderId: "881083929137",
    appId: "1:881083929137:web:a6fcf6743a6765bb9e7b10"
};

// firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyDvPZ-ME9NtX5STf9re9HV9cybfSYrpFp4",
//     authDomain: "hint-20c72.firebaseapp.com",
//     projectId: "hint-20c72",
//     storageBucket: "hint-20c72.appspot.com",
//     messagingSenderId: "492885275134",
//     appId: "1:492885275134:web:373b00370c9754af1410af",
//     measurementId: "G-ZQG00BZJSW"
// };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export const requestPermission = () => {
    Notification.requestPermission()?.then(permission => {
        if (permission === "granted") {
            return getToken(messaging, {
                vapidKey:
                    "BEPxT7Jx0dplDmfyXeBOMsaD8NLUmC-pcxQ_PJGgLjLhTLF0g6AqC3DgLT8IU8Fj8sjRQQtbylyRLyv-p-XSpGs",
            })
                ?.then(currentToken => {
                    if (currentToken) {
                        console.log('Client Token: ', currentToken);
                    }
                    else {
                        console.log("Không tạo được token");
                    }
                })
                ?.catch(err => {
                    console.log("Error tạo Token", err);
                });
        } else {
            console.log("Quyền gửi thông báo bị từ chối");
        }
    });
}
// requestPermission();
export const onMessageListener = () => {
    new Promise(resolve => onMessage(messaging, payload => {
        resolve(payload);
    }))
}
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


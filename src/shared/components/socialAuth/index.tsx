import { Icons } from "assets";
import classNames from "classnames";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import TwitterLogin from "react-twitter-auth";
import {
  IResolveParams,
  LoginSocialFacebook,
  LoginSocialGoogle,
} from "reactjs-social-login";
import { setUser } from "shared/redux/reducers/userSlice";
import { SocialLogin, TwitterGetUserInfo } from "shared/services/authService";
import { FacebookAppId, GoogleAPI } from "shared/utils/endpoints";
import { toastMessage } from "../toast";
import styles from "./style.module.scss";

function SocialAuth({ handleClose }: any) {
  const dispatch = useDispatch();
  const [gloading, setGloading] = useState<boolean>(false);
  const [fbloading, setFBloading] = useState<boolean>(false);
  const [twloading, setTwloading] = useState<boolean>(false);

  const onSuccess = async (data: any, provider: string) => {
    let formData = new FormData();
    if (provider === "google") {
      setGloading(true);
      let username = data.email.split("@")[0];
      let trimUsername = username.replace(/\s/g, "") + new Date().getTime();
      formData.append("name", data?.name);
      formData.append("email", data.email);
      formData.append("user_name", trimUsername);
      formData.append("social_network", "0");
      formData.append("social_login_id", data.sub);
      if (data.picture) {
        formData.append("avatar", data.picture);
      }
    } else if (provider === "facebook") {
      setFBloading(true);
      let username = "";
      let trimUsername = "";
      if (data?.email) {
        formData.append("email", data.email);
        username = data.email.split("@")[0];
        trimUsername = username.replace(/\s/g, "") + new Date().getTime();
      } else {
        username = data?.name.toLowerCase();
        trimUsername = username.replace(/\s/g, "") + new Date().getTime();
      }
      formData.append("user_name", trimUsername);
      formData.append("name", data?.first_name + " " + data?.last_name);
      formData.append("social_network", "1");
      formData.append("social_login_id", data.userID);
      if (data.picture) {
        formData.append("avatar", data.picture.data.url);
      }
    } else if (provider === "twitter") {
      setTwloading(true);
      console.log("TW", data);
      if (data?.email) {
        formData.append("email", data.email);
      }
      formData.append("name", data?.first_name + " " + data?.last_name);
      formData.append("social_network", "2");
      formData.append("social_login_id", data.userID);
      if (data.picture) {
        formData.append("avatar", data.picture.data.url);
      }
    }
    SocialLogin(formData)
      .then((res) => {
        let resp = {
          isLoggedIn: true,
          user: res.data.data.user,
          token: res?.data?.data?.user?.token,
        };
        dispatch(setUser(resp));
        handleClose();
        toastMessage("success", "Logged In!");
      })
      .catch((err) => {
        console.log("ERR", err);
        toastMessage("Error", err);
      })
      .finally(() => {
        setGloading(false);
        setFBloading(false);
      });
  };

  const handleTwitterSuccess = async (response: any) => {
    const res = await response.json();
    console.log("Success", res);
    setTwloading(true);
    TwitterGetUserInfo({
      auth_secret: res?.oauth_token_secret,
      auth_token: res?.oauth_token,
    })
      .then((res) => {
        console.log("Res", res?.data);
        let resp = {
          isLoggedIn: true,
          user: res.data.data.user,
          token: res?.data?.data?.user?.token,
        };
        dispatch(setUser(resp));
        handleClose();
        toastMessage("success", "Logged In!");
      })
      .catch((err) => {
        console.log("Error", err?.response?.data?.message);
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        setTwloading(false);
      });
  };

  const handleTwitterFailure = () => {
    toastMessage("Error", "Encountered an error! Try again later");
    setTwloading(false);
  };

  return (
    <div className={classNames("w-100")}>
      {!gloading && !fbloading && !twloading ? (
        <LoginSocialGoogle
          client_id={GoogleAPI}
          scope="openid profile email"
          discoveryDocs="claims_supported"
          cookie_policy="single_host_origin"
          onLoginStart={() => {
            // setGloading(true);
          }}
          onResolve={({ provider, data }: IResolveParams) => {
            onSuccess(data, provider);
          }}
          className="mb-3"
          onReject={(err) => {
            console.log(err);
            setGloading(false);
          }}
        >
          <div
            className={classNames(styles.socialIconContainer)}
            role={"button"}
          >
            <Icons.Google style={{ width: "24px", height: "24px" }} />
            <span className={classNames(styles.socialText, "ms-2")}>
              Continue with Google
            </span>
          </div>
        </LoginSocialGoogle>
      ) : gloading ? (
        <div
          className={classNames(styles.socialIconContainer, "mb-3")}
          role={"button"}
        >
          <Spinner size="sm" animation="border" style={{ color: "#0f1106" }} />
        </div>
      ) : (
        <div
          className={classNames(styles.socialIconContainer, "mb-3")}
          role={"button"}
        >
          <Icons.Google style={{ width: "24px", height: "24" }} />
          <span className={classNames(styles.socialText, "ms-2")}>
            Continue with Google
          </span>
        </div>
      )}

      {!fbloading && !gloading && !twloading ? (
        <LoginSocialFacebook
          appId={FacebookAppId}
          onLoginStart={() => {
            // setFBloading(true);
          }}
          className="mb-3"
          fieldsProfile={
            "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender"
          }
          onResolve={({ provider, data }: IResolveParams) => {
            onSuccess(data, provider);
          }}
          onReject={(err) => {
            console.log(err);
            setFBloading(false);
          }}
        >
          <div
            className={classNames(styles.socialIconContainer)}
            role={"button"}
          >
            <Icons.Facebook />
            <span className={classNames(styles.socialText, "ms-2")}>
              Continue with Facebook
            </span>
          </div>
        </LoginSocialFacebook>
      ) : fbloading ? (
        <div
          className={classNames(styles.socialIconContainer, "mb-3")}
          role={"button"}
        >
          <Spinner size="sm" animation="border" style={{ color: "#0f1106" }} />
        </div>
      ) : (
        <div
          className={classNames(styles.socialIconContainer, "mb-3")}
          role={"button"}
        >
          <Icons.Facebook />
          <span className={classNames(styles.socialText, "ms-2")}>
            Continue with Facebook
          </span>
        </div>
      )}
      <TwitterLogin
        className={classNames(styles.twContainer)}
        loginUrl="https://devcp.codingpixels.us/new/jmk/api/auth/twitter/callback"
        onFailure={handleTwitterFailure}
        onSuccess={handleTwitterSuccess}
        requestTokenUrl="https://devcp.codingpixels.us/new/jmk/api/auth/twitter"
      >
        <div className={classNames(styles.socialIconContainer)} role={"button"}>
          {twloading ? (
            <Spinner
              size="sm"
              animation="border"
              style={{ color: "#0f1106" }}
            />
          ) : (
            <>
              <Icons.Twitter />
              <span className={classNames(styles.socialText, "ms-2")}>
                Continue with Twitter
              </span>
            </>
          )}
        </div>
      </TwitterLogin>
    </div>
  );
}

export default SocialAuth;

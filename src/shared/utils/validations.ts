import * as yup from "yup";
const passwordRegExp = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/;
const specialREgex = /^[a-zA-Z0-9äöüÄÖÜ_-]*$/;
const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;

const LoginVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .label("email")
    .email("Invalid Email"),
  password: yup.string().required("Password is Required").label("password"),
});

const SignUpVS = yup.object().shape({
  fullname: yup
    .string()
    .required("Fullname is Required")
    .label("fullname")
    .matches(nameRegex, "Space and Special Characters are not allowed"),
  username: yup
    .string()
    .required("Username is Required")
    .label("username")
    .matches(
      specialREgex,
      "Special Characters are not allowed, use _ or - only"
    ),
  email: yup
    .string()
    .email("Invalid Email")
    .required("Email is Required")
    .label("email"),
  password: yup
    .string()
    .required("Password is Required")
    .min(8, "Password too Short")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const OtpVS = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is Required")
    .min(4, "OTP must be at least 4 characters")
    .label("otp"),
});

const EmailVerifyVS = yup.object().shape({
  name: yup
    .string()
    .required("Name is Required")
    .label("name")
    .matches(nameRegex, "Special Characters are not allowed"),
  email: yup
    .string()
    .required("Email is Required")
    .label("email")
    .email("Invalid Email"),
});

const ResetPasswordVS = yup.object().shape({
  password: yup
    .string()
    .required("Password is Required")
    .min(8, "Password too Short")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const ContactUsVS = yup.object().shape({
  name: yup.string().required("JMK name is Required").label("name"),
  email: yup
    .string()
    .email("Invalid Email")
    .required("Email is Required")
    .label("email"),
  description: yup
    .string()
    // .required("Description is Required")
    .label("desc")
    .test(
      "desc",
      "Description is Required",
      //@ts-ignore
      (val) => {
        if (val) {
          var cont = val.replace(/<[^>]*>/g, " ");
          cont = cont.replace(/\s+/g, " ");
          cont = cont.trim();
          // var n = cont.split(" ").length;
          return cont.length > 0;
        }
      }
    )
    .test(
      "desc",
      "Must not be greater than 255 words",
      //@ts-ignore
      (val) => {
        if (val) {
          var cont = val.replace(/<[^>]*>/g, " ");
          cont = cont.replace(/\s+/g, " ");
          cont = cont.trim();
          var n = cont.split(" ").length;
          return n < 256;
        }
      }
    ),
});

const GuestStoryVS = yup.object().shape({
  name: yup.string().required("JMK name is Required").label("name"),
  email: yup
    .string()
    .email("Invalid Email")
    .required("Email is Required")
    .label("email"),
  title: yup.string().required("Title is Required").label("title"),
  description: yup
    .string()
    // .required("Description is Required")
    .label("desc")
    .test(
      "desc",
      "Description is Required",
      //@ts-ignore
      (val) => {
        if (val) {
          var cont = val.replace(/<[^>]*>/g, " ");
          cont = cont.replace(/\s+/g, " ");
          cont = cont.trim();
          // var n = cont.split(" ").length;
          return cont.length > 0;
        }
      }
    )
    .test(
      "desc",
      "Must not be greater than 500 words",
      //@ts-ignore
      (val) => {
        if (val) {
          var cont = val.replace(/<[^>]*>/g, " ");
          cont = cont.replace(/\s+/g, " ");
          cont = cont.trim();
          var n = cont.split(" ").length;
          return n < 501;
        }
      }
    ),
});
const EditProfileVS = yup.object().shape({
  name: yup
    .string()
    .required("Name is Required")
    .label("name")
    .matches(nameRegex, "Special Characters are not allowed"),
  user_name: yup
    .string()
    .required("Username is Required")
    .label("user_name")
    .matches(specialREgex, "Special Characters are not allowed, use _ only"),
  email: yup
    .string()
    .required("Email is Required")
    .label("email")
    .email("Invalid Email"),
  bio: yup.string().label("bio").max(255),
});

const changePasswordVS = yup.object().shape({
  old_password: yup
    .string()
    .required("Current Password is Required")
    .min(8, "Password too Short"),
  password: yup
    .string()
    .required("Password is Required")
    .min(8, "Password too Short")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  password_confirmation: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const PostStoryVS = yup.object().shape({
  category: yup.string().required("Category is Required").label("category"),
  tags: yup.array().label("tags"),
  headline: yup
    .string()
    .required("Headline is Required")
    .label("headline")
    .max(80, "Must not be greater than 80 characters"),
  desc: yup
    .string()
    // .required("Description is Required")
    .label("desc")
    .test(
      "desc",
      "Description is Required",
      //@ts-ignore
      (val) => {
        if (val) {
          var cont = val.replace(/<[^>]*>/g, " ");
          cont = cont.replace(/\s+/g, " ");
          cont = cont.trim();
          // var n = cont.split(" ").length;
          return cont.length > 0;
        }
      }
    ),
});

export {
  LoginVS,
  SignUpVS,
  OtpVS,
  EmailVerifyVS,
  ResetPasswordVS,
  ContactUsVS,
  EditProfileVS,
  changePasswordVS,
  PostStoryVS,
  GuestStoryVS,
};

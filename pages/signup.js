import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styled, { keyframes } from 'styled-components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { LogoIcon } from '../assets/icons';
import { validateEmail, validatePassword } from '../utils/formValidation';
import { auth } from '../services/firebase-config';
import { db } from '../services/firebase-config';
import { getText } from '../utils/getText';

const MainNav = styled.div`
  font-size: 14px;
  background-color: #f4f4f4;
  padding: 16px;
  text-align: center;

  a {
    text-decoration: none;
    color: inherit;
  }

  span {
    color: #999;
  }
`;

const rotation = keyframes`
  from {
        transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }    
`;

const Div = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;

  p {
    line-height: 1.6;

    .bold {
      font-weight: 600;
    }
  }

  .box {
    border: 1px #eee solid;
    max-width: 500px;
    width: 100%;
    background-color: white;
    padding: 32px;
    margin: auto;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);

    .title {
      margin-top: 16px;
      text-align: center;

      .icon {
        filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.2));
      }
    }

    .server {
      border: 1px #ff4646 solid;
      color: #ff4646;
      border-radius: 6px;
      font-size: 14px;
      padding: 13px;
      margin-top: 24px;
      text-align: center;
    }

    .form {
      margin-top: 32px;
      font-size: 14px;

      .form-control {
        margin-bottom: 20px;

        input {
          display: block;
          font: inherit;
          color: inherit;
          width: 100%;
          padding: 13px 16px;
          outline: none;
          border: 1px #ccc solid;
          border-radius: 6px;

          &::placeholder {
            color: #aaa;
          }

          &:focus {
            border-color: #4a00e0;
          }
        }

        .hint {
          font-size: 13px;
          margin-top: 2px;
          margin-left: 4px;
          color: #ff4646;
          display: none;
        }

        &.error {
          input {
            border-color: #ff4646;
          }

          .hint {
            display: block;
          }
        }
      }

      button {
        font: inherit;
        background: #8e2de2;
        background: -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
        background: linear-gradient(to right, #8e2de2, #4a00e0);
        color: white;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 45px;
        outline: none;
        cursor: pointer;
        border: none;
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        .loader {
          width: 18px;
          height: 18px;
          border: 2px solid #fff;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: block;
          animation: ${rotation} 1s linear infinite;
        }
      }
    }

    .info {
      margin-top: 32px;
      margin-bottom: 16px;
      text-align: center;
      font-size: 14px;

      a {
        text-decoration: none;
        color: #4a00e0;

        @media (hover: hover) {
          &:hover {
            text-decoration: underline;
          }
        }

        @media (hover: none) {
          &:active {
            text-decoration: underline;
          }
        }
      }
    }
  }

  @media (max-width: 640px) {
    .box {
      border: none;
      box-shadow: none;
      padding: 16px;
    }
  }
`;

const SignUp = () => {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [startNameValidation, setStartNameValidation] = useState(false);
  const [startPhoneValidation, setStartPhoneValidation] = useState(false);
  const [startEmailValidation, setStartEmailValidation] = useState(false);
  const [startPasswordValidation, setStartPasswordValidation] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  if (user) {
    router.replace('/');
  }

  const isNameValid = nameInput.length !== 0;
  const isPhoneValid = phoneInput.length !== 0;
  const isEmailValid = emailInput.length !== 0 && validateEmail(emailInput);
  const isPasswordValid =
    passwordInput.length !== 0 && validatePassword(passwordInput);

  const nameInputHandler = (ev) => {
    setServerErrorMessage('');
    setNameInput(ev.target.value);
  };

  const phoneInputHandler = (ev) => {
    setServerErrorMessage('');
    setPhoneInput(ev.target.value);
  };

  const emailInputHandler = (ev) => {
    setServerErrorMessage('');
    setEmailInput(ev.target.value);
  };

  const passwordInputHandler = (ev) => {
    setServerErrorMessage('');
    setPasswordInput(ev.target.value);
  };

  const submitHandler = (ev) => {
    ev.preventDefault();

    setStartNameValidation(true);
    setStartPhoneValidation(true);
    setStartEmailValidation(true);
    setStartPasswordValidation(true);

    if (isNameValid && isPhoneValid && isEmailValid && isPasswordValid && !serverErrorMessage) {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          setDoc(doc(db, uid, 'account'), {
            name: nameInput,
            email: emailInput,
            phone: phoneInput,
          })
            .then(() => {
              setDoc(doc(db, uid, 'wishlist'), {
                items: [],
              }).then(() => {
                setDoc(doc(db, uid, 'cart'), {
                  items: [],
                });
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;

          if (errorCode === 'auth/email-already-in-use') {
            setServerErrorMessage('Email address already in use.');
          } else {
            setServerErrorMessage('Something went wrong.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const texts = getText('es');

  return (
    <>
      <Head>
        <title>{texts.signup.title}</title>
      </Head>
      <MainNav>
        <Link href="/">{texts.home.title}</Link> / <span>{texts.signup.title}</span>
      </MainNav>
      <Div>
        {user ? (
          <>
            <p>
              Haz iniciado sesión como <span className="bold">{user.email}</span>.
              Serás redirigdo.
            </p>
          </>
        ) : (
          <>
            <div className="box">
              <div className="title">
                <LogoIcon />
              </div>
              {serverErrorMessage && (
                <div className="server">{serverErrorMessage}</div>
              )}
              <form className="form" onSubmit={submitHandler}>
                <div
                  className={`form-control ${
                    startNameValidation ? (isNameValid ? '' : 'error') : ''
                  }`}
                >
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={texts.signup.name}
                    value={nameInput}
                    onChange={nameInputHandler}
                    onBlur={() => setStartNameValidation(false)}
                  />
                  <span className="hint">{texts.signup.invalid_name}</span>
                </div>
                <div
                  className={`form-control ${
                    startPhoneValidation ? (isPhoneValid ? '' : 'error') : ''
                  }`}
                >
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}"
                    placeholder={texts.signup.tel}
                    value={phoneInput}
                    onChange={phoneInputHandler}
                    onBlur={() => setStartPhoneValidation(false)}
                  />
                  <small>Formato: 0261-591-5718</small>
                  <span className="hint">{texts.signup.invalid_name}</span>
                </div>
                <div
                  className={`form-control ${
                    startEmailValidation ? (isEmailValid ? '' : 'error') : ''
                  }`}
                >
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={texts.signup.email}
                    value={emailInput}
                    onChange={emailInputHandler}
                    onBlur={() => setStartEmailValidation(false)}
                  />
                  <span className="hint">{`${
                    startEmailValidation
                      ? emailInput.length === 0
                        ? texts.signup.required_email
                        : !validateEmail(emailInput)
                        ? texts.signup.invalid_email
                        : ''
                      : ''
                  }`}</span>
                </div>
                <div
                  className={`form-control ${
                    startPasswordValidation
                      ? isPasswordValid
                        ? ''
                        : 'error'
                      : ''
                  }`}
                >
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder={texts.signup.password}
                    value={passwordInput}
                    onChange={passwordInputHandler}
                    onBlur={() => setStartPasswordValidation(false)}
                  />
                  <span className="hint">{`${
                    startPasswordValidation
                      ? passwordInput.length === 0
                        ? texts.signup.required_password
                        : !validatePassword(passwordInput)
                        ? texts.signup.invalid_password
                        : ''
                      : ''
                  }`}</span>
                </div>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? <span className="loader"></span> : 'Sign Up'}
                </button>
              </form>
              <p className="info">
                {texts.signup.signin_q} <Link href="/signin">Iniciar Sesión</Link>
              </p>
            </div>
          </>
        )}
      </Div>
    </>
  );
};

export default SignUp;

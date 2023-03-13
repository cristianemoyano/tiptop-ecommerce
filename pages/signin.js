import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styled, { keyframes } from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { LogoIcon } from '../assets/icons';
import { validateEmail, validatePassword } from '../utils/formValidation';
import { auth } from '../services/firebase-config';
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
    text-align: center;

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
        border-radius: 6px;
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
        padding: 14px 28px;
        border: none;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
    }

    .loader {
      width: 18px;
      height: 18px;
      border: 2px solid #fff;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: block;
      animation: ${rotation} 1s linear infinite;

      &.small {
        margin-left: 8px;
        width: 14px;
        height: 14px;
        border: 1.5px solid #4a00e0;
        border-bottom-color: transparent;
      }
    }

    .ext {
      margin-top: 32px;
      display: flex;
      justify-content: center;
      align-items: center;

      button {
        font: inherit;
        font-size: 14px;
        border: none;
        outline: none;
        background-color: white;
        color: #4a00e0;
        cursor: pointer;

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

        .icon {
          margin-left: 3px;
          width: 18px;
          height: 18px;
        }
      }
    }

    .info {
      margin-top: 24px;
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

const SignIn = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [startEmailValidation, setStartEmailValidation] = useState(false);
  const [startPasswordValidation, setStartPasswordValidation] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const isEmailValid = emailInput.length !== 0 && validateEmail(emailInput);
  const isPasswordValid =
    passwordInput.length !== 0 && validatePassword(passwordInput);

  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  if (user) {
    router.replace('/collections');
  }

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

    setStartEmailValidation(true);
    setStartPasswordValidation(true);

    if (isEmailValid && isPasswordValid && !serverErrorMessage) {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then((user) => {})
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);

          if (errorCode === 'auth/user-not-found') {
            setServerErrorMessage("Usuario no encontrado");
          } else if (errorCode === 'auth/wrong-password') {
            setServerErrorMessage('Usuario/Contraseña inválida.');
          } else {
            setServerErrorMessage('Ups! Algo salió mal.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const signInAsGuestHandler = () => {
    setIsGuestLoading(true);
    signInWithEmailAndPassword(auth, 'lovelyguest@fakemail.com', 'lovelyguest')
      .then((user) => {})
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);

        if (errorCode === 'auth/user-not-found') {
          setServerErrorMessage("Usuario no encontrado");
        } else if (errorCode === 'auth/wrong-password') {
          setServerErrorMessage('Usuario/Contraseña inválida.');
        } else {
          setServerErrorMessage('Ups! Algo salió mal.');
        }
      })
      .finally(() => {
        setIsGuestLoading(false);
      });
  };

  const texts = getText('es');

  return (
    <>
      <Head>
        <title>{texts.signin.title}</title>
      </Head>
      <MainNav>
        <Link href="/">{texts.home.title}</Link> / <span>{texts.signin.title}</span>
      </MainNav>
      <Div>
        {user ? (
          <>
            <p>
              Haz iniciado sesión con <span className="bold">{user.email}</span>.
              Estás siendo redireccionado a la página principal.
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
                    startEmailValidation ? (isEmailValid ? '' : 'error') : ''
                  }`}
                >
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={texts.signin.email}
                    value={emailInput}
                    onChange={emailInputHandler}
                    onBlur={() => setStartEmailValidation(false)}
                  />
                  <span className="hint">{`${
                    startEmailValidation
                      ? emailInput.length === 0
                        ? texts.signin.required_email
                        : !validateEmail(emailInput)
                        ? texts.signin.invalid_email
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
                    placeholder={texts.signin.password}
                    value={passwordInput}
                    onChange={passwordInputHandler}
                    onBlur={() => setStartPasswordValidation(false)}
                  />
                  <span className="hint">{`${
                    startPasswordValidation
                      ? passwordInput.length === 0
                        ? texts.signin.required_password
                        : !validatePassword(passwordInput)
                        ? texts.signin.invalid_password
                        : ''
                      : ''
                  }`}</span>
                </div>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? <span className="loader"></span> : texts.signin.title}
                </button>
              </form>
              <div className="ext">
                {/* <button
                  type="button"
                  disabled={isGuestLoading}
                  onClick={signInAsGuestHandler}
                >
                  Continue as Guest
                </button> */}
                {isGuestLoading && <span className="loader small"></span>}
              </div>
              <p className="info">
              {texts.signin.signup_q} <Link href="/signup">{texts.signin.signup}</Link>
              </p>
            </div>
          </>
        )}
      </Div>
    </>
  );
};

export default SignIn;

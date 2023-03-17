import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { useSelector } from 'react-redux';
import OutsideClickHandler from 'react-outside-click-handler';
import { useRouter } from 'next/router';
import { getText } from '../utils/getText';
import loadProducts from '../utils/loadProducts'

import { doc, getDoc } from 'firebase/firestore';

import { db } from '../services/firebase-config';

const Div = styled.div`
  border: 1px #eee solid;
  background-color: white;
  padding: 6px 0;
  border-radius: 6px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  position: absolute;
  top: calc(100% + 3px);
  right: -6px;
  z-index: 10;
  font-size: 14px;
  width: 250px;

  .load-product {
    color: red;
  }

  .special {
    padding: 8px 58px 8px 16px;

    p:first-child {
      font-weight: 600;
    }

    p:nth-child(2) {
      margin-top: 4px;
    }

    .sign {
      display: inline-block;
      border: 1px #4a00e0 solid;
      border-radius: 6px;
      color: #4a00e0;
      padding: 4px 12px;
      margin: 10px 0 6px 0;
      cursor: pointer;
    }
  }

  .divider {
    border-bottom: 1px #eee solid;
    margin: 6px 0;
  }

  .item {
    padding: 8px 16px;
    cursor: pointer;

    &:active {
      background-color: #f4f4f4;
    }
  }
`;

const Menu = ({ onClose, onSignOut }) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [account, setAccount] = useState();



  useEffect(() => {

    if (user) {
      getDoc(doc(db, user.uid, 'account')).then(
        (value) => {
          setAccount(value.data());
        }
      )
    }
   

  }, []);

  const signInHandler = () => {
    router.push('/signin');
    onClose();
  };

  const myOrdersHandler = () => {
    router.push('/orders');
    onClose();
  };

  const collectionsHandler = () => {
    router.push('/');
    onClose();
  };

  const wishlistHandler = () => {
    router.push('/wishlist');
    onClose();
  };

  const cartHandler = () => {
    router.push('/cart');
    onClose();
  };

  const loadHandler = () => {
    loadProducts();
  }

  const texts = getText('es');


  return (
    <Div>
      <OutsideClickHandler onOutsideClick={onClose}>
        <div className="special">
          {user ? (
            <>
              <p>{texts.menu.hello}</p>
              <p>{user.email}</p>
            </>
          ) : (
            <>
              <p>{texts.menu.welcome}</p>
              <div className="sign" onClick={signInHandler}>
              {texts.menu.login}
              </div>
            </>
          )}
        </div>
        <div className="divider"></div>
        {user && account?.isAdmin ? (
        <div className='item load-product' onClick={loadHandler}>
          Cargar productos
        </div>
        ) : ''}
        <div className="item" onClick={myOrdersHandler}>
        {texts.menu.orders}
        </div>
        <div className="item" onClick={collectionsHandler}>
        {texts.menu.collections}
        </div>
        <div className="item" onClick={wishlistHandler}>
        {texts.menu.wishlist}
        </div>
        <div className="item" onClick={cartHandler}>
        {texts.menu.cart}
        </div>
        <div className="divider"></div>
        {user && (
          <div className="item" onClick={onSignOut}>
             {texts.menu.logout}
          </div>
        )}
      </OutsideClickHandler>
    </Div>
  );
};

export default Menu;

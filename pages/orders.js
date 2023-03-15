import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';

import { useSelector } from 'react-redux';
import MyOrderItemCard from '../components/MyOrderItemCard';

import getMyOrders from '../utils/getMyOrders'

import Alias from '../components/Alias';
import { getText } from '../utils/getText';

const fade = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  5% {
    opacity: 1;
    transform: scale(1);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
  60% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`;

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

const Div = styled.div`
flex: 1;
  display: flex;
  padding: 16px;

  .title {
    font-size: 18px;
    font-weight: 500;

    span {
      font-size: 16px;
      font-weight: 400;
    }
  }

  .orders {
    margin: 16px 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;


const Orders = () => {

  const [myOrders, setMyOrders] = useState([]);

  const user = useSelector((state) => state.auth.user);
 
  useEffect(() => {

    const onGetMyOrders = (myOrders) => {
      setMyOrders(myOrders)
    }
  
    getMyOrders(user, onGetMyOrders)
   
  }, []);

  const texts = getText('es')

  return (
    <>
      <Head>
        <title>{texts.orders.title}</title>
      </Head>
      <MainNav>
        <Link href="/">{texts.home.title}</Link> / <span>{texts.orders.title}</span>
      </MainNav>
      <Alias/>
      {myOrders.map((order)=>{
        return (
          order.id
        )
      })}
      <Div>
      <div className='orders'>
      {myOrders.map((order, index) => (
        <MyOrderItemCard
        key={index}
        {...order}
      />
      ))}
      </div>
      </Div>

    </>
  );
};

export default Orders;

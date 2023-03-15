import styled from 'styled-components';

import { getFormattedCurrency, CURRENCY } from '../utils/getFormattedCurrency';

import ItemCard from './ItemCard'


const Div = styled.div`
  flex: 1;
  display: flex;
  font-size: 14px;
  border: 1px #eee solid;

  .item {
    position: relative;

    .delete {
      border: 1px #ddd solid;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2px;
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 5;
      background-color: #f4f4f4;
      color: #888;
      cursor: pointer;

      .icon {
        width: 16px;
        height: 16px;
        stroke-width: 2px;
      }
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .info {
      padding: 8px;

      .brand {
        font-weight: 500;
      }

      .name {
        color: #777;
        margin: 8px 0;
      }


    }
  }
  
  .detail {
    margin: 16px 8px;
    font-weight: 500;
  }

  .items {

    margin: 16px 8px;
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

const MyOrderItemCard = ({
  totalPrice,
  createdAt,
  items,
  uid,
  oid,

}) => {


  return (
    <>
      <Div>
        <div className="item">
          <div className="info">
            <div className="brand">Pedido ID#: {oid}</div>
            <div className="name">Internal ID#: {uid}</div>
            <div className="name">Fecha: {createdAt}</div>
            <div className="amount">Total: {`${CURRENCY} ${getFormattedCurrency(
              totalPrice
            )}`}</div>
          </div>
          <span className="detail">Detalle:</span>
          <div className='items'>
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                setPriority={index < 8}
                {...item}
                id={item.id}
                imageURL={item.imageURL}
                brand={item.brand}
                name={item.name}
                amount={item.amount}
                stock={false}
                imageResponsive={false}
                imgWidth={90}
                imgHeight={100}
              />
            ))}
          </div>
        </div>
      </Div>
    </>
  );
};

export default MyOrderItemCard;

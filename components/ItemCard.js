import Image from 'next/image';
import styled from 'styled-components';
import { getFormattedCurrency, CURRENCY } from '../utils/getFormattedCurrency';

import BetterLink from './BetterLink';

const Div = styled.div`
  border: 1px #eee solid;
  font-size: 14px;

  a {
    text-decoration: none;
    color: inherit;
  }

  .condition {
    background: #deeeff;
    width: 70px;
    text-align: center;
    padding: 5px;
    font-weight: 50;
    margin: 10px 0px 0px 0px;
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

    .amount {
      font-weight: 500;
    }
  }
`;

const ItemCard = ({ id, imageURL, brand, name, amount, setPriority, stock, sizes, color, condition, imageResponsive=true, imgWidth=220, imgHeight=275 }) => {
  return (
    <Div>
      <BetterLink href={`/collections/${id}`}>
        <Image
          src={imageURL}
          width={imgWidth}
          height={imgHeight}
          layout={imageResponsive? 'responsive' : ''}
          priority={setPriority}
          alt={name}
        />
        <div className="info">
          <div className="brand">{brand}</div>
          <div className='condition'> {String(condition).toLowerCase()}</div>
          <div className="name">{name}</div>
          {stock ? (
            <div className="name">Stock: {stock} · Talle: {sizes} · Color: {color}</div>
          ) : ''}
          <div className="amount">{`${CURRENCY} ${getFormattedCurrency(amount)}`}</div>
        </div>
      </BetterLink>
    </Div>
  );
};

export default ItemCard;

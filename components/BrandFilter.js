import styled from 'styled-components';
import { getText } from '../utils/getText';

import CheckBox from './CheckBox';

const Div = styled.div`
  margin-top: 12px;

  .heading {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
  }

  .item {
    display: flex;
    align-items: flex-start;
    margin: 8px 0;

    .text {
      margin: 0;
      padding: 0;
      font-size: 14px;

    }
  }

  @media (max-width: 640px) {
    margin-top: 0;
    margin-right: 32px;

    .item {
      margin: 16px 0;
    }
  }
`;

const BrandFilter = ({ items }) => {
  const texts = getText('es')
  return (
    <Div>
      <div className="heading">{texts.products.brand}</div>
      {items
        .sort((a, b) => a.localeCompare(b))
        .map((value, index) => (
          <div className="item" key={index}>
            <CheckBox of={value} type="brand" />
            <span className="text">{value}</span>
          </div>
        ))}
    </Div>
  );
};

export default BrandFilter;

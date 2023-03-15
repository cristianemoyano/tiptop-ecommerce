import { useState } from 'react';
import styled from 'styled-components';

import { SortIcon } from '../assets/icons';
import Modal from './Modal';
import SortBy from './SortBy';

const Button = styled.button`
  background-color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  margin-right: 8px;
  cursor: pointer;
  width: 140px;
`;

const ModalDiv = styled.div`
  padding: 16px 20px 16px 16px;

  .title {
    color: #4a00e0;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  .items {
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .text {
        margin: 0;
        padding: 0;
        font-size: 14px;
      }
    }
  }
`;

const SmallSort = () => {
  const [showSort, setShowSort] = useState(false);

  const openSortHandler = () => {
    setShowSort(true);
  };

  const closeSortHander = () => {
    setShowSort(false);
  };

  return (
    <>
      <Button onClick={openSortHandler}>
        <SortIcon />
      </Button>
      {showSort && (
        <Modal closeHandler={closeSortHander}>
          <ModalDiv>
            <div className="title">Sort by</div>
            <SortBy />
          </ModalDiv>
        </Modal>
      )}
    </>
  );
};

export default SmallSort;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { filterActions } from '../store/filterSlice';
import { CheckIcon } from '../assets/icons';

const Button = styled.button`
  flex-shrink: 0;
  width: 20px !important;
  height: 20px !important;
  border: 1px #bbb solid;
  border-radius: 50%;
  background-color: gray;
  margin-right: 8px;
  cursor: pointer;

  &.checked {
    border-color: #4a00e0;
    border-width: 5px;
    border-color: #4a00e0;
    background-color: #4a00e0;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      stroke-width: 3;
    }
  }
`;

const RoundBox = ({ of }) => {
  const filters = useSelector((state) => state.filter);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (filters.sort === of) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [filters.sort]);

  const clickHandler = () => {
    dispatch(filterActions.chooseSort(of));
    setIsChecked(true);
  };

  return isChecked ? (
    <Button className="checked" onClick={clickHandler}>
      <CheckIcon />
    </Button>
  ) : (
    <Button onClick={clickHandler}></Button>
  );
};

export default RoundBox;

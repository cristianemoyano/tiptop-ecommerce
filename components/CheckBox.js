import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { CheckIcon } from '../assets/icons';
import { filterActions } from '../store/filterSlice';

const Button = styled.button`
  flex-shrink: 0;
  width: 15px !important;
  height: 18px !important;
  border: 1px #bbb solid;
  border-color: #4a00e0;
  border-radius: 2px;
  margin-right: 8px;
  cursor: pointer;
  color: black;

  &.checked {
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

const CheckBox = ({ of, type }) => {
  const filters = useSelector((state) => state.filter);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (type === 'brand') {
      if (filters.brands.includes(of)) {
        setIsChecked(true);
      }
    } else if (type === 'category') {
      if (filters.categories.includes(of)) {
        setIsChecked(true);
      }
    }
  }, []);

  const clickHandler = () => {
    if (isChecked) {
      if (type === 'brand') {
        dispatch(filterActions.deselectBrand(of));
      } else if (type === 'category') {
        dispatch(filterActions.deselectCategory(of));
      }
    } else {
      if (type === 'brand') {
        dispatch(filterActions.selectBrand(of));
      } else if (type === 'category') {
        dispatch(filterActions.selectCategory(of));
      }
    }

    setIsChecked((prevValue) => !prevValue);
  };

  return isChecked ? (
    <Button className="checked" onClick={clickHandler}>
      <CheckIcon />
    </Button>
  ) : (
    <Button onClick={clickHandler}></Button>
  );
};

export default CheckBox;

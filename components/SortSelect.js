import Select from 'react-select';
import { useDispatch } from 'react-redux';

import { filterActions } from '../store/filterSlice';
import { getText } from '../utils/getText';

const texts = getText('es')

const options = [
  { value: 'default', label: texts.products.default },
  { value: 'price_high_to_low', label: texts.products.price_high_to_low },
  { value: 'price_low_to_high', label: texts.products.price_low_to_high },
];

const customStyles = {
  container: (provided) => ({
    ...provided,
    fontSize: '14px',
  }),
  control: (provided) => ({
    ...provided,
    width: '180px',
    border: '1px #ddd solid',
    boxShadow: 'none',
    '&:hover': {},
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    border: '1px #ddd solid',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.05)',
  }),
  option: (provided, state) => ({
    ...provided,
    border: 'none',
    backgroundColor: state.isSelected ? '#4a00e0' : 'white',
    cursor: 'pointer',
    ':active': {
      ...provided[':active'],
      backgroundColor: state.isSelected ? '#4a00e0' : '#f4f4f4',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#bbb',
  }),
};

const SortSelect = () => {
  const dispatch = useDispatch();

  const changeHandler = (selectedOption) => {
    dispatch(filterActions.chooseSort(selectedOption.value));
  };

  return (
    <Select
      blurInputOnSelect
      defaultValue={options[0]}
      instanceId="sort-select"
      isSearchable={false}
      onChange={changeHandler}
      options={options}
      placeholder="Sort by"
      styles={customStyles}
    />
  );
};

export default SortSelect;

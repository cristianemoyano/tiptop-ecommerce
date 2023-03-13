const SizePickerForBottoms = ({ currentSize, onSetSize, sizes }) => {

  const sizeComponent = sizes.map((value, index) => (
    <button
    className={currentSize === value ? 'active' : ''}
    onClick={() => onSetSize(value)}
    key={index}
  >
    {value}
  </button>
  ));

  return (
    <>
      {sizeComponent}
    </>
  );
};

export default SizePickerForBottoms;

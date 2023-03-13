const QuantityPicker = ({ currentQuantity, onSetQuantity }) => {

  const quantities = ['1']

  const quantitiesComponent = quantities.map((value, index)=>{
    return (
      <button
      className={currentQuantity === value ? 'active' : ''}
      onClick={() => onSetQuantity(value)}
      key={index}
    >
      {value}
    </button>
    )
  })

  return (
    <>
      {quantitiesComponent}
    </>
  );
};

export default QuantityPicker;

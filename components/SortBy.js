import { getText } from '../utils/getText';
import RoundBox from './RoundBox';

const SortBy = () => {
  const texts = getText('es')
  return (
    <div className="items">
      <div className="item">
        <RoundBox of="default" />
        <span className="text">{texts.products.default}</span>
      </div>
      <div className="item">
        <RoundBox of="price_high_to_low" />
        <span className="text">{texts.products.price_high_to_low}</span>
      </div>
      <div className="item">
        <RoundBox of="price_low_to_high" />
        <span className="text">{texts.products.price_low_to_high}</span>
      </div>
    </div>
  );
};

export default SortBy;

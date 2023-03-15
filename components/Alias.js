import styled from 'styled-components';

import { getText } from '../utils/getText';

const Div = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .text {
    margin-top: 4px;
  }

  .alias {
    border: 3px #4a00e0 solid;
    margin-top: 8px;
    background: #eee;
    padding: 10px;
    border-radius: 5%;
    font-size: 24px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }

  .warn {
    color: #4a00e0;
    font-size: 18px;
    text-align: center;
    padding: 5px;
  }

`;

const Alias = () => {

    const texts = getText('es');
    return (
        <Div>
            <p className="warn">{texts.cart.thanks}</p>
            <p className="text">Alias:</p>
            <p className="alias">{process.env.NEXT_PUBLIC_ALIAS}</p>
        </Div>
    );
};

export default Alias;

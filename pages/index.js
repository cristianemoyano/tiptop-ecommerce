import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import BrandFilter from '../components/BrandFilter';
import CategoryFilter from '../components/CategoryFilter';
import ItemCard from '../components/ItemCard';
import SortSelect from '../components/SortSelect';

import SmallSort from '../components/SmallSort';
import SmallFilter from '../components/SmallFilter';
import EmptyResults from '../components/EmptyResults';

import { getText } from '../utils/getText';
import getProductsPaginated from '../utils/hooks/pagination'

const MainNav = styled.div`
  font-size: 14px;
  background-color: #f4f4f4;
  padding: 16px;
  text-align: center;

  a {
    text-decoration: none;
    color: inherit;
  }

  span {
    color: #999;
  }
`;

const rotation = keyframes`
  from {
        transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }    
`;

const Div = styled.div`
  flex: 1;
  display: flex;

  .aside {
    width: 300px;
    padding: 16px;

    .title {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .fixedElement {
    border-style: dotted;
   border-width: 2px;
   border-color: #ccc;
    height: 80vh;
    width: 25vh;
    padding: 0 30px 0 10px;
    overflow-y: scroll;
    overflow: auto;
    position: fixed;
    z-index:100;

}

  .main {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;

    .top {
      display: flex;

      .title {
        font-size: 18px;
        font-weight: 500;
        margin-right: auto;
      }
    }

    .clothes {
      margin: 16px 0;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    button {
      font: inherit;
      font-weight: 500;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      outline: none;
      cursor: pointer;
      border: none;
      width: 140px;
      height: 48px;
    }

    .load-more {
      width: 240px;
      background-color: #8e2de2;
      color:#fff !important;
      padding:5px 10px;
      border-radius:4px;
      font-size:20px;
      margin:50px 0;
      display:inline-block;
      background: -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
      background: linear-gradient(to right, #8e2de2, #4a00e0);
      color: white;
      margin-left: 16px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

      .loader {
        width: 18px;
        height: 18px;
        border: 2px solid #fff;
        border-bottom-color: transparent;
        border-radius: 50%;
        margin: 0px 50px;
        display: block;
        animation: ${rotation} 1s linear infinite;
      }
    }

    .load-disabled {
      width: 240px;
      background-color: gray;
      color:#fff !important;
      padding:5px 10px;
      border-radius:4px;
      font-size:20px;
      margin:50px 0;
      display:inline-block;
      color: white;
      margin-left: 16px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .load-more:hover{
      background-color:blue;
      text-decoration:none;
    }

    .center {
      text-align: center;
    }
  }

  @media (max-width: 1024px) {
    .main {
      .clothes {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  @media (max-width: 768px) {
    .main {
      .clothes {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  @media (max-width: 640px) {
    .main {
      .top {
        align-items: center;

        .sort-filter {
          display: flex;
        }
      }

      .clothes {
        margin-bottom: 0;
      }
    }
  }
`;

const Products = ({ }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const filteredBrands = useSelector((state) => state.filter.brands);
  const filteredCategories = useSelector((state) => state.filter.categories);
  const filteredSort = useSelector((state) => state.filter.sort);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndPagination, setEndPagination] = useState(false);

  const [lastProduct, setLastProduct] = useState(null);
  const [productsPaginated, setProductsPaginated] = useState([]);

  // const products = useSelector((state) => state.products.items);
  const brands = getBrands(productsPaginated);
  const categories = getCategories(productsPaginated);

  const texts = getText('es');

  let filteredClothes;

  filteredClothes =
    filteredBrands.length > 0
      ? [...productsPaginated].filter((value) => filteredBrands.includes(value.brand))
      : [...productsPaginated];

  filteredClothes =
    filteredCategories.length > 0
      ? filteredClothes.filter((value) =>
        filteredCategories.includes(value.category)
      )
      : filteredClothes;

  if (filteredSort === 'price_high_to_low') {
    filteredClothes = filteredClothes.sort((a, b) => +b.amount - +a.amount);
  } else if (filteredSort === 'price_low_to_high') {
    filteredClothes = filteredClothes.sort((a, b) => +a.amount - +b.amount);
  }

  const onGetProducts = (newProducts, last) => {
    if (newProducts && last) {
      setLastProduct(last);
      setProductsPaginated([...productsPaginated, ...newProducts]);
    } else {
      setEndPagination(true)
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);

    setIsLoading(true)
    getProductsPaginated(lastProduct, onGetProducts);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };


  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    getProductsPaginated(lastProduct, onGetProducts);
  };

  const ProductsComponent = () => {
    if (filteredClothes.length > 0) {
      return (
        <div>
          <div className="clothes">
            {filteredClothes.map((item, index) => (
              <ItemCard key={item.id} {...item} setPriority={index < 8} />
            ))}
          </div>
          <div className='center'>
            <button className={isEndPagination ? 'load-disabled' : 'load-more'} onClick={handleLoadMore} disabled={isEndPagination}>
              {isLoading ? (<><span className="loader"></span></>) : 'Cargar más productos'}
            </button>
          </div>
        </div>
      )

    } else {
      return (
        <EmptyResults />
      )
    }
  }

  return (
    <>
      <Head>
        <title>{texts.products.collections}</title>
      </Head>
      <MainNav>
        <Link href="/">{texts.products.home}</Link> / <span>{texts.products.collections}</span>
      </MainNav>
      <Div>
        {width > 640 && (
          <aside className="aside">
            <div className='fixedElement'>
              <div className="title">{texts.products.filters}</div>
              <hr></hr>
              <BrandFilter items={brands} />
              <CategoryFilter items={categories} />
            </div>

          </aside>
        )}
        <main className="main">
          <div className="top">

            <div className="title ">{texts.products.collections}</div>
            {width > 640 ? (
              <SortSelect />
            ) : (
              <div className="sort-filter">
                <SmallSort />
                <SmallFilter brandItems={brands} categoryItems={categories} />
              </div>
            )}
          </div>
          {isLoading ? 'Cargando..' : ProductsComponent()}
        </main>
      </Div>
    </>
  );
};


const getBrands = (products) => {
  const brands = products.reduce((previous, current) => {
    if (!previous.includes(current.brand)) {
      previous.push(current.brand);
    }

    return previous;
  }, []);

  return brands;
}

const getCategories = (products) => {
  const categories = products.reduce((previous, current) => {
    if (!previous.includes(current.category)) {
      previous.push(current.category);
    }

    return previous;
  }, []);

  return categories;
}


export default Products;

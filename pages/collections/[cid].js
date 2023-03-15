import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import { doc, arrayUnion, setDoc, updateDoc, getDoc } from 'firebase/firestore';

import getAllStaticPaths from '../../utils/getAllStaticPaths';
import getItemById from '../../utils/getItemById';
import Modal from '../../components/Modal';
import { db } from '../../services/firebase-config';
import SizePickerForTops from '../../components/SizePickerForTops';
import SizePickerForBottoms from '../../components/SizePickerForBottoms';
import SizeChartForTops from '../../components/SizeChartForTops';
import SizeChartForBottoms from '../../components/SizeChartForBottoms';
import { CURRENCY, getFormattedCurrency } from '../../utils/getFormattedCurrency';
import { getText } from '../../utils/getText';
import { WishlistIcon } from '../../assets/icons';

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
  padding: 32px;

  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;

    .image {
      width: 330px;
    }

    .info {
      margin: 16px;
      padding: 16px;

      .brand {
        font-size: 20px;
        font-weight: 500;
      }

      .name {
        color: #777;
        margin: 16px 0;
      }

      .amount {
        font-size: 20px;
        font-weight: 500;
      }

      .size-box {
        margin-top: 32px;

        .head {
          margin-bottom: 16px;
          display: flex;
          align-items: baseline;

          .title {
            font-weight: 500;
          }

          .chart {
            color: #4a00e0;
            margin-left: 16px;
            font-size: 14px;
            cursor: pointer;

            @media (hover: hover) {
              &:hover {
                text-decoration: underline;
              }
            }

            @media (hover: none) {
              &:active {
                text-decoration: underline;
              }
            }
          }
        }

        .error {
          margin-bottom: 16px;
          color: #ff4646;
        }

        .sizes {
          display: flex;

          button {
            font: inherit;
            font-size: 14px;
            font-weight: 500;
            border: 1px #ddd solid;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            margin-right: 8px;
            background-color: white;
            cursor: pointer;

            &.active {
              border-color: #4a00e0;
              color: white;
              background-color: black;
            }

            &:last-child {
              margin-right: 0;
            }

            @media (hover: hover) {
              transition: border 240ms;

              &:hover {
                border-color: #4a00e0;
              }
            }
          }
        }
      }

      .actions {
        margin-top: 32px;
        display: flex;

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
          width: 145px;
          height: 48px;
        }

        .cart {
          background: #8e2de2;
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
            display: block;
            animation: ${rotation} 1s linear infinite;
          }
        }

        .cart-disabled {
          border: 1px gray solid;
          color: gray;
          margin-left: 16px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        }

        .wishlist {
          background-color: white;
          border: 1px #4a00e0 solid;
          color: #4a00e0;
        }

        .wishlist-active {
          background-color: white;
          border: 1px gray solid;
          color: gray;
        }
      }
    }
  }

  @media (max-width: 640px) {
    padding: 16px;

    .card {
      flex-direction: column;

      .image {
        width: 100%;
      }

      .info {
        width: 100%;
        padding: 0;
        margin-bottom: 0;

        .brand {
          font-size: 18px;
          font-weight: 500;
        }

        .name {
          color: #777;
          margin: 8px 0;
        }

        .amount {
          font-size: 18px;
          font-weight: 500;
        }

        .size-box {
          margin-top: 16px;
        }

        .actions {
          margin-top: 24px;

          button {
            width: 100%;
          }
        }
      }
    }
  }
`;

const ModalDiv = styled.div`
  padding: 16px;

  .title {
    color: #4a00e0;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .table {
    overflow: auto;

    table {
      border-collapse: collapse;
      font-size: 14px;
      width: 474px;

      &.jeans {
        width: 356px;
      }

      th {
        font-weight: 500;
      }

      td,
      th {
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        text-align: center;
        padding: 16px;
      }

      tr {
        th:first-child,
        td:first-child {
          border-left: 1px solid #ddd;
        }

        th:last-child,
        td:last-child {
          border-right: 1px solid #ddd;
        }
      }
    }
  }
`;

const ItemDetails = ({ productID }) => {
  const [size, setSize] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [promptSize, setPromptSize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState();
  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);
  const router = useRouter();


  useEffect(() => {
    getItemById(productID, setItem);
  
  }, []);


  const isWishlisted = !!wishlistItems.find((value) => value.itemId === productID);
  const isOutStock = Number(item?.stock) <= 0;

  const cartItem = cartItems.find(
    (item) => item.itemId === productID && item.itemSize === size
  );
  const cartItemIndex = cartItems.findIndex(
    (item) => item.itemId === productID && item.itemSize === size
  );
  const isInCart = !!cartItem;

  const openSizeChartHandler = () => {
    setShowSizeChart(true);
  };

  const closeSizeChartHandler = () => {
    setShowSizeChart(false);
  };

  const addToWishlistHandler = () => {
    if (user) {
      updateDoc(doc(db, user.uid, 'wishlist'), {
        items: arrayUnion({
          itemId: item.id,
          itemSize: size || null,
        }),
      }).catch((error) => console.log(error));
    } else {
      router.push('/signin');
    }
  };

  const addToCartHandler = () => {

    if (user) {
      if (isInCart) {
        alert('Éste producto ya se encuentra en tu carrito y la cantidad máxima es 1')
        return
      }
      if (isOutStock) {
        alert('Éste producto no tiene stock')
        return
      }

      if (size) {
        setPromptSize(false);
        setIsLoading(true);
        if (isInCart) {
          const updatedItem = {
            ...cartItem,
            itemQuantity: (+cartItem.itemQuantity + 1).toString(),
          };
          const updatedItems = [...cartItems];
          updatedItems.splice(cartItemIndex, 1, updatedItem);
          updateDoc(doc(db, user.uid, 'cart'), {
            items: updatedItems,
          })
            .then(() => {
              console.log('');
            })
            .catch((error) => console.log(error))
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          const docRef = doc(db, user.uid, 'cart')
          updateDoc(docRef, {
            items: arrayUnion({
              itemId: item.id,
              itemSize: size,
              itemQuantity: '1',
            }),
          }).then(
            () => {
              console.log('Added')
            }
          )
            .catch(
              (error) => {
                if (error.code === 'not-found') {
                  const docRef = doc(db, user.uid, 'cart')
                  setDoc(docRef, {
                    items: arrayUnion({
                      itemId: id,
                      itemSize: size,
                      itemQuantity: '1',
                    }),
                  })
                }
                console.log(error)
            }
            )
            .finally(() => {
              setIsLoading(false);
            });
        }
      } else {
        setPromptSize(true);
      }
    } else {
      router.push('/signin');
    }
  };

  const texts = getText('es');

  const wishlistIcon = () => {
    return (
      <>
      {texts.wishlist.added}
      <WishlistIcon/> 
      </>
    )
  }

  const cartMsg = () => {
    return isOutStock ? "No disponible" : texts.products.cart;
  }

  const cardComponent = (item) => {
    return (
    <div className="card">
          <div className="image">
            <Image
              src={item.imageURL}
              alt={item.name}
              width={330}
              height={412}
              layout="responsive"
            />
          </div>
          <div className="info">
            <div className="brand">{item.brand}</div>
            <div className="name">{item.name}</div>
            <div className="name">Stock: {item?.stock}</div>
            <div className="amount">{`${CURRENCY} ${getFormattedCurrency(
              item.amount
            )}`}</div>
            <div className="size-box">
              <div className="head">
                <div className="title">{texts.wishlist.selectSize}</div>
                <div className="chart" onClick={openSizeChartHandler}>
                {texts.products.chartSize}
                </div>
              </div>
              {promptSize && <div className="error">{texts.wishlist.selectSize}</div>}
              <div className="sizes">
                {item.category === 'Jeans' ? (
                  <SizePickerForBottoms
                    currentSize={size}
                    onSetSize={setSize}
                    sizes={item.sizes}
                  />
                ) : (
                  <SizePickerForTops currentSize={size} sizes={item.sizes} onSetSize={setSize} />
                )}
              </div>
            </div>
            <div className="actions">
              <button
                className={isWishlisted ? "wishlist-active" : "wishlist" }
                onClick={addToWishlistHandler}
                disabled={isWishlisted}
              >
                {isWishlisted ?  wishlistIcon() : texts.wishlist.title}
              </button>
              <button
                className={isOutStock ? "cart-disabled" : "cart" }
                onClick={addToCartHandler}
                disabled={isLoading || isOutStock}
              >
                {isLoading ? <span className="loader"></span> : cartMsg()}
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
    <>
      <MainNav>
        <Link href="/">{texts.home.title}</Link>
        {' / '}
        <Link href="/">{texts.products.collections}</Link>
        {' / '}
        <span>{` ${item?.brand} ${item?.name}`}</span>
      </MainNav>
      <Div>
        {
          item ? cardComponent(item) : ''
        }
      </Div>
      {showSizeChart && (
        <Modal closeHandler={closeSizeChartHandler}>
          <ModalDiv>
            <div className="title">{texts.products.chartSize}</div>
            <div className="table">
              {item.category === 'Jeans' ? (
                <SizeChartForBottoms />
              ) : (
                <SizeChartForTops />
              )}
            </div>
          </ModalDiv>
        </Modal>
      )}
    </>
  );
};

export const getStaticPaths = () => {
  const paths = getAllStaticPaths();

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = (context) => {

  return {
    props: {
      productID: context.params.cid,
    },
  };
};

export default ItemDetails;

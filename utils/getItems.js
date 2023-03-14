import data from '../pages/api/data.json';

import { db } from '../services/firebase-config';
import { collection, getDocs } from 'firebase/firestore';


// Shuffle the items
const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};


const getItems = () => {
  return shuffle(data.clothes);
};


export const getProducts = (onGet) => {
  const clothesRef= collection(db, 'products');
  getDocs(clothesRef).then(
    (snapshot)=>{
      let products = [];
      snapshot.forEach(
        (doc) => {
          products.push(doc.data()) 
        }
      )
      onGet(products)
    }
  );
}

export default getItems;

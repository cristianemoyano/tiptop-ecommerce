import data from '../pages/api/prod.json';

import { db } from '../services/firebase-config';
import { collection, setDoc, doc } from 'firebase/firestore';



export const loadProducts = () => {

    const items = data.clothes;
    
    items.forEach((item) => {
        setDoc(doc(db, 'products', item.id), item).then(() => {
            console.log("Product added: ", item)
        });
    });
}

export default loadProducts;

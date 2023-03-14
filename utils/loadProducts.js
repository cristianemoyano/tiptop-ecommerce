import data from '../pages/api/data.json';

import { db } from '../services/firebase-config';
import { collection, addDoc } from 'firebase/firestore';



export const loadProducts = () => {

    const items = data.clothes;
    
    items.forEach((item) => {
        addDoc(collection(db, 'products'), item).then(() => {
            console.log("Product added: ", item)
        });
    });
}

export default loadProducts;

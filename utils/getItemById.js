
import { db } from '../services/firebase-config';
import { query, where, getDocs, collection } from 'firebase/firestore';


export const getItemById = (productID, onGetHandler) => {
    const collectionRef = collection(db, 'products');
    const q = query(collectionRef, where("id", "==", productID));

    getDocs(q).then(
        (querySnapshot) => {
            querySnapshot.forEach((doc)=>{
              onGetHandler(doc.data());
            })
        }
    )
}

export default getItemById;



export const getItemByIds = (productIDS, onGetItems) => {
    if (productIDS.length === 0) {
      onGetItems([])
      return
    }
    const collectionRef = collection(db, 'products');
    const q = query(collectionRef, where("id", "in", productIDS));

    getDocs(q).then(
        (querySnapshot) => {
            let items = []
            querySnapshot.forEach((doc)=>{
              items.push(doc.data())
            })
            onGetItems(items);
        }
    )  
}

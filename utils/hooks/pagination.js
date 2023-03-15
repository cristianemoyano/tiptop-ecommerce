import { db } from '../../services/firebase-config';

import { query, getDocs, collection, limit, startAfter, orderBy, where } from 'firebase/firestore';

const PAGE_SIZE = 12;


const getProductsPaginated = (lastDocument, onGetProducts) => {
    const collectionRef = collection(db, 'products');
    let _query = query(collectionRef, where('stock', '>=', 1), limit(PAGE_SIZE), orderBy('stock', 'desc'), orderBy('id', 'desc'));

    if (lastDocument) {
        _query = query(collectionRef, where('stock', '>=', 1), limit(PAGE_SIZE), orderBy('stock', 'desc'), orderBy('id', 'desc'), startAfter(lastDocument)); 
    }
    getDocs(_query).then((querySnapshot) => {
      const documents = querySnapshot.docs.map((doc) => ({
        docID: doc.id,
        ...doc.data(),
      }));
      const last = querySnapshot.docs[querySnapshot.docs.length - 1]
      onGetProducts(documents, last)
    });

}


export default getProductsPaginated;

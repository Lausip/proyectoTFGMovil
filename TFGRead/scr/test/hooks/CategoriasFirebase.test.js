

import { getCategorias,crearFotoPerfilStorage  } from '../../hooks/CategoriasFirebase';

jest.mock('firebase/firestore', () => ({
    getFirestore:()=>{},
    getDocs:()=>{["hola","hola2"]}
  }))

  
describe('CategoriasFirebase test', () => {
    it('Should CategoriasFirebase getCategorias', async () => {
        getCategorias();

        

    });

});
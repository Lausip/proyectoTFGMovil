

import { crearLibroStorage ,crearFotoPerfilStorage } from '../../hooks/Storage';

jest.mock('firebase/storage', () => ({
    getStorage:()=>{},

  }))
  jest.mock('node-fetch', () => {
    const context = {
      then: jest.fn().mockImplementationOnce(() => {
        const blob = {};
        const response = { blob };
        return Promise.resolve(response);
      })
    };
    return jest.fn(() => context);
  });
describe('Storage test', () => {
    it('Should Storage', async () => {
        crearLibroStorage ("image.png");
        crearFotoPerfilStorage()
        

    });
});
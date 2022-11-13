import { storage, ref, uploadBytes, getDownloadURL, uploadBytesResumable, deleteObject } from '../config/firebase';



export const crearLibroStorage = async (image, email, id) => {
    let urlPortada = "";
    let imageFile = await fetch(image)
    const imageBlob = await imageFile.blob();
    const refi = ref(storage, `Portadas/${email}/${id}`);
    await uploadBytesResumable(refi, imageBlob).then((snapshot) => {
        // console.log('Uploaded a blob or file!');
    }
    ).then(async () => {
        await getDownloadURL(ref(storage, `Portadas/${email}/${id}`)).then((url) => {
            urlPortada = url;

        })
    })
    return urlPortada;
}

export const crearFotoPerfilStorage = async (image, email) => {

    let urlPerfil = "";
    let imageFile = await fetch(image)
    const imageBlob = await imageFile.blob();
    const refi = ref(storage, `Perfil/${email}/Foto`);
    await uploadBytesResumable(refi, imageBlob).then((snapshot) => {
        // console.log('Uploaded a blob or file!');
    }
    ).then(async () => {
        await getDownloadURL(ref(storage, `Perfil/${email}/Foto`)).then((url) => {
            urlPerfil = url;
        })
    })
    return urlPerfil;
}
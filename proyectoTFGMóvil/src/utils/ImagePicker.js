import * as ImagePicker from 'expo-image-picker';
/* istanbul ignore next */
export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  /* istanbul ignore next */
  return result.uri
};


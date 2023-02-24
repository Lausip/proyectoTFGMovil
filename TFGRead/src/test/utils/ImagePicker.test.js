
import '@testing-library/jest-dom'
import { pickImage } from '../../utils/ImagePicker';





const mockedReplace = jest.fn();
const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
            setOptions: jest.fn(),
            replace: mockedReplace,

        }),
        useIsFocused: () => true,
    };
});

jest.mock('expo-image-picker', () => {
    return {

        launchImageLibraryAsync: jest.fn().mockResolvedValue({
            cancelled: false, type: 'image',
            uri: 'abc.jpeg',
            width: '200',
            height: '200',
            result:""
        })
    }
})
describe('ImaginePicker test', () => {
    it('Should ImagePicker', async () => {
        pickImage();
 
        

    });
});
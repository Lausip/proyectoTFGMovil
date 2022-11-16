import Routes from "./scr/navigation/Routes"
import { MenuProvider } from 'react-native-popup-menu';
export default function App() {
  return (
    <MenuProvider>
    <Routes />
    </MenuProvider>
  );
}

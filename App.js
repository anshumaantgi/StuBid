import Splashscreen from './app/Screens/Splashscreen';
import Onboard from './app/Screens/Onboard';
import WelcomeScreen from './app/Screens/WelcomeScreen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/Screens/Login';
import Registration from './app/Screens/Registration';
import ForgetPassword from './app/Screens/ForgetPassword';
import Homepage from './app/Screens/Homepage';
import VerifyEmailSuccess from './app/Screens/VerifyEmailSuccess';
import ResetPasswordSuccess from './app/Screens/ResetPasswordSuccess';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainContainer from './app/Screens/MainContainer';
import LogoutSuccess from './app/Screens/LogoutSuccess';
import Auction1 from './app/Screens/Auction1';
import Auction2 from './app/Screens/Auction2';
import colors from './app/config/colors';
import ItemPublishSuccess from './app/Screens/ItemPublishSuccess';
import Filterpage from './app/Screens/Filterpage';
import Buyerbidding from './app/Screens/Buyerbidding';
import Sellerbidding from './app/Screens/Sellerbidding';

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const App = () => {
  return (
          <NavigationContainer theme={MyTheme}>
            <Stack.Navigator>
              <Stack.Screen options={{headerShown: false}} name = "Splashscreen" component={Splashscreen} />
              <Stack.Screen options={{headerShown: false}} name = "Onboard" component={Onboard} />
              <Stack.Screen options={{headerShown: false}} name = "WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen options={{headerShown: false}} name = "Login" component={Login} />
              <Stack.Screen options={{headerShown: false}} name = "Registration" component={Registration} />
              <Stack.Screen options={{headerShown: false}} name = "ForgetPassword" component={ForgetPassword} />
              <Stack.Screen options={{headerShown: false}} name = "VerifyEmailSuccess" component={VerifyEmailSuccess} />
              <Stack.Screen options={{headerShown: false}} name = "ResetPasswordSuccess" component={ResetPasswordSuccess} />
              <Stack.Screen options={{headerShown: false}} name = "LogoutSuccess" component={LogoutSuccess} />
              <Stack.Screen options={{headerShown: false}} name = "MainContainer" component={MainContainer} />
              <Stack.Screen options={{title: 'Auction Item', headerTintColor: colors.black}} name = "Auction1" component={Auction1} />
              <Stack.Screen options={{title: 'Category & Price of Item', headerTintColor: colors.black}} name = "Auction2" component={Auction2} />
              <Stack.Screen options={{headerShown: false}} name = "ItemPublishSuccess" component={ItemPublishSuccess} />
              <Stack.Screen options={{title: 'Filter Products',}} name = "Filter" component={Filterpage} />
              <Stack.Screen options={{title: 'Bid for Item',}} name = "BuyerBid" component={Buyerbidding} />
              <Stack.Screen options={{title: 'Accept a Bid',}} name = "SellerBid" component={Sellerbidding} />
      
            </Stack.Navigator>
          </NavigationContainer>

  );
}

export default App
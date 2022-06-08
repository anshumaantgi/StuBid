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
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name = "Splashscreen" component={Splashscreen} />
              <Stack.Screen name = "Onboard" component={Onboard} />
              <Stack.Screen name = "WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name = "Login" component={Login} />
              <Stack.Screen name = "Registration" component={Registration} />
              <Stack.Screen name = "ForgetPassword" component={ForgetPassword} />
              <Stack.Screen name = "Homepage" component={Homepage} />
              <Stack.Screen name = "VerifyEmailSuccess" component={VerifyEmailSuccess} />
              <Stack.Screen name = "ResetPasswordSuccess" component={ResetPasswordSuccess} />
            </Stack.Navigator>
          </NavigationContainer>
  );
}

export default App
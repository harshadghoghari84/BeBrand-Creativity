import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as PaperProvider } from 'react-native-paper'
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'mobx-react'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import Common from './src/utils/Common'
import { paperTheme } from './src/utils/Theme'
import UserStore from './src/mobx/UserStore'
import DesignStore from './src/mobx/DesignStore'
import SplashScreen from './src/screens/Splash'
import SigninScreen from './src/screens/Signin'
import SignupScreen from './src/screens/Signup'
import LanguageSelectionScreen from './src/screens/LanguageSelection'
import OtpScreen from './src/screens/Otp'
import Constant from './src/utils/Constant'
import client from './src/utils/ApolloClient'
import CustomDrawer from './src/screens/common/CustomDrawer'
import HomeStackComponent from './src/stacks/HomeStack'
import Login from './src/screens/Login'

Common.setTranslationInit()

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const DrawerScreen = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
    <Drawer.Screen
      name={Constant.navHomeStack}
      component={HomeStackComponent}
    />
    {/* <Drawer.Screen name={Constant.navDesign} component={DesignScreen} /> */}
  </Drawer.Navigator>
)

export default function App () {
  return (
    <Provider designStore={DesignStore} userStore={UserStore}>
      <ApolloProvider client={client}>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={Constant.navSplash}
            >
              <Stack.Screen
                name={Constant.navSplash}
                component={SplashScreen}
              />
              <Stack.Screen name={Constant.navLogin} component={Login} />
              <Stack.Screen
                name='langaugeSelection'
                component={LanguageSelectionScreen}
              />
              <Stack.Screen
                name={Constant.navSignIn}
                component={SigninScreen}
              />
              <Stack.Screen
                name={Constant.navSignUp}
                component={SignupScreen}
              />
              <Stack.Screen name={Constant.navOtp} component={OtpScreen} />

              <Stack.Screen
                name={Constant.navHomeStack}
                component={DrawerScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </ApolloProvider>
    </Provider>
  )
}

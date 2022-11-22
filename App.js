import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar,ActivityIndicator, View,Text, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import IconButton from './components/ui/IconButton';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerRight: (tintColor) => (
            <IconButton
              icon={"logout"}
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          
          // <Pressable onPress={authCtx.logout}>
          //   <Text style={{color:'white',fontSize:18,fontWeight:'800'}}>LogOut</Text>
          //   </Pressable>
            ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return (<View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000"}}>
    <Text style={{color: "#FFFFFF", fontSize: 27, fontFamily: "Poppins-SemiBold"}}>Loading</Text>
    <ActivityIndicator size="large" color="#FFFFFF" />
  </View>);
  }

  return <Navigation />;
}

export default function App() {
  
  return (
    <>
      <StatusBar style="light"translucent
      backgroundColor={"transparent"} />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
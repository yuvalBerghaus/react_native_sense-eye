/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
 import React, { useState } from 'react';
 import type {PropsWithChildren} from 'react';
 import { useNavigation } from '@react-navigation/native';
 import MentorMainScreen from './MentorMainScreen';

 import {
   Dimensions,
   InputAccessoryView,
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Image,
   TouchableOpacity,
   TextInput,
   Text,
   useColorScheme,
   View,
 } from 'react-native';
 
 import {
   Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
 
 // type SectionProps = PropsWithChildren<{
 //   title: string;
 // }>;
 
 function LoginScreen(): JSX.Element {
   // const isDarkMode = useColorScheme() === 'dark';
   const navigation = useNavigation();
   
   const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
   const backgroundStyle = {
     backgroundColor: 'white',
     flex: 1,
     borderWidth: 4,
     borderColor: 'green',
   };
   const handleLogin = () => {
    // You can use the email and password here to send to the server
    // using fetch or another method to authenticate the user
    // For example:
    fetch('http://192.168.14.3:8000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(response => {
        if (response.ok) {
          // Extract the JSON data from the response
          // Display the success message in the UI
          setLoginMessage('Login successful');
          return response.json();
        } else if (response.status === 401) {
          // Login failed due to unauthorized access
          throw new Error('Unable to access user');
        } else {
          // Other error occurred
          throw new Error('Login failed');
        }
      })
      .then(data => {
        // Use the JSON data
        console.log(data);
        // Store the user data using AsyncStorage or another storage method
        // For example:
        // AsyncStorage.setItem("user_token", data.accessToken);
        // AsyncStorage.setItem("user_org_name", data.orgName);
        // AsyncStorage.setItem("user_a", data.orgName);
        // AsyncStorage.setItem("user_name", data.name);
        // AsyncStorage.setItem("user_role", data.role);
        if (data.role === 'trainer') {
          // Redirect to the mentor main page
          navigation.navigate('MentorMainScreen');

        }
        if (data.role === 'trainee') {
          // Redirect to the player main page
          // navigation.navigate('PlayerMain');
        }
      })
      .catch(error => {
        // Handle the error
        console.error(error);
        // Display the error message in the UI
        setLoginMessage(error.message);
      });
  };
   return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.rootContainer}>
        <View style={styles.headerContainer}>
          {/* <Text style={styles.title}>My timer</Text> */}
          <Image
          source={require('./images/logo.png')}
          style={styles.logo}
          />
        </View>
        <View style={styles.middleContainer}>
          <Text style={styles.first_text_middle}>Login to your account</Text>
          <TextInput style={styles.input_email} value={email}
        onChangeText={setUsername} placeholder="Email"></TextInput>
          <TextInput style={styles.input_email} value={password} onChangeText={setPassword}
        secureTextEntry placeholder="Password"></TextInput>
        </View>
        <View style={styles.footerContainer}>
              <Text style={styles.footer_text}>Need help? Contact Support</Text>
              <TouchableOpacity onPress={handleLogin}>
        <Image
          source={require('./images/login_button.png')}
          style={styles.image_arrow}
        />
        </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
  
 }
 const windowsHight = Dimensions.get('window').height;
 const styles = StyleSheet.create({
   rootContainer: {
     flex: 1,
     height: windowsHight * 0.1,
     backgroundColor: 'white',
   },
   headerContainer: {
     width: '100%',
     flexDirection: 'row',
     alignItems:'center',
     justifyContent:'center',
     elevation: 2,
     flex:2,
     shadowColor: '#000',
     shadowOffset: {width: 0, height: 1},
     shadowOpacity: 0.1,
     shadowRadius: 10,
     borderColor: 'black',
     backgroundColor: 'white',
   },
   middleContainer: {
    width: '100%',
    flex:3,
    flexDirection:"column",
    alignItems:'center',
    justifyContent:'center'
  },
   title: {
    color:"red",
    fontFamily:"arial",
    fontSize: 30,
    textAlign:'center'
  },
  leftImage: {
    alignSelf:'center',
    flexDirection:'row-reverse'
  },
  first_text_middle: {
    width:'80%',
    height:'10%'
  },
  input_email: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    backgroundColor:'white'
  },
  footerContainer: {
    flexDirection:'row',
    width: '100%',
    alignItems:'center',
    justifyContent:'space-around',
    flex:3,

    alignContent: 'flex-end'
  },
  footer_text : {
      width:'39%'
  },
  image_arrow: {
    width: 50,
    height: 50
  },
  // logo: {
  //   width: 385,
  //   height: 98
  // },
  logo: {
    width: "100%",
    height: "60%"
  }
 });
 export default LoginScreen;
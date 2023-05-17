import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// const Stack = createStackNavigator();

const NavBar = (): JSX.Element => {
  return (
    <View style={styles.navbar}>
    <TouchableOpacity>
      <Text>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity>
        <Text>My List</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Results</Text>
      </TouchableOpacity>
    </View>
  )
}

interface Game {
  _id : string,
  mode: string;
  orgName: string;
  timestamp: string;
  // Add any other properties as needed
}

const GameDetailScreen = ({ game }: { game: Game }): JSX.Element => {
  console.log("the route is "+game);
  const [refresh, setRefresh] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
//     // Fetch the recommendations data from the server
    useEffect(() => {
      axios.get('http://192.168.14.3:8000/api/rec')
        .then(response => {
          const data = response.data;
          setRecommendations(data);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);
function handleButtonPress(recommendationId:string, color:string) {
  const url = `http://192.168.14.3:8000/api/rec/${recommendationId}`;
  const body = {
    status: color === 'green' ? 1 : -1
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      // Reload the current page
      setRefresh(true)
      console.log(response.json());
    })
    .catch(error => {
      console.error(error);
    });


}

  return (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {recommendations.length > 0 ? (
                recommendations
                .filter(
                    recommendation =>
                    recommendation.gameID === game.timestamp
                )
                .map(recommendation => (
                    <View key={recommendation._id} style={styles.listItem}>
                    <Image
                        source={{ uri: recommendation.frame }}
                        style={styles.listItemImage}
                    />
                    <Text>{recommendation.orgName}</Text>
                    <Text>{recommendation.gameID}</Text>
                    <View style={styles.accept_or_deny_container}>
                        <TouchableOpacity
                        onPress={() => handleButtonPress(recommendation._id, 'green')}
                        >
                        <Image
                            source={require('./images/V.png')}
                            style={styles.accept_icon}
                        />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => handleButtonPress(recommendation._id, 'red')}
                        >
                        <Image
                            source={require('./images/X.png')}
                            style={styles.deny_icon}
                        />
                        </TouchableOpacity>
                    </View>
                    </View>
                ))
            ) : (
                <Text>No recommendations found</Text>
            )}
            </ScrollView>
  );
};






const LoginComponent = ({ onLogin }: { onLogin: () => void }): JSX.Element => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  
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

        // Store the user data using AsyncStorage or another storage method
        // For example:
        AsyncStorage.setItem("user_token", data.accessToken);
        AsyncStorage.setItem("user_org_name", data.orgName);
        AsyncStorage.setItem("user_a", data.orgName);
        AsyncStorage.setItem("user_name", data.name);
        AsyncStorage.setItem("user_role", data.role);
        if (data.role === 'trainer') {
          // Redirect to the mentor main page
          // navigation.navigate('MentorMyListScreen');
              // Assuming the login is successful
          onLogin();
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
  <>
    <Text style={styles.first_text_middle}>Login to your account</Text>
    <TextInput style={styles.input_email} value={email}
      onChangeText={setUsername} placeholder="Email"></TextInput>
      <TextInput style={styles.input_email} value={password} onChangeText={setPassword}
    secureTextEntry placeholder="Password"></TextInput>
    <Text style={styles.footer_text}>Need help? Contact Support</Text>
    <TouchableOpacity onPress={handleLogin}>
    <Image source={require('./images/login_button.png')} style={styles.image_arrow} />
    </TouchableOpacity>
  </>
  )
}
type GameClickHandler = (game: Game) => void;

const MentorMyListScreen = ({ onGameClick }: { onGameClick: GameClickHandler }): JSX.Element => {
  let successRecStatus = 0;
    let wrongRecStatus = 0;
    // const navigation = useNavigation();
    const [gameList, setGameList] = useState<any[]>([]);
    const [org_name, setOrgName] = useState<string>("");
      // Retrieve the value
      AsyncStorage.getItem('user_org_name')
      .then((value) => {
          // Handle the retrieved value
          if(value) {
            setOrgName(value);
          }
      })
      .catch((error) => {
          // Handle errors
          console.error(error);
      });
      useEffect(() => {
        axios
          .get('http://192.168.14.3:8000/api/games/')
          .then(response => {
            const data = response.data;
            setGameList(data);
          })
          .catch(error => {
            console.error(error);
          });
      }, []);
    
  
    const backgroundStyle = {
      backgroundColor: 'white',
      flex: 1,
      borderWidth: 4,
      borderColor: 'green',
    };
  
    return (
            <ScrollView>
                {gameList.map(game => {
                  console.log("game details is "+game._id)
                  if(game.orgName === org_name){
                    return ((
                        <TouchableOpacity
                          key={game.timestamp}
                          onPress={() => onGameClick(game)}
                        >
                        <View>
                          <Text>Mode Number: {game.mode}</Text>
                          <Text>Organization Name: {game.orgName}</Text>
                          <Text>Date: {game.timestamp}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                })}
          </ScrollView>
    );
  
}

const App = (): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameDetail, setShowGameDetail] = useState(false);
  const handleGameClick = (game) => {
    setIsLoggedIn(true);
    setShowGameDetail(true);
    setSelectedGame(game);
    setIsMentor(false);
    console.log("the chosen game is "+game._id);
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsMentor(true);
  };
  return (
    <>
    <SafeAreaView style={styles.backgroundStyle}>
      <View style={styles.rootContainer}>
        <View style={styles.headerContainer}>
          <Image source={require('./images/logo.png')} style={styles.logo} />
          <NavBar />        
        </View>
        <View style={styles.middleContainer}>
          {!isLoggedIn && <LoginComponent onLogin={handleLogin} />}
          {isLoggedIn && isMentor && <MentorMyListScreen onGameClick={handleGameClick} />}
          {isLoggedIn && showGameDetail && (
            <GameDetailScreen
              game={selectedGame}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  </>
  );
};
export default App;

const windowsHight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    height: windowsHight * 0.1,
    backgroundColor: 'white',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems:'center',
    justifyContent:'center',
    elevation: 2,
    flex:1,
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
 logo: {
   width: "100%",
   height: "70%"
 },
 backgroundStyle : {
  backgroundColor: 'white',
  flex: 1,
  borderWidth: 4,
  // borderColor: 'green',
},
accept_or_deny_container: {
  flexDirection: 'row-reverse',
  justifyContent: 'space-around',

}, 
navbar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%',
  height: 50,
  backgroundColor: 'lightgray',
},
scrollViewContent: {
  flexGrow: 1,
},
listItem: {
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: 'lightgray',
},
listItemImage: {
  width: 200,
  height: 200,
  marginBottom: 8,
},
accept_icon: {
  width: 50,
  height: 50,
},
deny_icon: {
  width: 50,
  height: 50,
},
});

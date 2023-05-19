import React, { useEffect, useState ,useMemo} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions,  Button ,Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import WebView from 'react-native-webview';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
// const Stack = createStackNavigator();


const MyChart = () => {
  console.log('https://charts.mongodb.com/charts-project-0-nrlga/embed/charts?id=64639860-a17a-4043-8b21-cbc64cdb4bee&maxDataAge=300&theme=light&autoRefresh=true')
  return (
    <WebView
  source={{
    uri:
      'https://charts.mongodb.com/charts-project-0-nrlga/embed/charts?id=64639860-a17a-4043-8b21-cbc64cdb4bee&maxDataAge=300&theme=light&autoRefresh=true',
  }}
  style={{ flex: 1, height:100,width:350}}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
  }}
/>

  );
};




const NavBar = ({ handleMenuClick }: { handleMenuClick: MenuClickHandler }): JSX.Element => {  return (
    <View style={styles.navbar}>
    <TouchableOpacity onPress={() => handleMenuClick('login_component')}>
      <Text style={styles.text}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleMenuClick('my_list')}>
        <Text style={styles.text}>My List</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleMenuClick('results_component')}>
        <Text style={styles.text}>Results</Text>
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
const InsightComponent = ({ game }: { game: Game }): JSX.Element => {
  console.log("the route is "+game);
  const [refresh, setRefresh] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
//     // Fetch the recommendations data from the server
    useEffect(() => {
      axios.get(`http://192.168.14.3:8000/api/statistics/${game.timestamp}`)
        .then(response => {
          const data = response.data;
          setInsights(data);
          console.log(data)
        })
        .catch(error => {
          console.error(error);
        });
    }, []);

  return (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {insights.length > 0 ? (
                insights
                .map(insight => (
                    <View key={insight._id} style={styles.listItem}>
                    <Image
                        source={{ uri: insight.frame }}
                        style={styles.listItemImage}
                    />
                    <Text style={styles.text}>{insight.orgName}</Text>
                    <Text style={styles.text}>{insight.gameID}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.text}>No recommendations found</Text>
            )}
            </ScrollView>
  );
};


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
        .filter(recommendation => recommendation.gameID === game.timestamp)
        .map((recommendation, index) => {
          const isFirstRecommendation = index === 0;
          const chosen_gameID = isFirstRecommendation ? recommendation.gameID : null;
          const chosen_orgName = isFirstRecommendation ? recommendation.orgName : null;
          return (
            <>
            <Text style={styles.text}>{chosen_gameID}</Text>
            <Text style={styles.text}>{chosen_orgName}</Text>
            <View key={recommendation._id} style={styles.listItem}>
              <Image source={{ uri: recommendation.frame }} style={styles.listItemImage} />
              <Text style={styles.text}>current status: </Text>
              <Image
                source={recommendation.status === -1 ? require('./images/X.png') : require('./images/V.png')}
                style={styles.current_status}
              />
              <View style={styles.accept_or_deny_container}>
                <TouchableOpacity onPress={() => handleButtonPress(recommendation._id, 'green')}>
                  <Image source={require('./images/V.png')} style={styles.accept_icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleButtonPress(recommendation._id, 'red')}>
                  <Image source={require('./images/X.png')} style={styles.deny_icon} />
                </TouchableOpacity>
              </View>
            </View>

            </>
          );
        })
    ) : (
      <Text>No recommendations found</Text>
    )}
  </ScrollView>
);
};


const SignUpComponent = ({ onSignUp }: { onSignUp: () => void }): JSX.Element => {
  const [email, setUsername] = useState('');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const handleChangeRadio = (role:string) => {
    setRole(role);
  }
  const handleSignUpClick = () => {
    
    // You can use the email and password here to send to the server
    // using fetch or another method to authenticate the user
    // For example:
    fetch('http://192.168.14.3:8000/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password, role: role, name: name, orgName: orgName}),
    })
      .then(response => {
        if (response.ok) {
          // Extract the JSON data from the response
          // Display the success message in the UI
          setLoginMessage('Signup successful');
          return response.json();
        } else if (response.status === 401) {
          // Login failed due to unauthorized access
          throw new Error('Unable to add user');
        } else {
          // Other error occurred
          throw new Error('Signup failed');
        }
      })
      .then((data) => {
          onSignUp();
          Alert.alert(
            `Success!`,
            `The user ${data.name} signed up!`,
          );
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
    <Text style={styles.text}>Signup to Sense-Eye</Text>
    <TextInput style={styles.input_email} value={email}
      onChangeText={setUsername} placeholderTextColor="gray" placeholder="Email"></TextInput>
      <TextInput style={styles.input_name} value={name}
      onChangeText={setName} placeholder="Name" placeholderTextColor="gray"></TextInput>
      <TextInput style={styles.input_name} value={orgName}
      onChangeText={setOrgName} placeholder="Organization name" placeholderTextColor="gray"></TextInput>
      <RadioOptions onChangeRadio={handleChangeRadio}/>
      <TextInput style={styles.input_email} value={password} onChangeText={setPassword}
    secureTextEntry placeholder="Password" placeholderTextColor="gray"></TextInput>
    <Text style={styles.footer_text}>Need help? Contact Support</Text>
    <TouchableOpacity onPress={handleSignUpClick}>
    <Image source={require('./images/signup_button.png')} style={styles.image_arrow} />
    </TouchableOpacity>
    
  </>
  )
}



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
          // setLoginMessage("Login Success!");
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
type InsightClickHandler = (game: Game) => void;
type SignUpClickHandler = () => void;
type MenuClickHandler = (menu:string) => void;
const MentorMyListScreen = ({ onGameClick, onInsightsClick }: { onGameClick: GameClickHandler; onInsightsClick: InsightClickHandler }): JSX.Element => {
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
  
    return (
            <ScrollView>
                {gameList.map(game => {
                  console.log("game details is "+game._id)
                  if(game.orgName === org_name){
                    return ((
                        <>
                        <View style={styles.item_container}>
                        <Text style={styles.text}>Mode Number: {game.mode}</Text>
                        <Text style={styles.text}>Organization Name: {game.orgName}</Text>
                        <Text style={styles.text}>Date: {game.timestamp}</Text>
                        <View style={styles.button_items}>
                          <TouchableOpacity
                            key={game.timestamp}  /*TODO CHANGE KEY BECAUSE OF DUPLICATE! */
                            onPress={() => onGameClick(game)}
                          >
                            <Image
                              source={require('./images/review.png')}
                              style={styles.mode_icon} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            key={game._id} /*TODO CHANGE KEY BECAUSE OF DUPLICATE! */
                            onPress={() => onInsightsClick(game)}
                          >
                            <Image
                              source={require('./images/statistic.png')}
                              style={styles.mode_icon} />
                          </TouchableOpacity>
                        </View>
                      </View><View style={styles.separator} />
                      </>
                      
                    ))}
                })}
          </ScrollView>
    );
  
}

const RadioOptions = ({ onChangeRadio }: { onChangeRadio: (selectedRole: string) => void }) => {
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: 'trainer',
        label: 'Trainer',
        value: 'Trainer',
        color : 'black',
        labelStyle : {color:'black'}
      },
      {
        id: 'trainee',
        label: 'Trainee',
        value: 'Trainee',
        labelStyle : {color:'black'}
      },
    ],
    []
  );
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const handleOptionChange = (selectedId: string) => {
    setSelectedId(selectedId);
    onChangeRadio(selectedId);
  };

  return (
    <RadioGroup
    radioButtons={radioButtons}
    onPress={handleOptionChange}
    selectedId={selectedId}
    layout="row"
    />
  );
};






const App = (): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [current_content, setCurrentContent] = useState("login_component");
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameDetail, setShowGameDetail] = useState(false);
  const [showGameInsight, setShowGameInsight] = useState(false);
  const handleGameClick = (game: Game) => {
    setShowGameDetail(true);
    setSelectedGame(game);
    setCurrentContent("game_detail")
    setIsMentor(false);
    console.log("the chosen game is "+game._id);
  };
  const handleSignUpClick = () => {
    setIsMentor(false);
  };
  const handleInsightClick = (game: Game) => {
    setShowGameInsight(true);
    setSelectedGame(game);
    setCurrentContent("insight_component")
    setIsMentor(false);
    console.log("the chosen game is "+game._id);
  };
  const handleMenuClick = (current_content_component:string) => {
    console.log(current_content_component)
    setCurrentContent(current_content_component)
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsMentor(true);
    setCurrentContent("my_list")
  };
  return (
    <>
    <SafeAreaView style={styles.backgroundStyle}>
      <View style={styles.rootContainer}>
        <View style={styles.headerContainer}>
          <Image source={require('./images/logo.png')} style={styles.logo} />
          <NavBar handleMenuClick={handleMenuClick}/>        
        </View>
        <View style={styles.middleContainer}>
        {!isLoggedIn && current_content == "login_component" &&(
          <>
            <LoginComponent onLogin={handleLogin} />
            <Button onPress={() => setCurrentContent("signup_component")} title="Sign Up" />
          </>
        )}
          {isLoggedIn && current_content == 'my_list' && <MentorMyListScreen onGameClick={handleGameClick} onInsightsClick={handleInsightClick} />}
          {isLoggedIn && current_content == 'game_detail' && (
            <GameDetailScreen
              game={selectedGame}
            />
          )}
          {isLoggedIn && current_content == 'insight_component' && (
            <InsightComponent
              game={selectedGame}
            />
          )}
          {isLoggedIn && current_content == 'results_component' && <MyChart />}
          {!isLoggedIn && current_content == 'signup_component' && <SignUpComponent onSignUp={handleSignUpClick} />}
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
  text: {
    color: 'black', // Replace 'blue' with your desired custom color,
    
  },
  middleContainer: {
    color:'black',
   width: '100%',
   flex:3,
   flexDirection:"column",
   alignItems:'center',
   justifyContent:'center'
 },
  title: {
   fontFamily:"arial",
   fontSize: 30,
   textAlign:'center',
   color: 'black'
 },
 leftImage: {
   alignSelf:'center',
   flexDirection:'row-reverse'
 },
 separator: {
  height: 1,
  backgroundColor: 'gray',
  marginVertical: 8, // Adjust the spacing as needed
},
 first_text_middle: {
  //  width:'80%',
  //  height:'10%'
  fontWeight:'bold',
  color: 'black'
 },
 input_email: {
   width: '80%',
   borderColor: 'gray',
   color:'black',
   borderWidth: 1,
   marginBottom: 20,
   paddingLeft: 10,
   backgroundColor:'white',
 },
 input_role: {
  width: '80%',
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 20,
  paddingLeft: 10,
  backgroundColor:'white',
  color: 'black'
},
input_name: {
  width: '80%',
  borderColor: 'gray',
  borderWidth: 1,
  marginBottom: 20,
  paddingLeft: 10,
  backgroundColor:'white',
  color: 'black'
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
     width:'39%',
     color: 'black'
 },
 image_arrow: {
   width: 50,
   height: 50
 },
 signup_button: {
  width: 53,
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
  width: 300,
  height: 300,
  marginBottom: 0,
},
accept_icon: {
  width: 50,
  height: 50,
},
mode_icon: {
  width:50,
  height:50,
},
deny_icon: {
  width: 50,
  height: 50,
},
item_container : {
  justifyContent:'center',
  alignItems:'center'
},
button_items : {
  flexDirection:'row',
  width: '50%',
  justifyContent: 'space-between'
},
radioButton: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 6,
  marginRight: 10,
},
radioButtonSelected: {
  backgroundColor: 'blue',
  borderColor: 'blue',
  
},
radioButtonActive: {
  backgroundColor: 'blue',
  borderColor: 'blue',
  
},
radioButtonLabel: {
  color: 'black',
},
selectedOptionText: {
  fontSize: 18,
},
current_status: {
  width:20,
  height:20
}
});

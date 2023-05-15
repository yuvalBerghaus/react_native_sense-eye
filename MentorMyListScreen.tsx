import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  InputAccessoryView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TextInput,
  Text,
  useColorScheme,
  View,
} from 'react-native';


function MentorMyListScreen(): JSX.Element {
  const navigation = useNavigation();
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
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.rootContainer}>
        <View style={styles.headerContainer}>
          <Image source={require('./images/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.middleContainer}>
          {/* Navbar */}
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
          <ScrollView>
      {gameList.map(game => {
        if(game.orgName === org_name)
          return ((
              <TouchableOpacity
                key={game.timestamp}
                onPress={() => navigation.navigate('GameDetailScreen', { game })}
              >
              <View>
                <Text>Organization Number: {game.mode}</Text>
                <Text>Organization Name: {game.orgName}</Text>
                <Text>Date: {game.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))
      })}
    </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
const windowsHeight = Dimensions.get('window').height;
function openModal(gameID:string) {
  console.log(gameID);
}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    height: windowsHeight * 0.1,
    backgroundColor: 'white',
  },
  logo: {
    width: "100%",
    height: "70%"
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    flex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  middleContainer: {
    flex: 7,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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

export default MentorMyListScreen;
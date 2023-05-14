import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

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

const MentorMainScreen = () => {
  const [statistics, setStatistics] = useState<any[]>([]);

  // Fetch the statistics data from the server
  useEffect(() => {
    axios.get('http://192.168.14.3:8000/api/rec')
      .then(response => {
        const data = response.data;
        setStatistics(data);
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
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {statistics.length > 0 ? (
              statistics.map(statistic => (
                <View key={statistic._id} style={styles.listItem}>
                  <Image source={{ uri: statistic.frame }} style={styles.listItemImage} />
                  <Text>{statistic.orgName}</Text>
                  <Text>{statistic.gameID}</Text>
                  <View style={styles.accept_or_deny_container}>
                    <Image source={require('./images/V.png')} style={styles.accept_icon}/>
                    <Image source={require('./images/X.png')} style={styles.deny_icon}/>
                  </View>
                </View>
              ))

            ) : (
              <Text>No statistics found</Text>
            )}
          </ScrollView>
        </View>
        {/* <View style={styles.footerContainer}></View> */}
      </View>
    </SafeAreaView>
  );
};
const windowsHight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    height: windowsHight * 0.1,
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

export default MentorMainScreen;
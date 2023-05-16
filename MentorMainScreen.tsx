import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  useColorScheme,
  View,
} from 'react-native';

interface ChartComponentProps {
  rec_list: any[];
}

function MentorMainScreen(): JSX.Element {
  const BASE_URL = 'http://192.168.14.3:8000';
  const navigation = useNavigation();
  const [recList, setRecList] = useState<any[]>([]);
  const [org_name, setOrgName] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem('user_org_name')
      .then((value) => {
        if (value) {
          setOrgName(value);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const backgroundStyle = {
    backgroundColor: 'white',
    flex: 1,
    borderWidth: 4,
    borderColor: 'green',
  };

  const ChartComponent = (): JSX.Element => {
    return (
      <WebView
        source={{
          uri: 'https://charts.mongodb.com/charts-project-0-nrlga/embed/charts?id=64639860-a17a-4043-8b21-cbc64cdb4bee&maxDataAge=300&theme=light&autoRefresh=true',
        }}
        style={{ flex: 1}}
      />
    );
  };

  return (
    <>
      <SafeAreaView style={backgroundStyle}>
        <View style={styles.rootContainer}>
          <View style={styles.headerContainer}>
            <Image source={require('./images/logo.png')} style={styles.logo} />
          </View>
          <View style={styles.middleContainer}>
            {/* Navbar */}
            <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate('MentorMainScreen')}>
              <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MentorMyListScreen')}>
                <Text>My List</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text>Results</Text>
              </TouchableOpacity>
            </View>
            <ChartComponent />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const windowsHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    height: windowsHeight * 0.1,
    backgroundColor: 'white',
  },
  logo: {
    width: '100%',
    height: '70%',
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

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';

type GameDetailScreenProps = {
    route: {
      params: {
        game: {
          mode: string;
          orgName: string;
          timestamp: string;
        };
      };
    };
  };
  
interface Game {
  mode: string;
  orgName: string;
  timestamp: string;
  // Add more properties as needed
}

const GameDetailScreen = ({ route }: GameDetailScreenProps): JSX.Element => {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const { game } = route.params;
    // Fetch the recommendations data from the server
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
                        <Image
                        source={require('./images/V.png')}
                        style={styles.accept_icon}
                        />
                        <Image
                        source={require('./images/X.png')}
                        style={styles.deny_icon}
                        />
                    </View>
                    </View>
                ))
            ) : (
                <Text>No recommendations found</Text>
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

export default GameDetailScreen;

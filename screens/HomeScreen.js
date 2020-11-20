import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const HomeScreen = (props) => {

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        homeScreenButtons: {
          flex: 1, 
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          height: height * 0.4, 
          width: width * 0.3, 
          top: 10, 
          margin: 50,
          borderRadius: 10
        }
      });
  
    return (
        <View style={[styles.container, {backgroundColor: '#1ec4d5'}]}>
            <LinearGradient
            // Background Linear Gradient
            colors={['rgba(36,192,156,0.8)', 'transparent']}
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: height,
            }}
            />

            <View style={{alignItems: 'center', position: 'absolute', top: 10, height: height * 0.2}}>
            <Text style={{fontSize: 56, color: 'white'}}> UltraVision </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}> W A T C H I N G  Y O U R  B L I N D S I D E  </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.homeScreenButtons} onPress={props.setSuccess}>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text style={{fontSize: 24, color: '#A9A9A9'}}> Take Picture </Text>
                {/* <Icon name="camera" size={40} color="red" /> */}
            </TouchableOpacity>

            <TouchableOpacity style={styles.homeScreenButtons} onPress={props.setUpload}>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text style={{fontSize: 24, color: '#A9A9A9'}}> Upload </Text>
            </TouchableOpacity>
            </View>

            <TouchableOpacity style={{position: 'absolute', bottom: 5, left: 5}} onPress={() => {alert("Pop up with information")}}>
            <Text style={{fontSize: 16, color: 'white'}}> Info </Text>
            </TouchableOpacity>

            <View style={{position: 'absolute', bottom: 10}}>
            <Image style={{height: 61, width: 45}} source={require('../assets/logo2.png')}/>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}


  

export default HomeScreen;
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Button, View, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

import ImagePicker from 'react-native-image-crop-picker';

// import Icon from 'react-native-ionicons';

//****** */
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as jpeg from 'jpeg-js';

import HomeScreen from './screens/HomeScreen';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;






export default function App() {
  const [status, setStatus] = useState(0); 
  const [screen, setScreen] = useState("home"); // home, upload, success, model

  const [testOpac, setOpac] = useState(0);

  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await Font.loadAsync({
  //       Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
  //   });
  //   };
  //   loadFonts();
  // }, [])

  const [url, setUrl] = useState('https://oceana.org/sites/default/files/tiger_shark_0.jpg');
  //https://cdn.pixabay.com/photo/2017/07/24/19/57/tiger-2535888_1280.jpg  Tiger
  //https://cdn.pixabay.com/photo/2017/09/08/19/36/taxi-2729864_1280.jpg  Taxi Cab
  //https://cdn.pixabay.com/photo/2017/03/12/19/12/lamborghini-2137815_1280.jpg  Lambo (not full confidence)
  const [displayText, setDisplayText] = useState('loading');


  async function getPrediction(url) {
    setDisplayText('Loading Tensor Flow')
    await tf.ready()
    setDisplayText('Loading Mobile Net')
    const model = await mobilenet.load()
    setDisplayText('Fetching Image')
    const response = await fetch(url, {}, {isBinary:true})
    setDisplayText('Getting Image Buffer')
    const imageData = await response.arrayBuffer() // all the bytes representing our image
    setDisplayText('Getting Image Tensor')

    const imageTensor = imageToTensor(imageData)
    setDisplayText('Getting Classification Results')
    const prediction = await model.classify(imageTensor)
    setDisplayText(JSON.stringify(prediction))
  }

  // Convert imageData to matrix for neural network
  function imageToTensor(rawData) {
    const {width, height, data} = jpeg.decode(rawData, true)
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0
    for (let i=0; i < buffer.length; i+=3) {
      buffer[i] = data[offset] // Red
      buffer[i + 1] = data[offset + 1] // Green
      buffer[i + 2] = data[offset + 2] // Blue
      offset += 4 // Skips i + 3 which is alpha value for transparency
    }
    // Transform into 3D tensor buffer 
    return tf.tensor3d(buffer, [height, width, 3])
    
  }


  const takePhotoFromCamera = () => {
    //console.warn("Take Photo");
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then(image => {
      console.log(image);
    });
  }

  const choosePhotoFromLibrary = () => {
    //console.warn("Choose Photo");
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
    });
  }




  const uploadScreen = 
  <View>
    <Text>
      Upload Images
    </Text>
    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 4}} onPress={choosePhotoFromLibrary}> 
      <Text style={{fontSize: 24, color: 'white'}}>Upload</Text>
    </TouchableOpacity>
    <Text></Text>
    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 4}} onPress={() => {setScreen("home");}}> 
      <Text style={{fontSize: 24, color: 'white'}}>Home</Text>
    </TouchableOpacity>
    <Text></Text>
    
    <View style={{alignItems: 'center'}}>
      <Text> Only JPG images </Text>
      <TextInput 
        style={{height: 40, width: "90%", borderColor: 'gray', borderWidth: 1}}
        onChangeText={text => setUrl(text)}
        value={url}
      />
      <Text> {displayText} </Text>
      <Button title="Classify Image" onPress={() => getPrediction(url)} ></Button>
      <Image style={{height: 150, width: 150}} source={{uri:url}}></Image>
      
      
    </View>
    
  </View>

  
  const successScreen = 
  <View style={[styles.container, {backgroundColor: (status === 0) ? '#24ec8c' : '#fc0404'}]}>
    <Image style={{height: 40.7, width: 30}} source={require('./assets/logo2.png')}/>
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', paddingLeft: 60}}>Your Data: </Text>
        <Text></Text>
        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>Ultrascan Scan: </Text>
        <Image style={styles.image} source={require('./assets/ultrasound.png')}/>
      </View>

      <View style={{flex: 1, alignItems: 'center'}}>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Ultrascan Scan: </Text>
        <Text></Text>
        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>Value 1: </Text>
        <Text></Text>
        <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 4}} onPress={() => {setStatus(0);}}> 
          <Text style={{fontSize: 24, color: 'white'}}>Success</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 4}} onPress={() => {setStatus(1);}}> 
          <Text style={{fontSize: 24, color: 'white'}}>Failure</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 4}} onPress={() => {setScreen("home");}}> 
          <Text style={{fontSize: 24, color: 'white'}}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>

    <StatusBar style="auto" />
  </View>


  const analyzeScreen =
  <View style={[styles.container, {backgroundColor: '#1ec4d5'}]}>
    <LinearGradient
    // Background Linear Gradient
    colors={['rgba(36,192,156,0.8)', 'transparent']}
    style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: screenHeight,
    }}
    />

    <TouchableOpacity style={{position: 'absolute', top: 5, left: 5}} onPress={() => {setScreen("home")}}>
      <Text style={{fontSize: 16, color: 'white'}}> Home </Text>
    </TouchableOpacity>

    <View style={{alignItems: 'center', position: 'absolute', top: 10, height: screenHeight * 0.2}}>
      <Text style={{fontSize: 56, color: 'white'}}> UltraVision </Text>
      <Text style={{color: 'white', fontWeight: 'bold'}}> W A T C H I N G  Y O U R  B L I N D S I D E  </Text>
    </View>

    {/* <View style={{top: screenHeight*0.18, height: screenHeight*0.5, backgroundColor: 'red'}}> */}
    <View style={{top: screenHeight*0.24, height: screenHeight*0.6, width: screenHeight*0.6}}>
      <Video
        source={require('./assets/eye_vid.mp4')}
        onLoadStart={() => {setOpac(1)}}
        onLoad={() => {setOpac(0)}}
        rate={1.0}
        volume={0.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={{flex:1}}
      />
      <ActivityIndicator
          animating
          size="large"
          color="pink"
          style={{position: 'absolute',
            top: screenHeight*0.25,
            alignSelf: 'center',
            opacity: testOpac
          }}
      />
    </View>
    {/* </View> */}

    <TouchableOpacity style={{position: 'absolute', bottom: 5, left: 5}} onPress={() => {alert("Pop up with information")}}>
    <Text style={{fontSize: 16, color: 'white'}}> Info </Text>
    </TouchableOpacity>

    <View style={{flexDirection: 'row', top: screenHeight*0.1, bottom: 0}}>
      <TouchableOpacity style={styles.analyzeScreenButtons}>
        <Text style={{fontSize: 24, color: '#A9A9A9'}}>Choose Another File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.analyzeScreenButtons} onPress={() => {
        //loading
        setScreen("success");
      }}>
        <Text style={{fontSize: 24, color: '#A9A9A9'}}>Analyze</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 4, margin: 50}} onPress={() => {setStatus(0);}}> 
        <Text style={{fontSize: 24, color: 'white'}}>Choose Another File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 4, margin: 50}} onPress={() => {setStatus(0);}}> 
        <Text style={{fontSize: 24, color: 'white'}}>Analyze</Text>
      </TouchableOpacity> */}
    </View>

    <StatusBar style="auto" />
  </View>



  {
    if (screen === "home") {
      return <HomeScreen setSuccess = {() => setScreen("model")} setUpload = {() => setScreen("upload")} />
    }
    else if (screen == "model") {
      return uploadScreen;
    }
    else if (screen == "success") {
      return successScreen;
    }
    else if (screen == "upload") {
      //return uploadScreen;
      return analyzeScreen;
    }
    else {
      return <HomeScreen setSuccess = {() => setScreen("model")} setUpload = {() => setScreen("upload")} />
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: (status) ? '#24ec8c' : '#fc0404', //green, #fc0404 - red
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 250,
    width: 250,
    alignSelf: 'center'
  },
  homeScreenButtons: {
    flex: 1, 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    height: "40%",//height * 0.4, 
    width: "30%",//width * 0.3, 
    top: 10, 
    margin: 50,
    borderRadius: 10
  },
  analyzeScreenButtons: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)', 
    height: "25%",//height * 0.4, 
    width: "30%",//width * 0.3, 
    top: 10, 
    margin: 50,
    borderRadius: 10
  },

});

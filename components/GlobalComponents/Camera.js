import React, { useRef, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Alert, Image } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { BottomNavigation } from 'react-native-paper'

const Camera = ({navigation}) => {
    const [takingPic, setTakingPic] = useState(false)
    const [typePhoto, setTypePhoto] = useState(RNCamera.Constants.Type.back)
    const [img, setImg] = useState(null)
    let cameraRef = useRef(null)

    const onPicture = ({uri}) => {
        setImg(uri)
    }

    const onBackToCamera = () => {
        setImg(null)
    }

    const takePicture = async () => {
        if (cameraRef && !takingPic) {

            let options = {
              quality: 0.85,
              fixOrientation: true,
              forceUpOrientation: true,
            }
      
            setTakingPic(true)
      
            try {
               const data = await cameraRef.current.takePictureAsync(options)
               //Alert.alert('Success', JSON.stringify(data))
               navigation.navigate('ProfileDetailsPage2', {
                   photoUri: data.uri
               })
            } catch (err) {
              //Alert.alert('Error', 'Failed to take picture: ' + (err.message || err))
              return
            } finally {
              setTakingPic(false)
            }
        }
    }

    return (
        <View style={styles.container}>
            <RNCamera 
                ref={cameraRef}
                captureAudio={false}
                style={{flex: 1}}
                type={typePhoto}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            />
            <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                style={{backgroundColor: 'deepskyblue', padding: 10, alignItems: 'center', width: '80%'}}
                onPress={takePicture}
            >
                <Text style={{color: 'white', fontSize: 18}}>Click here to take a photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{backgroundColor: 'white', padding: 10, alignItems: 'center', width: '20%'}}
                onPress={() => {setTypePhoto(typeP => {
                    if(typeP === RNCamera.Constants.Type.back){
                        console.log('back')
                        setTypePhoto(RNCamera.Constants.Type.front)
                    } else {
                        console.log('front')
                        setTypePhoto(RNCamera.Constants.Type.back)
                    }
                })}}
            >
                <View>
                <Image
                    source={require('../../images/selfie.png')}
                    style={{height: 30, width: 30}}
                />
                </View>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default Camera


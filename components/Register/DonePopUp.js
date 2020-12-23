import React, {useState ,useContext} from 'react'
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import axios from 'axios';

import {NameContext} from '../../context/NameContext';
import {CountryContext} from '../../context/CountryContext';
import {EmailContext} from '../../context/EmailContext';
import {BirthdayContext} from '../../context/BirthdayContext';
import {PasswordContext} from '../../context/PasswordContext';
import {PhoneContext} from '../../context/PhoneContext';
import {ProfileImageContext} from '../../context/ProfileImageContext';

//for Firebase Storage
import storage from '@react-native-firebase/storage';

//for Firebase Auth
import auth from '@react-native-firebase/auth';

//Page to inform the user that the register is done, and mean while the client is uploaded to the data base
const DonePopUp = ({navigation}) => {
    const {firstName} = useContext(NameContext);
    const {lastName} = useContext(NameContext);
    const {birthday} = useContext(BirthdayContext);
    const {emailAddress} = useContext(EmailContext);
    const {password} = useContext(PasswordContext);
    const {country} = useContext(CountryContext);
    const {areaCode} = useContext(PhoneContext);
    const {phoneNumber} = useContext(PhoneContext);
    const {profileImage} = useContext(ProfileImageContext);


    const [profileImageUrl, setProfileImageUrl] = useState("");




    const config = {
        withCredentials: true,
        baseURL: 'http://localhost:3000/',
        headers: {
          "Content-Type": "application/json",
        },
    };

    const createUserFirebase = () =>{
        auth()
            .createUserWithEmailAndPassword(emailAddress, password)
            .then((data) => {
                console.log('User account created & signed in!');
                const userUid = "/clients/" + data.user.uid + "/profileImage.png" 
                uploadImage(userUid, profileImage)

            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }

    const uploadImage = async (filePath, imageUri) => {
        let reference = await storage().ref(filePath);
        reference.putFile(imageUri).then((snapshot) => {
                
            reference.getDownloadURL().then((url) => {
                alert(url);
                setProfileImageUrl(url);
                registerClient();
            })
            // setProfileImageUrl(snapshot.ref.getDownloadURL()); 
            // const ImageUrl = await reference.getDownloadURL().catch((error) => { throw error });
            // return setProfileImageUrl(ImageUrl),registerClient();
          })
          .catch((e) => {
              console.log(e)
            });
      }

    //   const uploadImageToStorage = async (path, imageName) => {
    //     let reference = storage().ref('shaharUpload/ProjectB/');         // 2
    //     let task = reference.putFile(profileImage);  
    //     console.log(profileImage);             // 3
    
    //     task.then(() => {                                 // 4
    //         console.log('Image uploaded to the bucket!');
    //     }).catch((e) => console.log('uploading image error => ', e));
    // }

    const registerClient = () => {
        // navigation.navigate('WelcomeUser');
        axios
            .post('/clients/register', {
                name: {
                    first: firstName,
                    last: lastName
                },
                birthday: birthday,
                email: emailAddress,
                password: password,
                country: country,
                image: 'profileImageUrl',
                phone: {
                    areaCode: areaCode, 
                    phoneNumber: phoneNumber
                },
                location: {
                    type: 'Point',
                    coordinates: [32.123602, 34.875223]
                }
            },
            config
            )
            .then((res) => {
                // navigation.navigate('WelcomeUser');
            })
            .catch((err) => alert(err.data));
    }
    
    //Uploading the client to the data base automaticly after 2 second
    setTimeout(() => {
        createUserFirebase();
    }, 10000);

    return(
        <View style={styles.container}>
            <Image 
                source={require('../../images/successfullyIcon.png')}
                style={styles.Image}
            />
            <Text style={styles.registeringText}>Done</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    registeringText: {
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center',
        marginTop: 25
    },
    Image: {
        height: Dimensions.get('window').height * .25,
        width : Dimensions.get('window').height * .25
    }
});

export default DonePopUp;
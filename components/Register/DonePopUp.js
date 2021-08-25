import React, {useState ,useContext} from 'react'
import {ART, StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {NameContext} from '../../context/NameContext';
import {CountryContext} from '../../context/CountryContext';
import {EmailContext} from '../../context/EmailContext';
import {BirthdayContext} from '../../context/BirthdayContext';
import {PasswordContext} from '../../context/PasswordContext';
import {PhoneContext} from '../../context/PhoneContext';
import {ProfileImageContext} from '../../context/ProfileImageContext';
import {PaymeTokenContext} from '../../context/PaymeTokenContext';

import * as Progress from 'react-native-progress';
// import {Surface, Shape} from '@react-native-community/art';



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
//    const {paymeToken} = useContext(PaymeTokenContext);


    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [taskProgress, setTaskProgress] = useState(undefined);
    const [isLoading,setIsLoading] = useState("flex");
    const [isDone,setIsDone] = useState("none");
    const [isLoadingCircle, setIsLoadingCircle] = useState(true);





    const config = {
        withCredentials: true,
    //    baseURL: 'http://10.0.2.2:3000/',
        baseURL: 'http://localhost:3000/',
        headers: {
          "Content-Type": "application/json",
        },
    };


    const getFormat = (uri) => {
        let indexOfDot = uri.indexOf('.', uri.length-6);
        console.log("format : " +uri.slice(indexOfDot));
        return uri.slice(indexOfDot);
    }

    const createUserFirebase = () =>{
        auth()
            .createUserWithEmailAndPassword(emailAddress, password)
            .then((data) => {
                console.log('User account created & signed in!');
                const userUid = "/clients/" + data.user.uid + '/profileImage'+getFormat(profileImage.uri);
                console.log('before uploadImage userUid ', userUid)
                uploadImage(userUid, profileImage.uri)

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
        console.log('in uploadImage filePath imageUri ', filePath, imageUri)
        let reference = await storage().ref(filePath);
        const task = reference.putFile(imageUri);
        // .then((snapshot) => {

        //     reference.getDownloadURL().then((url) => {
        //         alert(url);
        //         setProfileImageUrl('url');
        //         registerClient(url);
        //     })
        //     // setProfileImageUrl(snapshot.ref.getDownloadURL());
        //     // const ImageUrl = await reference.getDownloadURL().catch((error) => { throw error });
        //     // return setProfileImageUrl(ImageUrl),registerClient();
        //   })
          task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            const bytesTransferred = taskSnapshot.bytesTransferred;
            const totalByteCount = taskSnapshot.totalByteCount;
            const progress = (bytesTransferred / totalByteCount);
            // console.log(progress.toFixed(1));
            // setTaskProgress(progress.toFixed(1));
            // alert(progress.toFixed(1));
            // setIsLoading('none');
            // setIsDone('flex');
            // console.log( "isLoading"+isLoading);
            // console.log( "isDone"+isDone);
            // setProfileImageUrl("text isn't changing");
            // console.log(profileImageUrl);
          });

          task.then(() => {
            console.log('Image uploaded to the bucket!');
            reference.getDownloadURL().then((url) => {
                console.log('just before registerClient url ', url)
                registerClient(url);
            })
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

    const registerClient = (imageUrl) => {
        // navigation.navigate('WelcomeUser');
        console.log('in registerClient')
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
                image: imageUrl,
                phone: {
                    areaCode: areaCode,
                    phoneNumber: phoneNumber
                },
                location: {
                    type: 'Point',
                    coordinates: [32.123602, 34.875223]
                }
            //    paymeToken: paymeToken
            },
            config
            )
            .then((res) => {
                console.log('saving data in clients table succeeded firtsname ', firstName);
                // setIsLoadingCircle(false);
                // AsyncStorage.setItem('nameOfUser', firstName)
                //     .then(
                //         // AsyncStorage.getItem('nameOfUser')
                //         //     .then((err, res) => console.log('res of getitem asnyc after saving ', res))
                //         //     .catch(err => console.log(err))
                //     )
                //     .catch(err => console.log('error in asyncstorage setitem ', err))
                // setTimeout(() => {
                navigation.navigate('WelcomeUser');
                // }, 1570);
            })
            .catch((err) => {
                console.log('error in saving client data ', err)
                alert(err)
            });
    }

    //Uploading the client to the data base automaticly after 2 second
    setTimeout(() => {
         createUserFirebase();
    }, 100);


    // return(
    //     <View style={styles.container}>
    //         <Image
    //             source={require('../../images/successfullyIcon.png')}
    //             style={styles.Image}
    //         />
    //         <Text style={styles.registeringText}
    //                display= {isDone} >Done</Text>
    //         <Progress.Circle size={Dimensions.get('window').height * .25}
    //         display = {isLoading}
    //          indeterminate={true} />

    //     </View>
    // );

    return(
        <View style={styles.container}>
            {isLoadingCircle?
             <View>
                <View style={styles.progressView}>
                    <Progress.Circle size={Dimensions.get('window').height * .25} indeterminate={true} />
                </View>
                <View style={styles.loadingTextView}>
                    <Text style={styles.registeringText}>Creating account...</Text>
                </View>
             </View>
            :
            <View>
                <Image
                    source={require('../../images/successfullyIcon.png')}
                    style={styles.Image}
                />
                <Text style={styles.registeringText}>Done</Text>
            </View>
            }
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
    loadingTextView: {
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height * .020
    },
    progressView: {
        alignSelf: 'center'
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

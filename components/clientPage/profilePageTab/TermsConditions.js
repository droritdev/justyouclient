import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ArrowBackButton from '../../GlobalComponents/ArrowBackButton';


//Privacy policy
const TermsConditions = ({navigation}) => {
    
    //Navigates back to the trainer settings page
    const handleArrowButton = () => {
        navigation.goBack();
    }

    return(
        <SafeAreaView style={styles.pageContainer}>
            <View style={styles.topRowContainer}>
                <ArrowBackButton
                    onPress={handleArrowButton}
                />
                <View style={styles.headerContainer}>
                    <Text style={styles.justYouHeader}>Just You</Text>
                </View>
             </View>

            {/* Page Title */}
            <Text style={styles.pageTitle}>Terms & Conditions</Text>
            

            <ScrollView>
                <Text style={styles.paragraphStyle}>
                    Your privacy is important to Just You. This privacy policy (“Privacy Policy”) has been compiled to better serve those who are concerned with how their ‘Personally Identifiable Information’ (“PII”) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our Privacy Policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in connection with your use of the Just You website, theJust You app (together the “Sites”) and on demand services provided by Just You (“Services”).
                    Just You collects information about you when you use our Sites and Services, through other interactions and communications you have with us, and anything else in connection therewith.
                </Text>

                <Text style={styles.boldParagraphStyle}>
                    What personal information do we collect from the people that visit our Sites?
                </Text>
                    
                <Text style={styles.paragraphStyle}>
                    When registering/visiting our Sites, as appropriate, you may be asked to enter information, which may include your name, email address, phone number, credit card information, Health related information or other details to help you with your on-demand service, or any other information you choose to provide.
                </Text>

                <Text style={styles.boldParagraphStyle}>
                    When do we collect information?
                </Text>

                <Text style={styles.paragraphStyle}>
                    We collect information from you when you register on our Sites to provide or receive an on-demand service, fill out a form or enter information on our Sites (inter alia information entered in your personal lifestyle and workout diary (which is not mandatory)) and request an on-demand service.
                </Text>

                <Text style={styles.boldParagraphStyle}>
                    How do we use your information?
                </Text>

                <Text style={styles.paragraphStyle}>
                    We may use the information we collect from you when you register, update your profile as a trainer or client, make a booking, respond to a survey or marketing communication, surf the website, or use certain other Site features in the following ways:
                </Text>

                <Text style={styles.paragraphStyle}>
                    1. To personalize your experience / service and to allow us to deliver the type of content and product offerings in which you are most interested.
                </Text>

                <Text style={styles.paragraphStyle}>
                    2. To allow us to better service you in responding to your client / trainer service requests.
                </Text>

                <Text style={styles.paragraphStyle}>
                    3. To quickly process your transactions.
                </Text>

                <Text style={styles.paragraphStyle}>
                    4. To ask for ratings and reviews of services or products.
                </Text>
                
                <Text style={styles.paragraphStyle}>
                    5. To conduct third party verifications and background checks.
                </Text>

                <Text style={styles.boldParagraphStyle}>
                    Do we use ‘cookies’?
                </Text>

                <Text style={styles.paragraphStyle}>
                    We do not use cookies for tracking purposes. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since each browser is a little different, look at your browser’s Help Menu to learn the correct way to modify your cookies. If you turn cookies off, some features will be disabled. that make your site experience more efficient and may not function properly.
                    Just You collects information about you when you use our Sites and Services, through other interactions and communications you have with us, and anything else in connection therewith.
                </Text>
               


               {/* THIRD-PARTY DISCLOSURE */}

                <Text style={styles.paragraphTitlte}>
                    THIRD-PARTY DISCLOSURE
                </Text>

                <Text style={styles.paragraphStyle}>    
                    We may share your information with trainers/clients to enable them to provide/receive the requested workout. For example, we share your name, photo (if you provide one), average User rating given by clients/trainers, and training location with trainers.
                </Text>


                <Text style={styles.paragraphStyle}>    
                    We may share your information with the general public if you submit content in a public forum, such as blog comments, social media posts, or other features of our Services that are viewable by the general public.
                </Text>


                <Text style={styles.paragraphStyle}>    
                    We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our Sites, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it’s release is appropriate to comply with the law, enforce our site policies, or protect ours or others’ rights, property or safety.
                </Text>


                <Text style={styles.paragraphStyle}>    
                    Non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
                </Text>


                <Text style={styles.paragraphStyle}>    
                    We may share your information in response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.
                </Text>

                <Text style={styles.paragraphStyle}>    
                    We may share your information with law enforcement officials, government authorities, or other third parties if we believe your actions are inconsistent with our User agreements, Terms of Service, or policies, or to protect the rights, property, or safety of Uber or others.
                </Text>

                <Text style={styles.paragraphStyle}>    
                    We may share your information in connection with, or during negotiations of, any merger, sale of company assets, consolidation or restructuring, financing, or acquisition of all or a portion of our business by or into another company.
                </Text>

                <Text style={styles.paragraphStyle}>    
                    We may share your information in case we otherwise notify you and you consent to the sharing; and in an aggregated and/or anonymized form which cannot reasonably be used to identify you.
                </Text>

                <Text style={styles.paragraphStyle}>              
                    Subject to all applicable laws, Just You may provide to a third party any information (including personal data) about Just You trainers provided hereunder if: (a) there is a complaint, dispute or conflict, including an accident/injury of a client, relating to a trainer; (b) it is necessary, in Just You sole discretion, to protect the safety, rights, property, or security of Just You, or any third party; to detect, prevent or otherwise address fraud, security or technical issues; and/or to prevent or stop activity which Just You, in its sole discretion, considers to be, or to pose a risk of being, illegal, unethical, or legally actionable.
                </Text>




               {/* MANAGING OF PROVIDED INFORMATION*/}

               <Text style={styles.paragraphTitlte}>
                     MANAGING OF PROVIDED INFORMATION
                </Text>

                <Text style={styles.paragraphStyle}>          
                    You can review, update, change or correct your personal information r opt out of receiving certain e mails by contacting us at service@JustYou.com, as instructed in the e mail or under the setting section of the Just You app.
                </Text>



               {/* THIRD-PARTY LINKS */}

               <Text style={styles.paragraphTitlte}>
                    THIRD-PARTY LINKS
                </Text>

                <Text style={styles.paragraphStyle}>             
                    Occasionally, at our discretion, we may include or offer third-party products or services on our Sites. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
                </Text>




                {/* CHILDREN PRIVACY */}

               <Text style={styles.paragraphTitlte}>
                    CHILDREN PRIVACY
                </Text>

                <Text style={styles.paragraphStyle}>                     
                    The Site and Services are intended for users at the age of 18 or older. We do not knowingly collect information from children under the age of 13. If we become aware that we have inadvertently received personal information from a child under the age of 13 we will delete such information from our records.
                </Text>





                {/* DATA SECURITY */}

               <Text style={styles.paragraphTitlte}>
                    DATA SECURITY
                </Text>

                <Text style={styles.paragraphStyle}>                             
                    Just You will take reasonable technical and organizational precautions to prevent the loss, misuse or alteration of your personal information. We will store all the personal information you provide on our secure servers.
                </Text>





                {/* USE OF EMAIL ADDRESS */}

               <Text style={styles.paragraphTitlte}>
                    USE OF EMAIL ADDRESS
                </Text>

                <Text style={styles.paragraphStyle}>                                 
                    We may use your e mail address to send information, respond to inquiries, and/or other requests or questions, process bookings and to send information and updates pertaining to such bookings and additional information related to our Services. If at any time you would like to unsubscribe from receiving future emails, you can email us at service@JustYou.com or follow the instructions contained in each email and we will promptly remove you from ALL correspondence.
                </Text>



                {/* CHANGES TO THIS PRIVACY POLICY */}

                <Text style={styles.paragraphTitlte}>
                    CHANGES TO THIS PRIVACY POLICY
                </Text>

                <Text style={styles.paragraphStyle}>                                           
                    We may change this privacy policy from time to time. If we make significant changes in the way we treat your personal information, or to this privacy policy we will provide you notice through the Sites or by some other means, such as email. Your continued use of the Sites after such notice constitutes your consent to the changes. We encourage you to periodically review the Privacy Policy for the latest information on our privacy practices.
                </Text>




                {/* CONTACT US */}

                <Text style={styles.paragraphTitlte}>
                    CONTACT US
                </Text>

                <Text style={styles.paragraphStyle}>                                           
                    If you have any questions about this Privacy Policy, please contact us at service@JustYou.com, or post to Just You Corporation, ________________________ (address).
                </Text>
                <View style={{height: 100}}>
                </View>
                </ScrollView>

        </SafeAreaView>

    );

};

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height 
    },
    headerContainer: {
        marginLeft: Dimensions.get('window').width * .25,
        alignItems: 'center'
    },
    headerStyle: {
        fontSize: Dimensions.get('window').height * .025,
        fontWeight: 'bold'
    },
    justYouHeader: {
        fontSize: Dimensions.get('window').height * .025,
        fontWeight: 'bold'
    },
    partnerText: {
        color: 'deepskyblue',
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').height * .018
    },
    topRowContainer: {
        flexDirection: 'row',
    },
        headerStyle: {
        fontSize: Dimensions.get('window').height * .025,
        fontWeight: 'bold'
    },
    pageTitle: {
        marginTop: Dimensions.get('window').height * .05,
        alignSelf: 'center',
        fontSize: Dimensions.get('window').height * .03,
        fontWeight: 'bold'
    },
    paragraphStyle: {
        marginTop: Dimensions.get('window').height * .01,
        marginLeft: Dimensions.get('window').width * .05,
        width: Dimensions.get('window').width * .9,
        fontSize: Dimensions.get('window').height * .018,
    },
    boldParagraphStyle: {
        fontWeight: 'bold',
        marginTop: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').width * .05,
        width: Dimensions.get('window').width * .9,
        fontSize: Dimensions.get('window').height * .018,
    },
    paragraphTitlte: {
        fontWeight: 'bold',
        marginTop: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').width * .05,
        width: Dimensions.get('window').width * .9,
        fontSize: Dimensions.get('window').height * .022,
    }
    
});
export default TermsConditions;
import React, {useState} from 'react';

import EmailContextProvider from './EmailContext';
import CountryContextProvider from './CountryContext';
import PasswordContextProvider from './PasswordContext';
import NameContextProvider from './NameContext';
import PhoneContextProvider from './PhoneContext';
import BirthdayContextProvider from './BirthdayContext';
import ProfileImageContextProvider from '../context/ProfileImageContext';
import TrainerContextProvider from './TrainerContext'
import ClientContextProvider from './ClientContext'
import OrderContextProvider from './OrderContext'
import CategoryContextProvider from './CategoryContext'


//The context api global store to handle the state managments of the app
const GlobalStore = ({children}) => {

    return(
        <EmailContextProvider>
            <CountryContextProvider>
                <PasswordContextProvider>
                    <NameContextProvider>
                        <ProfileImageContextProvider>
                            <BirthdayContextProvider>
                                <PhoneContextProvider>
                                    <TrainerContextProvider>
                                        <ClientContextProvider>
                                            <OrderContextProvider>
                                                <CategoryContextProvider>
                                    {children}
                                                </CategoryContextProvider>
                                            </OrderContextProvider>
                                        </ClientContextProvider>
                                    </TrainerContextProvider>
                                </PhoneContextProvider>
                            </BirthdayContextProvider>
                        </ProfileImageContextProvider>
                    </NameContextProvider>
                </PasswordContextProvider>
            </CountryContextProvider>
        </EmailContextProvider>
    );
}

export default GlobalStore;

import React, {useState} from 'react';

import EmailContextProvider from './EmailContext';
import CountryContextProvider from './CountryContext';
import PasswordContextProvider from './PasswordContext';
import NameContextProvider from './NameContext';
import PhoneContextProvider from './PhoneContext';
import BirthdayContextProvider from './BirthdayContext';
import ProfileImageContextProvider from '../context/ProfileImageContext';

const GlobalStore = ({children}) => {

    return(
        <EmailContextProvider>
            <CountryContextProvider>
                <PasswordContextProvider>
                    <NameContextProvider>
                        <ProfileImageContextProvider>
                            <BirthdayContextProvider>
                                <PhoneContextProvider>
                                    {children}  
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
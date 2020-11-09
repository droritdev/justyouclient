import React, {useState} from 'react';

import EmailContextProvider from './EmailContext';
import CountryContextProvider from './CountryContext';
import PasswordContextProvider from './PasswordContext';
import NameContextProvider from './NameContext';
import PhoneContextProvider from './PhoneContext';
import MediaContextProvider from './MediaContext';
import ProfileImageContextProvider from '../context/ProfileImageContext';

const GlobalStore = ({children}) => {

    return(
        <EmailContextProvider>
            <CountryContextProvider>
                <PasswordContextProvider>
                    <NameContextProvider>
                        <MediaContextProvider>
                            <ProfileImageContextProvider>
                                <PhoneContextProvider>
                                    {children}  
                                </PhoneContextProvider>
                            </ProfileImageContextProvider>
                        </MediaContextProvider>
                    </NameContextProvider>
                </PasswordContextProvider>
            </CountryContextProvider>
        </EmailContextProvider>
    );
}

export default GlobalStore;
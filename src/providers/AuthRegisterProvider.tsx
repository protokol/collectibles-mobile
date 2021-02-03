import React, {createContext, FC, useCallback, useState} from "react";
import * as bip39 from "bip39";
import {Encryption} from "../utils/encryption";
import {useDispatch} from "react-redux";
import {SetEncodedUserPrivateKeyAction} from "../store/actions/app";

interface AuthRegisterProviderState {
    passphrase: string | null;
}

interface AuthRegisterProviderContext {
    readonly state: AuthRegisterProviderState;
    generatePassphrase: (language?: string) => void;
    setPin: (pin: string) => void;
}


const authRegisterProviderInitialState: AuthRegisterProviderState = {
    passphrase: null
}

export const AuthRegisterContext = createContext<AuthRegisterProviderContext>({} as AuthRegisterProviderContext);

const AuthRegisterContextProvider: FC = ({children}) => {
    const [state, setState] = useState<AuthRegisterProviderState>({
        ...authRegisterProviderInitialState
    })
    const dispatch = useDispatch();

    const generatePassphrase: AuthRegisterProviderContext["generatePassphrase"] = useCallback((language = 'english') => {
        const passphrase = bip39.generateMnemonic(
            undefined,
            undefined,
            bip39.wordlists[language]
        );

        setState(prevState => ({
            ...prevState,
            passphrase
        }));
    }, [setState])

    const setPin: AuthRegisterProviderContext["setPin"] = useCallback((pin) => {
        const {passphrase} = state;
        const passphraseJson = JSON.stringify({passphrase});
        const encoded = Encryption.encode(passphraseJson, Encryption.hash(pin));

        dispatch(SetEncodedUserPrivateKeyAction(encoded));

        /* const decoded = Encryption.decode(encoded, hashedPin);
        console.log(decoded);
        const passphraseJsonDecoded = JSON.parse(decoded);
        console.dir(passphraseJsonDecoded);

        try {
            const encodedWrong = Encryption.decode(passphraseJson, Encryption.hash('4321'));
            JSON.parse(encodedWrong);
        } catch (e) {
            console.error('decode failed', e);
        } */
    }, [state, dispatch]);

    const providerState: AuthRegisterProviderContext = {
        state,
        generatePassphrase,
        setPin
    }

    return (<AuthRegisterContext.Provider value={providerState}>{children}</AuthRegisterContext.Provider>);
}

export default AuthRegisterContextProvider;
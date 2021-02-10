import * as bip39 from 'bip39';
import React, { createContext, FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SetEncodedUserPrivateKeyAction } from '../store/actions/app';
import { Encryption } from '../utils/encryption';

interface AuthRegisterProviderState {
  username?: string;
  passphrase?: string;
}

interface AuthRegisterProviderContext {
  readonly state: AuthRegisterProviderState;
  setUsername: (username: string) => void;
  setPin: (pin: string) => void;
  generatePassphrase: (language?: string) => void;
}

const authRegisterProviderInitialState: AuthRegisterProviderState = {};

export const AuthRegisterContext = createContext<AuthRegisterProviderContext>(
  {} as AuthRegisterProviderContext
);

const AuthRegisterContextProvider: FC = ({ children }) => {
  const [state, setState] = useState<AuthRegisterProviderState>({
    ...authRegisterProviderInitialState,
  });
  const dispatch = useDispatch();

  const setUsername: AuthRegisterProviderContext['setUsername'] = useCallback(
    (username) => {
      setState((prevState) => ({
        ...prevState,
        username,
      }));
    },
    [setState]
  );

  const setPin: AuthRegisterProviderContext['setPin'] = useCallback(
    (pin) => {
      const { passphrase } = state;
      const passphraseJson = JSON.stringify({ passphrase });
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
    },
    [state, dispatch]
  );

  const generatePassphrase: AuthRegisterProviderContext['generatePassphrase'] = useCallback(
    (language = 'english') => {
      const passphrase = bip39.generateMnemonic(
        undefined,
        undefined,
        bip39.wordlists[language]
      );

      setState((prevState) => ({
        ...prevState,
        passphrase,
      }));
    },
    [setState]
  );

  const providerState: AuthRegisterProviderContext = {
    state,
    setUsername,
    setPin,
    generatePassphrase,
  };

  return (
    <AuthRegisterContext.Provider value={providerState}>
      {children}
    </AuthRegisterContext.Provider>
  );
};

export default AuthRegisterContextProvider;

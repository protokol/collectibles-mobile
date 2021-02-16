import * as bip39 from 'bip39';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { SetEncodedUserPrivateKeyAction } from '../store/actions/app';
import { Encryption } from '../utils/encryption';
import { AuthLoginContext } from './AuthLoginProvider';

interface AuthRegisterProviderState {
  username?: string;
}

interface AuthRegisterProviderContext {
  readonly state: AuthRegisterProviderState;
  setUsername: (username: string) => void;
  setPin: (pin: string) => void;
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
  const { setPin: authLoginSetPin } = useContext(AuthLoginContext);

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
      const passphrase = bip39.generateMnemonic(
        undefined,
        undefined,
        bip39.wordlists['english']
      );

      const passphraseJson = JSON.stringify({ passphrase });
      const encoded = Encryption.encode(passphraseJson, Encryption.hash(pin));

      authLoginSetPin(pin);
      dispatch(SetEncodedUserPrivateKeyAction(encoded));
    },
    [authLoginSetPin, dispatch]
  );

  const providerState: AuthRegisterProviderContext = {
    state,
    setUsername,
    setPin,
  };

  return (
    <AuthRegisterContext.Provider value={providerState}>
      {children}
    </AuthRegisterContext.Provider>
  );
};

export default AuthRegisterContextProvider;

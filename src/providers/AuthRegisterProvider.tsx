import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { SetEncodedUserPrivateKeyAction } from '../store/actions/app';
import { CryptoUtils } from '../utils/crypto-utils';
import { Encryption } from '../utils/encryption';
import { AuthLoginContext } from './AuthLoginProvider';

interface AuthRegisterProviderState {
  username?: string;
  passphrase?: string;
}

interface AuthRegisterProviderContext {
  readonly state: AuthRegisterProviderState;
  setUsername: (username: string) => void;
  setPassphrase: (passphrase: string) => void;
  setPin: (pin: string) => void;
  reset: () => void;
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

  const reset = useCallback(() => {
    setState({
      ...authRegisterProviderInitialState,
    });
  }, [setState]);

  const setUsername: AuthRegisterProviderContext['setUsername'] = useCallback(
    (username) => {
      setState((prevState) => ({
        ...prevState,
        username,
      }));
    },
    [setState]
  );

  const setPassphrase: AuthRegisterProviderContext['setPassphrase'] = useCallback(
    (passphrase) => {
      setState((prevState) => ({
        ...prevState,
        passphrase,
      }));
    },
    [setState]
  );

  const setPin: AuthRegisterProviderContext['setPin'] = useCallback(
    (pin) => {
      const passphrase = state.passphrase || CryptoUtils.generatePassphrase();

      const passphraseJson = JSON.stringify({ passphrase });
      const encoded = Encryption.encode(passphraseJson, Encryption.hash(pin));

      authLoginSetPin(pin);
      dispatch(SetEncodedUserPrivateKeyAction(encoded));

      reset();
    },
    [state, authLoginSetPin, dispatch, reset]
  );

  const providerState: AuthRegisterProviderContext = {
    state,
    setUsername,
    setPin,
    setPassphrase,
    reset,
  };

  return (
    <AuthRegisterContext.Provider value={providerState}>
      {children}
    </AuthRegisterContext.Provider>
  );
};

export default AuthRegisterContextProvider;

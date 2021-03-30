import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { NodeCryptoConfiguration } from '@arkecosystem/client/dist/resourcesTypes/node';
import { StorageKeys } from '../constants/storage';
import {
  encodedUserPrivateKeySelector,
  usernameSelector,
} from '../store/selectors/app';
import { nodeCryptoConfigurationSelector } from '../store/selectors/network';
import { ArkCrypto } from '../store/services/crypto';
import { Encryption } from '../utils/encryption';
import storage from '../utils/storage-service';

export enum AuthLoginState {
  Unknown,
  NeedRegistration,
  PinProtected,
  LoggedIn,
  Error,
}

interface AuthLoginProviderState {
  session: {
    state: AuthLoginState;
    error: Error | null;
    address?: string;
    passphrase?: string;
    publicKey?: string;
    username?: string | null;
  };
}

interface AuthLoginProviderContext {
  readonly session: AuthLoginProviderState['session'];
  setPin: (pin: string) => void;
}

const authLoginProviderInitialState: AuthLoginProviderState = {
  session: {
    state: AuthLoginState.Unknown,
    error: null,
  },
};

export const AuthLoginContext = createContext<AuthLoginProviderContext>(
  {} as AuthLoginProviderContext
);

const session = storage(window.sessionStorage);

const AuthLoginContextProvider: FC = ({ children }) => {
  const [state, setState] = useState<AuthLoginProviderState>({
    ...authLoginProviderInitialState,
  });

  const encodedPrivateKey = useSelector(
    encodedUserPrivateKeySelector,
    shallowEqual
  );
  const nodeCryptoConfiguration = useSelector(
    nodeCryptoConfigurationSelector,
    shallowEqual
  );
  const username = useSelector(usernameSelector, shallowEqual);

  useEffect(() => {
    if (encodedPrivateKey === null) {
      setState({
        session: {
          state: AuthLoginState.NeedRegistration,
          error: null,
        },
      });
    }
  }, [encodedPrivateKey]);

  const unlock = useCallback(
    (
      encodedPin: string,
      encodedPassphrase: string,
      nodeConfig: NodeCryptoConfiguration,
      username: string | null
    ) => {
      try {
        const decoded = Encryption.decode(encodedPassphrase, encodedPin);
        const { passphrase } = JSON.parse(decoded);

        const { network } = nodeConfig;
        const { pubKeyHash } = network;
        const address = ArkCrypto.Identities.Address.fromPassphrase(
          passphrase,
          pubKeyHash
        );
        const publicKey = ArkCrypto.Identities.PublicKey.fromPassphrase(
          passphrase
        );

        setState({
          session: {
            state: AuthLoginState.LoggedIn,
            error: null,
            address,
            passphrase,
            publicKey,
            username,
          },
        });
      } catch (error) {
        console.warn('decode failed', error);

        setState({
          session: {
            state: AuthLoginState.Error,
            error,
          },
        });
      } finally {
        session.removeItem(StorageKeys.PIN);
      }
    },
    []
  );

  useEffect(() => {
    const encodedPin = session.get<string>(StorageKeys.PIN);

    if (!encodedPin && encodedPrivateKey && nodeCryptoConfiguration) {
      setState({
        session: {
          state: AuthLoginState.PinProtected,
          error: null,
        },
      });
    }
  }, [encodedPrivateKey, nodeCryptoConfiguration]);

  useEffect(() => {
    const encodedPin = session.get<string>(StorageKeys.PIN);

    if (encodedPin && encodedPrivateKey && nodeCryptoConfiguration) {
      unlock(encodedPin, encodedPrivateKey, nodeCryptoConfiguration, username);
    }
  }, [
    encodedPrivateKey,
    nodeCryptoConfiguration,
    unlock,
    state.session,
    username,
  ]);

  const setPin = useCallback((pin: string) => {
    session.set(StorageKeys.PIN, Encryption.hash(pin));

    setState({
      ...authLoginProviderInitialState,
    });
  }, []);

  const providerState: AuthLoginProviderContext = useMemo(
    () => ({
      session: state.session,
      setPin,
    }),
    [state.session, setPin]
  );

  return (
    <AuthLoginContext.Provider value={providerState}>
      {children}
    </AuthLoginContext.Provider>
  );
};

export default AuthLoginContextProvider;

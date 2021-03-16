import { createContext, FC, useCallback, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { NodeCryptoConfiguration } from '@arkecosystem/client/dist/resourcesTypes/node';
import { StorageKeys } from '../constants/storage';
import { encodedUserPrivateKeySelector } from '../store/selectors/app';
import { nodeCryptoConfigurationSelector } from '../store/selectors/network';
import { ArkCrypto } from '../store/services/crypto';
import { Encryption } from '../utils/encryption';
import storage from '../utils/storage-service';

interface AuthLoginProviderState {
  session: {
    isReady: boolean;
    error: Error | null;
    address?: string;
    wif?: string;
    publicKey?: string;
  };
}

interface AuthLoginProviderContext {
  readonly state: AuthLoginProviderState;
  setPin: (pin: string) => void;
}

const authLoginProviderInitialState: AuthLoginProviderState = {
  session: {
    isReady: false,
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

  const unlock = useCallback(
    (
      encodedPin: string,
      encodedPassphrase: string,
      nodeConfig: NodeCryptoConfiguration
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
        const wif = ArkCrypto.Identities.WIF.fromPassphrase(
          passphrase,
          network
        );
        const publicKey = ArkCrypto.Identities.PublicKey.fromPassphrase(
          passphrase
        );

        setState({
          session: {
            isReady: true,
            error: null,
            address,
            wif,
            publicKey,
          },
        });
      } catch (error) {
        console.error('decode failed', error);

        setState({
          session: {
            isReady: false,
            error,
          },
        });
      } finally {
        session.removeItem(StorageKeys.STORAGE_PIN_KEY);
      }
    },
    []
  );

  useEffect(() => {
    const encodedPin = session.get<string>(StorageKeys.STORAGE_PIN_KEY);

    if (encodedPin && encodedPrivateKey && nodeCryptoConfiguration) {
      unlock(encodedPin, encodedPrivateKey, nodeCryptoConfiguration);
    }
  }, [encodedPrivateKey, nodeCryptoConfiguration, unlock]);

  const setPin = useCallback((pin: string) => {
    session.set(StorageKeys.STORAGE_PIN_KEY, Encryption.hash(pin));

    setState({
      ...authLoginProviderInitialState,
    });
  }, []);

  const providerState: AuthLoginProviderContext = {
    state,
    setPin,
  };

  return (
    <AuthLoginContext.Provider value={providerState}>
      {children}
    </AuthLoginContext.Provider>
  );
};

export default AuthLoginContextProvider;

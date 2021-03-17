import {
  createRef,
  FC,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { InputChangeEventDetail } from '@ionic/core';
import { IonCol } from '@ionic/react';
import { FontSize } from '../constants/font-size';
import { Utils } from '../utils/utils';
import Input from './ionic/Input';

const PASSPHRASE_WORDS = 12;

const Passphrase: FC<{
  onChange: (pin: string) => void;
}> = ({ onChange }) => {
  const [passphrase, setPassphrase] = useState<string[]>(
    Array.from({ length: PASSPHRASE_WORDS }, () => '')
  );

  const [wordElRefs, setWordElRefs] = useState<
    RefObject<HTMLIonInputElement>[]
  >([]);

  useEffect(() => {
    setWordElRefs((wordElRef) =>
      Array.from(
        { length: PASSPHRASE_WORDS },
        (_, i) => wordElRef[i] || createRef()
      )
    );
  }, []);

  useEffect(() => {
    onChange(
      passphrase
        .map((w) => w.trim())
        .join(' ')
        .toLowerCase()
    );
  }, [passphrase, onChange]);

  useEffect(() => {
    const setFocus = async ($el: HTMLIonInputElement | null) => {
      if (!$el) {
        return;
      }

      await Utils.wait(250);
      await $el.setFocus();
    };

    if (!wordElRefs.length) {
      return;
    }

    const [word0] = wordElRefs;

    if (!word0) {
      return;
    }

    setFocus(word0.current);
  }, [wordElRefs]);

  const onPassphraseWordChange = useCallback(
    (word, passphraseIndex) => {
      setPassphrase((prevState) => [
        ...prevState.slice(0, passphraseIndex),
        word,
        ...prevState.slice(passphraseIndex + 1),
      ]);
    },
    [setPassphrase]
  );

  const onKeyDown = useCallback(
    (event) => {
      const readFromClipboard = () => {
        navigator.clipboard
          .readText()
          .then((text) => {
            const words = text.split(' ');
            setPassphrase(
              [
                ...words,
                ...Array.from({ length: PASSPHRASE_WORDS }, () => ''),
              ].slice(0, PASSPHRASE_WORDS)
            );
          })
          .catch((err) => {
            console.warn('Reading contents from clipboard failed: ', err);
          });
      };

      let charCode = String.fromCharCode(event.which).toLowerCase();
      if (event.ctrlKey && charCode === 'v') {
        readFromClipboard();
      }

      if (event.metaKey && charCode === 'v') {
        readFromClipboard();
      }
    },
    [setPassphrase]
  );

  return (
    <>
      {passphrase.map((word, index) => (
        <IonCol key={index} size="3">
          <Input
            className={`form-input-transparent form-input-prefix-number-${
              index + 1
            }`}
            data-number={index + 1}
            type="text"
            fontSize={FontSize.SM}
            value={word}
            onKeyDown={onKeyDown}
            onIonChange={({
              detail: { value },
            }: CustomEvent<InputChangeEventDetail>) =>
              onPassphraseWordChange(value, index)
            }
            ref={wordElRefs[index]}
          />
        </IonCol>
      ))}
    </>
  );
};

export default Passphrase;

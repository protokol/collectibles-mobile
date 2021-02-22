import React, {
  createRef,
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

const Passphrase: React.FC<{
  onChange: (pin: string) => void;
}> = ({ onChange }) => {
  const [passphrase, setPassphrase] = useState<string[]>(
    Array.from({ length: PASSPHRASE_WORDS }, () => '')
  );

  const [wordElRefs, setWordElRefs] = React.useState<
    RefObject<HTMLIonInputElement>[]
  >([]);

  React.useEffect(() => {
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

  return (
    <>
      {passphrase.map((word, index) => (
        <IonCol key={index} size="3">
          <Input
            className="form-input-transparent"
            type="text"
            fontSize={FontSize.SM}
            value={word}
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

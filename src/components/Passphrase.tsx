import {
  createRef,
  FC,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import { InputChangeEventDetail } from '@ionic/core';
import { JSX } from '@ionic/core';
import { IonCol, IonRow } from '@ionic/react';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { CryptoUtils } from '../utils/crypto-utils';
import { Utils } from '../utils/utils';
import Button from './ionic/Button';
import Input from './ionic/Input';

const PASSPHRASE_WORDS = 12;

const PassphraseBackground = styled.div`
  border-radius: 0.25rem;
  padding-left: 1.75rem;
  background-color: var(--app-color-gray);
`;

const SuggestBtn = styled(Button)<JSX.IonButton>`
  &&&& {
    --background: var(--app-color-blue-dark-bg);
    background: var(--app-color-blue-dark-bg);
  }
`;

const SuggestionsRow = styled(IonRow)`
  display: flex;
  flex: 1 100%;
  flex-wrap: wrap;
  justify-content: space-between;

  padding: 1.5rem 0.75rem 0;
`;

const Passphrase: FC<{
  onChange: (pin: string) => void;
}> = ({ onChange }) => {
  const [passphrase, setPassphrase] = useState<string[]>(
    Array.from({ length: PASSPHRASE_WORDS }, () => '')
  );
  const [suggestions, setSuggestions] = useState<{
    words: string[];
    wordIndex: number;
  }>({
    words: [],
    wordIndex: -1,
  });

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

  const moveToNextWord = useCallback(
    (index) => {
      if (index <= 10) {
        wordElRefs[index + 1].current!.setFocus();
      }
    },
    [wordElRefs]
  );

  const setWordByIndex = useCallback(
    (word, index) => {
      setPassphrase((prevState) => [
        ...prevState.slice(0, index),
        word,
        ...prevState.slice(index + 1),
      ]);
    },
    [setPassphrase]
  );

  const onFillSuggestedWord = useCallback(
    (e, word) => {
      e.preventDefault();

      if (suggestions.wordIndex < 0) {
        return;
      }

      setSuggestions({
        words: [],
        wordIndex: -1,
      });

      setWordByIndex(word, suggestions.wordIndex);
      moveToNextWord(suggestions.wordIndex);
    },
    [suggestions.wordIndex, moveToNextWord, setWordByIndex]
  );

  const onPassphraseWordChange = useCallback(
    (word, passphraseIndex) => {
      setSuggestions({
        words: CryptoUtils.suggestWords(word),
        wordIndex: passphraseIndex,
      });

      setWordByIndex(word, passphraseIndex);
    },
    [setWordByIndex, setSuggestions]
  );

  const onKeyDown = useCallback(
    (event, index) => {
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

      if (event.keyCode === 32) {
        moveToNextWord(index);
        return;
      }

      let charCode = String.fromCharCode(event.which).toLowerCase();
      if ((event.metaKey || event.ctrlKey) && charCode === 'v') {
        readFromClipboard();
      }
    },
    [setPassphrase, moveToNextWord]
  );

  return (
    <>
      <PassphraseBackground className="ion-padding">
        <IonRow>
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
                onKeyDown={(e) => onKeyDown(e, index)}
                onIonChange={({
                  detail: { value },
                }: CustomEvent<InputChangeEventDetail>) =>
                  onPassphraseWordChange(value, index)
                }
                ref={wordElRefs[index]}
              />
            </IonCol>
          ))}
        </IonRow>
      </PassphraseBackground>

      {suggestions.words && suggestions.words.length > 0 && (
        <SuggestionsRow>
          {suggestions.words.map((suggestion) => (
            <SuggestBtn
              key={suggestion}
              size="small"
              className="ion-text-lowercase"
              fontSize={FontSize.SM}
              fontWeight={FontWeight.BOLD}
              onClick={(e) => onFillSuggestedWord(e, suggestion)}
            >
              {suggestion}
            </SuggestBtn>
          ))}
        </SuggestionsRow>
      )}
    </>
  );
};

export default Passphrase;

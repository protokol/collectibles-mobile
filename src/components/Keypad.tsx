import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { JSX } from '@ionic/core';
import { IonCol } from '@ionic/react';
import { FontSize } from '../constants/font-size';
import Button from './ionic/Button';

const keypadNumbers: undefined[] = Array.from({ length: 9 });

const KeypadNumberBtn: React.FC<{
  onClick: MouseEventHandler;
  fontSize?: FontSize;
  size?: JSX.IonButton['size'];
}> = ({ children, onClick, fontSize = FontSize.M, size = 'large' }) => (
  <Button
    type="button"
    size={size}
    expand="block"
    fill="clear"
    color="light"
    fontSize={fontSize}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </Button>
);

const Keypad: React.FC<{
  onChange: (pin: string) => void;
  onEnter: () => void;
}> = ({ onChange, onEnter }) => {
  const [pin, setPin] = useState<string>('');

  const addPinNumber = useCallback(
    (digit: string) => {
      setPin((prevPin) => `${prevPin}${digit}`);
    },
    [setPin]
  );

  const deletePinNumber = useCallback(() => {
    setPin((prevPin) => {
      if (!prevPin.length) {
        return '';
      }
      return prevPin.slice(0, -1);
    });
  }, [setPin]);

  useEffect(() => {
    onChange(pin);
  }, [pin, onChange]);

  return (
    <>
      {keypadNumbers.map((_, index) => {
        const keypadDigit = (index + 1).toString();

        return (
          <IonCol key={index} size="4">
            <KeypadNumberBtn onClick={() => addPinNumber(keypadDigit)}>
              {keypadDigit}
            </KeypadNumberBtn>
          </IonCol>
        );
      })}
      <IonCol size="4" offset="4">
        <KeypadNumberBtn onClick={() => addPinNumber('0')}>0</KeypadNumberBtn>
      </IonCol>
      <IonCol size="4" offset="1">
        <KeypadNumberBtn
          size="default"
          fontSize={FontSize.SM}
          onClick={deletePinNumber}
        >
          Delete
        </KeypadNumberBtn>
      </IonCol>
      <IonCol size="4" offset="2">
        <KeypadNumberBtn
          size="default"
          fontSize={FontSize.SM}
          onClick={onEnter}
        >
          Enter
        </KeypadNumberBtn>
      </IonCol>
    </>
  );
};

export default Keypad;

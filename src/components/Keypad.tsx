import { FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { JSX } from '@ionic/core';
import { IonCol } from '@ionic/react';
import { FontSize } from '../constants/font-size';
import useMediaQuery from '../hooks/use-media-query';
import Button from './ionic/Button';

const MAX_PIN_LENGTH = 4;

const keypadNumbers: undefined[] = Array.from({ length: 9 });

const KeypadNumberBtn: FC<{
  onClick: MouseEventHandler;
  fontSize?: FontSize;
  size?: JSX.IonButton['size'];
  disabled?: boolean;
}> = ({
  children,
  onClick,
  fontSize = FontSize.M,
  size = 'large',
  disabled = false,
}) => (
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
    disabled={disabled}
  >
    {children}
  </Button>
);

const Keypad: FC<{
  onChange: (pin: string) => void;
  onEnter: () => void;
}> = ({ onChange, onEnter }) => {
  const [pin, setPin] = useState<string>('');
  const isMedium = useMediaQuery('(min-height: 600px)');
  const isLarge = useMediaQuery('(min-height: 700px)');

  const canAddPinNumber = useCallback(() => MAX_PIN_LENGTH > pin.length, [pin]);

  const addPinNumber = useCallback(
    (digit: string) => {
      if (canAddPinNumber()) {
        setPin((prevPin) => `${prevPin}${digit}`);
      }
    },
    [setPin, canAddPinNumber]
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

  const getColPadding = useCallback(() => {
    if (!isLarge && isMedium) {
      return 'ion-padding-vertical';
    }
    return '';
  }, [isLarge, isMedium]);

  return (
    <>
      {keypadNumbers.map((_, index) => {
        const keypadDigit = (index + 1).toString();

        return (
          <IonCol key={index} size="4" className={getColPadding()}>
            <KeypadNumberBtn
              size={isLarge ? 'large' : 'default'}
              disabled={!canAddPinNumber()}
              onClick={() => addPinNumber(keypadDigit)}
            >
              {keypadDigit}
            </KeypadNumberBtn>
          </IonCol>
        );
      })}
      <IonCol size="4" offset="4" className={getColPadding()}>
        <KeypadNumberBtn
          size={isLarge ? 'large' : 'default'}
          disabled={!canAddPinNumber()}
          onClick={() => addPinNumber('0')}
        >
          0
        </KeypadNumberBtn>
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

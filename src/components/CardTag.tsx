import { FC } from 'react';
import styled from 'styled-components';
import { FontSize } from '../constants/font-size';
import Text from './ionic/Text';

const CardTagStyled = styled.div`
  position: absolute;
  width: 56%;
  top: -5%;
  right: -5%;
`;

const CardTagText = styled(Text)`
  position: absolute;
  top: 15%;
  right: 29%;
  font-size: ${FontSize.XS};

  @media only screen and (min-width: 992px) {
    font-size: ${FontSize.M};
  }

  @media only screen and (min-width: 1200px) {
    font-size: ${FontSize.L};
  }
`;

export enum CardTagType {
  None = 'none',
  Signed = 'signed',
  Limited = 'limited',
}

const tagTypeToColor = (type?: CardTagType) => {
  switch (type) {
    case CardTagType.Signed:
      return '#8AC827';
    case CardTagType.Limited:
      return '#FCCF45';
    case CardTagType.None:
    default:
      return '';
  }
};

const CardTag: FC<{ type?: CardTagType }> = ({ type = CardTagType.None }) =>
  type !== CardTagType.None ? (
    <CardTagStyled>
      <svg
        viewBox="0 0 2000 500"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="190"
          y="0"
          width="90%"
          height="100%"
          transform="skewX(-20)"
          fill={tagTypeToColor(type)}
        />
      </svg>
      <CardTagText color="light" className="ion-text-uppercase">
        {type}!
      </CardTagText>
    </CardTagStyled>
  ) : (
    <></>
  );

export default CardTag;

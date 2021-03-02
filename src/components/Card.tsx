import React from 'react';
import styled from 'styled-components';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { driverImage } from '../constants/images';
import Img from './ionic/Img';
import Text from './ionic/Text';
import Title from './ionic/Title';

const CardStyled = styled.div`
  position: relative;
  overflow: visible;
`;

const CardTitle = styled(Title)`
  font-size: 0.875rem;
  padding-bottom: 0.1rem;
`;

const CardSubTitle = styled(Title)`
  padding-bottom: 0.1rem;
`;

const CardAvailabilityTitle = styled(Title)`
  font-size: 0.625rem;
  font-style: italic;
  opacity: 0.5;
  padding-bottom: 0.1rem;
`;

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
  font-size: 0.625rem;
`;

const CardTag: React.FC = () => (
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
        fill="#8AC827"
      />
    </svg>
    <CardTagText color="light" className="ion-text-uppercase">
      Signed!
    </CardTagText>
  </CardTagStyled>
);

const Card: React.FC = () => {
  return (
    <CardStyled>
      <CardTag />
      <Img {...driverImage} />
      <CardTitle
        className="ion-no-padding ion-text-left"
        fontWeight={FontWeight.BOLD}
      >
        Corey LaJoie
      </CardTitle>
      <CardSubTitle className="ion-no-padding" fontSize={FontSize.SM}>
        Go Fas Racing
      </CardSubTitle>
      <CardAvailabilityTitle className="ion-no-padding">
        30/500 Cards Available
      </CardAvailabilityTitle>
    </CardStyled>
  );
};

export default Card;

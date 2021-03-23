import { FC } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { addIPFSGatewayPrefix } from '../constants/images';
import CardTag, { CardTagType } from './CardTag';
import Img from './ionic/Img';
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

const Card: FC<{
  id: string;
  title: string;
  subtitle: string;
  imgIpfsHash: string;
  details?: string;
  type?: CardTagType;
}> = ({ id, title, subtitle, details, imgIpfsHash, type }) => {
  const history = useHistory();

  return (
    <CardStyled onClick={() => history.push(`/home/card/${id}`)}>
      <CardTag type={type} />
      <Img src={addIPFSGatewayPrefix(imgIpfsHash)} />
      {title && (
        <CardTitle
          className="ion-no-padding ion-text-left"
          fontWeight={FontWeight.BOLD}
        >
          {title}
        </CardTitle>
      )}
      {subtitle && (
        <CardSubTitle className="ion-no-padding" fontSize={FontSize.SM}>
          {subtitle}
        </CardSubTitle>
      )}
      {details && (
        <CardAvailabilityTitle className="ion-no-padding">
          30/500 Cards Available
        </CardAvailabilityTitle>
      )}
    </CardStyled>
  );
};

export default Card;

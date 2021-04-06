import { arrowBackOutline } from 'ionicons/icons';
import { FC } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { IonButton, IonIcon } from '@ionic/react';

const BackButtonContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
`;

const BackButton: FC = () => {
  const history = useHistory();

  return (
    <BackButtonContainer>
      <IonButton
        size="default"
        expand="block"
        fill="clear"
        className="ion-no-margin ion-no-padding"
        color="light"
        onClick={() => history.goBack()}
      >
        <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
      </IonButton>
    </BackButtonContainer>
  );
};

export default BackButton;

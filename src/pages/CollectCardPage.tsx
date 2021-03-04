import React from 'react';
import styled from 'styled-components';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import Header from '../components/Header';
import { driverHighResImage } from '../constants/images';

const ImageBgCol = styled(IonCol)`
  position: absolute;
  overflow: hidden;
  height: calc(100vh - 3.5rem);
  background: var(--app-color-black);

  &:after {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.45;
    background-image: url('${driverHighResImage.src}');
    background-size: 350%;
    background-repeat: no-repeat;
    background-position: 75% 15%;
  }
`;

const CollectCardPage: React.FC = () => {
  return (
    <IonPage>
      <Header contentId="collect-card-content" />

      <IonContent fullscreen id="collect-card-content">
        <IonGrid className="ion-no-padding">
          <IonRow>
            <ImageBgCol size="12" />
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CollectCardPage;

import { menuOutline, searchOutline } from 'ionicons/icons';
import { FC } from 'react';
import styled from 'styled-components';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonToolbar,
} from '@ionic/react';
import { FontSize } from '../constants/font-size';
import Title from './ionic/Title';

const HeaderToolbar = styled(IonToolbar)`
  --background: var(--app-color-dark-cyan-blue);
`;

const SubHeaderToolbar = styled(IonToolbar)`
  display: flex;
  align-items: center;
  max-height: 2.25rem;
  --background: var(--app-color-dark-cyan-blue);
`;

const Header: FC<{
  title?: string;
  buttonTopLeft?: JSX.Element;
}> = ({ children, title, buttonTopLeft }) => {
  return (
    <IonHeader className="ion-no-border">
      <HeaderToolbar>
        <IonButtons slot="start">
          {buttonTopLeft ? (
            <>{buttonTopLeft}</>
          ) : (
            <IonMenuButton menu="main-menu" auto-hide="false">
              <IonIcon color="light" icon={menuOutline} />
            </IonMenuButton>
          )}
        </IonButtons>
        <IonButtons slot="primary">
          <IonButton>
            <IonIcon color="light" slot="icon-only" icon={searchOutline} />
          </IonButton>
        </IonButtons>

        <Title color="light" fontSize={FontSize.L} className="ion-text-center">
          {title}
        </Title>
      </HeaderToolbar>
      {children && (
        <SubHeaderToolbar className="ion-no-padding">
          {children}
        </SubHeaderToolbar>
      )}
    </IonHeader>
  );
};

export default Header;

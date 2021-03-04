import {
  arrowBackOutline,
  homeOutline,
  menuOutline,
  searchOutline,
  personOutline,
} from 'ionicons/icons';
import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenu,
  IonMenuButton,
  IonToolbar,
} from '@ionic/react';
import { FontSize } from '../constants/font-size';
import Label from './ionic/Label';
import Title from './ionic/Title';

const Menu = styled(IonMenu)`
  --background: var(--app-color-dark-cyan-blue);
  --max-width: 70vw;
`;

const MenuHeaderToolbar = styled(IonToolbar)`
  --background: var(--app-color-dark-cyan-blue);
`;

const MenuContentToolbar = styled(IonContent)`
  --background: var(--app-color-dark-cyan-blue);
`;

const MenuCloseButton = styled(IonButton)`
  &&&& {
    margin-left: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
  }
`;

const MenuItemIcon = styled(IonIcon)`
  &&&& {
    margin-left: 1rem;
    margin-right: 1.25rem;
  }
`;

const MenuItemLabel = styled(Label)`
  &&&& {
    margin-top: 1.125rem;
    margin-bottom: 1.125rem;
  }
`;

const HeaderToolbar = styled(IonToolbar)`
  --background: var(--app-color-dark-cyan-blue);
`;

const SubHeaderToolbar = styled(IonToolbar)`
  display: flex;
  align-items: center;
  max-height: 2.25rem;
  --background: var(--app-color-dark-cyan-blue);
`;

const MenuItem: React.FC<{ icon: string; label: string }> = ({
  icon,
  label,
}) => (
  <IonItem lines="none" class="app-bg-color-transparent">
    <MenuItemIcon color="light" icon={icon} slot="start" />
    <MenuItemLabel
      className="ion-text-uppercase"
      color="light"
      fontSize={FontSize.SM}
    >
      {label}
    </MenuItemLabel>
  </IonItem>
);

const Header: React.FC<{
  contentId?: string;
}> = ({ children, contentId = 'home-content' }) => {
  const homeMenuRef = useRef<HTMLIonMenuElement | null>();

  const onMenuClose = useCallback(
    (e) => {
      e.preventDefault();

      if (!homeMenuRef.current) {
        return;
      }

      homeMenuRef.current.close(true);
    },
    [homeMenuRef]
  );

  return (
    <>
      <Menu
        ref={(menuRef) => {
          homeMenuRef.current = menuRef;
        }}
        side="start"
        content-id={contentId}
        menuId="home-menu"
      >
        <IonHeader className="ion-no-border">
          <MenuHeaderToolbar>
            <IonButtons slot="start">
              <MenuCloseButton onClick={onMenuClose}>
                <IonIcon
                  color="light"
                  slot="icon-only"
                  icon={arrowBackOutline}
                />
              </MenuCloseButton>
            </IonButtons>
          </MenuHeaderToolbar>
        </IonHeader>
        <MenuContentToolbar>
          <IonList color="none" class="app-bg-color-transparent">
            <MenuItem icon={homeOutline} label="Home" />
            <MenuItem icon={personOutline} label="My Profile" />
          </IonList>
        </MenuContentToolbar>
      </Menu>

      <IonHeader className="ion-no-border">
        <HeaderToolbar>
          <IonButtons slot="start">
            <IonMenuButton menu="home-menu" auto-hide="false">
              <IonIcon color="light" icon={menuOutline} />
            </IonMenuButton>
          </IonButtons>
          <IonButtons slot="primary">
            <IonButton>
              <IonIcon color="light" slot="icon-only" icon={searchOutline} />
            </IonButton>
          </IonButtons>

          <Title
            color="light"
            fontSize={FontSize.M}
            className="ion-text-center"
          >
            Home
          </Title>
        </HeaderToolbar>
        {children && (
          <SubHeaderToolbar className="ion-no-padding">
            {children}
          </SubHeaderToolbar>
        )}
      </IonHeader>
    </>
  );
};

export default Header;

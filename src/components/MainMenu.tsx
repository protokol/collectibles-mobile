import {
  arrowBackOutline,
  homeOutline,
  lockOpenOutline,
  personOutline,
} from 'ionicons/icons';
import { FC, useCallback, useContext, useRef } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Plugins } from '@capacitor/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenu,
  IonToolbar,
  isPlatform,
} from '@ionic/react';
import { APP_PRIVACY_URL } from '../constants/external-links';
import { FontSize } from '../constants/font-size';
import {
  AuthLoginContext,
  AuthLoginState,
} from '../providers/AuthLoginProvider';
import Label from './ionic/Label';

const { Browser } = Plugins;

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

const MenuItem: FC<{
  icon: string;
  label: string;
  navigateTo?: string;
  onMenuClose: () => void;
  onNavigate?: () => void;
}> = ({ icon, label, navigateTo, onMenuClose, onNavigate }) => {
  const history = useHistory();

  const onNavigateClick = useCallback(
    (navigateTo) => {
      history.push(navigateTo);
    },
    [history]
  );

  return (
    <IonItem lines="none" class="app-bg-color-transparent">
      <MenuItemIcon color="light" icon={icon} slot="start" />
      <MenuItemLabel
        className="ion-text-uppercase"
        color="light"
        fontSize={FontSize.SM}
        onClick={() => {
          if (navigateTo) {
            onNavigateClick(navigateTo);
            onMenuClose();
          } else if (onNavigate) {
            onNavigate();
            onMenuClose();
          }
        }}
      >
        {label}
      </MenuItemLabel>
    </IonItem>
  );
};

const MainMenu: FC = () => {
  const {
    session: { state },
  } = useContext(AuthLoginContext);

  const homeMenuRef = useRef<HTMLIonMenuElement | null>();

  const onMenuClose = useCallback(
    (e?) => {
      if (e) {
        e.preventDefault();
      }

      if (!homeMenuRef.current) {
        return;
      }

      homeMenuRef.current.close(true);
    },
    [homeMenuRef]
  );

  const onNavigateToPrivacyPage = useCallback(() => {
    if (isPlatform('capacitor')) {
      Browser.open({ url: APP_PRIVACY_URL });
    } else {
      window.open(APP_PRIVACY_URL, '_blank');
    }
  }, []);

  if (state !== AuthLoginState.LoggedIn) {
    return <></>;
  }

  return (
    <Menu
      ref={(menuRef) => {
        homeMenuRef.current = menuRef;
      }}
      side="start"
      content-id="main-content"
      menu-id="main-menu"
    >
      <IonHeader className="ion-no-border">
        <MenuHeaderToolbar>
          <IonButtons slot="start">
            <MenuCloseButton onClick={(e) => onMenuClose(e)}>
              <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
            </MenuCloseButton>
          </IonButtons>
        </MenuHeaderToolbar>
      </IonHeader>
      <MenuContentToolbar>
        <IonList color="none" class="app-bg-color-transparent">
          <MenuItem
            icon={homeOutline}
            label="Home"
            navigateTo="/home"
            onMenuClose={onMenuClose}
          />
          <MenuItem
            icon={personOutline}
            label="My Profile"
            navigateTo="/home/profile"
            onMenuClose={onMenuClose}
          />
          <MenuItem
            icon={lockOpenOutline}
            label="Privacy"
            onNavigate={() => onNavigateToPrivacyPage()}
            onMenuClose={onMenuClose}
          />
        </IonList>
      </MenuContentToolbar>
    </Menu>
  );
};

export default MainMenu;

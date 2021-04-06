import { arrowBackOutline } from 'ionicons/icons';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Subscription } from 'rxjs';
import styled from 'styled-components';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import Header from '../components/Header';

declare const window: any;

const Content = styled(IonContent)`
  opacity: 0;
`;

const ScanQRPage: FC = () => {
  const history = useHistory();

  useEffect(() => {
    let scanSubscription: Subscription;

    const onInitQrScanner = async () => {
      try {
        const status: QRScannerStatus = await QRScanner.prepare();

        if (status.authorized) {
          await QRScanner.show();
          window.document.querySelector('ion-app').classList.add('camera-view');

          scanSubscription = QRScanner.scan().subscribe(
            (collectionId: string) => {
              // TODO: Validate text if it is valid collection id
              history.replace(`/home/collect-card/${collectionId}`);
            }
          );
        } else if (status.denied) {
          // camera permission was permanently denied
        } else {
          // permission was denied, but not permanently
        }
      } catch (e) {
        console.error(e);
      }
    };

    onInitQrScanner();

    return () => {
      if (scanSubscription) {
        scanSubscription.unsubscribe();
      }
      window.document.querySelector('ion-app').classList.remove('camera-view');
      QRScanner.hide();
      QRScanner.destroy();
    };
  }, [history]);

  return (
    <IonPage>
      <Header
        title="Collect Cards"
        buttonTopLeft={
          <IonButton onClick={() => history.replace('/home')}>
            <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        }
      />

      <Content fullscreen id="main-content" />
    </IonPage>
  );
};

export default ScanQRPage;

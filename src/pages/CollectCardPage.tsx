import React, { useEffect } from 'react';
import { Subscription } from 'rxjs';
import styled from 'styled-components';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { IonPage, IonContent } from '@ionic/react';
import Header from '../components/Header';

declare const window: any;

const Content = styled(IonContent)`
  opacity: 0;
`;

const CollectCardPage: React.FC = () => {
  useEffect(() => {
    let scanSubscription: Subscription;

    const onInitQrScanner = async () => {
      try {
        const status: QRScannerStatus = await QRScanner.prepare();

        if (status.authorized) {
          await QRScanner.show();
          window.document.querySelector('ion-app').classList.add('camera-view');

          scanSubscription = QRScanner.scan().subscribe((text: string) => {
            console.log('text', text);
          });
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
  }, []);

  return (
    <IonPage>
      <Header title="Collect Cards" contentId="collect-card-content" />

      <Content fullscreen id="collect-card-content" />
    </IonPage>
  );
};

export default CollectCardPage;

import { arrowBackOutline } from 'ionicons/icons';
import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Subscription } from 'rxjs';
import styled from 'styled-components';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import Header from '../components/Header';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';

declare const window: any;

const Content = styled(IonContent)`
  opacity: 0;
`;

const InstructionText = styled(Text)`
  text-align: center;
  padding-left: 4rem;
  padding-right: 4rem;
  margin-bottom: 20vh;
`;

const ScanQRPage: FC = () => {
  const history = useHistory();

  useEffect(() => {
    let scanSubscription: Subscription;

    const onInitQrScanner = async () => {
      try {
        const status: QRScannerStatus = await QRScanner.prepare();
        if (status.authorized) {
          console.log("BBBB");
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
          <IonButton onClick={() => history.goBack()}>
            <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        }
      />

      <Content fullscreen id="main-content" />
      <InstructionText fontSize={FontSize.SM} color="light">
        Align the QR code inside the marked area, and receive the hero card.
      </InstructionText>
    </IonPage>
  );
};

export default ScanQRPage;

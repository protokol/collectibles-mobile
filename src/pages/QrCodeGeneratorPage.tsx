import QRCode from 'qrcode.react';
import React from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { IonContent, IonPage } from '@ionic/react';

const QR_CODE_SIZE = 256;

const Content = styled(IonContent)`
  position: relative;
`;

const QRCodeStyled = styled(QRCode)`
  position: absolute;
  left: calc(50% - ${QR_CODE_SIZE / 2}px);
  top: calc(50% - ${QR_CODE_SIZE / 2}px);
`;

/**
 * Qr Code generator page, which generates QR code based on passed in GUID
 */
const QrCodeGeneratorPage: React.FC = () => {
  let { id } = useParams();

  return (
    <IonPage>
      <Content>
        {id && <QRCodeStyled renderAs="svg" size={QR_CODE_SIZE} value={id} />}
      </Content>
    </IonPage>
  );
};

export default QrCodeGeneratorPage;

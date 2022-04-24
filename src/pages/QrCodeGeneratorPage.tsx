import QRCode from 'qrcode.react';
import { FC, useMemo } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { IonCol, IonContent, IonPage, IonRow, IonSpinner } from '@ionic/react';
import { BaseResourcesTypes } from '@protokol/client';
import Text from '../components/ionic/Text';
import { FontSize } from '../constants/font-size';
import { addIPFSGatewayPrefix } from '../constants/images';
import useFetch from '../hooks/use-fetch';

const QR_CODE_SIZE = 256;
const QR_CODE_BG_SIZE = QR_CODE_SIZE + 48;

const Content = styled(IonContent)`
  position: relative;
`;

const CollectionBg = styled.div<{
  bgUrl: string;
}>`
  position:  fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1000;
  ${({ bgUrl }) => `background-image: url("${bgUrl}");`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const QRCodeBg = styled.div`
  position: absolute;
  left: calc(50% - ${QR_CODE_BG_SIZE / 2}px);
  top: calc(50% - ${QR_CODE_BG_SIZE / 2}px);
  height: ${QR_CODE_BG_SIZE}px;
  width: ${QR_CODE_BG_SIZE}px;
  background: white;
  z-index: 1001;
`;

const QRCodeStyled = styled(QRCode)`
  position: absolute;
  left: calc(50% - ${QR_CODE_SIZE / 2}px);
  top: calc(50% - ${QR_CODE_SIZE / 2}px);
  z-index: 1002;
`;

/**
 * Qr Code generator page, which generates QR code based on passed in GUID
 */
const QrCodeGeneratorPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { isLoading, error, data } = useFetch<BaseResourcesTypes.Collections>(
    `/api/nft/collections/${id}`
  );

  const imageIpfs = useMemo(() => {
    const metadata = data?.metadata as any;
    return metadata?.ipfsHashImageFront;
  }, [data]);

  return (
    <IonPage>
      <Content>
        <IonRow>
          {isLoading && (
            <IonCol size="12" class="ion-text-center ion-padding-top">
              <IonSpinner color="primary" />
            </IonCol>
          )}
          {!isLoading && error && (
            <IonCol size="12" class="ion-text-center ion-padding-top">
              <Text color="danger" fontSize={FontSize.XXL}>
                Something went wrong!
              </Text>
              <Text
                className="ion-padding-top"
                fontSize={FontSize.SM}
                color="light"
              >
                {error?.toString()}
              </Text>
            </IonCol>
          )}
          {!isLoading && !error && imageIpfs && id && (
            <>
              <CollectionBg bgUrl={addIPFSGatewayPrefix(imageIpfs)} />
              <QRCodeBg />
              <QRCodeStyled renderAs="svg" size={QR_CODE_SIZE} value={id} />
            </>
          )}
        </IonRow>
      </Content>
    </IonPage>
  );
};

export default QrCodeGeneratorPage;

import { format } from 'date-fns';
import GoogleMap from 'google-map-react';
import { arrowBackOutline, locationOutline } from 'ionicons/icons';
import { FC, useCallback, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import styled from 'styled-components';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { BaseResourcesTypes } from '@protokol/client';
import {
  DetailCard,
  DetailCards,
  DetailIconCard,
} from '../components/DetailCards';
import Header from '../components/Header';
import Img from '../components/ionic/Img';
import { addIPFSGatewayPrefix } from '../constants/images';
import { collectionSelector } from '../store/selectors/collections';
import { MapUtils } from '../utils/map-utils';

const IonColCards = styled(IonCol)`
  --padding-start: 0.5rem;
  padding-top: 0.5rem;
`;

const GoogleMapContainer = styled.div`
  height: 300px;
  width: 100%;
  padding: 0.25rem 1.25rem 2rem;
`;

const CardDetails: FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const history = useHistory();
  const { assets } = useSelector(collectionSelector, shallowEqual);
  const {
    attributes,
    timestamp: { unix },
  } = useMemo(() => assets.flat().find(({ id }) => id === assetId), [
    assets,
    assetId,
  ]) as BaseResourcesTypes.Assets;

  const {
    ipfsHashImageFront,
    title,
    carNumber,
    season,
    issuedLocation,
    issuedAddress,
    description,
  } = attributes as any;

  const onGoogleMapsLoaded = useCallback(
    async (maps) => {
      const geocoder = new maps.Geocoder();

      geocoder.geocode(
        { address: issuedAddress },
        (results: any, status: string) => {
          if (status === 'OK') {
            const [result] = results;
            const latLng = {
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
            };
            console.log('latLng', latLng);
          } else {
            console.error('Geocode failed: ' + status);
          }
        }
      );
    },
    [issuedAddress]
  );

  return (
    <IonPage>
      <Header
        title={title}
        buttonTopLeft={
          <IonButton onClick={() => history.replace('/home')}>
            <IonIcon color="light" slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        }
      />

      <IonContent fullscreen>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol className="ion-no-padding" size="12">
              <Img src={addIPFSGatewayPrefix(ipfsHashImageFront)} />
            </IonCol>
            <IonColCards className="ion-no-padding ion-no-margin" size="12">
              <DetailCards>
                <DetailCard size="4" title="CAR NUMBER" subtitle={carNumber} />
                <DetailCard size="4" title="SEASON" subtitle={season} />
                <DetailCard
                  size="4"
                  title="COLLECTED ON"
                  subtitle={format(new Date(unix), 'MM/dd/yyyy')}
                />
              </DetailCards>
              <DetailCards>
                <DetailCard size="12" description={description} />
              </DetailCards>
              <DetailCards>
                <DetailIconCard
                  size="12"
                  icon={locationOutline}
                  title={issuedLocation}
                  subtitle={issuedAddress}
                />
              </DetailCards>
            </IonColCards>
            <IonCol size="12">
              <GoogleMapContainer>
                <GoogleMap
                  options={{
                    styles: MapUtils.MapStyles(),
                  }}
                  bootstrapURLKeys={{
                    key: 'AIzaSyAzYuxD62y_TmSlgLXhfXywHrNLCsR4a40',
                  }}
                  defaultCenter={{
                    lat: 52.3676,
                    lng: 4.9041,
                  }}
                  defaultZoom={11}
                  onGoogleApiLoaded={({ maps }) => onGoogleMapsLoaded(maps)}
                  yesIWantToUseGoogleMapApiInternals
                />
              </GoogleMapContainer>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CardDetails;

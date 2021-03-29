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
import { Icons } from '../utils/icons';
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
    issuedLocationLng: lng,
    issuedLocationLat: lat,
  } = attributes as any;

  const onGoogleMapsLoaded = useCallback(
    (maps, map) => {
      new maps.Marker({
        position: new maps.LatLng(lat, lng),
        map,
        title: issuedLocation,
        icon: {
          url: Icons.LOCATION_BASE_64,
          fillColor: 'white',
          scaledSize: new maps.Size(20, 20),
        },
      });
    },
    [lat, lng, issuedLocation]
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
            {lat && lng && (
              <IonCol size="12">
                <GoogleMapContainer>
                  <GoogleMap
                    options={{
                      styles: MapUtils.MapStyles(),
                      disableDefaultUI: true,
                      scrollwheel: false,
                      disableDoubleClickZoom: true,
                      draggable: false,
                      fullscreenControl: false,
                    }}
                    bootstrapURLKeys={{
                      key: 'AIzaSyAzYuxD62y_TmSlgLXhfXywHrNLCsR4a40',
                    }}
                    defaultCenter={{
                      lat,
                      lng,
                    }}
                    defaultZoom={13}
                    onGoogleApiLoaded={({ maps, map }) =>
                      onGoogleMapsLoaded(maps, map)
                    }
                    yesIWantToUseGoogleMapApiInternals
                  />
                </GoogleMapContainer>
              </IonCol>
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CardDetails;

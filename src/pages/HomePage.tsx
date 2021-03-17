import { FC, useContext } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import Header from '../components/Header';
import HomeCollections from '../components/HomeCollections';
import {
  Panel,
  Tab,
  Tabs,
  TabsContextProvider,
  TabsState,
} from '../components/Tabs';
import Button from '../components/ionic/Button';
import Label from '../components/ionic/Label';
import Text from '../components/ionic/Text';
import Title from '../components/ionic/Title';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import { welcomeImage } from '../constants/images';

const Content = styled(IonContent)<{
  isDarkBg: boolean;
}>`
  ${({ isDarkBg }) =>
    isDarkBg && '--background: var(--app-color-dark-cyan-blue);'}
`;

const TabTitle = styled(Title)`
  line-height: 2rem;
`;

const ImageBgCol = styled(IonCol)`
  position: relative;
  padding: 3.5rem 2.05rem 1.85rem 1.5rem;
  overflow: hidden;
  z-index: 2;

  &:after {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.5;
    background-image: url('${welcomeImage.src}');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 0;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;

const StartCollectionButton = styled(Button)`
  text-decoration: underline;
`;

const BannerCol = styled(IonCol)`
  padding: 2.25rem;
  background: var(--ion-color-light);
  text-align: center;
`;

const BannerText = styled(Text)`
  color: var(--app-color-gray);
`;

const ActionButton = styled(Button)`
  height: 3.4375rem;
  --padding-top: 1.625rem;
  --padding-bottom: 1.8125rem;

  &.bg-gray {
    --background: var(--app-color-gray);
  }

  &.bg-charade {
    --background: var(--app-color-charade);
  }

  &.bg-dark-blue-magenta {
    --background: var(--app-color-dark-blue-magenta);
  }
`;

const HomeContent: FC = ({ children }) => {
  const [activeIndex] = useContext(TabsState);

  return (
    <Content fullscreen id="home-content" isDarkBg={activeIndex <= 0}>
      {children}
    </Content>
  );
};

const HomePage: FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <TabsContextProvider>
        <Header>
          <Tabs>
            <Tab>
              <TabTitle
                className="ion-text-uppercase ion-text-center"
                fontSize={FontSize.XS}
                color="light"
              >
                Home
              </TabTitle>
            </Tab>
            <Tab>
              <TabTitle
                className="ion-text-uppercase ion-text-center"
                fontSize={FontSize.XS}
                color="light"
              >
                Collectables
              </TabTitle>
            </Tab>
          </Tabs>
        </Header>

        <HomeContent>
          <Panel>
            <IonGrid className="ion-no-padding">
              <IonRow>
                <ImageBgCol size="12">
                  <Label
                    color="light"
                    fontSize={FontSize.M}
                    fontWeight={FontWeight.BOLD}
                  >
                    Collecting Digital Hero Cards Is Easy!
                  </Label>
                  <br />
                  <Text
                    className="ion-margin-vertical"
                    color="light"
                    fontSize={FontSize.XS}
                  >
                    Now you can find your favourite cards via the official
                    NASCAR app, and digitally collect them! You can also scan QR
                    codes at races, or buy cards at the market place.
                  </Text>
                  <br />
                  <StartCollectionButton
                    className="ion-float-right"
                    color="light"
                    fill="clear"
                    fontSize={FontSize.SM}
                    fontWeight={FontWeight.BOLD}
                  >
                    Start collecting
                  </StartCollectionButton>
                </ImageBgCol>
                <BannerCol>
                  <BannerText
                    fontSize={FontSize.M}
                    fontWeight={FontWeight.BOLD}
                  >
                    Gentlemen,
                    <br />
                    start your engines…
                  </BannerText>
                </BannerCol>
                <IonCol size="12">
                  <ActionButton
                    expand="block"
                    className="ion-text-uppercase ion-no-margin bg-gray"
                    fontSize={FontSize.SM}
                    fontWeight={FontWeight.BOLD}
                    onClick={() => history.push('/home/collect-card')}
                  >
                    Add new card
                  </ActionButton>
                  <ActionButton
                    expand="block"
                    className="ion-text-uppercase ion-no-margin bg-dark-blue-magenta"
                    fontSize={FontSize.SM}
                    fontWeight={FontWeight.BOLD}
                    onClick={() => history.push('/home/collect-card')}
                  >
                    Scan qr code
                  </ActionButton>
                  {/*<ActionButton
                    expand="block"
                    className="ion-text-uppercase ion-no-margin bg-charade"
                    fontSize={FontSize.SM}
                    fontWeight={FontWeight.BOLD}
                  >
                    Buy a card
                  </ActionButton>
                  <ActionButton
                    expand="block"
                    className="ion-text-uppercase ion-no-margin bg-gray"
                    fontSize={FontSize.SM}
                    fontWeight={FontWeight.BOLD}
                  >
                    Earn a card
                  </ActionButton>
                  <ActionButton
                    expand="block"
                    className="ion-text-uppercase ion-no-margin bg-dark-blue-magenta"
                    fontSize={FontSize.SM}
                    fontWeight={FontWeight.BOLD}
                  >
                    Sell cards
                  </ActionButton>
                  <ActionButton
                    expand="block"
                    className="ion-text-uppercase ion-no-margin bg-gray"
                    fontSize={FontSize.SM}
                    fontWeight={FontWeight.BOLD}
                  >
                    Start an auction
                  </ActionButton>*/}
                </IonCol>
              </IonRow>
            </IonGrid>
          </Panel>

          <Panel>
            <HomeCollections />
          </Panel>
        </HomeContent>
      </TabsContextProvider>
    </IonPage>
  );
};

export default HomePage;
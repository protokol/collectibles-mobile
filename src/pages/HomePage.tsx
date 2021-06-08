import { FC, useContext } from 'react';
import styled from 'styled-components';
import { IonContent, IonPage } from '@ionic/react';
import Header from '../components/Header';
import Home from '../components/Home';
import HomeCollectibles from '../components/HomeCollectibles';
import HomeMarket from '../components/HomeMarket';
import {
  Panel,
  Tab,
  Tabs,
  TabsContextProvider, 
  TabsState,
} from '../components/Tabs';
import Title from '../components/ionic/Title';
import { FontSize } from '../constants/font-size';

const Content = styled(IonContent)<{
  isDarkBg: boolean;
}>`
  overflow: hidden;
  ${({ isDarkBg }) =>
    isDarkBg && '--background: var(--app-color-dark-cyan-blue);'}
`;

const TabTitle = styled(Title)`
  line-height: 2rem;
`;

const HomeContent: FC = () => {  
  const [activeIndex] = useContext(TabsState);

  return (
    <Content id="main-content" fullscreen isDarkBg={activeIndex === 0}>
      <Panel>
        <Home />
      </Panel>

      <Panel>
        <HomeCollectibles />
      </Panel>

      <Panel>
        <HomeMarket />
      </Panel>
    </Content>
  );
};

const HomePage: FC = () => {
  return (
    <IonPage>
      <TabsContextProvider activeIndex={0}>
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
                Collectibles
              </TabTitle>
            </Tab>
            <Tab>
              <TabTitle
                className="ion-text-uppercase ion-text-center"
                fontSize={FontSize.XS}
                color="light"              
              >
                Market
              </TabTitle>
            </Tab>            
          </Tabs>
        </Header>
        <HomeContent/>
      </TabsContextProvider>
    </IonPage>
  );
};

export default HomePage;
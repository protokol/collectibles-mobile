import React from 'react';
import styled from 'styled-components';
import { IonContent, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { Panel, Tab, Tabs, TabsContextProvider } from '../components/Tabs';
import Text from '../components/ionic/Text';
import Title from '../components/ionic/Title';
import { FontSize } from '../constants/font-size';

const Content = styled(IonContent)`
  --background: var(--app-dark-cyan-blue);
`;

const TabTitle = styled(Title)`
  line-height: 2rem;
`;

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <TabsContextProvider>
        <Header>
          <Tabs>
            <Tab>
              <TabTitle
                className="ion-text-uppercase ion-text-left"
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
            <Tab>
              <TabTitle
                className="ion-text-uppercase ion-text-right"
                fontSize={FontSize.XS}
                color="light"
              >
                Market
              </TabTitle>
            </Tab>
          </Tabs>
        </Header>

        <Content fullscreen id="home-content">
          <Panel>
            <Text color="light">Home</Text>
          </Panel>

          <Panel>
            <Text color="light">Collectables</Text>
          </Panel>

          <Panel>
            <Text color="light">Market</Text>
          </Panel>
        </Content>
      </TabsContextProvider>
    </IonPage>
  );
};

export default HomePage;

import { FC } from 'react';
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
} from '../components/Tabs';
import Title from '../components/ionic/Title';
import { FontSize } from '../constants/font-size';


const TabTitle = styled(Title)`
  line-height: 2rem;
`;

const MarketContent: FC<{menu?:string}> = ({menu}) => {
  console.log("Menu in @ MarketContent:" + menu);

  return (
    <IonContent id="main-content" fullscreen>
      <Panel>
        <Home />
      </Panel>

      <Panel>
        <HomeCollectibles />
      </Panel>

      <Panel>
        <HomeMarket menu={menu}/>
      </Panel>
    </IonContent>    
  );
};

const HomeMarketPage: FC<{menu?:string}> = ({menu}) => {  
  
  return (
    <IonPage>
      <TabsContextProvider activeIndex={2}>
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
        <MarketContent menu={menu}/>        
      </TabsContextProvider>
    </IonPage>
  );
};

export default HomeMarketPage;
import {
  cloneElement,
  createContext,
  Dispatch,
  FC,
  isValidElement,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import useConstant from '../hooks/use-constant';

const TabsStyled = styled.ul<{ tabsLength: number }>`
  position: relative;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: --var(--app-dark-cyan-blue);

  &:after {
    content: ' ';
    display: table;
    clear: both;
  }

  > li {
    float: left;
    width: ${({ tabsLength }) => (100 / tabsLength).toFixed(2)}%;
    padding-bottom: 0.25rem;
    text-align: center;

    &.slider {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background-color: var(--ion-color-danger);
      transform-origin: 0 0;
      transition: transform 0.25s;
    }

    ${({ tabsLength }) =>
      Array.from(
        { length: tabsLength },
        (_, index) => `
      :nth-child(${index + 1}).active ~ .slider {
        transform: translateX(calc(${(100 / tabsLength).toFixed(
          2
        )}% * ${index})) scaleX(${(100 / tabsLength / 100).toFixed(2)});
}
    `
      ).join(' ')}
  }
`;

type UseNumberState = [number, Dispatch<SetStateAction<number>>];
interface ElementsStateContextType {
  tabs: number;
  panels: number;
}

export enum MarketContentSelector {
  ContentAuctionableCards = 'myauctionablecards',
  ContentAuctionsMyAuctions = 'myauctions',
  ContentAuctionParticipateIn = 'participateinauction',
  ContentAuctionMyBiddedCards = 'mybids',
  ContentDefault = 'default',
}


export const TabsState = createContext<UseNumberState>(([
  0,
  () => {},
] as unknown) as UseNumberState);
const Elements = createContext<ElementsStateContextType>({
  tabs: 0,
  panels: 0,
});

export const TabsContextProvider: FC<{ state?: UseNumberState, activeIndex?: number}> = ({
  state: outerState,
  activeIndex,
  children,
}) => {
  const innerState = useState(activeIndex || 0);
  const elements = useConstant(() => ({ tabs: 0, panels: 0 }));
  const state = outerState || innerState;

  return (
    <Elements.Provider value={elements}>
      <TabsState.Provider value={state}>{children}</TabsState.Provider>
    </Elements.Provider>
  );
};

export const useTabState = () => {
  const [activeIndex, setActive] = useContext(TabsState);
  const elements = useContext(Elements);

  const tabIndex = useConstant(() => {
    const currentIndex = elements.tabs;
    elements.tabs += 1;

    return currentIndex;
  });

  const onClick = useConstant(() => () => setActive(tabIndex));

  return useMemo(
    () => ({
      isActive: activeIndex === tabIndex,
      onClick,
    }),
    [activeIndex, onClick, tabIndex]
  );
};

export const usePanelState = () => {
  const [activeIndex] = useContext(TabsState);
  const elements = useContext(Elements);

  const panelIndex = useConstant(() => {
    const currentIndex = elements.panels;
    elements.panels += 1;

    return currentIndex;
  });

  return panelIndex === activeIndex;
};

export const Tabs: FC = ({ children }) => {
  const elements = useContext(Elements);

  return (
    <TabsStyled tabsLength={elements.tabs}>
      {children}
      <li className="slider" />
    </TabsStyled>
  );
};

export const Tab: FC = ({ children }) => {
  const state = useTabState();

  if (typeof children === 'function') {
    return children(state);
  }

  const { isActive } = state;

  return (
    <li className={isActive ? 'active' : ''}>
      {isValidElement(children) ? cloneElement(children, state) : children}
    </li>
  );
};

export const Panel: FC<{ active?: boolean }> = ({ active, children }) => {
  const isActive = usePanelState();

  return isActive || active ? <>{children}</> : <></>;
};

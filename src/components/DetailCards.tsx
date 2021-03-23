import { FC } from 'react';
import styled from 'styled-components';
import { JSX } from '@ionic/core';
import { IonRow, IonCol, IonIcon } from '@ionic/react';
import { FontSize } from '../constants/font-size';
import { FontWeight } from '../constants/font-weight';
import Text from './ionic/Text';

const DetailCardsStyled = styled(IonRow)`
  display: flex;
`;

const DetailCardStyled = styled(IonCol)`
  flex-grow: 1;
  padding: 0.25rem;
`;

const DetailsCardInner = styled.div<{ isDescription?: boolean }>`
  background: var(--app-color-charade);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 100%;

  ${({ isDescription }) => `text-align: ${isDescription ? 'left' : 'center'};`}

  ${({ isDescription }) => {
    if (isDescription) {
      return 'padding: 1.65rem 1.15rem;';
    }

    return 'padding: 2.25rem 0.55rem;';
  }}
`;

const DetailsIconCardInner = styled.div`
  background: var(--app-color-charade);

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  height: 100%;
  padding: 1.25rem 1.75rem;

  .text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 1rem;

    ion-text {
      &:first-child {
        padding-bottom: 0.25rem;
      }
    }
  }
`;

const DetailCard: FC<
  JSX.IonCol & {
    title?: string;
    subtitle?: string;
    description?: string;
  }
> = ({ title, subtitle, description, ...props }) => {
  return (
    <DetailCardStyled {...props}>
      <DetailsCardInner isDescription={!!description}>
        {subtitle && (
          <Text
            fontSize={FontSize.SM}
            fontWeight={FontWeight.BOLD}
            color="light"
          >
            {subtitle}
          </Text>
        )}
        {title && (
          <Text
            className="ion-text-capitalize"
            fontSize={FontSize.XXS}
            color="light"
          >
            {title}
          </Text>
        )}
        {description && (
          <Text fontSize={FontSize.SM} color="light">
            {description}
          </Text>
        )}
      </DetailsCardInner>
    </DetailCardStyled>
  );
};

const DetailIconCard: FC<
  JSX.IonCol & {
    title?: string;
    subtitle?: string;
    icon?: string;
  }
> = ({ title, subtitle, icon, ...props }) => {
  return (
    <DetailCardStyled {...props}>
      <DetailsIconCardInner>
        {icon && (
          <IonIcon size="large" color="light" slot="icon-only" icon={icon} />
        )}
        <div className="text">
          {title && (
            <Text
              className="ion-text-capitalize"
              fontSize={FontSize.SM}
              color="light"
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              className="ion-text-capitalize"
              fontSize={FontSize.XXS}
              color="light"
            >
              {subtitle}
            </Text>
          )}
        </div>
      </DetailsIconCardInner>
    </DetailCardStyled>
  );
};

const DetailCards: FC = ({ children }) => {
  return (
    <DetailCardsStyled className="ion-padding-horizontal ion-no-margin">
      {children}
    </DetailCardsStyled>
  );
};

export { DetailCards, DetailIconCard, DetailCard };

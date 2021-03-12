import { FC, useState } from 'react';
import styled from 'styled-components';
import { FontSize } from '../constants/font-size';
import Button from './ionic/Button';
import Text from './ionic/Text';

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-bottom: 0;
  list-style: none;
`;

const ListItem = styled.li`
  flex: 1 1 auto;
  text-align: center;

  &.center {
    justify-content: center;
    display: flex;
    align-items: center;
  }
`;

const ListItemHeader = styled(Text)`
  padding-top: 0.45rem;
`;

const ListItemOption = styled(Button)<{
  active: boolean;
}>`
  ${({ active }) => {
    if (active) {
      return `
        text-decoration: underline;
      `;
    }
    return `color: var(--app-color-charade);`;
  }}
`;

const SortBy: FC<{
  options: string[];
  defaultIndex?: number;
}> = ({ options, defaultIndex = 0 }) => {
  const [active, setActive] = useState(defaultIndex);

  return (
    <List>
      <ListItem>
        <ListItemHeader fontSize={FontSize.SM}>Sort by:</ListItemHeader>
      </ListItem>

      {options.map((option, index) => {
        const isActive = active === index;

        return (
          <ListItem key={option}>
            <ListItemOption
              active={isActive}
              color={isActive ? 'danger' : ''}
              size="small"
              fill="clear"
              className="ion-text-capitalize ion-no-margin"
              fontSize={FontSize.SM}
              radius={false}
              onClick={() => setActive(index)}
            >
              {option}
            </ListItemOption>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SortBy;

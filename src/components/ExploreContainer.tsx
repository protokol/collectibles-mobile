import React, {useCallback, useContext, useEffect} from 'react';
import './ExploreContainer.css';
import {AuthRegisterContext} from "../providers/AuthRegisterProvider";

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
    const {state: {passphrase}, generatePassphrase, setPin} = useContext(AuthRegisterContext);
    console.log(passphrase);

    const onLinkClick = useCallback(() => {
        generatePassphrase();
    }, [generatePassphrase]);

    useEffect(() => {
        if (passphrase) {
            setPin('1234');
        }
    }, [setPin, passphrase])

  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Explore <button onClick={onLinkClick}>Generate passphrase</button></p>
    </div>
  );
};

export default ExploreContainer;

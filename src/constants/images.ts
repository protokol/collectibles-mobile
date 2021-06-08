const welcomeImagePath1x = '/assets/images/welcome-screen.png';
const welcomeImagePath2x = '/assets/images/welcome-screen@2x.png';
const welcomeImagePath3x = '/assets/images/welcome-screen@3x.png';

const auctionImagePath1x = '/assets/images/auction-screen.png';
const auctionImagePath2x = '/assets/images/auction-screen@2x.png';
const auctionImagePath3x = '/assets/images/auction-screen@3x.png';

const auctionBalloonImagePath1x = '/assets/images/auction-balloon-screen.png';
const auctionBalloonImagePath2x = '/assets/images/auction-balloon-screen@2x.png';
const auctionBalloonImagePath3x = '/assets/images/auction-balloon-screen@3x.png';

const flagImagePath1x = '/assets/images/flag-screen.png';
const flagImagePath2x = '/assets/images/flag-screen@2x.png';
const flagImagePath3x = '/assets/images/flag-screen@3x.png';

const driverImage1x = '/assets/images/driver.png';
const driverImage2x = '/assets/images/driver@2x.png';

const driverHighResImage1x = '/assets/images/driver-high-res.png';
const driverHighResImage2x = '/assets/images/driver-high-res@2x.png';

const addGHPagesPrefix = () => {
  if (window.location.hostname === 'protokol.github.io') {
    return '/collectibles-mobile';
  }
  return '';
};

const addIPFSGatewayPrefix = (ipfsHash: string) =>
  `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

const flagImage = {
  alt: 'Flag',
  src: `${process.env.PUBLIC_URL}${addGHPagesPrefix()}${flagImagePath1x}`,
  srcSet: `${addGHPagesPrefix()}${flagImagePath1x} 1x, ${addGHPagesPrefix()}${flagImagePath2x} 2x, ${addGHPagesPrefix()}${flagImagePath3x} 3x`,
};

const welcomeImage = {
  alt: 'Welcome',
  src: `${process.env.PUBLIC_URL}${addGHPagesPrefix()}${welcomeImagePath1x}`,
  srcSet: `${addGHPagesPrefix()}${welcomeImagePath1x} 1x, ${addGHPagesPrefix()}${welcomeImagePath2x} 2x, ${addGHPagesPrefix()}${welcomeImagePath3x} 3x`,
};

const driverImage = {
  alt: 'Driver',
  src: `${addGHPagesPrefix()}${driverImage1x}`,
  srcSet: `${addGHPagesPrefix()}${driverImage1x} 1x, ${addGHPagesPrefix()}${driverImage2x} 2x`,
};

const auctionImage = {
  alt: 'Auction',
  src: `${process.env.PUBLIC_URL}${addGHPagesPrefix()}${auctionImagePath1x}`,
  srcSet: `${addGHPagesPrefix()}${auctionImagePath1x} 1x, ${addGHPagesPrefix()}${auctionImagePath2x} 2x, ${addGHPagesPrefix()}${auctionImagePath3x} 3x`,
};

const auctionBalloonImage = {
  alt: 'Auction',
  src: `${process.env.PUBLIC_URL}${addGHPagesPrefix()}${auctionBalloonImagePath1x}`,
  srcSet: `${addGHPagesPrefix()}${auctionBalloonImagePath1x} 1x, ${addGHPagesPrefix()}${auctionBalloonImagePath2x} 2x, ${addGHPagesPrefix()}${auctionBalloonImagePath3x} 3x`,
};

const driverHighResImage = {
  alt: 'Driver',
  src: `${addGHPagesPrefix()}${driverHighResImage1x}`,
  srcSet: `${addGHPagesPrefix()}${driverHighResImage1x} 1x, ${addGHPagesPrefix()}${driverHighResImage2x} 2x`,
};

export { addIPFSGatewayPrefix, welcomeImage, driverImage, flagImage, auctionImage, auctionBalloonImage, driverHighResImage };

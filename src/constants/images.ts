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

const addIPFSGatewayPrefix = (ipfsHash: string) =>
  `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

const flagImage = {
  alt: 'Flag',
  src: `${process.env.PUBLIC_URL}${flagImagePath1x}`,
  srcSet: `${process.env.PUBLIC_URL}${flagImagePath1x} 1x, ${process.env.PUBLIC_URL}${flagImagePath2x} 2x, ${process.env.PUBLIC_URL}${flagImagePath3x} 3x`,
};

const welcomeImage = {
  alt: 'Welcome',
  src: `${process.env.PUBLIC_URL}${welcomeImagePath1x}`,
  srcSet: `${process.env.PUBLIC_URL}${welcomeImagePath1x} 1x, ${process.env.PUBLIC_URL}${welcomeImagePath2x} 2x, ${process.env.PUBLIC_URL}${welcomeImagePath3x} 3x`,
};

const driverImage = {
  alt: 'Driver',
  src: `${process.env.PUBLIC_URL}${driverImage1x}`,
  srcSet: `${process.env.PUBLIC_URL}${driverImage1x} 1x, ${process.env.PUBLIC_URL}${driverImage2x} 2x`,
};

const auctionImage = {
  alt: 'Auction',
  src: `${process.env.PUBLIC_URL}${auctionImagePath1x}`,
  srcSet: `${process.env.PUBLIC_URL}${auctionImagePath1x} 1x, ${process.env.PUBLIC_URL}${auctionImagePath2x} 2x, ${process.env.PUBLIC_URL}${auctionImagePath3x} 3x`,
};

const auctionBalloonImage = {
  alt: 'Auction',
  src: `${process.env.PUBLIC_URL}${auctionBalloonImagePath1x}`,
  srcSet: `${process.env.PUBLIC_URL}${auctionBalloonImagePath1x} 1x, ${process.env.PUBLIC_URL}${auctionBalloonImagePath2x} 2x, ${process.env.PUBLIC_URL}${auctionBalloonImagePath3x} 3x`,
};

const driverHighResImage = {
  alt: 'Driver',
  src: `${process.env.PUBLIC_URL}${driverHighResImage1x}`,
  srcSet: `${process.env.PUBLIC_URL}${driverHighResImage1x} 1x, ${process.env.PUBLIC_URL}${driverHighResImage2x} 2x`,
};

export {
  addIPFSGatewayPrefix,
  welcomeImage,
  driverImage,
  flagImage,
  auctionImage,
  auctionBalloonImage,
  driverHighResImage,
};

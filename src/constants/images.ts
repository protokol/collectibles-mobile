const welcomeImagePath1x = '/assets/images/welcome-screen.png';
const welcomeImagePath2x = '/assets/images/welcome-screen@2x.png';

const addGHPagesPrefix = () => {
  if (window.location.hostname === 'protokol.github.io') {
    return '/collectibles-mobile';
  }
  return '';
};

const welcomeImage = {
  alt: 'Welcome',
  src: `${addGHPagesPrefix()}${welcomeImagePath1x}`,
  srcSet: `${addGHPagesPrefix()}${welcomeImagePath1x} 1x, ${addGHPagesPrefix()}${welcomeImagePath2x} 2x`,
};

export { welcomeImage };

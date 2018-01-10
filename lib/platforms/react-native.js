import { Linking, StatusBar, Platform } from 'react-native';
import SafariView from 'react-native-safari-view';

const iOS = Platform.OS === 'ios';

let previousOnLinkChange;

let showSubscription = iOS ? SafariView.addEventListener(
  "onShow",
  () => {
    StatusBar.setBarStyle("default");
  }
) : null;

let dismissSubscription = iOS ? SafariView.addEventListener(
  "onDismiss",
  () => {
    StatusBar.setBarStyle("light-content");
  }
) : null;

export const dance = (authUrl) => {
  if (previousOnLinkChange) {
    Linking.removeEventListener('url', previousOnLinkChange);
  }

  return (iOS ? 
    SafariView.show({ url: authUrl }) : 
    Linking.openURL(authUrl))
    .then(() => new Promise((resolve, reject) => {
      const handleUrl = (url) => {
        iOS ? SafariView.dismiss() : null;
        if (!url || url.indexOf('fail') > -1) {
          reject(url);
        } else {
          resolve(url);
        }
      };

      const onLinkChange = ({ url }) => {
        Linking.removeEventListener('url', onLinkChange);
        previousOnLinkChange = undefined;
        handleUrl(url);
      };

      Linking.addEventListener('url', onLinkChange);

      previousOnLinkChange = onLinkChange;
    }));
};

export const request = fetch;

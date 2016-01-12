const NEW_API_FIREFOX_VERSION = 44;
const NEWTAB_URL = 'http://gasolin.github.io/webby/';

const { version } = require('sdk/system/xul-app');

const newtaboverride = {
  version : parseFloat(version),

  init : function () {
    newtaboverride.override(NEWTAB_URL);
  },

  override : function (newTabUrl) {
    if (this.version < NEW_API_FIREFOX_VERSION) {
      require("sdk/preferences/service").set( "browser.startup.homepage", newTabUrl )
      require("sdk/preferences/service").set( "browser.newtab.url", newTabUrl );
      //require('resource:///modules/NewTabURL.jsm').NewTabURL.override(newTabUrl);
    } else {
      require("sdk/preferences/service").set( "browser.startup.homepage", newTabUrl );
      const { Cc, Ci } = require('chrome');
      const aboutNewTabService = Cc['@mozilla.org/browser/aboutnewtab-service;1'].getService(Ci.nsIAboutNewTabService);

      aboutNewTabService.newTabURL = newTabUrl;
    }
  },

  reset : function () {
    if (this.version < NEW_API_FIREFOX_VERSION) {
      require('resource:///modules/NewTabURL.jsm').NewTabURL.reset();
    } else {
      const { Cc, Ci } = require('chrome');
      const aboutNewTabService = Cc['@mozilla.org/browser/aboutnewtab-service;1'].getService(Ci.nsIAboutNewTabService);

      aboutNewTabService.resetNewTabURL();
    }
  }
};

const main = () => {
  newtaboverride.init();
};

exports.main = main;

exports.onUnload = function (reason) {
  if (reason === 'uninstall' || reason === 'disable') {
    newtaboverride.reset();
  }
};

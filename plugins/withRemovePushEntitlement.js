const { withEntitlementsPlist } = require('expo/config-plugins');

/**
 * Personal Apple Development teams cannot use Push Notifications.
 * This app only schedules local reminders, so strip the APNS entitlement
 * that expo-notifications adds by default.
 */
module.exports = function withRemovePushEntitlement(config) {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults['aps-environment'];
    return config;
  });
};

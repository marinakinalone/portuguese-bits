const { withEntitlementsPlist } = require('expo/config-plugins');

/**
 * Personal Apple Development teams cannot use Push Notifications.
 * Strip APNS if any plugin adds it. Local scheduled reminders do not need it.
 */
function withRemovePushEntitlement(config) {
  return withEntitlementsPlist(config, (config) => {
    if ('aps-environment' in config.modResults) {
      delete config.modResults['aps-environment'];
    }
    return config;
  });
}

module.exports = withRemovePushEntitlement;

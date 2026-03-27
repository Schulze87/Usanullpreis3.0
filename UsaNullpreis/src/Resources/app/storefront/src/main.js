import UsaNullpreisObserverPlugin from './plugin/usa-nullpreis-observer.plugin';

const PluginManager = window.PluginManager;

PluginManager.register('UsaNullpreisObserverPlugin', UsaNullpreisObserverPlugin, 'body');

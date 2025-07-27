import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';


AppRegistry.registerComponent('HostApp', () => App);
AppRegistry.runApplication('HostApp', { rootTag: document.getElementById('root') });

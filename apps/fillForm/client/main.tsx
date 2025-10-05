import { Meteor } from 'meteor/meteor'

import React from 'react';
import {createRoot} from "react-dom/client";

import '/imports/policy'
import { App } from '/imports/ui/App'

const rootElement = document.getElementById("react-target");
const root = createRoot(rootElement!);

Meteor.startup(() => {
  root.render(
    // Be wise, StrictMode make the form submit having a double submit, one being falsy.
    //<React.StrictMode>
      <App />
    //</React.StrictMode>
  );
})

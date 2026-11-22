// Library bundle -> deploy/mainmenu-vendor.js. Must load before mainmenu.js.
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as JSXRuntime from 'react/jsx-runtime';
// Every Lucide icon (https://lucide.dev/icons), so mainmenu-tools.json can name any of them.
import { icons } from 'lucide';

window.SapienVendor = { React, ReactDOMClient, JSXRuntime, Lucide: { icons } };

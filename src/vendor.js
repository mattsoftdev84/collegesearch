// Library bundle -> deploy/mainmenu-vendor.js. Must load before mainmenu.js.
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as JSXRuntime from 'react/jsx-runtime';

window.SapienVendor = { React, ReactDOMClient, JSXRuntime };

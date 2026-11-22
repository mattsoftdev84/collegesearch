// Library bundle -> deploy/sapien-vendor.js. Must load before sapien.js.
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as JSXRuntime from 'react/jsx-runtime';

window.SapienVendor = { React, ReactDOMClient, JSXRuntime };

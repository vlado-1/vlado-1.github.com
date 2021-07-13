------------------------------------------------
YouTube Escape: Escaping the YouTube rabbit hole
------------------------------------------------

## Important notice

This Extension is suitable for any version of Chrome 76.0.3809.100 and above and it will only modify YouTube (www.youtube.com) and not any of its premium platforms.

## System Architecture

Refer to 'Structure Diagram.jpg' for visual representation of system architecture.

There are five main elements to a Chrome browser extension: the manifest, background scripts, content scripts, option page and UI elements. The key element that makes any sort of extension work, is the manifest. It is a file existing in the JSON file format, that contains all the information that chrome will need to know about any extension that runs on it. In this file, information regarding where the other extension elements are located, what chrome permissions the extension will need etc. need to be specified otherwise the entire extension could fail to be loaded onto the browser.

The UI element enables users to interact with the extension. This element often consists of html and JavaScript files that work together in order to visually display things on the browser and take in user input. Often if an extension expects users to flick switches, press buttons, click links, see images/feeds etc. the functionality will rely heavily on UI components of the extension. UI elements can interact with other extension components, such as the content and background scripts.

The content script is for reading and writing to web pages. The script enables the extension to edit the structure, look and feel of a web page in a browser, without changing the actual page. Further it can make requests to the web page for information, such as for search results. Often it works together with the UI elements of a page to make the extension feel more responsive and powerful.

The background script is for handling events. When a website sends a request to the page, or a user clicks something on a webpage, or the page refreshes, an event occurs. The background script is a JavaScript file which detects events and responds to them based on some predefined logic. It mainly interacts with the browser but can also do so with the UI elements.

The options page element is the one which enables users to edit their extensions by changing the settings of the extension. This element often incorporates aspects of UI in order to give users on screen options they can choose from, and then applies JavaScript to save these options.

Of the above 5 core extension elements, we will provide a specific architectural overview of three, namely: the UI elements, the content script and the background script. We have no plans to use any options elements. And regarding the manifest component, the role it performs is often so basic to the extension that it requires no further architectural explaining.

## Instructions to unpack extension

1. Store the file in a known location on your desktop
2. Open a Chrome Web Browser window.
3. Visit 'chrome://extensions/' (or enter Extensions page by clicking on the Chrome options menu location on top right -> More Tools -> Extensions) 
*Ensure developer mode is turned on*
4. Click "load unpacked" and navigate to the folder with the source code. *folder: src*
5. The extension is now installed on your Google Chrome.
6. Enter 'www.youtube.com' to experience the extension.

---

## Functionalities of this extension
	
	PLEASE REFER TO THE USER GUIDE PROVIDED

---

## Instruction to run tests

1. Download "Node.js" from https://nodejs.org/en/.
*Download LTS option*
2. Navigate to the test folder in the terminal.
3. Type the command `npm install` to download the testing frameworks (Jest and Puppeteer).
*If this did not work, intall them manually using the commands:* `npm install jest` and `npm install puppeteer`.
4. To run the tests, type the command `npm test`. The test should run in the terminal (this should take a couple of minutes and various chromium windows will open).

---

import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/app.scss';

import { DEFAULT_APP_SETTINGS, ESCAPP_CLIENT_SETTINGS, MAIN_SCREEN } from '../constants/constants.jsx';
import MainScreen from './MainScreen.jsx';

export default function App() {
  const { escapp, setEscapp, appSettings, setAppSettings, Storage, setStorage, Utils, I18n } = useContext(GlobalContext);
  const hasExecutedEscappValidation = useRef(false);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(MAIN_SCREEN);
  const prevScreen = useRef(screen);
  const solution = useRef(null);
  const [appWidth, setAppWidth] = useState(0);
  const [appHeight, setAppHeight] = useState(0);

  useEffect(() => {
    // Init Escapp client
    if (escapp !== null) {
      return;
    }
    // Create the Escapp client instance.
    let _escapp = new ESCAPP(ESCAPP_CLIENT_SETTINGS);
    setEscapp(_escapp);
    Utils.log("Escapp client initiated with settings:", _escapp.getSettings());

    // Use the storage feature provided by Escapp client.
    setStorage(_escapp.getStorage());

    // Get app settings provided by the Escapp server.
    let _appSettings = processAppSettings(_escapp.getAppSettings());
    setAppSettings(_appSettings);
    Utils.log("App settings:", _appSettings);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  function processAppSettings(_appSettings) {
    if (typeof _appSettings !== "object") {
      _appSettings = {};
    }

    // Merge _appSettings with DEFAULT_APP_SETTINGS to obtain final app settings
    _appSettings = Utils.deepMerge(DEFAULT_APP_SETTINGS, _appSettings);

    const allowedActions = ["NONE", "SHOW_MESSAGE"];
    if (!allowedActions.includes(_appSettings.actionAfterSolve)) {
      _appSettings.actionAfterSolve = DEFAULT_APP_SETTINGS.actionAfterSolve;
    }

    // Validate contentType
    const allowedContentTypes = ["IMAGE", "IFRAME"];
    if (!allowedContentTypes.includes(_appSettings.contentType)) {
      _appSettings.contentType = DEFAULT_APP_SETTINGS.contentType;
    }

    // Validate popupPosition
    const allowedPositions = ["TOP_LEFT", "TOP_RIGHT", "BOTTOM_LEFT", "BOTTOM_RIGHT"];
    if (!allowedPositions.includes(_appSettings.popupPosition)) {
      _appSettings.popupPosition = DEFAULT_APP_SETTINGS.popupPosition;
    }

    // Validate inputType
    const allowedInputTypes = ["TEXT", "NUMERIC", "SELECT"];
    if (!allowedInputTypes.includes(_appSettings.inputType)) {
      _appSettings.inputType = DEFAULT_APP_SETTINGS.inputType;
    }

    // Init internacionalization module
    I18n.init(_appSettings);

    if (typeof _appSettings.message !== "string") {
      _appSettings.message = I18n.getTrans("i.message");
    }

    // Change HTTP protocol to HTTPs in URLs if necessary
    _appSettings = Utils.checkUrlProtocols(_appSettings);

    return _appSettings;
  }

  useEffect(() => {
    if (!hasExecutedEscappValidation.current && escapp !== null && appSettings !== null && Storage !== null) {
      hasExecutedEscappValidation.current = true;

      // Register callbacks in Escapp client and validate user.
      escapp.registerCallback("onNewErStateCallback", function (erState) {
        try {
          Utils.log("New escape room state received from ESCAPP", erState);
          restoreAppState(erState);
        } catch (e) {
          Utils.log("Error in onNewErStateCallback", e);
        }
      });

      escapp.registerCallback("onErRestartCallback", function (erState) {
        try {
          Utils.log("Escape Room has been restarted.", erState);
          if (typeof Storage !== "undefined") {
            Storage.removeSetting("state");
          }
        } catch (e) {
          Utils.log("Error in onErRestartCallback", e);
        }
      });

      // Validate user. To be valid, a user must be authenticated and a participant of the escape room.
      escapp.validate((success, erState) => {
        try {
          Utils.log("ESCAPP validation", success, erState);
          if (success) {
            restoreAppState(erState);
            setLoading(false);
          }
        } catch (e) {
          Utils.log("Error in validate callback", e);
        }
      });
    }
  }, [escapp, appSettings, Storage]);

  useEffect(() => {
    if (loading === false) {
      handleResize();
    }
  }, [loading]);

  useEffect(() => {
    if (screen !== prevScreen.current) {
      Utils.log("Screen changed from", prevScreen.current, "to", screen);
      prevScreen.current = screen;
      saveAppState();
    }
  }, [screen]);

  function handleResize() {
    setAppWidth(window.innerWidth);
    setAppHeight(window.innerHeight);
  }

  function restoreAppState(erState) {
    Utils.log("Restore application state based on escape room state:", erState);
    // Restore app state based on local storage if puzzle not solved
    if (!(escapp.getAllPuzzlesSolved() && (escapp.getSolvedPuzzles().length > 0))) {
      restoreAppStateFromLocalStorage();
    }
  }

  function restoreAppStateFromLocalStorage() {
    if (typeof Storage !== "undefined") {
      let stateToRestore = Storage.getSetting("state");
      if (stateToRestore) {
        Utils.log("Restore app state", stateToRestore);
        setScreen(stateToRestore.screen);
        if (typeof stateToRestore.solution === "string") {
          solution.current = stateToRestore.solution;
        }
      }
    }
  }

  function saveAppState() {
    if (typeof Storage !== "undefined") {
      let currentAppState = { screen: screen };
      Utils.log("Save app state in local storage", currentAppState);
      Storage.saveSetting("state", currentAppState);
    }
  }

  function onKeypadSolved(_solution) {
    Utils.log("onKeypadSolved with solution:", _solution);
    if (typeof _solution !== "string") {
      return;
    }
    solution.current = _solution;

    // If actionAfterSolve is "NONE", submit immediately
    // If "SHOW_MESSAGE", the MainScreen handles showing the message in the popup
    if (appSettings.actionAfterSolve === "NONE") {
      submitPuzzleSolution();
    }
    // Otherwise, MainScreen will show the message and call submitPuzzleSolution when user clicks Continue
  }

  function submitPuzzleSolution() {
    Utils.log("Submit puzzle solution", solution.current);

    escapp.submitNextPuzzle(solution.current, {}, (success, erState) => {
      if (!success) {
        setScreen(MAIN_SCREEN);
      }
      Utils.log("Solution submitted to Escapp", solution.current, success, erState);
    });
  }

  const renderScreens = (screens) => {
    if (loading === true) {
      return null;
    } else {
      return (
        <>
          {screens.map(({ id, content }) => renderScreen(id, content))}
        </>
      );
    }
  };

  const renderScreen = (screenId, screenContent) => (
    <div key={screenId} className={`screen_wrapper ${screen === screenId ? 'active' : ''}`} >
      {screenContent}
    </div>
  );

  let screens = [
    {
      id: MAIN_SCREEN,
      content: <MainScreen appHeight={appHeight} appWidth={appWidth} onKeypadSolved={onKeypadSolved} submitPuzzleSolution={submitPuzzleSolution} />
    }
  ];

  return (
    <div id="global_wrapper">
      {renderScreens(screens)}
    </div>
  )
}

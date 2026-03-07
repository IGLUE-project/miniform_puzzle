export const DEFAULT_APP_SETTINGS = {
  // Base background (takes all space)
  background: "", // URL for the base background image

  // Content area settings (image or iframe with configurable position)
  contentType: "IMAGE", // "IMAGE" or "IFRAME"
  contentUrl: "", // URL for the content (image or iframe)
  contentPosition: { // Position and size of the content area
    top: 0,       // pixels or percentage string (e.g., "10%")
    left: 0,      // pixels or percentage string
    width: "100%",  // pixels or percentage string
    height: "100%", // pixels or percentage string
  },

  // Popup settings
  popupPosition: "BOTTOM_RIGHT", // "TOP_LEFT", "TOP_RIGHT", "BOTTOM_LEFT", "BOTTOM_RIGHT"
  popupWidth: 320, // Width in pixels
  popupTitle: "", // Optional title for the popup
  popupMinimizable: false, // Allow the popup to be minimized
  popupStartMinimized: false, // Start with the popup minimized

  // Question settings
  question: "Enter your answer:",

  // Input settings
  inputType: "TEXT", // "TEXT", "NUMERIC", or "SELECT"
  inputPlaceholder: "",
  selectOptions: [], // Array of {value: "", label: ""} for SELECT type

  // Button text
  submitButtonText: "Submit",

  // Action after solve
  actionAfterSolve: "NONE", // "NONE" or "SHOW_MESSAGE"
  message: undefined,

  // Styling
  popupBackgroundColor: "#ffffff",
  popupTextColor: "#333333",
  popupBorderRadius: 8,
  popupPadding: 20,

};

export const ESCAPP_CLIENT_SETTINGS = {
  imagesPath: "./images/",
};

export const MAIN_SCREEN = "MAIN_SCREEN";

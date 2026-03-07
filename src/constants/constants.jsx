export const DEFAULT_APP_SETTINGS = {
  // Skin: "STANDARD", "RETRO", or "FUTURISTIC"
  skin: "STANDARD",

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
  // Single question mode (backward compatible)
  question: "Enter your answer:",

  // Input settings (for single question mode)
  inputType: "TEXT", // "TEXT", "NUMERIC", or "SELECT"
  inputPlaceholder: "",
  selectOptions: [], // Array of {value: "", label: ""} for SELECT type

  // Multiple questions mode (overrides single question if provided)
  // questions: [
  //   { question: "Question 1?", inputType: "TEXT", inputPlaceholder: "", selectOptions: [] },
  //   { question: "Question 2?", inputType: "SELECT", selectOptions: [{value: "a", label: "A"}] },
  // ]
  questions: null,

  // Button text
  submitButtonText: "Submit",
  continueButtonText: "", // Text for the continue button after solving (uses locale default if empty)
  errorMessage: "Incorrect answer. Try again.", // Error message when answer is wrong

  // Action after solve
  actionAfterSolve: "NONE", // "NONE" or "SHOW_MESSAGE"
  message: undefined,

  // Styling (can be overridden by skin)
  popupBackgroundColor: "#ffffff",
  popupTextColor: "#333333",
  popupBorderRadius: 8,
  popupPadding: 20,
  buttonColor: "#3498db",
  buttonHoverColor: "#2980b9",
  buttonSuccessColor: "#27ae60",
  inputBorderColor: "#cccccc",
  inputFocusColor: "#3498db",
  errorColor: "#e74c3c",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
};

// Retro skin - Ancient Egypt style
export const SKIN_SETTINGS_RETRO = {
  popupBackgroundColor: "#c4a574",
  popupTextColor: "#3d2b1f",
  popupBorderRadius: 4,
  popupPadding: 20,
  buttonColor: "#8b6914",
  buttonHoverColor: "#a67c00",
  buttonSuccessColor: "#6b8e23",
  inputBorderColor: "#8b6914",
  inputFocusColor: "#d4af37",
  errorColor: "#8b0000",
  fontFamily: "'Metalmania', 'Papyrus', fantasy",
  // Additional retro-specific
  popupBorder: "3px solid #8b6914",
  inputBackground: "#e8dcc4",
  inputTextColor: "#3d2b1f",
  buttonTextColor: "#f4e4bc",
  boxShadow: "0 4px 20px rgba(139, 105, 20, 0.4)",
};

// Futuristic skin - Space neon style
export const SKIN_SETTINGS_FUTURISTIC = {
  popupBackgroundColor: "rgba(0, 0, 0, 0.95)",
  popupTextColor: "#00ffff",
  popupBorderRadius: 0,
  popupPadding: 24,
  buttonColor: "#ff00ff",
  buttonHoverColor: "#ff44ff",
  buttonSuccessColor: "#00ff00",
  inputBorderColor: "#00ffff",
  inputFocusColor: "#ff00ff",
  errorColor: "#ff3333",
  fontFamily: "'Orbitron', 'Audiowide', sans-serif",
  // Additional futuristic-specific
  popupBorder: "2px solid #00ffff",
  inputBackground: "#000000",
  inputTextColor: "#00ffff",
  buttonTextColor: "#000000",
  boxShadow: "0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3)",
};

export const ESCAPP_CLIENT_SETTINGS = {
  imagesPath: "./images/",
};

export const MAIN_SCREEN = "MAIN_SCREEN";

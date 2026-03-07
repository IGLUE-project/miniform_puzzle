//Copy this file to config.js and specify your own settings

export let ESCAPP_APP_SETTINGS = {
  // Base background (takes all space)
  background: "https://example.com/background.jpg",

  // Content area settings (image or iframe with configurable position)
  // contentType can be "IMAGE" or "IFRAME"
  contentType: "IMAGE",
  // contentUrl is the URL for the content (image or iframe)
  contentUrl: "https://example.com/content.jpg",
  // contentPosition defines the position and size of the content area
  // Values can be pixels (numbers) or percentage strings (e.g., "50%")
  contentPosition: {
    top: "10%",
    left: "10%",
    width: "50%",
    height: "60%",
  },

  // Popup settings
  // popupPosition can be "TOP_LEFT", "TOP_RIGHT", "BOTTOM_LEFT", "BOTTOM_RIGHT"
  popupPosition: "BOTTOM_RIGHT",
  // popupWidth in pixels
  popupWidth: 350,
  // Optional title for the popup
  popupTitle: "Question",

  // Question to display
  question: "What is the answer?",

  // Input settings
  // inputType can be "TEXT", "NUMERIC", or "SELECT"
  inputType: "TEXT",
  // Placeholder text for the input field
  inputPlaceholder: "Enter your answer...",

  // Options for SELECT type (array of {value, label} objects)
  // selectOptions: [
  //   { value: "option1", label: "Option 1" },
  //   { value: "option2", label: "Option 2" },
  //   { value: "option3", label: "Option 3" }
  // ],

  // Button text
  submitButtonText: "Submit",

  // Action after solve: "NONE" or "SHOW_MESSAGE"
  actionAfterSolve: "SHOW_MESSAGE",
  // Custom message to show after solving (optional)
  // message: "Congratulations!",

  // Popup styling (optional)
  // popupBackgroundColor: "#ffffff",
  // popupTextColor: "#333333",
  // popupBorderRadius: 12,
  // popupPadding: 24,

  // Locale: "en", "es", or "sr"
  locale: "es",

  // Escapp integration settings
  escappClientSettings: {
    endpoint: "https://escapp.es/api/escapeRooms/id",
    linkedPuzzleIds: [1],
    rtc: false,
    preview: false
  },
};

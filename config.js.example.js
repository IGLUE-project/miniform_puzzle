//Copy this file to config.js and specify your own settings

export let ESCAPP_APP_SETTINGS = {
  // Skin: "STANDARD", "RETRO", or "FUTURISTIC"
  skin: "STANDARD",

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
  // Allow the popup to be minimized
  popupMinimizable: true,
  // Start with the popup minimized (optional)
  // popupStartMinimized: false,

  // ============================================================
  // SINGLE QUESTION MODE
  // Use this for a single question (simpler configuration)
  // ============================================================
  // question: "What is the answer?",
  // inputType: "TEXT",  // "TEXT", "NUMERIC", or "SELECT"
  // inputPlaceholder: "Enter your answer...",
  // selectOptions: [    // Only for SELECT type
  //   { value: "option1", label: "Option 1" },
  //   { value: "option2", label: "Option 2" },
  // ],

  // ============================================================
  // MULTIPLE QUESTIONS MODE
  // Use this for multiple questions (overrides single question)
  // Answers are combined with semicolons (e.g., "answer1;answer2;answer3")
  // ============================================================
  questions: [
    {
      question: "What is 2 + 2?",
      inputType: "NUMERIC",
      inputPlaceholder: "Enter number..."
    },
    {
      question: "Select the primary color:",
      inputType: "SELECT",
      selectOptions: [
        { value: "red", label: "Red" },
        { value: "green", label: "Green" },
        { value: "blue", label: "Blue" }
      ]
    },
    {
      question: "What is the capital of France?",
      inputType: "TEXT",
      inputPlaceholder: "Enter city name..."
    }
  ],

  // Button text
  submitButtonText: "Submit",
  continueButtonText: "Continue",  // Text for the continue button after solving
  errorMessage: "Incorrect answer. Try again.",  // Error message when answer is wrong

  // Action after solve: "NONE" or "SHOW_MESSAGE"
  actionAfterSolve: "SHOW_MESSAGE",
  // Custom message to show after solving (optional)
  message: "Congratulations! You solved the puzzle!",

  // Popup styling (comment out to use skin defaults)
  // popupBackgroundColor: "#ffffff",
  // popupTextColor: "#333333",
  // popupBorderRadius: 12,
  // popupPadding: 24,

  // Button styling (comment out to use skin defaults)
  // buttonColor: "#3498db",
  // buttonTextColor: "#ffffff",
  // buttonSuccessColor: "#27ae60",

  // Locale: "en", "es", or "sr"
  locale: "en",

  // Escapp integration settings
  escappClientSettings: {
    endpoint: "https://escapp.es/api/escapeRooms/id",
    linkedPuzzleIds: [1],
    rtc: false,
    preview: false
  },
};

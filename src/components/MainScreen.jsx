import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/main.scss';

const MainScreen = (props) => {
  const { escapp, appSettings, Utils, I18n } = useContext(GlobalContext);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [solved, setSolved] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [answers, setAnswers] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Determine if using multiple questions mode
  const hasMultipleQuestions = appSettings?.questions && Array.isArray(appSettings.questions) && appSettings.questions.length > 0;
  const questions = hasMultipleQuestions ? appSettings.questions : null;

  // Initialize answers and minimized state when appSettings is ready
  useEffect(() => {
    if (appSettings && !initialized) {
      if (hasMultipleQuestions) {
        setAnswers(appSettings.questions.reduce((acc, _, idx) => ({ ...acc, [idx]: '' }), {}));
      } else {
        setAnswers('');
      }
      setMinimized(appSettings.popupStartMinimized || false);
      setInitialized(true);
    }
  }, [appSettings, hasMultipleQuestions, initialized]);

  // Don't render until initialized
  if (!initialized || !appSettings || answers === null) {
    return null;
  }

  const getPopupPositionStyle = () => {
    const position = appSettings.popupPosition || 'BOTTOM_RIGHT';
    const margin = 20;

    const styles = {
      position: 'fixed',
      width: appSettings.popupWidth || 320,
      zIndex: 1000,
    };

    switch (position) {
      case 'TOP_LEFT':
        styles.top = margin;
        styles.left = margin;
        break;
      case 'TOP_RIGHT':
        styles.top = margin;
        styles.right = margin;
        break;
      case 'BOTTOM_LEFT':
        styles.bottom = margin;
        styles.left = margin;
        break;
      case 'BOTTOM_RIGHT':
      default:
        styles.bottom = margin;
        styles.right = margin;
        break;
    }

    return styles;
  };

  const getSolution = () => {
    if (questions && answers && typeof answers === 'object') {
      // Multiple questions: combine answers with semicolons
      return Object.values(answers).map(a => (a || '').trim()).join(';');
    }
    // Single question
    return typeof answers === 'string' ? answers.trim() : '';
  };

  const allAnswersFilled = () => {
    if (questions && answers && typeof answers === 'object') {
      return Object.values(answers).every(a => (a || '').trim() !== '');
    }
    return typeof answers === 'string' && answers.trim() !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isProcessing || !allAnswersFilled()) {
      return;
    }

    setIsProcessing(true);
    setShowError(false);

    const solution = getSolution();
    Utils.log("Check solution", solution);

    escapp.checkNextPuzzle(solution, {}, (success, erState) => {
      Utils.log("Check solution Escapp response", success, erState);

      setTimeout(() => {
        if (success) {
          setIsProcessing(false);
          setSolved(true);
          props.onKeypadSolved(solution);
        } else {
          setShowError(true);
          setIsProcessing(false);

          setTimeout(() => {
            setShowError(false);
          }, 2000);
        }
      }, 300);
    });
  };

  const handleContinue = () => {
    props.submitPuzzleSolution();
  };

  const handleInputChange = (e, index = null, inputType = null) => {
    let value = e.target.value;
    const type = inputType || appSettings.inputType;

    // For numeric input, only allow numbers
    if (type === 'NUMERIC') {
      value = value.replace(/[^0-9]/g, '');
    }

    if (questions && index !== null) {
      setAnswers(prev => ({ ...prev, [index]: value }));
    } else {
      setAnswers(value);
    }
    setShowError(false);
  };

  const getInputStyles = (hasError = false) => {
    return {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      fontFamily: appSettings.fontFamily,
      border: hasError
        ? `2px solid ${appSettings.errorColor}`
        : `1px solid ${appSettings.inputBorderColor}`,
      borderRadius: '6px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      backgroundColor: appSettings.inputBackground || '#ffffff',
      color: appSettings.inputTextColor || appSettings.popupTextColor,
    };
  };

  const renderSingleInput = (inputType, value, onChange, placeholder, selectOptions, disabled) => {
    const commonStyles = getInputStyles(showError);

    switch (inputType) {
      case 'SELECT':
        return (
          <select
            value={value}
            onChange={onChange}
            style={commonStyles}
            disabled={disabled}
            className="popup-input"
          >
            <option value="">{placeholder || 'Select an option...'}</option>
            {(selectOptions || []).map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'NUMERIC':
        return (
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Enter a number...'}
            style={commonStyles}
            disabled={disabled}
            autoComplete="off"
            className="popup-input"
          />
        );

      case 'TEXT':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Enter your answer...'}
            style={commonStyles}
            disabled={disabled}
            autoComplete="off"
            className="popup-input"
          />
        );
    }
  };

  const renderQuestionInput = (questionConfig, index) => {
    const { question, inputType = 'TEXT', inputPlaceholder = '', selectOptions = [] } = questionConfig;
    const value = answers[index] || '';

    return (
      <div key={index} style={{ marginBottom: index < questions.length - 1 ? '16px' : '0' }}>
        <label className="popup-question" style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
        }}>
          {question}
        </label>
        {renderSingleInput(
          inputType,
          value,
          (e) => handleInputChange(e, index, inputType),
          inputPlaceholder,
          selectOptions,
          isProcessing
        )}
      </div>
    );
  };

  const parsePosition = (value) => {
    if (typeof value === 'number') {
      return `${value}px`;
    }
    return value || '0';
  };

  const getContentStyle = () => {
    const pos = appSettings.contentPosition || {};
    return {
      position: 'absolute',
      top: parsePosition(pos.top),
      left: parsePosition(pos.left),
      width: parsePosition(pos.width) || '100%',
      height: parsePosition(pos.height) || '100%',
      zIndex: 1,
    };
  };

  const renderContent = () => {
    const contentType = appSettings.contentType || 'IMAGE';
    const contentUrl = appSettings.contentUrl;

    if (!contentUrl) {
      return null;
    }

    const style = getContentStyle();

    if (contentType === 'IFRAME') {
      return (
        <iframe
          src={contentUrl}
          className="content-iframe"
          title="Content"
          style={style}
          allowFullScreen
        />
      );
    }

    // Default to IMAGE
    return (
      <div
        className="content-image"
        style={{
          ...style,
          backgroundImage: `url("${contentUrl}")`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
    );
  };

  const renderBackground = () => {
    const backgroundUrl = appSettings.background;

    if (!backgroundUrl) {
      return null;
    }

    return (
      <div
        className="background-image"
        style={{
          backgroundImage: `url("${backgroundUrl}")`,
        }}
      />
    );
  };

  const getButtonStyle = (isSuccess = false, disabled = false) => {
    const bgColor = isSuccess
      ? appSettings.buttonSuccessColor
      : (disabled ? '#ccc' : appSettings.buttonColor);

    const isGradient = bgColor && bgColor.includes('gradient');

    return {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      fontFamily: appSettings.fontFamily,
      background: isGradient ? bgColor : 'none',
      backgroundColor: isGradient ? undefined : bgColor,
      color: appSettings.buttonTextColor || '#ffffff',
      border: 'none',
      borderRadius: '6px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
    };
  };

  const popupStyle = {
    ...getPopupPositionStyle(),
    backgroundColor: appSettings.popupBackgroundColor,
    color: appSettings.popupTextColor,
    borderRadius: appSettings.popupBorderRadius,
    padding: appSettings.popupPadding,
    fontFamily: appSettings.fontFamily,
    boxShadow: appSettings.boxShadow || '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: appSettings.popupBorder || 'none',
  };

  const renderPopupContent = () => {
    if (solved) {
      // Success message view
      return (
        <>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            margin: '0 0 16px 0',
          }}>
            {appSettings.message}
          </p>

          <button
            type="button"
            onClick={handleContinue}
            style={getButtonStyle(true)}
            className="popup-button popup-button-success"
          >
            {appSettings.continueButtonText || I18n.getTrans("i.continue") || 'Continue'}
          </button>
        </>
      );
    }

    // Question form view
    if (questions) {
      // Multiple questions mode
      return (
        <form onSubmit={handleSubmit}>
          {questions.map((q, idx) => renderQuestionInput(q, idx))}

          {showError && (
            <p style={{
              color: appSettings.errorColor,
              fontSize: '13px',
              margin: '8px 0 0 0',
            }}>
              {appSettings.errorMessage || 'Incorrect answer. Try again.'}
            </p>
          )}

          <button
            type="submit"
            disabled={isProcessing || !allAnswersFilled()}
            style={{
              ...getButtonStyle(false, isProcessing || !allAnswersFilled()),
              marginTop: '16px',
            }}
            className="popup-button"
          >
            {isProcessing ? 'Checking...' : (appSettings.submitButtonText || 'Submit')}
          </button>
        </form>
      );
    }

    // Single question mode
    return (
      <form onSubmit={handleSubmit}>
        <label className="popup-question" style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: '500',
        }}>
          {appSettings.question || 'Enter your answer:'}
        </label>

        {renderSingleInput(
          appSettings.inputType || 'TEXT',
          answers,
          (e) => handleInputChange(e),
          appSettings.inputPlaceholder,
          appSettings.selectOptions,
          isProcessing
        )}

        {showError && (
          <p style={{
            color: appSettings.errorColor,
            fontSize: '13px',
            margin: '8px 0 0 0',
          }}>
            {appSettings.errorMessage || 'Incorrect answer. Try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={isProcessing || !allAnswersFilled()}
          style={{
            ...getButtonStyle(false, isProcessing || !allAnswersFilled()),
            marginTop: '16px',
          }}
          className="popup-button"
        >
          {isProcessing ? 'Checking...' : (appSettings.submitButtonText || 'Submit')}
        </button>
      </form>
    );
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const minimizedStyle = {
    ...getPopupPositionStyle(),
    backgroundColor: appSettings.popupBackgroundColor,
    color: appSettings.popupTextColor,
    borderRadius: appSettings.popupBorderRadius,
    padding: '12px 16px',
    fontFamily: appSettings.fontFamily,
    boxShadow: appSettings.boxShadow || '0 4px 20px rgba(0, 0, 0, 0.15)',
    border: appSettings.popupBorder || 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  if (minimized && appSettings.popupMinimizable) {
    return (
      <div id="screen_main" className={`screen_content skin-${(appSettings.skin || 'standard').toLowerCase()}`}>
        {renderBackground()}
        {renderContent()}

        <div className="popup popup-minimized" style={minimizedStyle} onClick={toggleMinimize} title={I18n.getTrans("i.expand") || "Expand"}>
          <span style={{ fontSize: '16px' }}>+</span>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {appSettings.popupTitle || 'Answer'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div id="screen_main" className={`screen_content skin-${(appSettings.skin || 'standard').toLowerCase()}`}>
      {renderBackground()}
      {renderContent()}

      <div className="popup" style={popupStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: appSettings.popupTitle || appSettings.popupMinimizable ? '16px' : '0',
        }}>
          {appSettings.popupTitle && (
            <h3 className="popup-title" style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
            }}>
              {appSettings.popupTitle}
            </h3>
          )}

          {appSettings.popupMinimizable && (
            <button
              type="button"
              onClick={toggleMinimize}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: 1,
                color: appSettings.popupTextColor,
                marginLeft: 'auto',
              }}
              title={I18n.getTrans("i.minimize") || "Minimize"}
            >
              −
            </button>
          )}
        </div>

        {renderPopupContent()}
      </div>
    </div>
  );
};

export default MainScreen;

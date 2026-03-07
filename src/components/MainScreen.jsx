import React, { useState, useContext } from 'react';
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/main.scss';

const MainScreen = (props) => {
  const { escapp, appSettings, Utils, I18n } = useContext(GlobalContext);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [solved, setSolved] = useState(false);
  const [minimized, setMinimized] = useState(appSettings.popupStartMinimized || false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isProcessing || !inputValue.trim()) {
      return;
    }

    setIsProcessing(true);
    setShowError(false);

    const solution = inputValue.trim();
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

  const handleInputChange = (e) => {
    let value = e.target.value;

    // For numeric input, only allow numbers
    if (appSettings.inputType === 'NUMERIC') {
      value = value.replace(/[^0-9]/g, '');
    }

    setInputValue(value);
    setShowError(false);
  };

  const renderInput = () => {
    const inputType = appSettings.inputType || 'TEXT';
    const commonStyles = {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: showError ? '2px solid #e74c3c' : '1px solid #ccc',
      borderRadius: '6px',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.2s',
    };

    switch (inputType) {
      case 'SELECT':
        return (
          <select
            value={inputValue}
            onChange={handleInputChange}
            style={commonStyles}
            disabled={isProcessing}
          >
            <option value="">{appSettings.inputPlaceholder || 'Select an option...'}</option>
            {(appSettings.selectOptions || []).map((option, index) => (
              <option key={index} value={option.value}>
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
            value={inputValue}
            onChange={handleInputChange}
            placeholder={appSettings.inputPlaceholder || 'Enter a number...'}
            style={commonStyles}
            disabled={isProcessing}
            autoComplete="off"
          />
        );

      case 'TEXT':
      default:
        return (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={appSettings.inputPlaceholder || 'Enter your answer...'}
            style={commonStyles}
            disabled={isProcessing}
            autoComplete="off"
          />
        );
    }
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

  const popupStyle = {
    ...getPopupPositionStyle(),
    backgroundColor: appSettings.popupBackgroundColor || '#ffffff',
    color: appSettings.popupTextColor || '#333333',
    borderRadius: appSettings.popupBorderRadius || 8,
    padding: appSettings.popupPadding || 20,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
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
            {appSettings.message || I18n.getTrans("i.message")}
          </p>

          <button
            type="button"
            onClick={handleContinue}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: '#27ae60',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {I18n.getTrans("i.continue") || 'Continue'}
          </button>
        </>
      );
    }

    // Question form view
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

        {renderInput()}

        {showError && (
          <p style={{
            color: '#e74c3c',
            fontSize: '13px',
            margin: '8px 0 0 0',
          }}>
            Incorrect answer. Try again.
          </p>
        )}

        <button
          type="submit"
          disabled={isProcessing || !inputValue.trim()}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: isProcessing ? '#ccc' : '#3498db',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
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
    backgroundColor: appSettings.popupBackgroundColor || '#ffffff',
    color: appSettings.popupTextColor || '#333333',
    borderRadius: appSettings.popupBorderRadius || 8,
    padding: '12px 16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  if (minimized && appSettings.popupMinimizable) {
    return (
      <div id="screen_main" className="screen_content">
        {renderBackground()}
        {renderContent()}

        <div className="popup popup-minimized" style={minimizedStyle} onClick={toggleMinimize}>
          <span style={{ fontSize: '16px' }}>+</span>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {appSettings.popupTitle || 'Answer'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div id="screen_main" className="screen_content">
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
                color: appSettings.popupTextColor || '#333333',
                marginLeft: 'auto',
              }}
              title="Minimize"
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

import React from 'react';
import get from 'lodash/get';
import { closeTabs } from 'providers/ReduxStore/slices/tabs';
import { useDispatch } from 'react-redux';
import { findItemInCollection } from 'utils/collections';
import StyledWrapper from './StyledWrapper';
import RequestTabNotFound from './RequestTabNotFound';
import SpecialTab from './SpecialTab';
import { useTheme } from 'providers/Theme';
import darkTheme from 'themes/dark';
import lightTheme from 'themes/light';

const RequestTab = ({ tab, collection }) => {
  const dispatch = useDispatch();
  const { storedTheme } = useTheme();

  const handleCloseClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(
      closeTabs({
        tabUids: [tab.uid]
      })
    );
  };

  const getMethodColor = (method = '') => {
    const theme = storedTheme === 'dark' ? darkTheme : lightTheme;

    let color = '';
    method = method.toLocaleLowerCase();

    switch (method) {
      case 'get': {
        color = theme.request.methods.get;
        break;
      }
      case 'post': {
        color = theme.request.methods.post;
        break;
      }
      case 'put': {
        color = theme.request.methods.put;
        break;
      }
      case 'delete': {
        color = theme.request.methods.delete;
        break;
      }
      case 'patch': {
        color = theme.request.methods.patch;
        break;
      }
      case 'options': {
        color = theme.request.methods.options;
        break;
      }
      case 'head': {
        color = theme.request.methods.head;
        break;
      }
    }

    return color;
  };

  if (['collection-settings', 'variables', 'collection-runner'].includes(tab.type)) {
    return (
      <StyledWrapper className="flex items-center justify-between tab-container px-1">
        <SpecialTab handleCloseClick={handleCloseClick} type={tab.type} />
      </StyledWrapper>
    );
  }

  const item = findItemInCollection(collection, tab.uid);

  if (!item) {
    return (
      <StyledWrapper className="flex items-center justify-between tab-container px-1">
        <RequestTabNotFound handleCloseClick={handleCloseClick} />
      </StyledWrapper>
    );
  }

  const method = item.draft ? get(item, 'draft.request.method') : get(item, 'request.method');

  return (
    <StyledWrapper className="flex items-center justify-between tab-container px-1">
      <div className="flex items-baseline tab-label pl-2">
        <span className="tab-method uppercase" style={{ color: getMethodColor(method), fontSize: 12 }}>
          {method}
        </span>
        <span className="ml-1 tab-name" title={item.name}>
          {item.name}
        </span>
      </div>
      <div className="flex px-2 close-icon-container" onClick={(e) => handleCloseClick(e)}>
        {!item.draft ? (
          <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="close-icon">
            <path
              fill="currentColor"
              d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"
            ></path>
          </svg>
        ) : (
          <svg
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="16"
            fill="#cc7b1b"
            className="has-changes-icon"
            viewBox="0 0 8 8"
          >
            <circle cx="4" cy="4" r="3" />
          </svg>
        )}
      </div>
    </StyledWrapper>
  );
};

export default RequestTab;

import { createSelector } from 'reselect';
import _ from 'lodash';

import { ACTION_TYPES } from './feed.constants';
import { LOADING_STATES, SHARED_ACTION_TYPES } from '../constants';
import { FEEDBACK_TYPES } from '../../global.constants';

const getInitialState = () => ({
  myFeedbacksStatus: LOADING_STATES.LOADED,
  myFeedbacksEntities: {},
  myFeedbacks: [],

  discoverFeedbacksStatus: LOADING_STATES.LOADED,
  discovers: [],
});

const initialState = getInitialState();

const updateFeedbackMessages = (state, { payload }) => {
  const { feedbackId, messagesIds } = payload;

  const updatedFeedback = { ...state.myFeedbacksEntities[feedbackId] };
  updatedFeedback.messages = messagesIds;

  return {
    ...state,
    myFeedbacksEntities: {
      ...state.myFeedbacksEntities,
      [feedbackId]: updatedFeedback,
    },
  };
};
const setMyFeedbacks = (state, { payload }) => {
  const mergedEntities = {
    ...state.myFeedbacksEntities,
    ...payload.entities.feedbacks,
  };

  return {
    ...state,
    myFeedbacksEntities: mergedEntities,
    myFeedbacks: _.union(state.myFeedbacks, payload.result),
  };
};

const setFeedbacksStatus = (state, { status }) => ({
  ...state,
  myFeedbacksStatus: status,
});

const updateFeedbackDescription = (state, { updatedFeedback }) => {
  const { id: feedbackId } = updatedFeedback;
  const updatedFeedbacks = state.myFeedbacks.map((item) => {
    if (item.id !== feedbackId) { return item; }
    return updatedFeedback;
  });

  return {
    ...state,
    myFeedbacks: updatedFeedbacks,
  };
};

const setDiscoveryStatus = (state, { status }) => ({
  ...state,
  discoverFeedbacksStatus: status,
});

const setDiscoveryFeedbacks = (state, { discovers }) => ({
  ...state,
  discovers,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SHARED_ACTION_TYPES.SET_FEEDBACK_ENTITIES:
      return setMyFeedbacks(state, action);
    case SHARED_ACTION_TYPES.UPDATE_MESSAGES_ENTITIES:
      return updateFeedbackMessages(state, action);
    case ACTION_TYPES.SET_STATUS_MY_FEEDBACKS:
      return setFeedbacksStatus(state, action);
    case ACTION_TYPES.UPDATE_MY_FEEDBACK_DESCRIPTION:
      return updateFeedbackDescription(state, action);
    case ACTION_TYPES.SET_STATUS_DISCOVER_FEEDBACKS:
      return setDiscoveryStatus(state, action);
    case ACTION_TYPES.SET_DISCOVER_FEEDBACKS:
      return setDiscoveryFeedbacks(state, action);
    default:
      return state;
  }
};

export default reducer;

export const myFeedbacksEntitiesSelector = (state) => state.myFeedbacksEntities;

export const feedbacksWithChatsSelector = createSelector(
  [myFeedbacksEntitiesSelector],
  (myFeedbacksEntities) => {
    const result = [];
    Object.keys(myFeedbacksEntities).forEach((id) => {
      if (myFeedbacksEntities[id].messages.length > 0) {
        result.push(myFeedbacksEntities[id]);
      }
    });
    return result;
  },
);

export const getMyFeedbackStatistics = createSelector(
  [myFeedbacksEntitiesSelector],
  (myFeedbacksEntities) => {
    const result = [
      {
        title: 'Improvements',
        counter: 0,
      },
      {
        title: 'Issues',
        counter: 0,
      },
    ];

    const [improvements, issues] = result;

    Object.keys(myFeedbacksEntities).forEach((id) => {
      const { type: issueType } = myFeedbacksEntities[id];
      switch (issueType) {
        case FEEDBACK_TYPES.Improvement:
          improvements.counter += 1;
          break;
        case FEEDBACK_TYPES.Issue:
          issues.counter += 1;
          break;
        default:
          break;
      }
    });
    return result;
  },
);
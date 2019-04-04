import { StackActions } from 'react-navigation';
import { ACTION_TYPES } from './feed.constants';
import { LOADING_STATES, SHARED_ACTION_TYPES } from '../constants';
import * as FeedbackService from '../../services/feedback.service';
import { SCENE_KEYS } from '../../core/constants';

export const setMyFeedbacksStatus = (status) => ({
  type: ACTION_TYPES.SET_STATUS_MY_FEEDBACKS,
  status,
});

export const setDiscoverStatus = (status) => ({
  type: ACTION_TYPES.SET_STATUS_DISCOVER_FEEDBACKS,
  status,
});

export const setMyFeedbacks = (payload) => ({
  type: SHARED_ACTION_TYPES.SET_FEEDBACK_ENTITIES,
  payload,
});

export const setDiscoverFeedbacks = (discovers) => ({
  type: ACTION_TYPES.SET_DISCOVER_FEEDBACKS,
  discovers,
});

export const updateFeedback = ({ updatedFeedback }) => ({
  type: ACTION_TYPES.UPDATE_MY_FEEDBACK_DESCRIPTION,
  updatedFeedback,
});

const navigateToSuccess = () => StackActions.reset({
  index: 0,
  actions: [
    StackActions.push({ routeName: SCENE_KEYS.FeedbackCreationSuccessScreen }),
  ],
});

const getFeedbackDownloadMethod = (full) => {
  if (full) { return FeedbackService.getMyFeedbacks(); }
  return FeedbackService.getFeedbacksWithMessages();
};

export const getMyFeedbacks = (options = { full: true }) => async (dispatch) => {
  dispatch(setMyFeedbacksStatus(LOADING_STATES.LOADING));
  try {
    const feedbacks = await getFeedbackDownloadMethod(options.full);
    dispatch(setMyFeedbacks(feedbacks));
    dispatch(setMyFeedbacksStatus(LOADING_STATES.LOADED));
  } catch (err) {
    alert('My feedback loading error');
    dispatch(setMyFeedbacksStatus(LOADING_STATES.ERROR));
  }
};

export const getDiscoverFeedbacks = () => async (dispatch) => {
  dispatch(setDiscoverStatus(LOADING_STATES.LOADING));
  try {
    const feedbacks = await FeedbackService.getDiscoveryFeedbacks();
    dispatch(setDiscoverFeedbacks(feedbacks));
    dispatch(setDiscoverStatus(LOADING_STATES.LOADED));
  } catch (err) {
    dispatch(setDiscoverStatus(LOADING_STATES.ERROR));
  }
};

// TODO: Revision in next tasks with updating and remove if necessary
export const pushFeedbackDescriptionUpdate = ({ feedbackId, description }) => async (dispatch) => {
  if (!feedbackId || !description) { return; }
  dispatch(setMyFeedbacksStatus(LOADING_STATES.LOADING));
  try {
    const updatedFeedback = await FeedbackService
      .updateFeedbackDescription({ feedbackId, description });

    dispatch(updateFeedback({ updatedFeedback }));
    dispatch(setMyFeedbacksStatus(LOADING_STATES.LOADED));
    dispatch(navigateToSuccess());
  } catch (err) {
    alert('Update description error');
    dispatch(setMyFeedbacksStatus(LOADING_STATES.ERROR));
  }
};
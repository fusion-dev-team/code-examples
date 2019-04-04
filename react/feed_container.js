import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import connect from './connect';

import { SCENE_KEYS } from '../../../../core/constants';
import { LOADING_STATES } from '../../../../store/constants';

import LoadingContainer from '../../components/LoadingContainer';
import FeedStats from '../../components/FeedsStatistics';
import FeedList from '../../components/FeedList';
import FeedListHeader from '../../components/FeedList/FeedListHeader';

import Navbar from '../../../Shared/components/Navbars/NavbarFeed';

class MyFeedbacksScreen extends Component {
  componentDidMount() {
    this.props.getMyFeedbacks();
  }

  onMessagePress = (feedback) => {
    this.props.navigation.navigate(SCENE_KEYS.ChatScreen, {
      feedbackId: feedback.id,
    });
  }

  onContentPress = (link) => {
    this.props.navigation.navigate(SCENE_KEYS.VideoPreviewScreen, {
      videoData: {
        path: link,
      },
      options: {
        resizeMode: 'contain',
      },
    });
  };

  renderHeader = () => {
    const { myFeedbackStatistics } = this.props;
    return (
      <View style={styles.statInfoContainer}>
        <View>
          <FeedStats
            stats={myFeedbackStatistics}
          />
        </View>
        <View>
          <FeedListHeader />
        </View>
      </View>
    );
  }

  render() {
    const { feed } = this.props;

    const loading = LOADING_STATES.LOADING === feed.myFeedbacksStatus;

    return (
      <View
        style={
          loading ?
            [styles.container, styles.containerLoading]
            :
            styles.container
          }
      >
        {loading ?
          <LoadingContainer />
          :
          <FeedList
            HeaderComponent={this.renderHeader}
            onLikePress={() => null}
            onMessagesPress={this.onMessagePress}
            onContentPress={this.onContentPress}
            feedbacks={feed.myFeedbacks}
            feedbackEntities={feed.myFeedbacksEntities}
            isOwner
          />
        }

      </View>
    );
  }
}

MyFeedbacksScreen.navigationOptions = ({ navigation }) => ({
  header: (
    <Navbar
      title="Add Product"
      onPressMessages={() => navigation.navigate(SCENE_KEYS.ChatListScreen)}
      onPressProfile={() => navigation.navigate(SCENE_KEYS.ProfileScreen)}
    />
  ),
});

MyFeedbacksScreen.propTypes = {
  feed: PropTypes.shape({
    myFeedbacks: PropTypes.array.isRequired,
    myFeedbacksStatus: PropTypes.string.isRequired,
  }).isRequired,

  getMyFeedbacks: PropTypes.func.isRequired,

  myFeedbackStatistics: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    counter: PropTypes.number,
  })).isRequired,

  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(MyFeedbacksScreen);
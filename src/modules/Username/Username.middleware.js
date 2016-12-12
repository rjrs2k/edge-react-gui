import asyncAuto from 'async/auto'
import { Actions } from 'react-native-router-flux'

import abcContext from '../../lib/abcContext'

import { openErrorModal } from '../ErrorModal/ErrorModal.action'
import { openLoading, closeLoading } from '../Loader/Loader.action'

import t from '../../lib/LocaleStrings'
const timeoutTimer = setTimeout(() => {}, 0)
export const checkUsername = username => {
  return dispatch => {
    asyncAuto({
      checkUsernameLength: function (callback) {
        if (username.length >= 3) {
          callback(null, null)
        } else {
          callback(t('activity_signup_insufficient_username_message'), null)
        }
      },
      openLoading: function (callback) {
        dispatch(openLoading(t('activity_signup_checking_username')))
        callback(null, null)
      },
      getUsernameAvailability: function (callback) {
        abcContext.usernameAvailable(username, function (error, available) {
          if (error) {
            callback(t('activity_signup_username_unavailable'), null)
          }
          if (!error) {
            callback(null, null)
          }
        })
      }
    }, function (err, results) {
      clearTimeout(timeoutTimer)
      dispatch(closeLoading())

      if (err) {
        dispatch(openErrorModal(err))
      }
      if (!err) {
        Actions.pin()
      }
    })
  }
}

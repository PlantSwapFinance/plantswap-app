// Backwards-compatible re-export of the pools action surface.
export {
  setPoolsPublicData,
  setPoolsUserData,
  updatePoolsUserData,
  fetchPoolsPublicData as fetchPoolsPublicDataAsync,
  fetchPoolsStakingLimits as fetchPoolsStakingLimitsAsync,
  fetchPoolsUserData as fetchPoolsUserDataAsync,
  updateUserAllowance,
  updateUserBalance,
  updateUserStakedBalance,
  updateUserPendingReward,
  usePoolsStore,
} from './store'
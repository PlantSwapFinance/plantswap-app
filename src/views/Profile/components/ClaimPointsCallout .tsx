// The IFO point-claim flow that lived here was removed when PlantSwap dropped
// the IFO feature. The component is preserved as a no-op stub so that
// `src/views/Profile/TaskCenter.tsx` can keep mounting it without changing its
// layout. Delete this file (and the corresponding import/JSX in TaskCenter) if
// a non-IFO claim flow is ever added.
const ClaimPointsCallout = () => null

export default ClaimPointsCallout

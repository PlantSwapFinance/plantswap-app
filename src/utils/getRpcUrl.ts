import sample from 'lodash/sample'

// Array of available nodes to connect to
export const nodes = [import.meta.env.REACT_APP_NODE_1, import.meta.env.REACT_APP_NODE_2, import.meta.env.REACT_APP_NODE_3]

const getNodeUrl = () => {
  return sample(nodes)
}

export default getNodeUrl

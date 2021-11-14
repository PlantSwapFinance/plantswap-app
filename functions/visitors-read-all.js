/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query


exports.handler = (event, context) => {
  console.log('Function `visitors-read-all` invoked')
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  return client.query(q.Paginate(q.Match(q.Ref('indexes/all_visitors'))))
    .then((response) => {
      const docRefs = response.data
      console.log('visitor refs', docRefs)
      console.log(`${docRefs.length} visitors found`)
      
      const getAllTodoDataQuery = docRefs.map((ref) => {
        return q.Get(ref)
      })
      
      return client.query(getAllTodoDataQuery).then((ret) => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        }
      })
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}

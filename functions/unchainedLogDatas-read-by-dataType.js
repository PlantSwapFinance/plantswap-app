/* Import faunaDB sdk */
const faunadb = require('faunadb')
const getId = require('./utils/getId')
const q = faunadb.query

exports.handler = (event, context) => {
  console.log('Function `unchainedLogDatas-read-by-dataType` invoked')
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  const id = getId(event.path)
  return client.query(q.Paginate(q.Match(q.Index('unchainedLogDatas_by_dataType'), id)))
    .then((response) => {
      const docRefs = response.data
      console.log('unchainedLogDatas refs', docRefs)
      console.log(`${docRefs.length} unchainedLogDatas found`)
      
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

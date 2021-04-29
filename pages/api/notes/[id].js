import db from '../../../libs/db'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)
  const id = +req.query.id
  const login = req.session.login

  console.time('get item from db')
  const [val, _] = await db.query("SELECT * FROM notes WHERE id = ? LIMIT 1", [id])
  const note = val[0]
  console.timeEnd('get item from db')

  if (req.method === 'GET') {
    return res.send(JSON.stringify(note))
  }

  if (req.method === 'DELETE') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    console.time('delete item from db')
    await db.query("DELETE FROM notes WHERE id = ?", id)
    console.timeEnd('delete item from db')

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    console.time('update item from db')
    await db.query("UPDATE notes SET body = ?, title = ? WHERE id = ?",
      [req.body.body, req.body.title, id])
    console.timeEnd('update item from db')

    return sendRes(req, res, null)
  }

  return res.send('Method not allowed.')
}

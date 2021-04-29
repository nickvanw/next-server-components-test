import db from '../../../libs/db'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)

  if (req.method === 'GET') {
    console.time('get all items from db')
    const [val, _] = await db.query("SELECT * FROM notes")
    console.timeEnd('get all items from db')
    return res.send(JSON.stringify(val))
  }

  if (req.method === 'POST') {
    const login = req.session.login

    if (!login) {
      return res.status(403).send('Unauthorized')
    }

    console.time('create item from db')
    const [rows, _] = await db.query("INSERT INTO notes (title, body, created_by) VALUES (?, ?, ?)",
      [req.body.title, req.body.body, login])
    console.timeEnd('create item from db')

    return sendRes(req, res, rows.insertId)
  }

  return res.send('Method not allowed.')
}

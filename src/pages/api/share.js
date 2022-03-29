import { put } from '../../utils/database'
import { toValidTailwindVersion } from '../../utils/toValidTailwindVersion'

export default async function share(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 404
    return res.end()
  }

  if (
    typeof req.body !== 'object' ||
    typeof req.body.html !== 'string' ||
    typeof req.body.css !== 'string' ||
    typeof req.body.config !== 'string'
  ) {
    res.statusCode = 400
    return res.end()
  }

  try {
    const { ID } = await put({
      html: req.body.html,
      css: req.body.css,
      config: req.body.config,
      version: toValidTailwindVersion(req.body.version),
    })
    res.statusCode = 200
    res.json({ ID })
  } catch (error) {
    res.statusCode = 500
    if (error instanceof Response) {
      res.json(await error.json())
    } else {
      console.error(error)
      res.json({ error: true })
    }
  }
}

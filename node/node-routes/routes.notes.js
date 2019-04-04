const db = require('../models');
const auth = require('../middlewares/auth');
const acl = require('../middlewares/acl');

module.exports = (router) => {
  router.use(auth.authRequired);

  router.route('/')
    .all(acl.hasActionPermission('note'))
    .get((req, res) => {
      const where = {};
      const { feedbackId } = req.query;
      if (feedbackId) {
        where.feedback_id = feedbackId;
      }
      db.note.findAll({
        where,
        include: [{
          model: db.user,
          as: 'author',
          attributes: ['id', 'email', 'name']
        }]
      })
        .then(notes => res.json({ error: false, notes }))
        .catch(err => res.status(400).json({ error: true, message: err.message }));
    })
    .post(async (req, res) => {
      const { text } = req.body;
      const feedbackId = req.body.feedback_id;
      db.note.create({
        text,
        feedback_id: feedbackId,
        created_by: req.user.id
      })
        .then(note => db.note.findById(note.id, {
          include: [{
            model: db.user,
            as: 'author',
            attributes: ['id', 'email', 'name']
          }]
        }))
        .then(note => res.json({ error: false, note }))
        .catch(err => res.status(400).json({ error: true, message: err.message }));
    });

  router.route('/:id')
    .all(acl.hasActionPermission('note'))
    .get((req, res) => {
      const { id } = req.params;
      db.note.findById(id, {
        include: [{
          model: db.user,
          as: 'author',
          attributes: ['id', 'email', 'name']
        }]
      })
        .then(note => res.json({ error: false, note }))
        .catch(err => res.status(400).json({ error: true, message: err.message }));
    })
    .put((req, res) => {
      const { id } = req.params;
      const payload = req.body;

      db.note.findById(id, {
        include: [{
          model: db.user,
          as: 'author',
          attributes: ['id', 'email', 'name']
        }]
      })
        .then(note => note.update(payload))
        .then(note => res.json({ error: false, note }))
        .catch(err => res.status(400).json({ error: true, message: err.message }));
    })
    .delete((req, res) => {
      const { id } = req.params;
      let note;
      db.note.findById(id)
        .then((model) => {
          note = model;
          return note.destroy();
        })
        .then(() => res.json({
          error: false,
          message: `Note with ID ${note.id} was deleted.`
        }))
        .catch(err => res.status(500).json({ error: true, message: err.message }));
    });
};

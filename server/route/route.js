const jwt = require('../modules/jwt');
const mysql = require('../config/mysql');

module.exports.route = (app) => {
  app.post('/api/login', function(req, res) {
    mysql.query('SELECT * FROM user WHERE id="' + req.body.id + '" AND pw="' + req.body.pw + '";', (err, data) => {
      if (err) {
        res.send({
          status: 400,
          message: 'database user search error',
          data: {}
        });
        return;
      }

      if (data.length == 1) {
        let user = { id: req.body.id, pw: req.body.pw };
        jwt.sign(user).then((token) => {
          mysql.query('UPDATE user SET refresh_token="' + token.refresh_token + '" WHERE id="' + req.body.id + '";', (err, result) => {
            if (err) {
              res.send({
                status: 400,
                message: 'database update error',
                data: {}
              });
              return;
            }

            res.send({
              status: 200,
              message: 'find user successfully',
              data: {
                access_token: token.access_token,
                refresh_token: token.refresh_token
              }
            });
          });
        });
      } else {
        res.send({ 
          status: 404,
          message: "can't find user",
          data: {}
        });
      }
    });
  });

  app.post('/api/signup', function(req, res) {
    mysql.query('INSERT INTO user (id, pw) VALUES ("' + req.body.id + '", "' + req.body.pw + '");', (err, result) => {
      if (err) {
        if (err.code == 'ER_DUP_ENTRY') {
          res.send({
            status: 400,
            message: 'DUP_ENTRY',
            data: {}
          });
          return;
        }
        return;
      }
      res.send({
        status: 200,
        message: 'add user successfully',
        data: {},
      });
    });
  });

  app.post('/api/refreshToken', function(req, res) {
    mysql.query('SELECT * FROM user WHERE refresh_token="' + req.body.refresh_token + '";', (err, data) => {
      if (err) {
        res.send({
          status: 400,
          message: 'database token search error',
          data: {}
        });
        return;
      }

      if (data.length == 1) {
        let user = { id: data.id, pw: data.pw };
        jwt.refresh(user).then((token) => {
          res.send({
            status: 200,
            message: 'refresh token successfully',
            data: {
              access_token: token.access_token,
            }
          });
        });
      } else {
        res.send({ 
          status: 404,
          message: "can't find user by refresh_token",
          data: {}
        });
      }
    });
  });

  app.get('/api/users', function(req, res) {
    jwt.verify(req.headers.access_token).then((data) => {
      if (data != 1) return;
    });
    mysql.query('SELECT id FROM user WHERE id LIKE "%' + req.query.search + '%" ORDER BY id ASC;', (err, data) => {
      if (err) {
        res.send({
          status: 400,
          message: 'database users search error',
          data: {}
        });
        return;
      }

      res.send({
        status: 200,
        message: 'users search successfully',
        data: {
          users: data
        }
      });
    });
  });
}


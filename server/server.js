// libraries
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { Pool } = require('pg');
const cors = require('cors')

app.use(cors());

const pool = new Pool({
    user: 'chris_user',
    host: 'dpg-cg3l8ql269v3bpb833b0-a.oregon-postgres.render.com',
    database: 'chris_koetzee',
    password: 'IwGFGXhLzoCFztiJVwFj4gP7xffAo4ht',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// End Points
// Getting all the videos saved
app.get("/", (req, res) => {
  pool.query('SELECT * FROM videos')
      .then((result) => res.json(result.rows))
      .catch((error) => {
          console.error(error);
          res.status(500).json(error);
      });
});
// Getting a video with a particular id
app.get("/videos/:id", (req, res) => {
    const id = req.body.id
    pool.query('SELECT * FROM videos where id=$', [id])
        .then((result) => res.json(result.rows))
        .catch((error) => {
            console.error(error);
            res.status(500).json(error);
        });
  });
// Adding a video
app.post("/videos/post", (req, res)=>{
    const {title, url} = req.body;
    pool
        .query('select title, url from videos')
        .then((result)=>{
            if (result.rows.find(v => v.title === title && v.url === url)){
             return res
                .status(400)
                .json({ error: "Video already exists" });
            } else {
                const query =
                'INSERT INTO videos(vid_id, title, url, rating)VALUES(uuid_generate_v4(),$1, $2, $3, 0)';
                pool
                    .query(query, [title, url])
                    .then(() => res.json({ message: 'Video saved' }))
                    .catch((error)=> res.status(500).json({ error: error.message }));
            }
        })
    })  
// Deleting a video
app.delete("/delete/:id", (req, res)=> {
    const vidId = req.params.id;
    pool
      .query("DELETE FROM videos WHERE id=$1", [id])
      .then(() => res.send(`Video ${vidId} deleted!`))
      .catch((error) => {
        console.error(error);
        res.status(500).json(error);
      });
  });

app.listen(port, () => console.log(`Listening on port ${port}`));

// Store and retrieve your videos from here
// If you want, you can copy "exampleresponse.json" into here to have some data to work with
let videos = [];

// GET "/"


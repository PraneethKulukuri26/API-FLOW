// apiServer.js
const express = require('express');
const { getProjects, addProject } = require('./service/projectsServices');

const app = express();
const PORT = 4000;

app.use(express.json());

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = await addProject(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API Server is running at http://localhost:${PORT}`);
});

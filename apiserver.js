// apiServer.js
const express = require('express');
const { getProjects, addProject, getCurrentProjectOrAll } = require('./service/projectsServices');
const {
  getProjectBlueprintTitlesOnlyWithResponses,
  addFolder,
  addRequest,
  addResponse,
  deleteFolder,
  deleteRequest,
  deleteResponse,
  editFolder,
  editRequest,
  editResponse,
} = require("./service/projectServices");
const {
  sendRequest,
}=require("./service/requestServices");
const { error } = require('console');

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

app.get('/api/get/project/current-or-all', async (req, res) => {
  try {
    const data = await getCurrentProjectOrAll();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.get('/api/get/project/blueprint', async (req, res) => {
  try {
    const getProjectBlueprint = await getProjectBlueprintTitlesOnlyWithResponses(req.query.id);
    res.status(200).json(getProjectBlueprint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/api/project/add/folder', async (req, res) => {
  try {
    const folder = await addFolder(req.body);
    res.status(200).json(folder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/api/project/add/request', async (req, res) => {
  try {
    const data = await addRequest(req.body);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/api/project/add/responce', async (req, res) => {
  try {
    const data = await addResponse(req.body);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
})

app.post('/api/project/delete/folder', async (req, res) => {
  try {
    const data=await deleteFolder(req.body);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/api/project/delete/request',async(req,res)=>{
  try{
    const data=await deleteRequest(req.body);
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server error'});
  }
})

app.post('/api/project/delete/responce',async(req,res)=>{
  try{
    const data=await deleteResponse(req.body);
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server error'});
  }
})

app.post('/api/project/edit/folder',async(req,res)=>{
  try{
    const data=await editFolder(req.body);
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server error'});
  }
})

app.post('/api/project/edit/request',async(req,res)=>{
  try{
    const data=await editRequest(req.body);
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server error'});
  }
})

app.post('/api/project/edit/responce',async(req,res)=>{
  try{
    const data=await editResponse(req.body);
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server error'});
  }
})

app.post('/api/project/request-call',async (req,res)=>{
  try{
    const data=await sendRequest({ Request: req.body.Request });
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500).json({error:'Internal server error'});
  }
})

app.listen(PORT, () => {
  console.log(`✅ API Server is running at http://localhost:${PORT}`);
});

// src/components/ProjectSelector.tsx
import React, { useState, useEffect } from 'react';
import { getProjects,addProject } from '../services/projectAPI';
import { 
  Layout, 
  Typography, 
  List, 
  Card, 
  Button, 
  Input, 
  Form, 
  Spin, 
  Empty, 
  Space,
  message // Import message for potential error feedback
} from 'antd';
import { 
  PlusOutlined, 
  ArrowLeftOutlined, // Keep this if you prefer the curved arrow
  LeftOutlined, // Use this if you prefer a straight arrow
  CheckOutlined 
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Project {
  id: string;
  title: string;
  description: string;
  created: string;
  updated: string;
}

interface Props {
  onProjectCreated: (project: { name: string; description?: string }) => void;
}

const ProjectSelector: React.FC<Props> = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false); // Add state for create button loading
  const [view, setView] = useState<'list' | 'create'>('list');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Optionally show an error message
        message.error('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreate = async () => { // Make handleCreate async
    if (!projectName.trim()) {
      message.warning('Project name is required.');
      return;
    }

    setCreating(true); // Set creating state to true

    try {
      // Call the addProject API function
      const newProject = await addProject({
        id: Date.now().toString(), // Generate a temporary ID for the API call if needed, or let backend handle it
        title: projectName.trim(),
        description: projectDescription.trim() || '', // Send empty string if no description
        created: new Date().toISOString(), // Add creation date
        updated: new Date().toISOString(), // Add update date
      });

      // Assuming the API returns the created project, you might want to update the list
      // or more likely, navigate to the new project's view.
      // For this example, we'll call onProjectCreated and potentially re-fetch or update state later.
      onProjectCreated({ name: newProject.title, description: newProject.description });

      // Reset form fields and switch view after successful creation
      setProjectName('');
      setProjectDescription('');
      setView('list'); // Or navigate to the new project view

      // Optionally re-fetch projects to update the list view
      // fetchProjects(); 

    } catch (error) {
      console.error('Error creating project:', error);
      message.error('Failed to create project.'); // Show error message
    } finally {
      setCreating(false); // Set creating state back to false
    }
  };

  const handleSelectProject = (project: Project) => {
    onProjectCreated({ name: project.title, description: project.description });
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#121826', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Loading your API collections..." />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#121826' }}>
      <Content style={{ padding: '40px 0', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {view === 'list' ? (
          <div style={{ padding: '0 24px' }}>
            <Paragraph style={{ color: '#A0A0B2', marginBottom: 24 }}>
              Select an existing collection or create a new one to start building your API documentation
            </Paragraph>

            {projects.length > 0 ? (
              <List
                grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
                dataSource={projects}
                renderItem={(project) => (
                  <List.Item>
                    <Card 
                      hoverable
                      style={{ 
                        background: '#2C2F48', 
                        borderColor: '#3A3D56',
                        borderRadius: '8px'
                      }}
                      onClick={() => handleSelectProject(project)}
                    >
                      <Title level={4} style={{ color: 'white', marginTop: 0 }}>{project.title}</Title>
                      <Paragraph style={{ color: '#A0A0B2' }} ellipsis={{ rows: 2 }}>
                        {project.description}
                      </Paragraph>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        borderTop: '1px solid #3A3D56', 
                        paddingTop: 12,
                        marginTop: 12,
                        fontSize: '12px',
                        color: '#A0A0B2'
                      }}>
                        <Text style={{ color: '#A0A0B2', fontSize: '12px' }}>
                          Created: {new Date(project.created).toLocaleDateString()}
                        </Text>
                        <Text style={{ color: '#A0A0B2', fontSize: '12px' }}>
                          Updated: {new Date(project.updated).toLocaleDateString()}
                        </Text>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ color: '#A0A0B2' }}>No collections yet. Create your first one!</span>}
                style={{ 
                  background: '#2C2F48', 
                  padding: '40px', 
                  borderRadius: '8px', 
                  border: '1px solid #3A3D56' 
                }}
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setView('create')}
                style={{ 
                  background: '#00ADB5', 
                  borderColor: '#00ADB5' 
                }}
              >
                Create New Collection
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 24px' }}>
            <Title level={3} style={{ color: 'white', marginBottom: 8 }}>
              Create New Collection
            </Title>
            <Paragraph style={{ color: '#A0A0B2', marginBottom: 24 }}>
              Name your API collection to get started
            </Paragraph>

            <Card style={{ 
              background: '#2C2F48', 
              borderColor: '#3A3D56',
              marginBottom: 24,
              borderRadius: '8px'
            }}>
              <Form layout="vertical">
                <Form.Item 
                  label={<label style={{ color: '#E0E0E0' }}>Collection Name</label>}
                  required
                >
                  <Input
                    placeholder="Enter collection name..."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    // Removed onPressEnter here to avoid accidental creation without description if desired
                    style={{ 
                      background: '#1E1E2F', 
                      borderColor: '#3A3D56',
                      color: 'white'
                    }}
                  />
                </Form.Item>
                
                <Form.Item 
                  label={<label style={{ color: '#E0E0E0' }}>Description (Optional)</label>}
                >
                  <Input.TextArea
                    placeholder="Enter collection description..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    style={{ 
                      background: '#1E1E2F', 
                      borderColor: '#3A3D56',
                      color: 'white'
                    }}
                    rows={3}
                  />
                </Form.Item>
              </Form>
            </Card>
            
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                icon={<LeftOutlined />} // Changed from <ArrowLeftOutlined />
                onClick={() => setView('list')}
                style={{ 
                  background: '#2C2F48', 
                  borderColor: '#3A3D56',
                  color: '#E0E0E0'
                }}
                disabled={creating} // Disable button while creating
              >
                Back to Collections
              </Button>
              
              <Button
                type="primary"
                icon={<CheckOutlined />} // Kept CheckOutlined
                onClick={handleCreate}
                disabled={!projectName.trim() || creating} // Disable if name is empty or creating
                loading={creating} // Add loading state to button
                style={{ 
                  background: projectName.trim() && !creating ? '#00ADB5' : undefined,
                  borderColor: projectName.trim() && !creating ? '#00ADB5' : undefined
                }}
              >
                Create Collection
              </Button>
            </Space>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ProjectSelector;
import React, { useState } from 'react';

interface SidebarProps {
  projectName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ projectName }) => {
  const [activeTab, setActiveTab] = useState('Collections');
  const [expanded, setExpanded] = useState<string[]>(['Admin', 'test', 'Templates']);

  const toggleExpand = (id: string) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter(item => item !== id));
    } else {
      setExpanded([...expanded, id]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 border-r">
      <div className="p-3 border-b flex items-center">
        <span className="font-semibold">{projectName}</span>
      </div>
      
      <div className="flex border-b">
        <button 
          className={`flex-1 py-2 text-sm ${activeTab === 'Collections' ? 'border-b-2 border-blue-600' : ''}`}
          onClick={() => setActiveTab('Collections')}
        >
          Collections
        </button>
        <button 
          className={`flex-1 py-2 text-sm ${activeTab === 'Environments' ? 'border-b-2 border-blue-600' : ''}`}
          onClick={() => setActiveTab('Environments')}
        >
          Environments
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {activeTab === 'Collections' && (
          <div className="p-2">
            <div className="mb-2">
              <div 
                className="flex items-center p-1 hover:bg-gray-200 cursor-pointer"
                onClick={() => toggleExpand('Admin')}
              >
                <span className="mr-1">{expanded.includes('Admin') ? '▼' : '►'}</span>
                <span>Admin</span>
              </div>
              
              {expanded.includes('Admin') && (
                <div className="ml-4">
                  <div 
                    className="flex items-center p-1 hover:bg-gray-200 cursor-pointer"
                    onClick={() => toggleExpand('test')}
                  >
                    <span className="mr-1">{expanded.includes('test') ? '▼' : '►'}</span>
                    <span>test</span>
                  </div>
                  
                  {expanded.includes('test') && (
                    <div className="ml-4">
                      <div 
                        className="flex items-center p-1 hover:bg-gray-200 cursor-pointer"
                        onClick={() => toggleExpand('Templates')}
                      >
                        <span className="mr-1">{expanded.includes('Templates') ? '▼' : '►'}</span>
                        <span>Templates</span>
                      </div>
                      
                      {expanded.includes('Templates') && (
                        <div className="ml-4">
                          <div className="p-1 hover:bg-gray-200 cursor-pointer text-orange-600">
                            POST OTP template
                          </div>
                          <div className="p-1 hover:bg-gray-200 cursor-pointer text-orange-600">
                            POST After Taking Premium
                          </div>
                          <div className="p-1 hover:bg-gray-200 cursor-pointer text-orange-600">
                            POST Received Like
                          </div>
                          <div className="p-1 hover:bg-gray-200 cursor-pointer text-orange-600">
                            POST Plan_exp_warning
                          </div>
                          <div className="p-1 hover:bg-gray-200 cursor-pointer text-orange-600">
                            POST plan Expired
                          </div>
                          <div className="p-1 hover:bg-gray-200 cursor-pointer">
                            Success
                          </div>
                          <div className="p-1 hover:bg-gray-200 cursor-pointer text-orange-600">
                            POST Meeting Update
                          </div>
                          <div className="p-1 hover:bg-gray-200 cursor-pointer text-orange-600">
                            POST Birthday
                          </div>
                          <div className="p-1 hover:bg-gray-200 cursor-pointer text-orange-600">
                            POST After Registering
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
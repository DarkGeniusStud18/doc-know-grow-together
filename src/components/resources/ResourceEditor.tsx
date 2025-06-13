
import React from 'react';

interface ResourceEditorProps {
  resource: any;
  type: 'resource' | 'article';
  onEditComplete: () => void;
}

const ResourceEditor: React.FC<ResourceEditorProps> = ({ resource, type, onEditComplete }) => {
  // Placeholder component - will be implemented later
  return null;
};

export default ResourceEditor;

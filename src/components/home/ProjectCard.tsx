import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Clock, ExternalLink } from 'lucide-react';
import { Project } from '../../types';
import { formatDate, calculateDaysRemaining } from '../../utils/date';
import Button from '../ui/Button';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const daysRemaining = calculateDaysRemaining(project.createdAt);
  
  const getExpiryColor = () => {
    if (daysRemaining <= 5) return 'text-red-500 dark:text-red-400';
    if (daysRemaining <= 10) return 'text-amber-500 dark:text-amber-400';
    return 'text-green-500 dark:text-green-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold truncate">{project.title}</h3>
          <p className="text-gray-200 text-sm">{formatDate(project.createdAt)}</p>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className={`flex items-center mb-4 ${getExpiryColor()}`}>
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">
            {daysRemaining > 0 
              ? `Expires in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`
              : 'Expired'
            }
          </span>
        </div>
        
        <div className="mt-auto flex justify-between">
          <Link 
            to={`/project/${project.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            View Project <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(project.id)}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="text-red-500 hover:text-red-700 hover:border-red-500 dark:text-red-400 dark:hover:text-red-300 dark:hover:border-red-400"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
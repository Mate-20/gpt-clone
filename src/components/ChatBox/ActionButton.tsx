import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  tooltip: string;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon: Icon, 
  onClick, 
  tooltip, 
  className = "" 
}) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-md text-white hover:bg-[var(--secondary-hover-bg)] transition-colors duration-200 ${className}`}
    title={tooltip}
  >
    <Icon size={16} />
  </button>
);
export default ActionButton;
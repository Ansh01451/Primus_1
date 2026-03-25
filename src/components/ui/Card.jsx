import { cn } from '../../utils/utils';

const Card = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl border border-slate-100 card-shadow p-6",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

// src/components/Card/index.js
const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
  
  const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
  
  export { Card, CardContent };
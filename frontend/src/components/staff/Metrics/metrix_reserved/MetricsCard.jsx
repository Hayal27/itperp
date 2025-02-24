import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const MetricsCard = ({ title, children, className }) => {
  return (
    <Card className={`h-100 shadow-sm ${className || ''}`}>
      <CardHeader>
        <h2 className="h5 fw-bold text-dark text-center">{title}</h2>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
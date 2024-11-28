import React from 'react';
import { User } from 'lucide-react';

interface TestimonialProps {
  experience: string;
  role: string;
  beforeSalary: string;
  afterSalary: string;
  increase: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  experience,
  role,
  beforeSalary,
  afterSalary,
  increase
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gray-100 p-2 rounded-full">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">実務経験{experience}の</p>
          <p className="text-gray-600">{role}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-gray-800">
          月単価<span className="font-bold">{beforeSalary}</span>だった方が
        </p>
        <p className="text-gray-800">
          単価<span className="font-bold text-blue-600">{increase}</span>アップして
        </p>
        <p className="text-gray-800">
          月単価<span className="font-bold text-blue-600">{afterSalary}</span>になりました
        </p>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { User, Activity, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export function OnboardingForm() {
  const { updateProfile } = useAuth();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(parseFloat(height), parseFloat(weight));
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const bmi = height && weight 
    ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)
    : null;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Normal Weight', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <User className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h2>
            <p className="text-gray-600">
              Let's calculate your baseline fitness score
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Height (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                placeholder="170"
                min="100"
                max="250"
              />

              <Input
                label="Weight (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                placeholder="70"
                min="30"
                max="200"
              />
            </div>

            {bmi && (
              <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">BMI Score</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{bmi}</div>
                    <div className={`text-sm font-medium ${getBMICategory(parseFloat(bmi)).color}`}>
                      {getBMICategory(parseFloat(bmi)).text}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
              icon={Target}
            >
              Complete Setup
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
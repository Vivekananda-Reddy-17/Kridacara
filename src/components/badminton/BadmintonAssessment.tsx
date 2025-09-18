import React, { useState, useRef } from 'react';
import { Upload, Play, CheckCircle, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function BadmintonAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const analyzeVideo = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulated AI analysis results
      const smashSpeed = Math.round(120 + Math.random() * 80); // 120-200 km/h
      const trajectory = ['Perfect Arc', 'Steep Descent', 'Flat Trajectory'][Math.floor(Math.random() * 3)];
      const technique = smashSpeed > 160 ? 'Excellent' : smashSpeed > 130 ? 'Good' : 'Needs Improvement';
      
      const analysisResults = {
        smashSpeed,
        trajectory,
        technique,
        accuracy: Math.round(75 + Math.random() * 20), // 75-95%
        powerGeneration: Math.round(80 + Math.random() * 15), // 80-95%
        followThrough: Math.round(70 + Math.random() * 25), // 70-95%
        recommendations: [
          'Focus on wrist snap for extra speed',
          'Maintain better body rotation',
          'Improve timing of jump',
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      };
      
      setResults(analysisResults);
      setIsComplete(true);
      
      // Save to database
      await supabase.from('assessments').insert({
        user_id: user?.id,
        type: 'badminton',
        result: smashSpeed,
        details: analysisResults
      });
      
    } catch (error) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAssessment = () => {
    setSelectedFile(null);
    setIsComplete(false);
    setResults(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Badminton Skill Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Analyze your smash speed and technique with AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {!selectedFile ? (
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-orange-500 transition-colors">
                    <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Upload Your Smash Video
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Record a 3-5 second video of your badminton smash. 
                      Make sure the shuttlecock is clearly visible.
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Choose Video File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-4">
                      Supported formats: MP4, MOV, AVI (Max: 50MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Video Preview */}
                  <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
                    <video
                      src={URL.createObjectURL(selectedFile)}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* File Info */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Change
                      </Button>
                    </div>
                  </div>

                  {/* Analysis Button */}
                  <Button
                    onClick={analyzeVideo}
                    disabled={isAnalyzing}
                    loading={isAnalyzing}
                    icon={Play}
                    fullWidth
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isAnalyzing ? 'Analyzing Video...' : 'Analyze Smash Speed'}
                  </Button>
                </div>
              )}
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Instructions and Results */}
          <div className="space-y-6">
            {!isComplete ? (
              <>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recording Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Record in landscape mode</li>
                    <li>• Keep the shuttlecock in frame</li>
                    <li>• Ensure good lighting</li>
                    <li>• Capture the full smash motion</li>
                    <li>• Keep video under 5 seconds</li>
                  </ul>
                </Card>

                <Card className="p-6 bg-orange-50 border-orange-200">
                  <div className="flex items-start">
                    <Zap className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        AI Analysis
                      </h4>
                      <p className="text-sm text-gray-600">
                        Our AI will track the shuttlecock trajectory and calculate 
                        peak speed, analyzing your technique.
                      </p>
                    </div>
                  </div>
                </Card>

                {isAnalyzing && (
                  <Card className="p-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Processing Video...
                      </h3>
                      <p className="text-sm text-gray-600">
                        Tracking shuttlecock and analyzing technique
                      </p>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              /* Results */
              <>
                <Card className="p-6 bg-orange-50 border-orange-200">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Analysis Complete!
                    </h3>
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {results?.smashSpeed} km/h
                    </div>
                    <p className="text-sm text-gray-600">Peak Smash Speed</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detailed Analysis
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed</span>
                      <span className="font-semibold">{results?.smashSpeed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trajectory</span>
                      <span className="font-semibold">{results?.trajectory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Technique</span>
                      <span className="font-semibold">{results?.technique}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accuracy</span>
                      <span className="font-semibold">{results?.accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Power</span>
                      <span className="font-semibold">{results?.powerGeneration}%</span>
                    </div>
                  </div>
                </Card>

                {results?.recommendations && results.recommendations.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={resetAssessment}
                    fullWidth
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Analyze Another Video
                  </Button>
                  <Button
                    onClick={() => navigate('/profile')}
                    variant="outline"
                    fullWidth
                  >
                    View Profile
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
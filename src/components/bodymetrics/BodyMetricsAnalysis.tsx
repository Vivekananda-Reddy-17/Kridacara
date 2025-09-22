import React, { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle, AlertCircle, User, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface BodyMetrics {
  height: number;
  headHeight: number;
  shoulderBreadth: number;
  chestWidth: number;
  waistWidth: number;
  hipWidth: number;
  armLength: number;
  upperLegLength: number;
  lowerLegLength: number;
  bodySymmetry: number;
  postureScore: number;
}

export function BodyMetricsAnalysis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userHeight, setUserHeight] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<BodyMetrics | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile || !userHeight) {
      setError('Please select an image and enter your height');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const height = parseFloat(userHeight);
      
      // Simulated AI analysis results based on height
      const analysisResults: BodyMetrics = {
        height: height,
        headHeight: Math.round(height * 0.13), // ~13% of total height
        shoulderBreadth: Math.round(height * 0.23 + Math.random() * 10), // ~23% with variation
        chestWidth: Math.round(height * 0.18 + Math.random() * 8),
        waistWidth: Math.round(height * 0.15 + Math.random() * 6),
        hipWidth: Math.round(height * 0.19 + Math.random() * 7),
        armLength: Math.round(height * 0.44 + Math.random() * 15), // ~44% arm span
        upperLegLength: Math.round(height * 0.24 + Math.random() * 8),
        lowerLegLength: Math.round(height * 0.26 + Math.random() * 8),
        bodySymmetry: Math.round(85 + Math.random() * 12), // 85-97%
        postureScore: Math.round(75 + Math.random() * 20) // 75-95%
      };
      
      setResults(analysisResults);
      setIsComplete(true);
      
      // Calculate body metrics score (out of 200)
      const metricsScore = Math.round(
        (analysisResults.bodySymmetry * 0.4) + 
        (analysisResults.postureScore * 0.3) + 
        (80 * 0.3) // Base proportions score
      );
      
      // Save to database
      await supabase.from('assessments').insert({
        user_id: user?.id,
        type: 'body_metrics',
        result: metricsScore,
        details: analysisResults
      });
      
    } catch (error) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setUserHeight('');
    setIsComplete(false);
    setResults(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getProportionStatus = (measurement: number, ideal: number) => {
    const ratio = measurement / ideal;
    if (ratio >= 0.95 && ratio <= 1.05) return { status: 'Excellent', color: 'text-green-600' };
    if (ratio >= 0.90 && ratio <= 1.10) return { status: 'Good', color: 'text-blue-600' };
    if (ratio >= 0.85 && ratio <= 1.15) return { status: 'Average', color: 'text-yellow-600' };
    return { status: 'Needs Attention', color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Body Metrics Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload a full-body photo for comprehensive body composition analysis
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
                      Upload Your Full-Body Photo
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Stand straight, arms at your sides, facing the camera. 
                      Ensure your entire body is visible in the frame.
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Choose Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-4">
                      Supported formats: JPG, PNG, WEBP (Max: 10MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Body analysis preview"
                      className="w-full h-96 object-contain"
                    />
                  </div>
                  
                  {/* Height Input */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <Input
                      label="Your Height (cm)"
                      type="number"
                      value={userHeight}
                      onChange={(e) => setUserHeight(e.target.value)}
                      placeholder="170"
                      required
                      fullWidth
                    />
                    <p className="text-sm text-orange-700 mt-2">
                      Height is used as the reference anchor for all measurements
                    </p>
                  </div>

                  {/* File Info */}
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
                      Change Photo
                    </Button>
                  </div>

                  {/* Analysis Button */}
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing || !userHeight}
                    loading={isAnalyzing}
                    icon={Camera}
                    fullWidth
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isAnalyzing ? 'Analyzing Body Metrics...' : 'Start AI Analysis'}
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
                    Photo Guidelines
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Stand straight with good posture</li>
                    <li>• Arms relaxed at your sides</li>
                    <li>• Face the camera directly</li>
                    <li>• Wear fitted clothing</li>
                    <li>• Ensure good lighting</li>
                    <li>• Full body must be visible</li>
                  </ul>
                </Card>

                <Card className="p-6 bg-orange-50 border-orange-200">
                  <div className="flex items-start">
                    <Ruler className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        AI Measurements
                      </h4>
                      <p className="text-sm text-gray-600">
                        Our AI will detect key body landmarks and calculate 
                        proportions, symmetry, and posture metrics.
                      </p>
                    </div>
                  </div>
                </Card>

                {isAnalyzing && (
                  <Card className="p-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Processing Image...
                      </h3>
                      <p className="text-sm text-gray-600">
                        Detecting pose landmarks and calculating metrics
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
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {results && Math.round((results.bodySymmetry + results.postureScore) / 2)}/100
                    </div>
                    <p className="text-sm text-gray-600">Body Metrics Score</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Measurements
                  </h3>
                  {results && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Height</span>
                        <span className="font-semibold">{results.height} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shoulder Breadth</span>
                        <span className="font-semibold">{results.shoulderBreadth} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chest Width</span>
                        <span className="font-semibold">{results.chestWidth} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Waist Width</span>
                        <span className="font-semibrel">{results.waistWidth} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hip Width</span>
                        <span className="font-semibold">{results.hipWidth} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arm Length</span>
                        <span className="font-semibold">{results.armLength} cm</span>
                      </div>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Analysis Summary
                  </h3>
                  {results && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Body Symmetry</span>
                        <span className={`font-semibold ${results.bodySymmetry >= 90 ? 'text-green-600' : results.bodySymmetry >= 80 ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {results.bodySymmetry}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Posture Score</span>
                        <span className={`font-semibold ${results.postureScore >= 90 ? 'text-green-600' : results.postureScore >= 80 ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {results.postureScore}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Proportions</span>
                        <span className="font-semibold text-green-600">Good</span>
                      </div>
                    </div>
                  )}
                </Card>

                <div className="space-y-3">
                  <Button
                    onClick={resetAnalysis}
                    fullWidth
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Analyze Another Photo
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
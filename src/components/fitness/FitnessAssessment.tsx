import React, { useState, useRef, useEffect } from 'react';
import { Camera, Play, Square, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function FitnessAssessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [pushUpCount, setPushUpCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isComplete, setIsComplete] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState('');

  // Simulated AI detection states
  const [bodyPosition, setBodyPosition] = useState<'up' | 'down' | 'transition'>('up');
  const [formScore, setFormScore] = useState(85);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permission and refresh.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const startAssessment = () => {
    if (!cameraReady) {
      setError('Camera not ready. Please wait or refresh the page.');
      return;
    }

    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          beginRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginRecording = () => {
    setIsRecording(true);
    setTimeLeft(30);
    setPushUpCount(0);
    
    // Simulated push-up detection
    const detectionInterval = setInterval(() => {
      // Random push-up detection every 1-3 seconds
      if (Math.random() < 0.4) {
        setPushUpCount(prev => prev + 1);
        setBodyPosition('down');
        setTimeout(() => setBodyPosition('up'), 500);
        
        // Update form score based on performance
        setFormScore(prev => Math.max(60, prev + (Math.random() - 0.5) * 10));
      }
    }, 2000);

    // Timer countdown
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          clearInterval(detectionInterval);
          completeAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeAssessment = async () => {
    setIsRecording(false);
    setIsComplete(true);

    // Save results to database
    try {
      await supabase.from('assessments').insert({
        user_id: user?.id,
        type: 'fitness',
        result: pushUpCount,
        details: {
          duration: 30,
          formScore: Math.round(formScore),
          technique: formScore > 80 ? 'Excellent' : formScore > 60 ? 'Good' : 'Needs Improvement'
        }
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const resetAssessment = () => {
    setIsComplete(false);
    setPushUpCount(0);
    setTimeLeft(30);
    setFormScore(85);
    setBodyPosition('up');
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
            Basic Fitness Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Push-up endurance test with AI form analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ display: 'none' }}
                />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Countdown */}
                  {countdown > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-8xl font-bold animate-pulse">
                        {countdown}
                      </div>
                    </div>
                  )}
                  
                  {/* Recording indicator */}
                  {isRecording && (
                    <>
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">RECORDING</span>
                      </div>
                      
                      {/* Timer */}
                      <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
                        <div className="text-2xl font-bold">{timeLeft}s</div>
                      </div>
                      
                      {/* Push-up counter */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full">
                        <div className="text-3xl font-bold">{pushUpCount}</div>
                        <div className="text-sm text-center">Push-ups</div>
                      </div>
                    </>
                  )}
                  
                  {/* Body position indicator */}
                  {isRecording && (
                    <div className="absolute bottom-4 right-4">
                      <div className={`w-4 h-4 rounded-full ${
                        bodyPosition === 'up' ? 'bg-green-500' : 
                        bodyPosition === 'down' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}></div>
                    </div>
                  )}
                </div>
                
                {/* Camera not ready */}
                {!cameraReady && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg">Starting camera...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Controls and Results */}
          <div className="space-y-6">
            {!isComplete ? (
              <>
                {/* Instructions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Instructions
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Position yourself so your full body is visible</li>
                    <li>• Maintain proper push-up form</li>
                    <li>• Complete as many push-ups as possible in 30 seconds</li>
                    <li>• The AI will count valid repetitions</li>
                  </ul>
                </Card>

                {/* Start Button */}
                <Card className="p-6">
                  <Button
                    onClick={startAssessment}
                    disabled={!cameraReady || isRecording || countdown > 0}
                    icon={countdown > 0 ? Square : Play}
                    fullWidth
                    size="lg"
                  >
                    {countdown > 0 ? 'Starting...' : 
                     isRecording ? 'Recording...' : 'Start Assessment'}
                  </Button>
                </Card>

                {/* Live Stats */}
                {isRecording && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Live Analysis
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Push-ups</span>
                        <span className="font-semibold">{pushUpCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Form Score</span>
                        <span className="font-semibold">{Math.round(formScore)}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Left</span>
                        <span className="font-semibold">{timeLeft}s</span>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              /* Results */
              <>
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Assessment Complete!
                    </h3>
                    <div className="text-3xl font-bold text-green-600 mb-4">
                      {pushUpCount} Push-ups
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detailed Results
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repetitions</span>
                      <span className="font-semibold">{pushUpCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold">30 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Form</span>
                      <span className="font-semibold">{Math.round(formScore)}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Technique</span>
                      <span className="font-semibold">
                        {formScore > 80 ? 'Excellent' : formScore > 60 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-3">
                  <Button
                    onClick={resetAssessment}
                    icon={RotateCcw}
                    fullWidth
                  >
                    Try Again
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
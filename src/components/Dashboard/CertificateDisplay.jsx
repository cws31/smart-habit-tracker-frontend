
import React, { useEffect, useState } from 'react';
import { certificateAPI } from '../../api';
import { Award, Clock, FileText, Trophy, Sparkles, RefreshCw, Calendar, Target, X } from 'lucide-react';

const CompactCertificateCard = ({ certificate, onViewDetails }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition duration-200">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-lg">{certificate.habitTitle}</h3>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
          <span className="flex items-center">
            <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
            {certificate.streakAchieved} days
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-blue-500" />
            {new Date(certificate.awardedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <button
        onClick={() => onViewDetails(certificate)}
        className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 flex items-center"
      >
        <FileText className="w-4 h-4 mr-2" />
        View Certificate
      </button>
    </div>
  </div>
);

const FullCertificateModal = ({ certificate, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition duration-150"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="px-12 pb-12 pt-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 tracking-widest uppercase mb-2 font-serif">
              CERTIFICATE
            </h1>
            <h2 className="text-4xl font-bold text-gray-900 tracking-widest uppercase font-serif">
              OF EXCELLENCE
            </h2>
          </div>

          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 uppercase tracking-widest mb-6 font-light">
              THIS CERTIFICATE IS AWARDED TO
            </p>
            <h3 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-400 pb-4 inline-block px-12 tracking-wide uppercase">
              {certificate.habitTitle}
            </h3>
          </div>

          <div className="mb-12">
            <p className="text-gray-700 text-center leading-relaxed text-lg font-light tracking-wide">
              {certificate.certificateMessage || 
                "For demonstrating exceptional commitment and consistency in maintaining healthy habits. " +
                "Your dedication to personal growth and remarkable discipline in daily routine has set a " +
                "remarkable example of excellence and perseverance in habit formation and self-improvement."
              }
            </p>
          </div>

          <div className="text-center mb-12">
            <div className="inline-block bg-gray-100 py-4 px-8 rounded-lg border-2 border-gray-300">
              <p className="text-sm uppercase tracking-widest text-gray-600 mb-1 font-semibold">
                Achieved Streak
              </p>
              <p className="text-4xl font-bold text-gray-900">{certificate.streakAchieved} Consecutive Days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="text-center">
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2 font-semibold">
                Completed On
              </p>
              <p className="font-semibold text-gray-900 text-lg">
                {certificate.streakCompletionDate 
                  ? new Date(certificate.streakCompletionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Date not available'
                }
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2 font-semibold">
                Certificate ID
              </p>
              <p className="font-mono font-semibold text-gray-900 text-lg">#{certificate.id}</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2 tracking-wide">Salford</p>
              <div className="w-32 h-1 bg-gray-400 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 uppercase tracking-widest">Habit Excellence Foundation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificateDisplay = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await certificateAPI.getAllCertificates();
      setCertificates(response.data);
      
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError(`Failed to load certificates: ${error.response?.data?.message || error.message}`);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleRefresh = () => {
    fetchCertificates();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏆 My Achievement Certificates
          </h1>
          <p className="text-lg text-gray-600">
            Celebrate your habit-building journey and consistency milestones
          </p>
        </div>

        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Certificates</h2>
            <p className="text-gray-600">
              {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-150"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              <p className="font-medium">{error}</p>
            </div>
            <button 
              onClick={fetchCertificates}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
            >
              Try Again
            </button>
          </div>
        )}
        
        {certificates.length === 0 && !error && (
          <div className="text-center p-12 bg-white rounded-xl shadow-2xl border-2 border-dashed border-blue-300">
            <Trophy className="w-20 h-20 mx-auto text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Certificates Yet!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Certificates are automatically generated when you achieve specific streak milestones. 
              Keep building your habits and you'll see your certificates here!
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">
                🎯 How to Earn Certificates
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-1">1</span>
                    <p className="text-sm text-blue-700">Maintain consistent daily habits</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-1">2</span>
                    <p className="text-sm text-blue-700">Build consecutive day streaks</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-1">3</span>
                    <p className="text-sm text-blue-700">Achieve streak milestones (2-day, 7-day, etc.)</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 mt-1">4</span>
                    <p className="text-sm text-blue-700">Certificates are automatically generated!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {certificates.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow border text-center">
                <p className="text-sm text-gray-600">Total Certificates</p>
                <p className="text-3xl font-bold text-blue-600">{certificates.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border text-center">
                <p className="text-sm text-gray-600">Highest Streak</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.max(...certificates.map(c => c.streakAchieved))} days
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border text-center">
                <p className="text-sm text-gray-600">Habits Certified</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(certificates.map(c => c.habitTitle)).size}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {certificates
                .sort((a, b) => new Date(b.awardedAt) - new Date(a.awardedAt))
                .map(certificate => (
                  <CompactCertificateCard 
                    key={certificate.id} 
                    certificate={certificate}
                    onViewDetails={handleViewCertificate}
                  />
                ))
              }
            </div>
          </div>
        )}

        {selectedCertificate && (
          <FullCertificateModal
            certificate={selectedCertificate}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default CertificateDisplay;
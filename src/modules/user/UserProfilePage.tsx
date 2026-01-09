import { useState } from 'react';
import {
  UserInfoCard,
  ProficiencyCard,
  StatsOverview,
  LessonsByTopic,
  WordsLearned,
  LearningHistory,
  ProgressChart,
} from './components';
import '../../styles/userProfile.css';

export const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'history'>('overview');

  return (
    <div className="user-profile-page min-h-screen bg-white-97 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-15 mb-2">My Learning Profile</h1>
          <p className="text-gray-40">Track your progress and achievements in English learning</p>
        </div>

        {/* Top Row: User Info & Proficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <UserInfoCard />
          </div>
          <div>
            <ProficiencyCard />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-4 border-b border-white-90">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'text-mint-50 border-b-2 border-mint-50'
                : 'text-gray-40 hover:text-gray-30'
            }`}
          >
            Learning Overview
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'lessons'
                ? 'text-mint-50 border-b-2 border-mint-50'
                : 'text-gray-40 hover:text-gray-30'
            }`}
          >
            Lessons by Topic
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'history'
                ? 'text-mint-50 border-b-2 border-mint-50'
                : 'text-gray-40 hover:text-gray-30'
            }`}
          >
            Learning History
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <>
                <ProgressChart />
                <div className="mt-6">
                  <WordsLearned />
                </div>
              </>
            )}
            {activeTab === 'lessons' && <LessonsByTopic />}
            {activeTab === 'history' && <LearningHistory />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-mint-50/10 rounded-lg p-6 border border-mint-50/20">
              <h3 className="text-lg font-bold text-mint-50 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-40">Streak Days</span>
                  <span className="text-xl font-bold text-mint-50">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-40">Current Level</span>
                  <span className="text-xl font-bold text-mint-50">Upper-Intermediate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-40">Completion Rate</span>
                  <span className="text-xl font-bold text-mint-50">85%</span>
                </div>
              </div>
            </div>

            <div className="bg-white-95 rounded-lg p-6 border border-white-90">
              <h3 className="text-lg font-bold text-gray-15 mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-semibold text-gray-15">First Steps</p>
                    <p className="text-sm text-gray-40">Complete 5 lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="font-semibold text-gray-15">On Fire</p>
                    <p className="text-sm text-gray-40">7-day learning streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <p className="font-semibold text-gray-15">Word Master</p>
                    <p className="text-sm text-gray-40">Learn 500 words</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Trophy, Clock, Brain, Star, Calendar, Badge, Gamepad, Target, Award, BookOpen, Activity, AlertTriangle, ChevronRight, ArrowUp, Info } from "lucide-react";

// Sample performance data for demonstration
const performanceData = [
  { date: '2025-01-01', xp: 120, gamesPlayed: 5, accuracy: 78, studyTime: 35 },
  { date: '2025-01-02', xp: 150, gamesPlayed: 6, accuracy: 82, studyTime: 42 },
  { date: '2025-01-03', xp: 80, gamesPlayed: 3, accuracy: 75, studyTime: 25 },
  { date: '2025-01-04', xp: 210, gamesPlayed: 8, accuracy: 85, studyTime: 55 },
  { date: '2025-01-05', xp: 160, gamesPlayed: 6, accuracy: 81, studyTime: 40 },
  { date: '2025-01-06', xp: 190, gamesPlayed: 7, accuracy: 88, studyTime: 48 },
  { date: '2025-01-07', xp: 240, gamesPlayed: 9, accuracy: 90, studyTime: 60 },
  { date: '2025-02-10', xp: 300, gamesPlayed: 12, accuracy: 92, studyTime: 75 },
  { date: '2025-02-15', xp: 270, gamesPlayed: 10, accuracy: 88, studyTime: 70 },
  { date: '2025-02-20', xp: 310, gamesPlayed: 13, accuracy: 93, studyTime: 80 },
  { date: '2025-02-25', xp: 350, gamesPlayed: 15, accuracy: 95, studyTime: 90 },
];

// Sample subject performance data
const subjectPerformance = [
  { subject: 'Math', score: 82, color: '#9333ea', weakTopics: ['Calculus', 'Trigonometry'], strongTopics: ['Algebra', 'Statistics'] },
  { subject: 'Science', score: 78, color: '#2563eb', weakTopics: ['Physics', 'Chemistry'], strongTopics: ['Biology', 'Astronomy'] },
  { subject: 'History', score: 92, color: '#ea580c', weakTopics: ['Ancient History'], strongTopics: ['Modern History', 'World Wars'] },
  { subject: 'Language', score: 85, color: '#16a34a', weakTopics: ['Grammar'], strongTopics: ['Vocabulary', 'Comprehension'] },
  { subject: 'Geography', score: 70, color: '#db2777', weakTopics: ['Mountain Ranges', 'Capitals'], strongTopics: ['Countries', 'Oceans'] },
];

// Game achievements data with dynamic progress calculations
const achievements = [
  { name: 'Quiz Master', description: 'Complete 50 quizzes', progress: 32, total: 50, icon: Brain, color: 'text-purple-400' },
  { name: 'Perfect Score', description: 'Get 100% on 10 games', progress: 4, total: 10, icon: Star, color: 'text-yellow-400' },
  { name: 'Daily Streak', description: 'Study for 7 consecutive days', progress: 5, total: 7, icon: Calendar, color: 'text-green-400' },
  { name: 'Level 10', description: 'Reach level 10', progress: 6, total: 10, icon: Badge, color: 'text-blue-400' },
  { name: 'Speed Demon', description: 'Complete 5 games in under 2 minutes each', progress: 2, total: 5, icon: Clock, color: 'text-red-400' },
];

// Recent activities with timestamps
const recentActivities = [
  { date: "2025-02-25", time: "14:22", activity: "Completed Hangman Challenge", xp: 50, color: "text-blue-400", subjectArea: "Language" },
  { date: "2025-02-24", time: "09:15", activity: "Created 5 new flashcards", xp: 25, color: "text-green-400", subjectArea: "Science" },
  { date: "2025-02-24", time: "16:30", activity: "Perfect score on Quick Quiz", xp: 100, color: "text-purple-400", subjectArea: "Math" },
  { date: "2025-02-23", time: "08:00", activity: "Daily login bonus", xp: 10, color: "text-yellow-400", subjectArea: null },
  { date: "2025-02-22", time: "19:45", activity: "Completed Millionaire Challenge", xp: 75, color: "text-blue-400", subjectArea: "History" },
];

// Skill mastery data
const skillMastery = [
  { skill: 'Problem Solving', value: 85 },
  { skill: 'Memorization', value: 70 },
  { skill: 'Critical Thinking', value: 90 },
  { skill: 'Speed', value: 65 },
  { skill: 'Accuracy', value: 80 },
];

// Learning recommendations based on performance
const learningRecommendations = [
  { title: 'Review Calculus Concepts', description: 'Your recent quizzes show you struggle with derivatives', subject: 'Math', difficulty: 'Medium', estimatedTime: '20 min' },
  { title: 'Try Geography Flashcards', description: 'Improve your knowledge of world capitals', subject: 'Geography', difficulty: 'Easy', estimatedTime: '15 min' },
  { title: 'Physics Interactive Lab', description: 'Hands-on practice with Newton\'s laws of motion', subject: 'Science', difficulty: 'Hard', estimatedTime: '30 min' },
];

export default function EnhancedPerformance() {
  const [timeRange, setTimeRange] = useState("week");
  const [chartData, setChartData] = useState(performanceData.slice(-7));
  const [chartType, setChartType] = useState("xp");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [insightVisible, setInsightVisible] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);

  useEffect(() => {
    // Filter data based on selected time range
    if (timeRange === "week") {
      setChartData(performanceData.slice(-7));
    } else if (timeRange === "month") {
      setChartData(performanceData.slice(-30));
    } else {
      setChartData(performanceData);
    }
  }, [timeRange]);

  // Calculate stats
  const totalXP = performanceData.reduce((sum, entry) => sum + entry.xp, 0);
  const totalGames = performanceData.reduce((sum, entry) => sum + entry.gamesPlayed, 0);
  const averageAccuracy = Math.round(
    performanceData.reduce((sum, entry) => sum + entry.accuracy, 0) / performanceData.length
  );
  const totalStudyTime = performanceData.reduce((sum, entry) => sum + entry.studyTime, 0);

  // Calculate trends (simplified)
  const lastWeekXP = performanceData.slice(-7).reduce((sum, entry) => sum + entry.xp, 0);
  const previousWeekXP = performanceData.slice(-14, -7).reduce((sum, entry) => sum + entry.xp, 0) || 1;
  const xpTrend = ((lastWeekXP - previousWeekXP) / previousWeekXP) * 100;
  
  // Generate meaningful insights
  const generateInsight = () => {
    if (xpTrend > 20) {
      return "Great progress! Your XP has increased significantly. Keep up the momentum!";
    } else if (xpTrend > 0) {
      return "You're showing steady improvement. Try challenging yourself with more difficult quizzes.";
    } else if (xpTrend === 0) {
      return "Your progress has plateaued. Consider trying different learning activities.";
    } else {
      return "Your XP has decreased. Focus on consistent daily practice to get back on track.";
    }
  };

  // Calculate achievements close to completion
  const nearCompletionAchievements = achievements
    .filter(a => a.progress / a.total >= 0.7 && a.progress / a.total < 1)
    .sort((a, b) => (b.progress / b.total) - (a.progress / a.total));

  // Custom tooltip for charts
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }
  
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded-md shadow-lg">
          <p className="text-gray-300 text-sm">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {`${entry.name}: ${entry.value}${entry.name.includes('%') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderSubjectDetail = () => {
    if (!selectedSubject) return null;
    
    const subject = subjectPerformance.find(s => s.subject === selectedSubject);
    if (!subject) return null;
    
    return (
      <div className="mt-4 bg-gray-800 p-4 rounded-lg animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">{subject.subject} Performance Details</h3>
          <button
            onClick={() => setSelectedSubject(null)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Areas for Improvement</h4>
            <ul className="space-y-2">
              {subject.weakTopics.map((topic, idx) => (
                <li key={idx} className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-400 mr-2" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Strong Areas</h4>
            <ul className="space-y-2">
              {subject.strongTopics.map((topic, idx) => (
                <li key={idx} className="flex items-center">
                  <Award className="h-4 w-4 text-green-400 mr-2" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
            onClick={() => setShowRecommendations(true)}
          >
            Get Personalized Study Plan
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center">
        Your Performance Dashboard
        <span className="ml-2 text-xs font-normal bg-purple-500 text-white px-2 py-1 rounded-full">
          PREMIUM
        </span>
      </h1>

      {/* Insight Banner */}
      {insightVisible && (
        <div className="relative mb-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 rounded-lg border border-blue-500/30 flex items-center">
          <Info className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
          <p className="text-sm flex-1">{generateInsight()}</p>
          <button 
            onClick={() => setInsightVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Overview with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-hover p-4 flex items-center gap-3 relative overflow-hidden group">
          <div className="absolute right-2 top-2 text-xs font-medium rounded-full px-2 bg-green-400/20 text-green-400 flex items-center">
            <ArrowUp className="h-3 w-3 mr-1" />
            {Math.abs(xpTrend).toFixed(1)}%
          </div>
          <div className="bg-purple-400/20 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Trophy className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total XP</p>
            <p className="text-xl font-bold text-purple-400">{totalXP.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Level {Math.floor(totalXP / 500) + 1}</p>
          </div>
        </div>
        
        <div className="card-hover p-4 flex items-center gap-3 relative overflow-hidden group">
          <div className="bg-green-400/20 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Gamepad className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Games Played</p>
            <p className="text-xl font-bold text-green-400">{totalGames}</p>
            <p className="text-xs text-gray-500 mt-1">Avg. {(totalXP / totalGames).toFixed(1)} XP per game</p>
          </div>
        </div>
        
        <div className="card-hover p-4 flex items-center gap-3 relative overflow-hidden group">
          <div className="bg-blue-400/20 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Target className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Average Accuracy</p>
            <p className="text-xl font-bold text-blue-400">{averageAccuracy}%</p>
            <p className="text-xs text-gray-500 mt-1">Last game: {performanceData[performanceData.length - 1].accuracy}%</p>
          </div>
        </div>

        <div className="card-hover p-4 flex items-center gap-3 relative overflow-hidden group">
          <div className="bg-amber-400/20 p-3 rounded-full group-hover:scale-110 transition-transform">
            <Clock className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Study Time</p>
            <p className="text-xl font-bold text-amber-400">{totalStudyTime} min</p>
            <p className="text-xs text-gray-500 mt-1">~{Math.round(totalStudyTime / performanceData.length)} min/day</p>
          </div>
        </div>
      </div>

      {/* Chart Section with Enhanced Interactivity */}
      <div className="card-hover p-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Performance Trends</h2>
            <p className="text-xs text-gray-400">Track your progress over time</p>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-end">
            <div className="flex rounded-md bg-gray-800 p-1 mr-2">
              <button
                onClick={() => setChartType("xp")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  chartType === "xp" ? "bg-purple-600 text-white" : "bg-transparent text-gray-300 hover:bg-gray-700"
                }`}
              >
                XP
              </button>
              <button
                onClick={() => setChartType("accuracy")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  chartType === "accuracy" ? "bg-blue-600 text-white" : "bg-transparent text-gray-300 hover:bg-gray-700"
                }`}
              >
                Accuracy
              </button>
              <button
                onClick={() => setChartType("studyTime")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  chartType === "studyTime" ? "bg-amber-600 text-white" : "bg-transparent text-gray-300 hover:bg-gray-700"
                }`}
              >
                Study Time
              </button>
            </div>
            
            <div className="flex rounded-md bg-gray-800 p-1">
              <button
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeRange === "week" ? "bg-purple-600 text-white" : "bg-transparent text-gray-300 hover:bg-gray-700"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeRange === "month" ? "bg-purple-600 text-white" : "bg-transparent text-gray-300 hover:bg-gray-700"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange("all")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeRange === "all" ? "bg-purple-600 text-white" : "bg-transparent text-gray-300 hover:bg-gray-700"
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {chartType === "xp" && (
                <Line
                  type="monotone"
                  dataKey="xp"
                  name="XP Earned"
                  stroke="#9333ea"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  animationDuration={1000}
                />
              )}
              
              {chartType === "accuracy" && (
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  name="Accuracy %"
                  stroke="#2563eb"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  animationDuration={1000}
                />
              )}
              
              {chartType === "studyTime" && (
                <Line
                  type="monotone"
                  dataKey="studyTime"
                  name="Study Time (min)"
                  stroke="#f59e0b"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  animationDuration={1000}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Performance & Skill Mastery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Subject Performance */}
        <div className="card-hover p-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Subject Performance</h2>
              <p className="text-xs text-gray-400">Click on a bar for detailed insights</p>
            </div>
            {selectedSubject && (
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                Reset View
              </button>
            )}
          </div>
          
          <div className="h-72 cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="subject" stroke="#999" />
                <YAxis stroke="#999" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  labelStyle={{ color: "#e0e0e0" }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Bar 
                  dataKey="score" 
                  name="Score %" 
                  radius={[4, 4, 0, 0]}
                  onClick={(data) => setSelectedSubject(data.subject)}
                  animationDuration={1000}
                >
                  {subjectPerformance.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      fillOpacity={selectedSubject === entry.subject ? 1 : 0.7}
                      className="transition-opacity duration-300 hover:opacity-100"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {renderSubjectDetail()}
        </div>

        {/* Skill Mastery Radar Chart */}
        <div className="card-hover p-4 transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Skill Mastery</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={skillMastery}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="skill" stroke="#999" />
                <PolarRadiusAxis domain={[0, 100]} stroke="#999" />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.5}
                  animationDuration={1000}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  labelStyle={{ color: "#e0e0e0" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achievements Section - Interactive */}
      <div className="card-hover p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Achievements</h2>
            <p className="text-xs text-gray-400">
              {nearCompletionAchievements.length > 0 
                ? `${nearCompletionAchievements.length} achievements close to completion!` 
                : 'Track your learning milestones'}
            </p>
          </div>
        </div>
        
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
          {achievements.map((achievement, index) => {
            const progressPercent = (achievement.progress / achievement.total) * 100;
            const isSelected = selectedAchievement === index;
            
            return (
              <div 
                key={index} 
                className={`bg-gray-800 p-3 rounded-lg flex items-center cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-purple-500 transform scale-[1.02]' : 'hover:bg-gray-750'
                } ${progressPercent >= 70 && progressPercent < 100 ? 'border-l-4 border-yellow-500' : ''}`}
                onClick={() => setSelectedAchievement(isSelected ? null : index)}
              >
                <div className={`${achievement.color} mr-3`}>
                  <achievement.icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{achievement.name}</h3>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"
                      style={{ width: `${progressPercent}%`, transition: 'width 1s ease-in-out' }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">
                      {achievement.progress}/{achievement.total}
                    </p>
                    {progressPercent >= 70 && progressPercent < 100 && (
                      <span className="text-xs text-yellow-400 font-medium">Almost there!</span>
                    )}
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
              </div>
            );
          })}
        </div>
        
        {selectedAchievement !== null && (
          <div className="mt-4 bg-gray-750 p-4 rounded-lg animate-fadeIn">
            <h3 className="font-medium text-sm mb-2">How to Earn: {achievements[selectedAchievement].name}</h3>
            <ul className="text-xs text-gray-300 space-y-2 list-disc pl-5">
              <li>Complete more {achievements[selectedAchievement].name.toLowerCase()} activities</li>
              <li>Focus on consistency - daily practice helps!</li>
              <li>Try the recommended activities in your study plan</li>
            </ul>
            <div className="mt-3">
              <button className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-md transition-colors">
                Find Related Activities
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity with Filtering */}
      <div className="card-hover p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Activity</h2>
            <p className="text-xs text-gray-400">Your latest learning activities</p>
          </div>
          <div className="flex gap-2">
            <select className="bg-gray-800 text-sm border-gray-700 rounded-md px-2 py-1">
              <option value="all">All Activities</option>
              <option value="quiz">Quizzes</option>
              <option value="flashcard">Flashcards</option>
              <option value="challenge">Challenges</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg hover:bg-gray-750 transition-colors">
              <div className="flex items-center">
                <div className="text-xs text-gray-400 w-32">
                  {item.date}<br/>{item.time}
                </div>
                <div>
                  <div className="text-sm">{item.activity}</div>
                  {item.subjectArea && (
                    <div className="text-xs text-gray-400">Subject: {item.subjectArea}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className={`font-semibold ${item.color} mr-3`}>+{item.xp} XP</div>
                <button className="text-xs bg-gray-700 hover:bg-gray-600 rounded-full px-2 py-1 transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            View All Activity →
          </button>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 ${showRecommendations ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="p-5 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Personalized Study Recommendations</h2>
            <button 
              onClick={() => setShowRecommendations(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-5">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">
                Focus Areas for {selectedSubject || 'Your Learning'}
              </h3>
              <p className="text-sm text-gray-400">
                Based on your performance, we recommend focusing on these activities:
              </p>
            </div>
            
            <div className="space-y-4">
              {learningRecommendations.map((rec, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{rec.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' : 
                      rec.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' : 
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {rec.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{rec.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-400">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{rec.subject}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{rec.estimatedTime}</span>
                    </div>
                    <button className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-md transition-colors">
                      Start Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <button 
                onClick={() => setShowRecommendations(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Remind Me Later
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-sm transition-colors">
                Add All to Study Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goals Section */}
      <div className="card-hover p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Weekly Goals</h2>
            <p className="text-xs text-gray-400">Track your progress towards weekly targets</p>
          </div>
          <button className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-md transition-colors">
            Adjust Goals
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Study Time', current: 240, target: 300, unit: 'minutes', icon: Clock, color: 'from-blue-500 to-cyan-400' },
            { name: 'XP Earned', current: 1250, target: 2000, unit: 'XP', icon: Trophy, color: 'from-purple-500 to-pink-400' },
            { name: 'Activities', current: 15, target: 25, unit: 'activities', icon: Activity, color: 'from-amber-500 to-orange-400' }
          ].map((goal, index) => {
            const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
            
            return (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <goal.icon className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="font-medium">{goal.name}</h3>
                  </div>
                  <span className="text-xs text-gray-400">{percentage}%</span>
                </div>
                
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${goal.color}`}
                    style={{ width: `${percentage}%`, transition: 'width 1s ease-in-out' }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{goal.current} / {goal.target} {goal.unit}</span>
                  {percentage >= 100 ? (
                    <span className="text-xs text-green-400 font-medium">Completed!</span>
                  ) : (
                    <span className="text-xs text-gray-400">{goal.target - goal.current} more to go</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS Styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .card-hover {
          background-color: rgba(31, 31, 35, 0.6);
          border-radius: 0.5rem;
          border: 1px solid rgba(55, 55, 60, 0.5);
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          background-color: rgba(31, 31, 35, 0.8);
          border-color: rgba(75, 75, 85, 0.6);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
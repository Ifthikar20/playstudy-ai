"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Trophy, Clock, Brain, Star, Calendar, Badge, TrendingUp, Gamepad } from "lucide-react";

// Sample performance data for demonstration
const performanceData = [
  { date: '2025-01-01', xp: 120, gamesPlayed: 5, accuracy: 78 },
  { date: '2025-01-02', xp: 150, gamesPlayed: 6, accuracy: 82 },
  { date: '2025-01-03', xp: 80, gamesPlayed: 3, accuracy: 75 },
  { date: '2025-01-04', xp: 210, gamesPlayed: 8, accuracy: 85 },
  { date: '2025-01-05', xp: 160, gamesPlayed: 6, accuracy: 81 },
  { date: '2025-01-06', xp: 190, gamesPlayed: 7, accuracy: 88 },
  { date: '2025-01-07', xp: 240, gamesPlayed: 9, accuracy: 90 },
  { date: '2025-02-10', xp: 300, gamesPlayed: 12, accuracy: 92 },
  { date: '2025-02-15', xp: 270, gamesPlayed: 10, accuracy: 88 },
  { date: '2025-02-20', xp: 310, gamesPlayed: 13, accuracy: 93 },
  { date: '2025-02-25', xp: 350, gamesPlayed: 15, accuracy: 95 },
];

// Sample subject performance data
const subjectPerformance = [
  { subject: 'Math', score: 82, color: '#9333ea' },
  { subject: 'Science', score: 78, color: '#2563eb' },
  { subject: 'History', score: 92, color: '#ea580c' },
  { subject: 'Language', score: 85, color: '#16a34a' },
  { subject: 'Geography', score: 70, color: '#db2777' },
];

// Game achievements data
const achievements = [
  { name: 'Quiz Master', description: 'Complete 50 quizzes', progress: 32, icon: Brain, color: 'text-purple-400' },
  { name: 'Perfect Score', description: 'Get 100% on 10 games', progress: 4, icon: Star, color: 'text-yellow-400' },
  { name: 'Daily Streak', description: 'Study for 7 consecutive days', progress: 5, icon: Calendar, color: 'text-green-400' },
  { name: 'Level 10', description: 'Reach level 10', progress: 6, icon: Badge, color: 'text-blue-400' },
  { name: 'Speed Demon', description: 'Complete 5 games in under 2 minutes each', progress: 2, icon: Clock, color: 'text-red-400' },
];

export default function YourPerformance() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  const [chartData, setChartData] = useState(performanceData.slice(-7));

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

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Your Performance
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-hover p-4 flex items-center gap-3">
          <div className="bg-purple-400/20 p-3 rounded-full">
            <Trophy className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total XP</p>
            <p className="text-xl font-bold text-purple-400">{totalXP}</p>
          </div>
        </div>
        
        <div className="card-hover p-4 flex items-center gap-3">
          <div className="bg-green-400/20 p-3 rounded-full">
            <Gamepad className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Games Played</p>
            <p className="text-xl font-bold text-green-400">{totalGames}</p>
          </div>
        </div>
        
        <div className="card-hover p-4 flex items-center gap-3">
          <div className="bg-blue-400/20 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Average Accuracy</p>
            <p className="text-xl font-bold text-blue-400">{averageAccuracy}%</p>
          </div>
        </div>
      </div>

      {/* XP Progress Chart */}
      <div className="card-hover p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">XP Progress</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-3 py-1 text-xs rounded-full ${
                timeRange === "week" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1 text-xs rounded-full ${
                timeRange === "month" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange("all")}
              className={`px-3 py-1 text-xs rounded-full ${
                timeRange === "all" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                labelStyle={{ color: "#e0e0e0" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="xp"
                name="XP Earned"
                stroke="#9333ea"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy %"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Performance & Achievements Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Subject Performance */}
        <div className="card-hover p-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Subject Performance</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="subject" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  labelStyle={{ color: "#e0e0e0" }}
                />
                <Bar dataKey="score" name="Score %" radius={[4, 4, 0, 0]}>
                  {subjectPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievements */}
        <div className="card-hover p-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Achievements</h2>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gray-800 p-3 rounded-lg flex items-center">
                <div className={`${achievement.color} mr-3`}>
                  <achievement.icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{achievement.name}</h3>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(achievement.progress / (parseInt(achievement.description.match(/\d+/)?.[0] || "10"))) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {achievement.progress}/{achievement.description.match(/\d+/)?.[0] || "10"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-hover p-4 mb-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { date: "Feb 24, 2025", activity: "Completed Hangman Challenge", xp: "+50 XP", color: "text-blue-400" },
            { date: "Feb 23, 2025", activity: "Created 5 new flashcards", xp: "+25 XP", color: "text-green-400" },
            { date: "Feb 23, 2025", activity: "Perfect score on Quick Quiz", xp: "+100 XP", color: "text-purple-400" },
            { date: "Feb 22, 2025", activity: "Daily login bonus", xp: "+10 XP", color: "text-yellow-400" },
            { date: "Feb 21, 2025", activity: "Completed Millionaire Challenge", xp: "+75 XP", color: "text-blue-400" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="text-xs text-gray-400 w-28">{item.date}</div>
                <div className="text-sm">{item.activity}</div>
              </div>
              <div className={`font-semibold ${item.color}`}>{item.xp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { habitAPI } from "../../../api";

const HabitCard = ({ habit, onMarkHabit, onSetChallenge, getValidToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStatus, setCurrentStatus] = useState(
    habit.currentStatus ? habit.currentStatus.toUpperCase() : "PENDING"
  );
  const [progress, setProgress] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeDays, setChallengeDays] = useState(habit.challengeDays || 21);
  const [isSettingChallenge, setIsSettingChallenge] = useState(false);
  const [showChallengeHistory, setShowChallengeHistory] = useState(false);
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const CHALLENGE_LENGTH = habit.challengeDays || 21;
  const isChallengeActive = habit.challengeDays !== undefined && habit.challengeDays !== null;
  const isChallengeCompleted = progress && progress.streak >= CHALLENGE_LENGTH;

  const isStartDateInFuture = () => {
    const startDate = new Date(habit.startDate);
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return startDate > today;
  };

  const canMarkHabitToday = () => {
    if (currentStatus !== "PENDING") return false;
    const startDate = new Date(habit.startDate);
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return today >= startDate;
  };

  const formatStartDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fetchChallengeHistory = async () => {
    try {
      setHistoryLoading(true);
      console.log("Fetching challenge history for habit:", habit.id);
      
      const response = await habitAPI.getChallengeHistory(habit.id);
      const history = response.data;
      
      console.log("Raw Challenge History:", history);
      
      const mappedHistory = history.map(entry => ({
        ...entry,
        previousDays: entry.previousDays || 0,
        newDays: entry.newDays || 0,
        currentStreak: entry.currentStreak || 0,
        changedAt: entry.changedAt,
        type: entry.type || "UPDATED"
      }));
      
      setChallengeHistory(mappedHistory);
    } catch (err) {
      console.error("Failed to fetch challenge history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchProgressData = async () => {
    try {
      const response = await habitAPI.getHabitProgress(habit.id);
      const data = response.data;
      
      console.log("Progress Data:", data);
      setProgress(data);
    } catch (err) {
      console.error("Progress fetch failed:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 404) {
        console.log("Progress endpoint not found, using default values");
        setProgress({
          totalDays: 0,
          completedDays: 0,
          completionRate: 0,
          streak: 0,
          longestStreak: 0,
          streakBreakDate: null,
          challengeDays: habit.challengeDays || 21
        });
      } else {
        setProgress({
          totalDays: 0,
          completedDays: 0,
          completionRate: 0,
          streak: 0,
          longestStreak: 0,
          streakBreakDate: null,
          challengeDays: habit.challengeDays || 21
        });
      }
    }
  };

  const handleMarkHabit = async (status) => {
    if (!canMarkHabitToday()) {
      setError(`You can start marking this habit from ${formatStartDate(habit.startDate)}.`);
      return;
    }

    if (currentStatus !== "PENDING") {
      setError("This habit has already been marked for today.");
      return;
    }

  try {
    setIsLoading(true);
    setError("");

    // FIXED: Use correct data format for /api/habitlogs endpoint
    const response = await habitAPI.markHabitComplete({
      habitId: habit.id,
      status: status.toUpperCase()
    });

    const result = response.data;
    setCurrentStatus(status.toUpperCase());

    // Refresh progress and history
    setTimeout(() => {
      fetchProgressData();
      fetchChallengeHistory();
    }, 1000);

  } catch (err) {
    // ... error handling
  } finally {
    setIsLoading(false);
  }
};

  const handleSetChallenge = async () => {
    if (challengeDays < 1) {
      setError("Challenge days must be at least 1");
      return;
    }

    if (challengeDays > 365) {
      setError("Challenge days cannot exceed 365");
      return;
    }

    try {
      setIsSettingChallenge(true);
      setError("");

      const response = await habitAPI.setChallenge({
        habitId: habit.id,
        challengeDays: parseInt(challengeDays)
      });

      const updatedHabit = response.data;
      setChallengeDays(updatedHabit.challengeDays);

      if (onSetChallenge) {
        onSetChallenge(updatedHabit);
      }

      setShowChallengeModal(false);

      await fetchProgressData();
      await fetchChallengeHistory();

    } catch (err) {
      console.error("Challenge setting error:", err);
      setError(err.response?.data?.message || err.message || "Failed to set challenge days");
    } finally {
      setIsSettingChallenge(false);
    }
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatBreakDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    setCurrentStatus(habit.currentStatus ? habit.currentStatus.toUpperCase() : "PENDING");
    setChallengeDays(habit.challengeDays || 21);
    if (habit.id) {
      fetchChallengeHistory();
    }
  }, [habit.id, habit.challengeDays]);

  useEffect(() => {
    fetchProgressData();
  }, [habit.id, currentStatus, CHALLENGE_LENGTH, habit.title]);

  useEffect(() => {
    console.log("=== HABIT CARD DEBUG ===");
    console.log("Habit ID:", habit.id);
    console.log("Habit Title:", habit.title);
    console.log("Challenge Days:", habit.challengeDays);
    console.log("Current Status:", currentStatus);
    console.log("Progress Data:", progress);
    console.log("Challenge History Count:", challengeHistory.length);
    console.log("Challenge History:", challengeHistory);
  }, [habit, progress, challengeHistory, currentStatus]);

  const isMarked = currentStatus !== "PENDING";
  const startedDate = new Date(habit.startDate || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const streakBreakDateFormatted = progress?.streakBreakDate 
    ? formatBreakDate(progress.streakBreakDate) 
    : null;

  const completedVisualBars = progress && progress.streak > 0 
    ? (progress.streak % CHALLENGE_LENGTH === 0 
        ? CHALLENGE_LENGTH
        : progress.streak % CHALLENGE_LENGTH)
    : 0;

  const completedCycles = progress && progress.streak > 0 
    ? Math.floor(progress.streak / CHALLENGE_LENGTH)
    : 0;

  const startDateStatus = isStartDateInFuture();

  const motivationalMessages = [
    {
      title: "🎉 Challenge Mastered!",
      message: `You've successfully completed your ${CHALLENGE_LENGTH}-day challenge for "${habit.title}"! Your consistency is truly inspiring.`,
    },
    {
      title: "🏆 Habit Champion!",
      message: `Amazing work! ${CHALLENGE_LENGTH} days of "${habit.title}" completed. You've built a powerful habit that will serve you well.`,
    },
    {
      title: "✨ Transformation Complete!",
      message: `You've transformed "${habit.title}" from a goal into a lifestyle over ${CHALLENGE_LENGTH} days. This is just the beginning of your success!`,
    },
    {
      title: "⭐ Consistency King/Queen!",
      message: `${CHALLENGE_LENGTH} days of unwavering commitment to "${habit.title}"! Your dedication is creating the future you deserve.`,
    },
    {
      title: "🌱 Habit Rooted!",
      message: `Your ${CHALLENGE_LENGTH}-day journey with "${habit.title}" has planted deep roots. This habit is now part of who you are!`,
    }
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  if (isChallengeCompleted) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-300 shadow-lg p-6 relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl mb-4">🎊</div>
          <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3">
            {randomMessage.title}
          </h3>
          <p className="text-purple-600 text-sm sm:text-lg leading-relaxed">
            {randomMessage.message}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 mb-6 border border-purple-200 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{progress?.streak || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Days</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{CHALLENGE_LENGTH}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Challenge Target</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm font-semibold text-purple-700 mb-3">
            <span className="text-xs sm:text-sm">Challenge Progress</span>
            <span className="text-xs sm:text-sm">100% Complete ✅</span>
          </div>
          <div className="w-full bg-purple-200/60 h-3 sm:h-4 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-purple-600 transition-all duration-1000 shadow-md"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600 text-xs sm:text-sm font-medium">
            Ready for your next challenge?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowChallengeModal(true)}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base"
            >
              🚀 Update Challenge
            </button>
            
            <button
              onClick={() => setShowChallengeHistory(true)}
              className="px-4 sm:px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base"
            >
              📊 View History ({challengeHistory.length})
            </button>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xl sm:text-2xl opacity-0"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `confetti ${1 + Math.random() * 2}s ${Math.random() * 2}s forwards`,
                top: '-10%'
              }}
            >
              {['🎉', '🎊', '⭐', '🌟', '✨'][i % 5]}
            </div>
          ))}
        </div>

        {showChallengeHistory && (
          <ChallengeHistoryModal 
            habit={habit}
            challengeHistory={challengeHistory}
            historyLoading={historyLoading}
            onClose={() => setShowChallengeHistory(false)}
            formatShortDate={formatShortDate}
          />
        )}

        {showChallengeModal && (
          <ChallengeSettingsModal
            habit={habit}
            challengeDays={challengeDays}
            setChallengeDays={setChallengeDays}
            isSettingChallenge={isSettingChallenge}
            onSetChallenge={handleSetChallenge}
            onClose={() => setShowChallengeModal(false)}
            CHALLENGE_LENGTH={CHALLENGE_LENGTH}
            progress={progress}
            isChallengeActive={isChallengeActive}
          />
        )}

        <style jsx>{`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{habit.title}</h3>
          {habit.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{habit.description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {isChallengeActive && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 rounded-xl border border-green-200">
              <span className="text-green-700 text-sm font-bold">
                {CHALLENGE_LENGTH}d
              </span>
              {progress && (
                <span className="text-green-800 text-sm font-black">
                  {progress.streak}/{CHALLENGE_LENGTH}
                </span>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowChallengeModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-1"
              title={isChallengeActive ? "Update challenge settings" : "Set your first challenge"}
            >
              {isChallengeActive ? "⚙️" : "🎯"}
              <span className="hidden xs:inline">{isChallengeActive ? "Update" : "Start"}</span>
            </button>
            
            {(challengeHistory.length > 0 || historyLoading) && (
              <button
                onClick={() => setShowChallengeHistory(true)}
                disabled={historyLoading}
                className="text-purple-600 hover:text-purple-800 text-sm bg-purple-100 hover:bg-purple-200 px-3 py-2 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-1 disabled:opacity-50"
                title="View challenge history"
              >
                {historyLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                    <span className="hidden xs:inline">Loading</span>
                  </>
                ) : (
                  <>
                    📊
                    <span className="hidden xs:inline">({challengeHistory.length})</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {startDateStatus && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-yellow-600 text-xl">📅</span>
            <div>
              <p className="text-yellow-800 font-semibold text-sm">
                Challenge Starts Soon!
              </p>
              <p className="text-yellow-700 text-xs mt-1">
                You can start marking this habit from <strong>{formatStartDate(habit.startDate)}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {isChallengeActive && progress && (
        <>
          <div className="mb-5">
            <div className="flex justify-between text-sm font-semibold text-gray-800 mb-2">
              <span className="text-xs sm:text-sm">
                {`${progress.completedDays} / ${progress.totalDays} days tracked`}
              </span>
              <span className="text-xs sm:text-sm">{progress.completionRate?.toFixed(1) || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-xl overflow-hidden shadow-inner">
              <div
                className={`h-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-700 shadow-md`}
                style={{ width: `${progress.completionRate || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-3">
              <span className="font-bold text-gray-900 text-sm sm:text-base">
                Current Streak: {progress.streak || 0} days 🔥
              </span>
              {progress.longestStreak !== undefined && (
                <span className="text-gray-600 text-xs font-semibold bg-gray-100 px-2 py-1 rounded-lg">
                  Longest: {progress.longestStreak} days 🏆
                </span>
              )}
            </div>
            
            {progress.streak > 0 && progress.streak % CHALLENGE_LENGTH === 0 && (
              <p className="text-sm text-blue-600 mb-3 font-semibold bg-blue-50 px-3 py-2 rounded-lg">
                {CHALLENGE_LENGTH}-Day Milestone Reached! 🎉
              </p>
            )}

            {progress.streakBreakDate && (
              <p className="text-sm text-red-500 mb-3 bg-red-50 px-3 py-2 rounded-lg font-medium">
                Streak broke on: <span className="font-bold">{streakBreakDateFormatted}</span> 😥
              </p>
            )}

            <div className="flex gap-1 mb-2">
              {Array.from({ length: CHALLENGE_LENGTH }).map((_, idx) => {
                const isDoneInStreak = idx < completedVisualBars;
                let bgColor = isDoneInStreak ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm" : "bg-gray-300";
                return <div key={idx} className={`flex-1 h-3 rounded-lg ${bgColor} transition-all duration-300`}></div>;
              })}
            </div>
            
            {completedCycles > 0 && (
              <div className="text-xs text-gray-500 text-center font-medium">
                +{completedCycles} full cycle{completedCycles > 1 ? 's' : ''} completed
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex flex-col xs:flex-row xs:justify-between gap-2 text-sm text-gray-700 mb-5 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Frequency:</span>
          <span className="text-gray-600">{habit.frequency}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Started:</span>
          <span className="text-gray-600">{startedDate}</span>
        </div>
      </div>

      {isChallengeActive && currentStatus !== "PENDING" && (
        <div
          className={`rounded-xl p-4 text-sm mb-4 flex items-center gap-3 ${
            currentStatus === "DONE"
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800"
              : "bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-800"
          }`}
        >
          <span className="text-lg">{currentStatus === "DONE" ? "✅" : "⚠️"}</span>
          <span className="font-medium">
            {currentStatus === "DONE"
              ? "Great job! Completed for today."
              : "Habit skipped for today."}
          </span>
        </div>
      )}

      {isChallengeActive && !isMarked && (
        <div className="flex justify-center">
          <button
            onClick={() => handleMarkHabit("DONE")}
            disabled={isLoading || !canMarkHabitToday()}
            className={`w-full max-w-sm py-3.5 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
              canMarkHabitToday()
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm"
            } ${
              isLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Marking...
              </span>
            ) : canMarkHabitToday() ? (
              "🎯 Mark as Done"
            ) : (
              `⏳ Starts ${formatStartDate(habit.startDate)}`
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 mt-4 text-sm text-red-800 font-medium">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {showChallengeHistory && (
        <ChallengeHistoryModal 
          habit={habit}
          challengeHistory={challengeHistory}
          historyLoading={historyLoading}
          onClose={() => setShowChallengeHistory(false)}
          formatShortDate={formatShortDate}
        />
      )}

      {showChallengeModal && (
        <ChallengeSettingsModal
          habit={habit}
          challengeDays={challengeDays}
          setChallengeDays={setChallengeDays}
          isSettingChallenge={isSettingChallenge}
          onSetChallenge={handleSetChallenge}
          onClose={() => setShowChallengeModal(false)}
          CHALLENGE_LENGTH={CHALLENGE_LENGTH}
          progress={progress}
          isChallengeActive={isChallengeActive}
        />
      )}
    </div>
  );
};

const ChallengeHistoryModal = ({ habit, challengeHistory, historyLoading, onClose, formatShortDate }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Challenge History</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl transition-colors p-1 rounded-lg hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        Challenge updates for "<strong>{habit.title}</strong>"
      </p>

      {historyLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-3 text-sm">Loading history...</p>
        </div>
      ) : challengeHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-medium">No challenge history yet.</p>
          <p className="text-sm mt-2">Update your challenge to see history here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {challengeHistory.map((history, index) => (
            <div
              key={history.id || index}
              className={`border-2 rounded-xl p-4 transition-all hover:scale-[1.02] ${
                history.type === "COMPLETED" 
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
                  : history.type === "STARTED"
                  ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200"
                  : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className={`font-bold text-sm ${
                    history.type === "COMPLETED" ? "text-green-700" : 
                    history.type === "STARTED" ? "text-purple-700" : 
                    "text-blue-700"
                  }`}>
                    {history.type === "STARTED" ? (
                      `Challenge Started: ${history.newDays} days`
                    ) : history.type === "COMPLETED" ? (
                      `Challenge Completed: ${history.previousDays} → ${history.newDays} days`
                    ) : (
                      `Challenge Updated: ${history.previousDays} → ${history.newDays} days`
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Date: {formatShortDate(history.changedAt)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Streak at change: <span className="font-semibold">{history.currentStreak} days</span>
                  </div>
                  {history.type === "COMPLETED" && (
                    <div className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                      <span>✅</span> Challenge Completed!
                    </div>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  history.type === "COMPLETED" 
                    ? "bg-green-100 text-green-800" 
                    : history.type === "STARTED"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {history.type === "COMPLETED" ? "🎯 Completed" : 
                   history.type === "STARTED" ? "🚀 Started" : "📊 Updated"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const ChallengeSettingsModal = ({ 
  habit, 
  challengeDays, 
  setChallengeDays, 
  isSettingChallenge, 
  onSetChallenge, 
  onClose, 
  CHALLENGE_LENGTH, 
  progress, 
  isChallengeActive 
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {!isChallengeActive ? "Start Your Challenge" : "Update Challenge"}
      </h3>
      
      {isChallengeActive ? (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-xl mt-0.5">🎯</span>
            <div>
              <p className="text-blue-800 font-semibold text-sm">Current Progress: {progress?.streak || 0}/{CHALLENGE_LENGTH} days</p>
              <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                You can update your challenge duration anytime.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl mt-0.5">🚀</span>
            <div>
              <p className="text-green-800 font-semibold text-sm">Start Your Journey</p>
              <p className="text-green-700 text-xs mt-1 leading-relaxed">
                Set your challenge duration to begin tracking progress!
              </p>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-gray-700 mb-4 text-sm">
        Set challenge duration for "<strong className="text-gray-900">{habit.title}</strong>"
      </p>
      
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Challenge Days (1-365)
        </label>
        <input
          type="number"
          min="1"
          max="365"
          value={challengeDays}
          onChange={(e) => setChallengeDays(parseInt(e.target.value) || 1)}
          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm font-medium"
          placeholder="Enter number of days"
        />
        {isChallengeActive && (
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Current challenge: <span className="text-green-600">{CHALLENGE_LENGTH} days</span>
          </p>
        )}
      </div>

      {isChallengeActive && progress && challengeDays < CHALLENGE_LENGTH && progress.streak >= challengeDays && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-xl mt-0.5">⚠️</span>
            <div>
              <p className="text-yellow-800 font-semibold text-sm">Challenge Will Auto-Complete!</p>
              <p className="text-yellow-700 text-xs mt-1 leading-relaxed">
                Your current streak ({progress.streak} days) already meets the new target ({challengeDays} days).
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-800 mb-3">Suggested Durations:</p>
        <div className="flex gap-2 flex-wrap">
          {[7, 21, 30, 60, 90].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setChallengeDays(days)}
              className={`text-xs px-3 py-2 rounded-lg border-2 font-medium transition-all ${
                challengeDays === days
                  ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
          disabled={isSettingChallenge}
        >
          Cancel
        </button>
        <button
          onClick={onSetChallenge}
          disabled={isSettingChallenge || !challengeDays}
          className="px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold text-sm shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isSettingChallenge ? "Setting..." : (!isChallengeActive ? "Start Challenge" : "Update Challenge")}
        </button>
      </div>
    </div>
  </div>
);

export default HabitCard;
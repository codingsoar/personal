import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useStageStore } from '../stores/useStageStore';
import { useAssessmentStore, getAchievementGrade } from '../stores/useAssessmentStore';
import StudentLayout from '../components/StudentLayout';
import StudentHeaderActions from '../components/StudentHeaderActions';

export default function StudentAssessmentsPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { courses } = useStageStore();
    const {
        assessmentPlans, calculateTotal, getAreaFinalScore,
        getStudentComments, generatedReports, studentScores,
        getSessionScoresForArea,
    } = useAssessmentStore();

    const assignedCourses = useMemo(() => {
        if (!user?.courseIds) return [];
        return courses.filter(c => user.courseIds.includes(c.id));
    }, [courses, user?.courseIds]);

    const [selectedCourseId, setSelectedCourseId] = useState(assignedCourses[0]?.id || '');
    const [expandedArea, setExpandedArea] = useState(null);

    const plan = assessmentPlans[selectedCourseId] || null;
    const totalResult = calculateTotal(selectedCourseId, user?.studentId);
    const comments = getStudentComments(selectedCourseId, user?.studentId);
    const studentData = studentScores?.[selectedCourseId]?.[user?.studentId];

    const getGradeColor = (grade) => {
        const colors = {
            'A': 'from-emerald-500 to-green-600',
            'B': 'from-blue-500 to-indigo-600',
            'C': 'from-amber-500 to-yellow-600',
            'D': 'from-orange-500 to-red-500',
            'E': 'from-red-500 to-rose-600',
        };
        return colors[grade] || 'from-slate-400 to-slate-500';
    };

    const getGradeBg = (grade) => {
        const colors = {
            'A': 'bg-emerald-100 text-emerald-700 border-emerald-300',
            'B': 'bg-blue-100 text-blue-700 border-blue-300',
            'C': 'bg-amber-100 text-amber-700 border-amber-300',
            'D': 'bg-orange-100 text-orange-700 border-orange-300',
            'E': 'bg-red-100 text-red-700 border-red-300',
        };
        return colors[grade] || 'bg-slate-100 text-slate-500 border-slate-300';
    };

    const areaColors = [
        { border: 'border-amber-300', bg: 'bg-amber-50', icon: 'text-amber-500', ring: 'ring-amber-200' },
        { border: 'border-blue-300', bg: 'bg-blue-50', icon: 'text-blue-500', ring: 'ring-blue-200' },
        { border: 'border-emerald-300', bg: 'bg-emerald-50', icon: 'text-emerald-500', ring: 'ring-emerald-200' },
        { border: 'border-purple-300', bg: 'bg-purple-50', icon: 'text-purple-500', ring: 'ring-purple-200' },
        { border: 'border-rose-300', bg: 'bg-rose-50', icon: 'text-rose-500', ring: 'ring-rose-200' },
        { border: 'border-cyan-300', bg: 'bg-cyan-50', icon: 'text-cyan-500', ring: 'ring-cyan-200' },
    ];

    const areaIcons = ['brush', 'architecture', 'terminal', 'draw', 'assignment', 'school'];

    return (
        <StudentLayout activeTab="assessments">
            <div className="flex flex-col h-full">
                {/* Header */}
                <header className="flex items-center justify-between px-4 md:px-8 h-16 border-b border-accent-purple/10 bg-white/80 backdrop-blur-sm flex-shrink-0">
                    <div className="flex items-center gap-3 md:hidden">
                        <button className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <span className="font-bold text-lg">평가</span>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">assignment</span>
                        <h1 className="text-xl font-bold text-slate-800">내 평가 현황</h1>
                    </div>
                    <StudentHeaderActions />
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-20">
                    {/* Course selector */}
                    {assignedCourses.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-500">수업 선택:</span>
                            <select
                                value={selectedCourseId}
                                onChange={e => setSelectedCourseId(e.target.value)}
                                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            >
                                {assignedCourses.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {!plan ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">assignment_late</span>
                            <h2 className="text-xl font-bold text-slate-400 mb-2">평가 계획이 아직 없습니다</h2>
                            <p className="text-sm text-slate-400">선생님이 평가 계획을 등록하면 여기에 표시됩니다.</p>
                        </div>
                    ) : (
                        <>
                            {/* Summary Card */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-accent-purple/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800 mb-1">종합 성적</h2>
                                            <p className="text-sm text-slate-500">
                                                지필 {plan.writtenExamWeight}% + 수행 {plan.performanceWeight}%
                                            </p>
                                        </div>
                                        {totalResult && (() => {
                                            const rate = Math.round(totalResult.total);
                                            const ag = getAchievementGrade(rate);
                                            return (
                                                <div className={`px-5 py-2 rounded-xl text-2xl font-extrabold border-2 ${getGradeBg(ag.grade)}`}>
                                                    {ag.grade}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {totalResult ? (
                                        <div className="space-y-4">
                                            <div className="flex items-end gap-3">
                                                <span className="text-5xl font-extrabold text-slate-900">
                                                    {totalResult.total}
                                                </span>
                                                <span className="text-lg text-slate-400 mb-2">/ 100점</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${totalResult.total > 0 ? getGradeColor(getAchievementGrade(Math.round(totalResult.total)).grade) : 'from-primary to-secondary'} transition-all duration-700`}
                                                    style={{ width: `${Math.min(totalResult.total, 100)}%` }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                                    <span className="text-xs text-slate-500 font-medium">지필평가</span>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span className="text-2xl font-bold">{totalResult.writtenRaw}</span>
                                                        <span className="text-sm text-slate-400">/{plan.writtenExamMaxScore}</span>
                                                        <span className="text-xs text-slate-400 ml-2">(환산: {totalResult.writtenConverted}점)</span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                                    <span className="text-xs text-slate-500 font-medium">수행평가 합계</span>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span className="text-2xl font-bold">{totalResult.performanceTotal}</span>
                                                        <span className="text-sm text-slate-400">점</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-slate-400">
                                            <span className="material-symbols-outlined text-4xl mb-2">hourglass_empty</span>
                                            <p className="text-sm">아직 채점된 항목이 없습니다.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Performance Area Cards */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">checklist</span>
                                    수행평가 영역별 상세
                                </h3>
                                <div className="space-y-3">
                                    {plan.performanceAreas.map((area, idx) => {
                                        const color = areaColors[idx % areaColors.length];
                                        const icon = areaIcons[idx % areaIcons.length];
                                        const result = getAreaFinalScore(selectedCourseId, user?.studentId, area.id);
                                        const sessions = getSessionScoresForArea(selectedCourseId, area.id);
                                        const isExpanded = expandedArea === area.id;
                                        const maxScore = area.scoringLevels.length > 0
                                            ? Math.max(...area.scoringLevels.map(l => l.score))
                                            : 0;

                                        return (
                                            <div key={area.id} className={`bg-white rounded-2xl border ${color.border} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
                                                <button
                                                    onClick={() => setExpandedArea(isExpanded ? null : area.id)}
                                                    className="w-full flex items-center justify-between p-5 text-left"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center`}>
                                                            <span className={`material-symbols-outlined ${color.icon}`}>{icon}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{area.name}</h4>
                                                            <p className="text-sm text-slate-500">비율 {area.weight}% · {result.sessionCount}회 채점</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <span className="text-2xl font-extrabold text-slate-800">
                                                                {result.sessionCount > 0 ? result.finalScore : '-'}
                                                            </span>
                                                            {result.sessionCount > 0 && (
                                                                <span className="text-xs text-slate-400 block">avg {result.avg}</span>
                                                            )}
                                                        </div>
                                                        <span className={`material-symbols-outlined text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                            expand_more
                                                        </span>
                                                    </div>
                                                </button>

                                                {isExpanded && (
                                                    <div className={`px-5 pb-5 border-t ${color.border}/50`}>
                                                        {/* 성취 기준 */}
                                                        {area.achievementStandard && (
                                                            <div className="pt-4 mb-3">
                                                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">성취기준</span>
                                                                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{area.achievementStandard}</p>
                                                            </div>
                                                        )}

                                                        {/* 평가 요소 & 방법 */}
                                                        {area.assessmentElements?.length > 0 && (
                                                            <div className="mb-3">
                                                                <span className="text-xs font-semibold text-slate-500 mb-2 block">평가 요소</span>
                                                                <div className="space-y-1">
                                                                    {area.assessmentElements.map((el, i) => {
                                                                        // 마지막 세션의 체크 여부 확인
                                                                        const lastSession = sessions[sessions.length - 1];
                                                                        const lastChecked = lastSession?.checkedCriteria?.[user?.studentId] || [];
                                                                        const isChecked = lastChecked.includes(i);
                                                                        return (
                                                                            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${isChecked ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'}`}>
                                                                                <span className={`material-symbols-outlined text-sm ${isChecked ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                                                    {isChecked ? 'check_circle' : 'radio_button_unchecked'}
                                                                                </span>
                                                                                <span className={`text-sm ${isChecked ? 'text-emerald-700' : 'text-slate-500'}`}>{el}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {area.assessmentMethods?.map(m => (
                                                                <span key={m} className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{m}</span>
                                                            ))}
                                                        </div>

                                                        {/* 채점 기준표 */}
                                                        <div className="mb-3">
                                                            <span className="text-xs font-semibold text-slate-500 mb-2 block">채점 기준</span>
                                                            <div className="grid gap-1.5">
                                                                {area.scoringLevels.map(lv => (
                                                                    <div key={lv.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${result.finalScore === lv.score && result.sessionCount > 0 ? `${color.bg} ring-2 ${color.ring}` : 'bg-slate-50'}`}>
                                                                        <span className={`text-sm font-bold w-8 text-center ${result.finalScore === lv.score && result.sessionCount > 0 ? color.icon.replace('text-', 'text-') : 'text-slate-400'}`}>{lv.label}</span>
                                                                        <span className="text-sm text-slate-600 flex-1">{lv.description}</span>
                                                                        <span className="text-sm font-bold text-slate-700">{lv.score}점</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* 수업별 점수 이력 */}
                                                        {sessions.length > 0 && (
                                                            <div>
                                                                <span className="text-xs font-semibold text-slate-500 mb-2 block">수업별 점수</span>
                                                                <div className="flex gap-2 flex-wrap">
                                                                    {sessions.map(s => {
                                                                        const score = s.scores[user?.studentId];
                                                                        return (
                                                                            <div key={s.id} className="bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200 text-center">
                                                                                <div className="text-[10px] text-slate-400">{s.sessionLabel}</div>
                                                                                <div className="text-sm font-bold text-slate-700">{score ?? '-'}</div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Session Comments Timeline */}
                            {comments.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-secondary">forum</span>
                                        수업 코멘트
                                    </h3>
                                    <div className="space-y-3">
                                        {comments.map(c => (
                                            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                                                        {c.date}
                                                    </span>
                                                    {c.tags?.length > 0 && (
                                                        <div className="flex gap-1">
                                                            {c.tags.map((tag, i) => (
                                                                <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">{c.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}

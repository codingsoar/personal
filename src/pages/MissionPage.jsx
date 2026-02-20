import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStageStore } from '../stores/useStageStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Button, Card, CardBody, Progress, Modal, ModalContent, ModalBody } from '@heroui/react';
import { ChevronLeft, Star, Upload, ChevronRight, Check, Play, BookOpen } from 'lucide-react';

/* ─── 축하 모달 ─── */
function CelebrationModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
            <ModalContent>
                <ModalBody className="py-10 text-center space-y-4">
                    <div className="text-6xl animate-star-earned inline-block">⭐</div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--sq-text)' }}>별 획득!</h2>
                    <p style={{ color: 'var(--sq-muted)' }}>미션을 성공적으로 완료했습니다!</p>
                    <div className="flex gap-2 justify-center text-3xl">
                        {['🎉', '✨', '🏆'].map((e, i) => (
                            <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
                        ))}
                    </div>
                    <Button className="font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--sq-primary), #2b5a91)' }} onPress={onClose}>계속하기</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

/* ─── 동영상 뷰 (하) ─── */
function VideoView({ mission, onComplete }) {
    const [watched, setWatched] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);

    const questions = mission.quizQuestions || [];

    const handleAnswer = (qIdx, ansIdx) => {
        setAnswers(prev => ({ ...prev, [qIdx]: ansIdx }));
    };

    const submitQuiz = () => {
        setShowResult(true);
        const correct = questions.filter((q, i) => answers[i] === q.answer).length;
        if (correct >= Math.ceil(questions.length * 0.66)) {
            setTimeout(() => onComplete(), 500);
        }
    };

    const correctCount = questions.filter((q, i) => answers[i] === q.answer).length;
    const passed = correctCount >= Math.ceil(questions.length * 0.66);

    if (!quizStarted) {
        return (
            <div className="space-y-6">
                <div className="aspect-video rounded-xl overflow-hidden" style={{ background: 'var(--sq-surface)', border: '1px solid var(--sq-border)' }}>
                    <iframe
                        src={mission.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={mission.title}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--sq-muted)' }}>
                        <input type="checkbox" checked={watched} onChange={e => setWatched(e.target.checked)} className="w-4 h-4" style={{ accentColor: 'var(--sq-primary)' }} />
                        영상을 끝까지 시청했습니다
                    </label>
                    <Button className="text-white" style={{ background: 'var(--sq-primary)' }} isDisabled={!watched} onPress={() => setQuizStarted(true)}>
                        퀴즈 풀기 →
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Progress value={(Object.keys(answers).length / questions.length) * 100} color="primary" className="mb-4" label="퀴즈 진행률" />
            {!showResult ? (
                <div className="space-y-4">
                    <Card className="sq-card">
                        <CardBody className="p-6 space-y-4">
                            <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>문제 {currentQ + 1} / {questions.length}</p>
                            <h3 className="text-lg font-semibold" style={{ color: 'var(--sq-text)' }}>{questions[currentQ]?.question}</h3>
                            <div className="space-y-2">
                                {questions[currentQ]?.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(currentQ, i)}
                                        className="w-full text-left p-3 rounded-lg border transition-all"
                                        style={{
                                            borderColor: answers[currentQ] === i ? 'var(--sq-primary)' : 'var(--sq-border)',
                                            background: answers[currentQ] === i ? 'rgba(63,114,175,0.15)' : 'var(--sq-card-bg)',
                                            color: answers[currentQ] === i ? 'var(--sq-text)' : 'var(--sq-muted)',
                                        }}
                                    >
                                        {i + 1}. {opt}
                                    </button>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                    <div className="flex justify-between">
                        <Button variant="flat" isDisabled={currentQ === 0} onPress={() => setCurrentQ(p => p - 1)}>이전</Button>
                        {currentQ < questions.length - 1 ? (
                            <Button className="text-white" style={{ background: 'var(--sq-primary)' }} isDisabled={answers[currentQ] === undefined} onPress={() => setCurrentQ(p => p + 1)}>다음</Button>
                        ) : (
                            <Button color="success" isDisabled={Object.keys(answers).length < questions.length} onPress={submitQuiz}>제출</Button>
                        )}
                    </div>
                </div>
            ) : (
                <Card className="sq-card">
                    <CardBody className="p-6 text-center space-y-4">
                        <div className="text-5xl">{passed ? '🎉' : '😅'}</div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--sq-text)' }}>{passed ? '합격!' : '아쉬워요!'}</h3>
                        <p style={{ color: 'var(--sq-muted)' }}>{correctCount} / {questions.length} 정답</p>
                        {!passed && <Button className="text-white" style={{ background: 'var(--sq-primary)' }} onPress={() => { setShowResult(false); setAnswers({}); setCurrentQ(0); }}>다시 도전</Button>}
                    </CardBody>
                </Card>
            )}
        </div>
    );
}

/* ─── 튜토리얼 뷰 (중) ─── */
function TutorialView({ mission, onComplete }) {
    const [checked, setChecked] = useState(false);
    const [step, setStep] = useState(0);
    const hasHtmlTutorial = typeof mission.htmlContent === 'string' && mission.htmlContent.trim().length > 0;
    const steps = mission.tutorialSteps || [];
    const isLast = step === steps.length - 1;

    if (hasHtmlTutorial) {
        return (
            <div className="space-y-6">
                <Card className="sq-card">
                    <CardBody className="p-3 md:p-4 space-y-3">
                        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--sq-border)', background: 'var(--sq-surface)' }}>
                            <iframe
                                srcDoc={mission.htmlContent}
                                title={mission.title}
                                className="w-full min-h-[60vh]"
                                sandbox="allow-scripts allow-forms allow-modals allow-popups"
                            />
                        </div>
                    </CardBody>
                </Card>
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--sq-muted)' }}>
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={e => setChecked(e.target.checked)}
                            className="w-4 h-4"
                            style={{ accentColor: 'var(--sq-primary)' }}
                        />
                        Tutorial completed
                    </label>
                    <Button color="success" isDisabled={!checked} onPress={onComplete} endContent={<Check size={16} />}>
                        Complete
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Progress value={((step + 1) / steps.length) * 100} color="primary" label={`${step + 1} / ${steps.length} 단계`} />
            <Card className="sq-card">
                <CardBody className="p-8 text-center space-y-6">
                    <div className="text-6xl">{steps[step]?.image}</div>
                    <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--sq-text)' }}>{steps[step]?.title}</h3>
                        <p className="mt-2" style={{ color: 'var(--sq-muted)' }}>{steps[step]?.description}</p>
                    </div>
                </CardBody>
            </Card>
            <div className="flex justify-between">
                <Button variant="flat" isDisabled={step === 0} onPress={() => setStep(s => s - 1)}>
                    <ChevronLeft size={16} /> 이전
                </Button>
                {isLast ? (
                    <Button color="success" onPress={onComplete} endContent={<Check size={16} />}>완료!</Button>
                ) : (
                    <Button className="text-white" style={{ background: 'var(--sq-primary)' }} onPress={() => setStep(s => s + 1)} endContent={<ChevronRight size={16} />}>다음</Button>
                )}
            </div>
        </div>
    );
}

/* ─── 실습 뷰 (상) ─── */
function PracticeView({ mission, onSubmit }) {
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (f) setFile(f);
    };

    const handleSubmit = () => {
        if (file) {
            onSubmit(file);
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <Card className="sq-card">
                <CardBody className="p-8 text-center space-y-4">
                    <div className="text-6xl">📤</div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--sq-text)' }}>제출 완료!</h3>
                    <p style={{ color: 'var(--sq-muted)' }}>선생님이 확인 후 승인합니다.</p>
                    <p className="text-sm" style={{ color: 'var(--sq-primary)' }}>승인되면 별을 획득합니다 ⭐</p>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="sq-card">
                <CardBody className="p-6 space-y-4">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--sq-text)' }}>📋 과제 안내</h3>
                    <div className="whitespace-pre-line text-sm leading-relaxed p-4 rounded-lg"
                        style={{ color: 'var(--sq-muted)', background: 'var(--sq-card-bg)', border: '1px solid var(--sq-border)' }}>
                        {mission.taskDescription}
                    </div>
                    {mission.requiredFileTypes && (
                        <p className="text-xs" style={{ color: 'var(--sq-muted)', opacity: 0.6 }}>
                            제출 가능 파일: {mission.requiredFileTypes.join(', ')}
                        </p>
                    )}
                </CardBody>
            </Card>

            <Card className="sq-card">
                <CardBody className="p-6 space-y-4">
                    <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                        style={{ borderColor: 'var(--sq-border)' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--sq-primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--sq-border)'}>
                        <Upload size={32} style={{ color: 'var(--sq-muted)', opacity: 0.6 }} />
                        <span style={{ color: 'var(--sq-muted)' }}>{file ? file.name : '파일을 선택하세요'}</span>
                        <input type="file" className="hidden" onChange={handleFileChange} accept={mission.requiredFileTypes?.join(',')} />
                    </label>
                    <Button color="success" fullWidth isDisabled={!file} onPress={handleSubmit} className="font-semibold">
                        과제 제출
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
}

/* ─── 메인 미션 페이지 ─── */
export default function MissionPage() {
    const { courseId, stageId, difficulty } = useParams();
    const navigate = useNavigate();
    const { getStage } = useStageStore();
    const { user } = useAuthStore();
    const { completeMission, isMissionCompleted, addSubmission } = useProgressStore();
    const [showCelebration, setShowCelebration] = useState(false);

    const stage = getStage(courseId, stageId);
    const mission = stage?.missions?.[difficulty];
    const alreadyDone = isMissionCompleted(user?.studentId, courseId, stageId, difficulty);
    const missionType = mission?.type || (difficulty === 'easy' ? 'video' : difficulty === 'normal' ? 'tutorial' : 'practice');

    if (!mission) return <div className="p-8" style={{ color: 'var(--sq-text)' }}>미션을 찾을 수 없습니다.</div>;

    const handleComplete = () => {
        if (!alreadyDone) {
            completeMission(user?.studentId, courseId, stageId, difficulty);
            setShowCelebration(true);
        }
    };

    const handlePracticeSubmit = (file) => {
        addSubmission({
            studentId: user?.studentId,
            studentName: user?.name,
            courseId,
            stageId,
            missionId: mission.id,
            difficulty,
            fileName: file.name,
            fileSize: file.size,
        });
        handleComplete();
    };

    const diffLabel = { easy: '하 (Easy) — 동영상', normal: '중 (Normal) — 튜토리얼', hard: '상 (Hard) — 실습' };
    const diffIcon = { easy: <Play size={18} />, normal: <BookOpen size={18} />, hard: <Upload size={18} /> };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--sq-bg)', color: 'var(--sq-text)' }}>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="flat" onPress={() => navigate(`/course/${courseId}/stage/${stageId}`)}>
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">{diffIcon[difficulty]} {mission.title}</h1>
                        <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>{diffLabel[difficulty]}</p>
                    </div>
                    {alreadyDone && <Star size={24} className="text-amber-400 fill-amber-400 star-glow ml-auto" />}
                </div>

                {missionType === 'video' && <VideoView mission={mission} onComplete={handleComplete} />}
                {missionType === 'tutorial' && <TutorialView mission={mission} onComplete={handleComplete} />}
                {missionType === 'practice' && <PracticeView mission={mission} onSubmit={handlePracticeSubmit} />}

                <CelebrationModal isOpen={showCelebration} onClose={() => { setShowCelebration(false); navigate(`/course/${courseId}/stage/${stageId}`); }} />
            </div>
        </div>
    );
}

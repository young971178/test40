import { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  Edit3,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
  Layers,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  Info,
  Clock,
  UserCheck
} from 'lucide-react';
import type { CandidateEvaluation } from '../App';

interface FeedbackEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateEvaluation;
}

// Embedded SVG Spider Chart for Email Preview
function EmailSpiderChart({
  scores
}: {
  scores: {
    problemDefinition: number;
    aiPrompting: number;
    accuracy: number;
    structure: number;
  };
}) {
  const cx = 150;
  const cy = 125;
  const R = 75;

  const s0 = scores.problemDefinition;
  const s1 = scores.aiPrompting;
  const s2 = scores.accuracy;
  const s3 = scores.structure;

  const r0 = (Math.min(25, Math.max(0, s0)) / 25) * R;
  const r1 = (Math.min(25, Math.max(0, s1)) / 25) * R;
  const r2 = (Math.min(25, Math.max(0, s2)) / 25) * R;
  const r3 = (Math.min(25, Math.max(0, s3)) / 25) * R;

  const p0 = { x: cx, y: cy - r0 };
  const p1 = { x: cx + r1, y: cy };
  const p2 = { x: cx, y: cy + r2 };
  const p3 = { x: cx - r3, y: cy };

  const dataPath = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  const levels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
        <span>📊 4대 역량 기준 득점 레이더 차트</span>
      </div>
      <svg width="300" height="240" viewBox="0 0 300 240" className="max-w-full">
        {levels.map((lvl, idx) => {
          const r = R * lvl;
          const points = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
          return (
            <g key={idx}>
              <polygon
                points={points}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth={lvl === 1.0 ? '1.5' : '1'}
                strokeDasharray={lvl === 1.0 ? 'none' : '2,2'}
              />
              <text x={cx + 3} y={cy - r + 9} fontSize="7.5" fill="#94a3b8">
                {Math.round(25 * lvl)}점
              </text>
            </g>
          );
        })}

        <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="#cbd5e1" strokeWidth="1" />
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#cbd5e1" strokeWidth="1" />

        <polygon
          points={dataPath}
          fill="rgba(79, 70, 229, 0.22)"
          stroke="#4f46e5"
          strokeWidth="2.2"
        />

        <circle cx={p0.x} cy={p0.y} r="3.5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
        <circle cx={p1.x} cy={p1.y} r="3.5" fill="#059669" stroke="#fff" strokeWidth="1.5" />
        <circle cx={p2.x} cy={p2.y} r="3.5" fill="#d97706" stroke="#fff" strokeWidth="1.5" />
        <circle cx={p3.x} cy={p3.y} r="3.5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" />

        {/* Labels */}
        <text x={cx} y={cy - R - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#312e81">
          1. 문제정의 ({s0}점)
        </text>
        <text x={cx + R + 10} y={cy + 4} textAnchor="start" fontSize="10" fontWeight="bold" fill="#065f46">
          2. AI활용 ({s1}점)
        </text>
        <text x={cx} y={cy + R + 15} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400e">
          3. 답변정확성 ({s2}점)
        </text>
        <text x={cx - R - 10} y={cy + 4} textAnchor="end" fontSize="10" fontWeight="bold" fill="#075985">
          4. 구조화 ({s3}점)
        </text>
      </svg>
    </div>
  );
}

export function FeedbackEmailModal({
  isOpen,
  onClose,
  candidate
}: FeedbackEmailModalProps) {
  if (!isOpen || !candidate) return null;

  // Edit Mode state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Email Fields
  const [recipientEmail, setRecipientEmail] = useState<string>(
    `${candidate.candidateName.toLowerCase().replace(/\s+/g, '')}@kolon.com`
  );
  const [emailSubject, setEmailSubject] = useState<string>(
    `[AXAGE 역량 검증] ${candidate.candidateName}님 평가 결과 및 개별 맞춤 피드백 안내 (${candidate.isPassed ? '합격' : '불합격'})`
  );
  const [greetingMessage, setGreetingMessage] = useState<string>(
    `안녕하세요, ${candidate.candidateName}님.\n코오롱인더스트리 AXAGE 문제해결 역량 검증 평가(모듈 ${candidate.moduleNumber}: ${candidate.scenario.title})에 임해 주셔서 진심으로 감사드리며 수고 많으셨습니다.`
  );

  // Recommendations for Passed Candidates
  const defaultRecommendedModules = [
    {
      code: 'Module 05',
      name: 'AX 실전 심화: RAG 기반 엔터프라이즈 사내 지식검색 챗봇 구축',
      desc: '사내 기술문서, 매뉴얼을 벡터 DB에 임베딩하여 할루시네이션 없는 정확한 답변을 도출하는 사내 전문 에이전트 개발 과정',
      tag: '실전 심화 추천'
    },
    {
      code: 'Module 08',
      name: '데이터 분석 자동화: LLM Tool Use 및 Code Interpreter 파이프라인',
      desc: '자연어 명령만으로 이상치 탐지, 통계 모델링, 시각화 보고서 자동 생성 코드를 즉시 구동하는 에이전트 구현',
      tag: '데이터/생산 필수'
    },
    {
      code: 'Module 12',
      name: '멀티에이전트 오케스트레이션 및 엔터프라이즈 워크플로우 혁신',
      desc: '기획-개발-검증 단계별 전문 LLM 에이전트 간 역할 분담과 전사 ERP/MES 시스템 자동 연계 설계',
      tag: '최고급 과정'
    }
  ];
  const [recommendedModulesText, setRecommendedModulesText] = useState<string>(
    defaultRecommendedModules
      .map(
        (m, idx) =>
          `[추천 ${idx + 1}] ${m.code}. ${m.name}\n- 특징: ${m.desc} (${m.tag})`
      )
      .join('\n\n')
  );

  // Failure info (남은 응시기간, 응시횟수)
  // 응시기간은 30일 이내로 하고 D-10 형태, 응시횟수는 최대 5회 중 이번 2회 응시 / 3회 남음
  const [remainingDaysTag, setRemainingDaysTag] = useState<string>('D-14');
  const [currentAttempt, setCurrentAttempt] = useState<number>(2);
  const [maxAttempts, setMaxAttempts] = useState<number>(5);
  const remainingAttempts = Math.max(0, maxAttempts - currentAttempt);

  const [overallFeedback, setOverallFeedback] = useState<string>(
    candidate.overallFeedback
  );

  // Update when candidate changes
  useEffect(() => {
    setRecipientEmail(
      `${candidate.candidateName.toLowerCase().replace(/\s+/g, '')}@kolon.com`
    );
    setEmailSubject(
      `[AXAGE 역량 검증] ${candidate.candidateName}님 평가 결과 및 개별 맞춤 피드백 안내 (${candidate.isPassed ? '합격' : '불합격'})`
    );
    setGreetingMessage(
      `안녕하세요, ${candidate.candidateName}님.\n코오롱인더스트리 AXAGE 문제해결 역량 검증 평가(모듈 ${candidate.moduleNumber}: ${candidate.scenario.title})에 임해 주셔서 진심으로 감사드리며 수고 많으셨습니다.`
    );
    setOverallFeedback(candidate.overallFeedback);
    setIsSent(false);
    setIsEditMode(false);
  }, [candidate]);

  // Handle Send
  const handleSendEmail = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>응시자 피드백 이메일 발송</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  AXAGE 역량 평가
                </span>
                {isSent && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 발송 완료
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                수신인: {candidate.candidateName} ({recipientEmail}) | 모듈 {candidate.moduleNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isEditMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isEditMode ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>미리보기 모드로 전환</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>이메일 내용 수정하기</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}
        {showToast && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shrink-0 shadow-md animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>
                <strong>{recipientEmail}</strong> ({candidate.candidateName} 응시자)에게 피드백 메일이 성공적으로 발송되었습니다.
              </span>
            </div>
            <button onClick={() => setShowToast(false)} className="text-emerald-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE EMAIL PREVIEW OR EDIT FORM) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950">
          
          {/* EMAIL META HEADER (TO / FROM / SUBJECT) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-5 space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-slate-500 font-medium w-16 shrink-0">수 신 자:</span>
              {isEditMode ? (
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
              ) : (
                <span className="font-semibold text-slate-200">
                  {candidate.candidateName} &lt;{recipientEmail}&gt;
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-slate-500 font-medium w-16 shrink-0">발 신 자:</span>
              <span className="text-slate-300">
                코오롱인더스트리 AXAGE 평가운영위원회 &lt;axage-eval@kolon.com&gt;
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-slate-500 font-medium w-16 shrink-0">제 목:</span>
              {isEditMode ? (
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                />
              ) : (
                <span className="font-bold text-white">{emailSubject}</span>
              )}
            </div>
          </div>

          {/* EDIT MODE FORM CONTROLS */}
          {isEditMode ? (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-5 space-y-5 text-slate-200 text-xs shadow-lg">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-300 font-bold">
                <Edit3 className="w-4 h-4" />
                <span>이메일 본문 상세 항목 편집</span>
              </div>

              {/* Greeting */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">
                  1. 인사말 및 수고 인사 문구
                </label>
                <textarea
                  rows={3}
                  value={greetingMessage}
                  onChange={e => setGreetingMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                />
              </div>

              {/* Conditional: Passed vs Failed edit */}
              {candidate.isPassed ? (
                <div className="space-y-1.5 bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl">
                  <label className="block font-semibold text-emerald-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>2. [합격자 안내] 이어서 획득하면 좋을 추천 교육 모듈 안내 문구</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    응시자가 본 모듈을 통과한 후 수강하면 시너지가 나는 연계 교육 모듈들을 지정합니다.
                  </p>
                  <textarea
                    rows={6}
                    value={recommendedModulesText}
                    onChange={e => setRecommendedModulesText(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-mono leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-3 bg-rose-950/30 border border-rose-500/30 p-4 rounded-xl">
                  <label className="block font-semibold text-rose-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-400" />
                    <span>2. [불합격자 안내] 남은 응시 기간 및 응시 횟수 설정</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1">남은 응시 기간 (D-Day 표기)</span>
                      <input
                        type="text"
                        value={remainingDaysTag}
                        onChange={e => setRemainingDaysTag(e.target.value)}
                        placeholder="예: D-14"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-bold text-rose-300"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1">이번 응시 회차</span>
                      <input
                        type="number"
                        min={1}
                        max={maxAttempts}
                        value={currentAttempt}
                        onChange={e => setCurrentAttempt(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400 mb-1">최대 응시 가능 횟수</span>
                      <input
                        type="number"
                        min={currentAttempt}
                        max={10}
                        value={maxAttempts}
                        onChange={e => setMaxAttempts(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-300/80">
                    * 안내 문구 미리보기: "응시기간은 30일 이내로 유효하며({remainingDaysTag}), 최대 5회 중 이번에 {currentAttempt}회 응시하였고 앞으로 {remainingAttempts}회 남았습니다."
                  </p>
                </div>
              )}

              {/* Overall Feedback */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">
                  3. 종합 평가 의견 (성적서 기재 총평)
                </label>
                <textarea
                  rows={4}
                  value={overallFeedback}
                  onChange={e => setOverallFeedback(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>수정 완료 및 미리보기 확인</span>
                </button>
              </div>
            </div>
          ) : (
            /* EMAIL PREVIEW BODY (WHITE CONTAINER RESEMBLING ACTUAL RECEIVED EMAIL) */
            <div className="bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              
              {/* EMAIL BRAND HEADER */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 border-b border-indigo-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-indigo-400 tracking-wider uppercase">
                      KOLON INDUSTRIES • AX INNOVATION CENTER
                    </span>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">
                      AXAGE 문제해결 역량 검증 평가 결과 안내
                    </h2>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-200 border border-white/10">
                      공식 평가 피드백
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {candidate.evaluatedAt}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6 text-slate-800 text-sm leading-relaxed">
                
                {/* 1. GREETING & RESULT NOTICE */}
                <div className="space-y-3">
                  <div className="whitespace-pre-line text-slate-700 text-sm font-medium">
                    {greetingMessage}
                  </div>

                  {/* JUDGEMENT RESULT BANNER */}
                  <div
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      candidate.isPassed
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/90 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {candidate.isPassed ? (
                        <div className="p-2.5 bg-emerald-600 text-white rounded-full">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="p-2.5 bg-rose-600 text-white rounded-full">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-500">최종 판정 결과</div>
                        <div className="text-lg font-black tracking-tight flex items-center gap-2">
                          <span>
                            {candidate.isPassed ? '합격 (PASSED)' : '불합격 (FAILED)'}
                          </span>
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-white border border-slate-300">
                            {candidate.grade} 등급
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">취득 총점 / 기준 점수</div>
                      <div className="text-xl font-black text-indigo-900">
                        {candidate.totalScore}점 <span className="text-xs text-slate-500 font-normal">/ 100점 (기준: 70점)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CONDITIONAL BRANCH: PASSED VS FAILED */}
                {candidate.isPassed ? (
                  /* ================= PASSED: RECOMMENDED NEXT MODULES ================= */
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-950">
                      <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-sm md:text-base">
                          🎉 합격 축하 및 연계 추천 교육 모듈 안내
                        </h4>
                        <p className="text-xs text-indigo-800">
                          본 모듈의 검증을 성공적으로 이수하셨습니다! 이어지는 역량 심화를 위해 다음 모듈 획득을 권장합니다.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {defaultRecommendedModules.map((mod, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3.5 rounded-lg border border-indigo-100 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                                {mod.code}
                              </span>
                              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                {mod.tag}
                              </span>
                            </div>
                            <h5 className="font-bold text-xs text-slate-900 mb-1 line-clamp-1">
                              {mod.name}
                            </h5>
                            <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                              {mod.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-700 font-semibold">
                            <span>연계 심화 트랙</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* ================= FAILED: REMAINING PERIOD & ATTEMPTS ================= */
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-amber-950">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-sm md:text-base text-slate-900">
                          ⏳ 재응시 기회 및 잔여 응시 기간 안내
                        </h4>
                        <p className="text-xs text-slate-600">
                          아쉽게도 합격 기준에 미달하였으나, 아래 잔여 기간과 횟수 내에 언제든 재도전이 가능합니다.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-amber-200">
                      {/* Remaining Period (D-10 style within 30 days) */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex flex-col items-center justify-center shrink-0 border border-rose-200">
                          <span className="text-[10px] font-bold">잔여기간</span>
                          <span className="text-sm font-black">{remainingDaysTag}</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            남은 응시 기간: <span className="text-rose-700 font-extrabold text-sm">{remainingDaysTag}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            평가 개시일로부터 <strong>30일 이내</strong> 재응시 가능합니다. (마감 후 자동 종료)
                          </p>
                        </div>
                      </div>

                      {/* Remaining Attempts (Max 5, current 2, 3 left) */}
                      <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-200 pt-3 sm:pt-0">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex flex-col items-center justify-center shrink-0 border border-indigo-200">
                          <span className="text-[10px] font-bold">잔여횟수</span>
                          <span className="text-sm font-black">{remainingAttempts}회</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            응시 횟수: 총 {maxAttempts}회 중 이번에 <span className="text-indigo-700 font-bold">{currentAttempt}회</span> 응시
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            앞으로 <strong className="text-emerald-700 font-extrabold text-xs">{remainingAttempts}회</strong>의 추가 재응시 기회가 남아있습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. REPORT CONTENT: SPIDER CHART & SCORE BREAKDOWN */}
                <div className="space-y-4 pt-2">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>성적서 세부 내역 (역량 차트 및 기준별 득점)</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Spider Chart on Left */}
                    <div className="md:col-span-2 flex justify-center">
                      <EmailSpiderChart
                        scores={{
                          problemDefinition: candidate.criteria.problemDefinition.score,
                          aiPrompting: candidate.criteria.aiPrompting.score,
                          accuracy: candidate.criteria.accuracy.score,
                          structure: candidate.criteria.structure.score
                        }}
                      />
                    </div>

                    {/* Breakdown Table on Right */}
                    <div className="md:col-span-3">
                      <table className="w-full text-xs text-left border-collapse border border-slate-200">
                        <thead className="bg-slate-100 text-slate-700 font-bold">
                          <tr>
                            <th className="border border-slate-200 p-2">평가 기준</th>
                            <th className="border border-slate-200 p-2 text-center w-14">배점</th>
                            <th className="border border-slate-200 p-2 text-center w-16">득점</th>
                            <th className="border border-slate-200 p-2">주요 평가 근거</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-slate-200 p-2 font-semibold">1. 문제 정의 및 분석력</td>
                            <td className="border border-slate-200 p-2 text-center">25</td>
                            <td className="border border-slate-200 p-2 text-center font-bold text-indigo-700">
                              {candidate.criteria.problemDefinition.score}점
                            </td>
                            <td className="border border-slate-200 p-2 text-[11px] text-slate-600">
                              {candidate.criteria.problemDefinition.grounds[0]}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-200 p-2 font-semibold">2. AI 활용 및 프롬프트</td>
                            <td className="border border-slate-200 p-2 text-center">25</td>
                            <td className="border border-slate-200 p-2 text-center font-bold text-emerald-700">
                              {candidate.criteria.aiPrompting.score}점
                            </td>
                            <td className="border border-slate-200 p-2 text-[11px] text-slate-600">
                              {candidate.criteria.aiPrompting.grounds[0]}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-200 p-2 font-semibold">3. 답변의 정확성</td>
                            <td className="border border-slate-200 p-2 text-center">25</td>
                            <td className="border border-slate-200 p-2 text-center font-bold text-amber-700">
                              {candidate.criteria.accuracy.score}점
                            </td>
                            <td className="border border-slate-200 p-2 text-[11px] text-slate-600">
                              {candidate.criteria.accuracy.grounds[0]}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-200 p-2 font-semibold">4. 답변의 구조화</td>
                            <td className="border border-slate-200 p-2 text-center">25</td>
                            <td className="border border-slate-200 p-2 text-center font-bold text-sky-700">
                              {candidate.criteria.structure.score}점
                            </td>
                            <td className="border border-slate-200 p-2 text-[11px] text-slate-600">
                              {candidate.criteria.structure.grounds[0]}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-slate-50 font-bold">
                          <tr>
                            <td className="border border-slate-200 p-2">총 점</td>
                            <td className="border border-slate-200 p-2 text-center">100</td>
                            <td className="border border-slate-200 p-2 text-center text-sm font-black text-indigo-900">
                              {candidate.totalScore}점
                            </td>
                            <td className="border border-slate-200 p-2 text-slate-800 text-[11px]">
                              판정: {candidate.isPassed ? '합격' : '불합격'} ({candidate.grade} 등급)
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 4. COMPREHENSIVE FEEDBACK */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>평가자 종합 의견 및 총평</span>
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                    {overallFeedback}
                  </div>
                </div>

                {/* 5. EMAIL ACTION BUTTONS: RE-EXAM & OTHER MODULE APPLY */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="text-center text-xs font-semibold text-slate-500 mb-2">
                    {candidate.isPassed
                      ? '🎉 합격을 축하드립니다! 다음 연계 교육 모듈을 신청하여 AX 역량을 더욱 강화해 보세요.'
                      : '⏳ 남은 응시 기간 및 잔여 횟수 내에 재도전하여 역량 검증을 완료해 주세요.'}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* 불합격한 경우: '재응시하기' 버튼만 생성 (https://test38-virid.vercel.app/) */}
                    {!candidate.isPassed && (
                      <a
                        href="https://test38-virid.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-500/30"
                      >
                        <RotateCcw className="w-4 h-4 text-rose-200" />
                        <span>재응시하기</span>
                        <ExternalLink className="w-4 h-4 text-rose-200" />
                      </a>
                    )}

                    {/* 합격한 경우: '다른 모듈 신청하기' 버튼만 생성 (https://test14-wyc8.vercel.app/) */}
                    {candidate.isPassed && (
                      <a
                        href="https://test14-wyc8.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-500/30"
                      >
                        <Layers className="w-4 h-4 text-indigo-200" />
                        <span>다른 모듈 신청하기</span>
                        <ExternalLink className="w-4 h-4 text-indigo-200" />
                      </a>
                    )}
                  </div>

                  <div className="text-center text-[11px] text-slate-400 mt-2">
                    ※ 본 메일은 코오롱인더스트리 AXAGE 교육평가 시스템에서 자동 생성된 공식 평가 피드백입니다.
                  </div>
                </div>

              </div>

              {/* FOOTER OF RECEIVED EMAIL */}
              <div className="bg-slate-100 p-4 border-t border-slate-200 text-center text-[11px] text-slate-500">
                코오롱인더스트리(주) AX Innovation Center | 서울특별시 마곡동 코오롱 One&Only 타워 | 문의: axage-support@kolon.com
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER (POPUP WINDOW BOTTOM BUTTONS: 발송하기 / 수정하기 / 닫기) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              {isEditMode
                ? '내용 편집 중입니다. 작성이 끝나면 [수정 완료] 또는 [발송하기]를 눌러주세요.'
                : '이메일 내용을 확인하신 후 [발송하기]를 누르면 응시자에게 피드백이 전송됩니다.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
            >
              닫기
            </button>

            {/* 수정하기 / 미리보기 버튼 */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all border ${
                isEditMode
                  ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {isEditMode ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>수정 완료</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>수정하기</span>
                </>
              )}
            </button>

            {/* 발송하기 버튼 */}
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className={`px-5 py-2 text-white text-xs font-black rounded-xl shadow-lg cursor-pointer flex items-center gap-2 transition-all ${
                isSent
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/30'
              } ${isSending ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>발송 중...</span>
                </>
              ) : isSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>재발송하기</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-emerald-200" />
                  <span>발송하기</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

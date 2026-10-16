import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Bot,
  Terminal,
  Download,
  Paperclip,
  Printer,
  Edit3,
  X,
  UserCheck,
  Target,
  Cpu,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Check,
  Copy,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  RotateCw,
  Mail
} from 'lucide-react';
import { FeedbackEmailModal } from './components/FeedbackEmailModal';

// ==========================================
// 1. 타입 정의 (Types)
// ==========================================
export interface EvaluationCriterion {
  id: string;
  name: string;
  maxScore: number;
  score: number;
  grounds: string[];
  revisionMessage?: string; // 보완 메세지
}

export interface ScenarioInfo {
  moduleNumber: number;
  title: string;
  text: string;
  files: string[];
  keywords: string[];
}

export interface CandidateEvaluation {
  id: string;
  candidateName: string;
  moduleNumber: number;
  scenario: ScenarioInfo;
  aiPrompt: string;
  aiAnswer: string;
  candidateAnswer: string;
  criteria: {
    problemDefinition: EvaluationCriterion;
    aiPrompting: EvaluationCriterion;
    accuracy: EvaluationCriterion;
    structure: EvaluationCriterion;
  };
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  isPassed: boolean;
  overallFeedback: string;
  evaluatedAt: string;
}

// ==========================================
// 2. 13명 응시자 시나리오/답안 데이터 (Initial Data)
// ==========================================
const INITIAL_CANDIDATES_DATA: CandidateEvaluation[] = [
  {
    id: 'cand-1',
    candidateName: '지덱수',
    moduleNumber: 1,
    scenario: {
      moduleNumber: 1,
      title: '1. 기술통계 (Descriptive Statistics)',
      text: '생산 라인에서 수집된 온도 센서 데이터(측정 척도)를 분석하려 합니다. 데이터의 결측치를 확인하여 적절한 조치를 취하세요. 온도의 중심과 퍼짐 정도(분산)를 확인하고, 데이터가 모형을 바탕으로 분석 방향을 제안해 주세요. 이상치의 존재 여부를 판단하고 판단 기준을 제시하세요. 기술통계량을 바탕으로 분석 방향에 대한 종합적인 의견을 제시하세요.',
      files: ['sensor_data.csv', 'temperature_log.xlsx', 'missing_report.csv'],
      keywords: ['측정 척도', '중심경향치', '산포도', '왜도/첨도', 'IQR 이상치']
    },
    aiPrompt: `생산 라인의 온도 센서 데이터(sensor_data.csv)를 활용하여 기술통계 분석을 진행하려고 해. 파이썬 코드를 작성해 주되, 코딩을 할 때는 최대한 간단히 작성해 줘. 그리고 코드에 대한 설명은 제외해 줘. 다음의 분석 요건을 모두 충족하는 코드만 바로 출력해 줘.

1. 데이터 전처리: 결측치를 확인하고 평균값으로 대체
2. 중심경향치 및 산포도 계산: 평균, 중앙값, 최빈값, 분산, 표준편차, 범위(Max-Min) 산출
3. 분포 형태 확인: 왜도(Skewness)와 첨도(Kurtosis) 계산
4. 시각화: 히스토그램, 상자수염그림(Box Plot), 산점도 그리기
5. 이상치 탐지: IQR 방식을 활용하여 이상치 기준을 계산하고 필터링`,
    aiAnswer: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

df = pd.read_csv('sensor_data.csv')
df['temperature'].fillna(df['temperature'].mean(), inplace=True)

mean_val = df['temperature'].mean()
median_val = df['temperature'].median()
mode_val = df['temperature'].mode()[0]
var_val = df['temperature'].var()
std_val = df['temperature'].std()
range_val = df['temperature'].max() - df['temperature'].min()

skewness = df['temperature'].skew()
kurtosis = df['temperature'].kurt()

plt.figure(figsize=(15, 5))
plt.subplot(1, 3, 1)
sns.histplot(df['temperature'], kde=True)
plt.title('Histogram')

plt.subplot(1, 3, 2)
sns.boxplot(y=df['temperature'])
plt.title('Box Plot')

plt.subplot(1, 3, 3)
sns.scatterplot(x=df.index, y=df['temperature'])
plt.title('Scatter Plot')

plt.tight_layout()
plt.show()

Q1 = df['temperature'].quantile(0.25)
Q3 = df['temperature'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df['temperature'] < lower_bound) | (df['temperature'] > upper_bound)]
print(f"Mean: {mean_val:.2f}, Median: {median_val:.2f}, Mode: {mode_val:.2f}")
print(f"Variance: {var_val:.2f}, Std Dev: {std_val:.2f}, Range: {range_val:.2f}")
print(f"Skewness: {skewness:.2f}, Kurtosis: {kurtosis:.2f}")
print(f"Outlier Bounds: {lower_bound:.2f} ~ {upper_bound:.2f}")`,
    candidateAnswer: `[온도 센서 데이터 기술통계 분석 및 공정 방향 제안 리포트]

본 리포트는 생산 라인에서 수집된 온도 센서 데이터를 바탕으로 공정의 현재 상태를 진단하고, 향후 품질 개선을 위한 분석 방향을 종합적으로 제안합니다.

1-1. 데이터의 이해와 척도 분석
수집된 온도 데이터는 소수점 이하의 세밀한 측정이 가능한 연속형(Continuous) 데이터에 해당하며, 명목/서열/등간/비율 척도 기준을 적용하여 분류했습니다.

1-5. 결측치 식별 및 조치
missing_report.csv를 통해 2% 결측치를 발견하였으며, 무작위 결측(MCAR)으로 판단하여 중앙값(Median)으로 대치하여 왜곡을 방지했습니다.

1-2. 중심경향치와 산포도 분석
- 중심경향치: 평균 185.2℃, 중앙값 185.0℃, 최빈값 184.8℃로 치우침이 없음.
- 산포도: 범위 12.5℃, 분산 4.2, 표준편차 2.05℃로 온도가 평균 중심 ±2℃ 내외에서 안정적 변동을 보입니다.

1-3. 데이터의 분포와 형태 진단
- 왜도(Skewness): 0.15로 대칭형.
- 첨도(Kurtosis): 2.8로 정규분포에 근접.

1-4. 시각화 기법을 활용한 패턴 파악
- 히스토그램: 185℃ 중심으로 종 모양(Bell Shape) 형성.
- 상자수염그림: IQR 범위를 벗어난 단발성 아웃라이어 포착.
- 산점도: 시간 흐름에 따른 미세한 주기적 파동 패턴 발견.

1-5. 이상치 탐지 및 종합 분석 의견
IQR 방식으로 판단 기준(Q1-1.5*IQR ~ Q3+1.5*IQR)을 설정 후 초과 5건을 이상치로 선별했습니다. 관리도 작성 및 SPC 진입을 후속 제안합니다.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 24,
        grounds: [
          '온도 센서 데이터의 연속형 특성 및 4가지 측정 척도를 명확히 구분함.',
          '2% 결측치의 발생 원인을 무작위 결측(MCAR)으로 적절히 진단함.',
          '산점도 기반 주기적 파동 패턴과 이상치 5건의 특성을 명확히 포착함.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 24,
        grounds: [
          '전처리, 중심경향치, 왜도/첨도, 시각화, IQR 이상치 탐지 5개 요건을 구체 제시함.',
          '설명 제외 및 코드 전용 출력 제한 옵션을 명확히 지정함.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 25,
        grounds: [
          '모듈 핵심 키워드인 척도 구분, 중심경향치, 산포도, IQR 수식이 완벽히 반영됨.',
          '평균(185.2℃), 중앙값(185.0℃), 표준편차(2.05℃) 수치 해석 정확성이 우수함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 24,
        grounds: [
          'AI 파이썬 실행 결과를 보고서 형식으로 체계적 재구성함.',
          '수치 분석과 현장 공정 개선 제안(관리도 및 SPC)을 논리적으로 연결함.'
        ]
      }
    },
    totalScore: 97,
    grade: 'S',
    isPassed: true,
    overallFeedback: '지덱수 응시자는 기술통계 기본 개념부터 전처리, 이상치 판정 및 후속 공정 제안까지 출제 의도에 완벽히 부합하는 고품질 보고서를 작성함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-2',
    candidateName: '기냥',
    moduleNumber: 2,
    scenario: {
      moduleNumber: 2,
      title: '2. 추론통계 (Inferential Statistics)',
      text: '두 생산 공장(A, B)의 제품 강도 데이터를 수집했습니다. 두 공장에서 생산된 제품의 강도에 차이가 있는지 검정하고자 합니다. 가설검정을 수행하고 검정 결과를 제시해 주세요. 강도와 제조 온도 간의 관계에 대해 분석하고 중심극한정리를 바탕으로 결과를 해석하세요.',
      files: ['factory_a_strength.csv', 'factory_b_strength.csv', 'temp_strength_corr.xlsx'],
      keywords: ['중심극한정리', '가설검정(H0/H1)', 't-검정/ANOVA', '피어슨 상관계수', '단순선형회귀']
    },
    aiPrompt: `공장 A와 B의 제품 강도 데이터와 제조 온도에 따른 강도 데이터를 활용하여 추론통계 분석을 진행하려고 해.
1. Levene 등분산 검정
2. 2표본 t-검정
3. ANOVA 분석
4. 상관계수 및 단순선형회귀분석`,
    aiAnswer: `import pandas as pd
from scipy import stats
import statsmodels.api as sm

df_a = pd.read_csv('factory_a_strength.csv')
df_b = pd.read_csv('factory_b_strength.csv')
df_temp = pd.read_excel('temp_strength_corr.xlsx')

stat_var, p_val_var = stats.levene(df_a['strength'], df_b['strength'])
stat_t, p_val_t = stats.ttest_ind(df_a['strength'], df_b['strength'], equal_var=(p_val_var > 0.05))

X = sm.add_constant(df_temp['temperature'])
model = sm.OLS(df_temp['strength'], X).fit()

print(f"Variance p-val: {p_val_var:.4f}, T-test p-val: {p_val_t:.4f}")
print(f"Correlation: {df_temp['temperature'].corr(df_temp['strength']):.4f}")
print(model.summary().tables[1])`,
    candidateAnswer: `[공장 간 제품 강도 차이 및 제조 온도 영향에 대한 추론통계 분석 리포트]

2-1. 확률분포와 표본추출의 타당성 및 중심극한정리의 적용
n>30 이상의 표본 크기를 확보함에 따라 중심극한정리(CLT)를 통해 표본평균 분포가 정규분포에 근사함을 확인했습니다.

2-2. 가설검정의 원리: 귀무가설/대립가설 설정과 오류 통제
- H0: A/B 공장 강도 평균 차이 없음.
- H1: A/B 공장 강도 평균 유의미한 차이 있음.
- 유의수준 0.05 기준 1종 오류(α)와 2종 오류(β)를 통제함.

2-4. 분산 검정 선행
Levene 등분산 검정 결과 p-value = 0.124 (>0.05)로 등분산성을 채택했습니다.

2-3. 평균 검정 결과 해석
2표본 t-검정 p-value = 0.015 (<0.05)로 A/B 공장 간 강도 차이가 유의함을 입증했습니다.

2-5. 상관 및 단순 회귀분석 인과관계 추론
온도와 강도 간 피어슨 상관계수 -0.78로 음의 상관관계를 확인했으며, OLS 회귀모델을 통해 제조 온도 증가가 강도 저하를 유발함을 밝혔습니다.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 23,
        grounds: [
          'A/B 공장 품질 격차 및 온도 영향을 수학적으로 명확 정의함.',
          'n>30 표본에서 중심극한정리(CLT) 적용 가능성을 입증함.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 23,
        grounds: [
          'Levene -> t-test -> 회귀분석으로 이어지는 연속적 질의 작성.',
          'Statsmodels 라이브러리 OLS 활용 지시가 명확함.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 24,
        grounds: [
          '가설검정 절차(H0/H1, α, p-value)를 완벽 준수함.',
          '피어슨 상관계수 -0.78과 회귀 기울기 p-value 해석 정확함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 23,
        grounds: [
          'CLT -> 가설 설정 -> 등분산 검정 -> 평균 비교 -> 회귀분석으로 이어지는 깔끔한 구조.',
          '현장 표준화 권고사항을 수식과 함께 제시함.'
        ]
      }
    },
    totalScore: 93,
    grade: 'A',
    isPassed: true,
    overallFeedback: '기냥 응시자는 가설검정 논리 전개와 회귀분석 인과관계 해석이 매우 우수함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-3',
    candidateName: '빤히',
    moduleNumber: 3,
    scenario: {
      moduleNumber: 3,
      title: '3. 실험계획법 (Design of Experiments, DOE)',
      text: '신소재 배합 공정에서 수율을 극대화(최적화)하기 위한 실험을 설계합니다. 온도와 압력이 수율에 미치는 단독 영향(주효과)과 두 인자가 결합되어 나타나는 시너지(교호작용)를 분석하세요. 분석과정에서 고려된 실험계획법의 원리에 대해 설명하고 결과를 해석하세요.',
      files: ['doe_plan.xlsx', 'yield_results.csv', 'factor_levels.csv'],
      keywords: ['랜덤화/블록화/반복', '주효과(Main Effect)', '교호작용(Interaction)', '2^2 완전요인실험', '반응표면분석법(RSM)']
    },
    aiPrompt: `신소재 배합 공정 수율 데이터(yield_results.csv) 기반 DOE 분석 파이썬 코드를 작성해 줘.
1. 온도와 압력의 2-way ANOVA 수행
2. 주효과도(Main Effects Plot) 시각화
3. 교호작용도(Interaction Plot) 시각화`,
    aiAnswer: `import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('yield_results.csv')
model = ols('yield_val ~ C(Temperature) * C(Pressure)', data=df).fit()
anova_table = sm.stats.anova_lm(model, typ=2)
print(anova_table)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
sns.pointplot(x='Temperature', y='yield_val', data=df, ax=axes[0])
sns.pointplot(x='Temperature', y='yield_val', hue='Pressure', data=df, ax=axes[1])
plt.show()`,
    candidateAnswer: `[신소재 배합 공정 수율 극대화를 위한 실험계획법(DOE) 분석 리포트]

3-1. 실험계획법의 기본 원리를 적용한 환경 오차 통제
- 랜덤화(Randomization): 무작위 순서 배정으로 누적 오차 제거.
- 블록화(Blocking): 습도 차이를 블록 처리하여 순수 잔차 40% 감소.
- 반복(Replication): 3회 반복으로 우연 산포와 오차 구분.

3-2. 이원 실험계획 및 주효과 분석
온도 및 압력 주효과 p-value < 0.05로 유의미한 영향 확인 (온도 주효과 영향력이 더 큼).

3-3. 2^2 완전요인실험 기반 교호작용 검증
교호작용도 그래프에서 두 선이 교차하는 형태를 보여 고압 상태에서 고온 적용 시 수율 폭발적 상승 시너지 확인.

3-5. 반응표면분석법 (RSM) 최적화 제안
곡면 최적점 산출을 위해 중심합성계획(CCD) 및 RSM 전환 분석을 제안함.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 23,
        grounds: [
          '온도와 압력을 수율 최적화 핵심 인자로 타당하게 규정함.',
          '실험 노이즈 제어를 위한 블록화 및 교락 방지 요구사항 도출.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 22,
        grounds: [
          '2-way ANOVA 및 주효과/교호작용 그래프 작성을 요구함.',
          '질문 꼬리물기 보완이 조금 더 구체적이었으면 함.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 24,
        grounds: [
          '실험계획 3대 원칙(랜덤화, 블록화, 반복)과 교락 개념 정확함.',
          '교호작용 시너지 효과 및 RSM 중심합성계획 논리 타당함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 22,
        grounds: [
          '실험 원칙 -> ANOVA -> 교호작용 -> RSM으로 이어지는 우수한 목차 재구성.'
        ]
      }
    },
    totalScore: 91,
    grade: 'A',
    isPassed: true,
    overallFeedback: '빤히 응시자는 DOE 기본 원칙과 교호작용 시너지 해석이 우수하며, RSM 고도화 제안이 돋보임.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-4',
    candidateName: '김사업',
    moduleNumber: 4,
    scenario: {
      moduleNumber: 4,
      title: '4. 통계적공정관리 (Statistical Process Control, SPC)',
      text: '가죽 시트 제조 공정에서 두께를 측정합니다. 파괴검사 특성을 고려해 계측기 및 작업자의 오차(Gage R&R)가 허용 수준인지 검증하세요. 공정이 관리상태인지 판정하고 그 근거를 제시하세요. 공정능력지수를 산출하고 불량비율을 모니터링하세요.',
      files: ['leather_thickness.csv', 'gage_rr_data.xlsx', 'control_chart_points.csv'],
      keywords: ['파괴검사/Nested Gage R&R', 'Xbar-R 관리도', 'p-관리도', 'Cp/Cpk vs Pp/Ppk', '우연원인/이상원인']
    },
    aiPrompt: `가죽 시트 두께 SPC 분석 파이썬 코드를 작성해 줘.
1. 파괴검사 특성 반영 Nested ANOVA Gage R&R 계산
2. Xbar-R 관리도 및 UCL/LCL 표시
3. p-관리도 시각화
4. Cpk 및 Ppk 산출`,
    aiAnswer: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
from statsmodels.formula.api import ols

df_gage = pd.read_excel('gage_rr_data.xlsx')
model = ols('thickness ~ C(Operator) + C(Operator):C(Part)', data=df_gage).fit()
print(sm.stats.anova_lm(model, typ=1))

df_thick = pd.read_csv('leather_thickness.csv')
subgroups = df_thick.groupby('Subgroup')['thickness'].agg(['mean', lambda x: x.max() - x.min()])
xbar_mean, r_mean = subgroups['mean'].mean(), subgroups['<lambda_0>'].mean()
print(f"Xbar CL={xbar_mean:.3f}, UCL={xbar_mean+0.577*r_mean:.3f}")`,
    candidateAnswer: `[가죽 시트 두께 통계적 공정관리(SPC) 및 측정시스템 분석 리포트]

4-2. 파괴검사 특성을 반영한 측정시스템 분석 (MSA)
파괴검사 특성을 반영하여 지연(Nested) 설계 Gage R&R 모델을 적용함. 변동 비율 10% 미만으로 측정 신뢰성 확보.

4-3. 계량형 관리도를 활용한 공정 상태 판정
Xbar-R 관리도 타점 결과 UCL/LCL 이탈 및 이상 패턴이 없어 공정이 관리상태(In Control)임을 판정함.

4-4. 계수형 관리도를 활용한 불량비율 모니터링
표본 크기 가변성을 고려하여 불량비율을 모니터링하는 p-관리도 도입.

4-5. 단기 및 장기 공정능력 지수 산출
- 단기 Cpk = 1.45 (군내 변동)
- 장기 Ppk = 1.33 (전체 장기 변동 반영)
외부 변동성을 모두 포함하는 보수적 퍼포먼스 지표인 Ppk(1.33)를 최종 표준 성능 지표로 선정함.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 25,
        grounds: [
          '파괴검사 특성(시료 재측정 불가)에 따른 Nested MSA 필요성을 도출함.',
          '우연원인과 이상원인의 구분을 관리도 이탈 여부로 정확히 판정함.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 24,
        grounds: [
          'Nested ANOVA 지정식(C(Operator):C(Part)) 및 Xbar-R 수식을 정확히 표현함.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 25,
        grounds: [
          'Nested MSA, Xbar-R 계수(A2=0.577, d2=2.326), p-관리도 수식이 완벽함.',
          'Cpk 1.45 vs Ppk 1.33의 군내/군간 변동성 차이 서술 정교함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 24,
        grounds: [
          'MSA 검증 -> 계량형 관리도 -> 계수형 관리도 -> 공정능력 지수 순으로 재구성함.'
        ]
      }
    },
    totalScore: 98,
    grade: 'S',
    isPassed: true,
    overallFeedback: '김사업 응시자는 파괴검사 MSA부터 Cpk/Ppk 선택 논리까지 SPC 전 영역에서 탁월한 수술적 전문성을 보임.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-5',
    candidateName: '이생산',
    moduleNumber: 5,
    scenario: {
      moduleNumber: 5,
      title: '5. 구조적 문제해결 방법론',
      text: '현재 불량 발생률을 수치로 명확히 정의(As-Is 정량화)하고, 불량률에 영향을 미칠 것으로 예상되는 변수(potential)를 선정하세요. 데이터 분석을 거쳐 불량에 가장 큰 영향을 미치는 소수의 변수(vital few)를 검증하세요.',
      files: ['defect_rate_asis.xlsx', 'feature_analysis.csv', 'vital_few_analysis.csv'],
      keywords: ['As-Is 정량화', '5-Why / 특성요인도', 'Vital Few (t-test)', '우선순위 매트릭스', 'Before/After 검증']
    },
    aiPrompt: `구조적 문제해결을 위한 불량률 저감 분석 파이썬 코드를 작성해 줘.
1. As-Is 불량 발생률 정량화
2. t-test로 Vital Few 검증
3. 효과성-실현가능성 우선순위 매트릭스 시각화
4. Before/After 비교 그래프`,
    aiAnswer: `import pandas as pd
from scipy import stats

df_asis = pd.read_excel('defect_rate_asis.xlsx')
asis_rate = (len(df_asis[df_asis['Status'] == 'NG']) / len(df_asis)) * 100

df_feat = pd.read_csv('feature_analysis.csv')
for col in ['Temperature', 'Pressure', 'Speed']:
    ok = df_feat[df_feat['Status']=='OK'][col]
    ng = df_feat[df_feat['Status']=='NG'][col]
    p_val = stats.ttest_ind(ok, ng, equal_var=False).pvalue
    print(f"{col} p-val: {p_val:.4f}")`,
    candidateAnswer: `[구조적 문제해결 방법론 기반 공정 불량률 저감 분석 리포트]

5-1. 문제 정의와 현상 파악
As-Is 상태 정량화 결과 현재 불량률 5.2% 확인. To-Be 목표 1.5% 달성을 위한 갭(3.7%p) 도출.

5-2. 데이터 기반 원인 분석
4M1E 특성요인도 및 5-Why 분석을 통해 잠재 변수 도출.

5-3. 핵심 인자(Vital Few) 검증
t-test 실시 결과 건조 구간 온도(Temperature) p-value = 0.001로 불량을 유발하는 근본 원인(Vital Few)임을 확정.

5-4. 최적 대안 도출 및 평가
우선순위 매트릭스 산출을 통해 '실시간 PID 자동 온도 제어 시스템'을 최적 대안으로 선정.

5-5. 실행, 검증 및 표준화
Before(5.2%) vs After(1.5%) 효과 검증 후 작업 표준서 업데이트 및 SPC 연동 관리계획 수립.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 24,
        grounds: [
          'As-Is(5.2%)와 To-Be(1.5%)의 정량적 갭(3.7%p)을 명확히 제시함.',
          '4M1E 관점 5-Why 가설 수립과 Vital Few 연결이 타당함.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 22,
        grounds: [
          't-test 기반 원인 검증과 우선순위 매트릭스 작성을 구체화함.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 24,
        grounds: [
          'Vital Few 선정을 위한 t-test p-value(0.001) 활용 정확함.',
          'DMAIC 로직 및 Control Plan 연결 타당함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 23,
        grounds: [
          '문제 정의 -> 원인 가설 -> Vital Few 확정 -> 대안 매트릭스 -> 표준화로 연결됨.'
        ]
      }
    },
    totalScore: 93,
    grade: 'A',
    isPassed: true,
    overallFeedback: '이생산 응시자는 문제 정의부터 DMAIC 기반 구조적 접근 및 Vital Few 통계 검증까지 우수하게 기술함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-6',
    candidateName: '홍길동',
    moduleNumber: 6,
    scenario: {
      moduleNumber: 6,
      title: '6. 미니탭 기초 (Minitab Basics)',
      text: '제시된 데이터를 데이터프레임 구조에 맞도록 정리하여 미니탭에 입력하세요. 작업자 및 설비별로 데이터를 나누어(층별화) 기초 통계량과 그래프를 확인하고 결과를 해석하세요.',
      files: ['raw_inspection.xlsx', 'stratified_data.csv', 'minitab_export.csv'],
      keywords: ['워크시트/세션창 UI', '데이터 전처리/포맷변환', '층별화(Stratification)', 'ANOVA p-value', 'Minitab Assistant']
    },
    aiPrompt: `미니탭 분석 준비 및 검정 재현 파이썬 코드를 작성해 줘.
1. raw_inspection.xlsx 결측치 제거
2. Worker, Machine별 층별화 기초통계량 계산
3. Machine별 Value에 대한 ANOVA 수행
4. 층별 Boxplot 시각화`,
    aiAnswer: `import pandas as pd
from scipy import stats
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_excel('raw_inspection.xlsx').dropna()
print(df.groupby(['Worker', 'Machine'])['Value'].agg(['mean', 'std']))

machines = [df[df['Machine']==m]['Value'] for m in df['Machine'].unique()]
f_stat, p_val = stats.f_oneway(*machines)
print(f"ANOVA p-val: {p_val:.4f}")

sns.boxplot(data=df, x='Machine', y='Value', hue='Worker')
plt.show()`,
    candidateAnswer: `[미니탭(Minitab)을 활용한 품질 검사 데이터 분석 및 가설검정 리포트]

6-1. 기본 UI와 환경 설정
워크시트(Worksheet), 세션 창(Session Window), 그래프 창(Graph Window) 구성 확인 및 프로젝트 파일 저장 관리.

6-2. 데이터 핸들링
raw_inspection.xlsx 불러오기 후 텍스트-숫자 포맷 변환 및 결측치(*) 처리 진행.

6-3. 층별화 분석
Worker 및 Machine 기준 층별화 적용 후 기술통계량 표시 및 Box Plot을 통해 2번 설비 공정 산포 이상 패턴 발견.

6-4. 가설검정 및 세션 창 해석
ANOVA p-value = 0.012 (<0.05)로 "설비 간 품질 검사 평균에 유의미한 차이가 존재한다"는 대립가설 채택.

6-5. Minitab Assistant 활용
Assistant 요약 보고서를 추출하여 신호등 시각화 지표 및 보고서 자동 추출 완료.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 21,
        grounds: [
          '미니탭 UI 영역 및 설비/작업자별 층별화 필요성을 이해함.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 21,
        grounds: [
          'Pandas groupby 층별화 및 Scipy ANOVA 구성을 요구함.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 22,
        grounds: [
          'ANOVA 세션 창 p-value = 0.012 해석이 통계학적 기준에 부합함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 21,
        grounds: [
          'UI 이해 -> 임포트 -> 층별화 -> ANOVA -> Assistant 보고서로 전개됨.'
        ]
      }
    },
    totalScore: 85,
    grade: 'B',
    isPassed: true,
    overallFeedback: '홍길동 응시자는 미니탭 UI와 층별화 분석 및 ANOVA 검정을 무난하게 수행함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-7',
    candidateName: '장발장',
    moduleNumber: 7,
    scenario: {
      moduleNumber: 7,
      title: '7. 파이썬 리터러시 (Python Literacy)',
      text: '첨부의 파일들에 대해 파이썬을 이용하여 데이터의 성격(자료형)을 확인하고 리스트 또는 딕셔너리 구조로 저장하세요. 조건문과 데이터프레임을 활용하고 GroupBy로 요약하세요.',
      files: ['sales_raw.csv', 'customer_info.xlsx', 'region_mapping.csv'],
      keywords: ['기본 자료형/변수', '리스트/딕셔너리', '조건문/사용자정의함수', 'Pandas read_csv/merge', 'GroupBy 요약']
    },
    aiPrompt: `파이썬 데이터 가공 스크립트를 작성해 줘.
1. sales_raw.csv, customer_info.xlsx, region_mapping.csv 불러오기 및 merge
2. 딕셔너리 변환 규칙 선언
3. sales_amount 기준 VIP/Gold/Normal 분류 조건문 작성
4. GroupBy 지역별 매출 합계 요약`,
    aiAnswer: `import pandas as pd

df_sales = pd.read_csv('sales_raw.csv')
df_cust = pd.read_excel('customer_info.xlsx')
df_region = pd.read_csv('region_mapping.csv')

df_merged = pd.merge(df_sales, df_cust, on='customer_id').merge(df_region, on='region_code')

def classify(amt):
    if amt >= 500000: return 'VIP'
    elif amt >= 100000: return 'Gold'
    else: return 'Normal'

df_merged['grade'] = df_merged['sales_amount'].apply(classify)
print(df_merged.groupby('region_name')['sales_amount'].sum())`,
    candidateAnswer: `[AX 기획팀 파이썬 기반 데이터 병합 및 자동화 전처리 리포트]

7-1. 환경 구축 및 자료형 점검
Jupyter Notebook 환경에서 int/float, string 자료형 점검 후 변수 할당.

7-3. 자료구조 활용
- 딕셔너리: {'R01': 'Seoul'} 키-값 매핑으로 VLOOKUP 대체.
- 리스트: ['Seoul', 'Busan'] 필터 대상 관리.

7-4. Pandas 입출력 및 병합
read_csv(), read_excel()을 통한 로드 및 merge() 조인 수행.

7-2. 제어문과 함수 적용
classify_sales() 사용자 정의 함수 내 if-elif-else 조건문 작성 및 apply 일괄 적용.

7-5. 데이터 가공 및 그룹화
dropna() 결측치 정제 후 groupby('region_name')['sales_amount'].sum() 집계 연산 수행.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 22,
        grounds: [
          '이기종 수집 데이터의 파이썬 통합 전처리 목적을 정의함.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 22,
        grounds: [
          'Pandas merge, apply 조건문, GroupBy를 단계적으로 적절히 명시함.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 23,
        grounds: [
          '자료형, 조건문, Pandas merge/groupby 문법 서술이 정확함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 23,
        grounds: [
          '자료형 -> 딕셔너리 -> Pandas 입출력 -> 제어문 -> GroupBy 순으로 정돈됨.'
        ]
      }
    },
    totalScore: 90,
    grade: 'A',
    isPassed: true,
    overallFeedback: '장발장 응시자는 파이썬 기본 자료구조 및 Pandas 활용법을 명확하게 이해하여 성실히 수행함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-8',
    candidateName: '손흥민',
    moduleNumber: 8,
    scenario: {
      moduleNumber: 8,
      title: '8. 프롬프트 엔지니어링과 바이브 코딩',
      text: 'AI에게 데이터 병합 작업을 요청하려 합니다. 상황과 목표를 명확히 설명(맥락 부여)하고, 한국어 요구사항을 파이썬 코드로 변환(자연어-코드 번역)하도록 요청하세요. 단계별 지시 및 에러 로그 디버깅을 수행하세요.',
      files: ['prompt_template.txt', 'vibe_coding_test.xlsx', 'error_traceback.csv'],
      keywords: ['역할/맥락 부여', '바이브 코딩(자연어-코드 번역)', '단계별 지시(Step-by-step)', '에러 로그 디버깅', '자동화 템플릿']
    },
    aiPrompt: `너는 파이썬 데이터 분석 전문가야. vibe_coding_test.xlsx 파일 데이터를 기반으로 다음을 수행해 줘.
1. 여러 시트를 concat으로 세로 병합해 줘.
2. error_traceback.csv에서 발생했던 InvalidIndexError 방지를 위해 reset_index(drop=True)를 적용해 줘.
3. fillna(0) 및 부서별 매출 합계/비용 평균 요약표 생성
4. automated_report_template.xlsx로 자동 저장해 줘.`,
    aiAnswer: `import pandas as pd

xls = pd.ExcelFile('vibe_coding_test.xlsx')
df_list = [pd.read_excel(xls, s) for s in xls.sheet_names]
df_merged = pd.concat(df_list).reset_index(drop=True)

df_merged.fillna(0, inplace=True)
summary = df_merged.groupby('Department').agg({'Sales': 'sum', 'Cost': 'mean'}).reset_index()

with pd.ExcelWriter('automated_report_template.xlsx') as writer:
    df_merged.to_excel(writer, sheet_name='Raw', index=False)
    summary.to_excel(writer, sheet_name='Summary', index=False)`,
    candidateAnswer: `[AX 기획팀 업무 자동화를 위한 프롬프트 엔지니어링 및 바이브 코딩 실무 리포트]

8-1. LLM 작동 원리와 프롬프트 구조화 전략
Persona(파이썬 전문가) 및 Context(전사 취합 자동화) 부여를 통한 답변 고도화.

8-2. 바이브 코딩 패러다임 전환
자연어 요구사항을 AI가 파이썬 코드로 번역하는 바이브 코딩 패러다임 적용.

8-3. 단계별 지시 (Step-by-step)
다중 시트 불러오기 -> concat 병합 -> fillna -> GroupBy EDA 단계별 프롬프트 적용.

8-4. 에러 로그 디버깅
InvalidIndexError 발생 시 error_traceback.csv 에러 로그를 피드백하여 reset_index(drop=True) 자가 수정 유도.

8-5. 현업 자동화 템플릿
ExcelWriter 기반 다중 시트 추출 코드를 정립하여 자동화 파이프라인(RPA) 완성.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 25,
        grounds: [
          '자연어-코드 번역 패러다임과 LLM 맥락 부여 전략을 명확 정의함.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 25,
        grounds: [
          'Persona, Context, Step-by-Step, Output Format 규정이 명확한 최고 수준 프롬프트 작성.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 25,
        grounds: [
          'InvalidIndexError 원인과 reset_index(drop=True) 해결책 서술 완벽함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 24,
        grounds: [
          'LLM 원리 -> 개념 -> 단계별 프롬프팅 -> 디버깅 -> 자동화로 구성 완벽함.'
        ]
      }
    },
    totalScore: 99,
    grade: 'S',
    isPassed: true,
    overallFeedback: '손흥민 응시자는 프롬프트 엔지니어링 4대 요소와 에러 로그 디버깅, 자동화 스크립트 작성까지 완벽한 모범 답안을 작성함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-9',
    candidateName: '박찬호',
    moduleNumber: 9,
    scenario: {
      moduleNumber: 9,
      title: '9. 머신러닝 : 이론',
      text: '불량품을 예측하는 모델(학습 패러다임)을 구축합니다. 변수 간의 비례적 관계(선형성)를 가정하는 모델과 앙상블 기법을 비교하세요. 혼동 행렬 및 편향-분산 트레이드오프를 통제하세요.',
      files: ['ml_train_data.csv', 'ml_test_data.csv', 'confusion_matrix.xlsx'],
      keywords: ['지도학습 분류', '로지스틱 회귀', '랜덤 포레스트(앙상블)', '혼동 행렬/Recall/F1', '편향-분산 트레이드오프']
    },
    aiPrompt: `지도학습 기반 불량 예측 머신러닝 모델 파이썬 코드를 작성해 줘.
1. ml_train_data.csv, ml_test_data.csv 독립/종속변수 분리 및 'NG'=1 매핑
2. 로지스틱 회귀 및 랜덤 포레스트 모델 fit & predict
3. 'NG'=1 기준 Confusion Matrix, Accuracy, Precision, Recall, F1-score 출력`,
    aiAnswer: `import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score

train = pd.read_csv('ml_train_data.csv')
test = pd.read_csv('ml_test_data.csv')

X_tr, y_tr = train.drop('Status', axis=1), train['Status'].apply(lambda x: 1 if x=='NG' else 0)
X_te, y_te = test.drop('Status', axis=1), test['Status'].apply(lambda x: 1 if x=='NG' else 0)

rf = RandomForestClassifier().fit(X_tr, y_tr)
pred = rf.predict(X_te)
print("Recall:", recall_score(y_te, pred), "F1:", f1_score(y_te, pred))`,
    candidateAnswer: `[AX 기획팀 머신러닝 기반 공정 불량 예측 모델 이론 검증 및 평가 리포트]

9-1. 머신러닝 개요 및 지도학습 패러다임
과거 정답 데이터가 존재하므로 지도학습(Supervised Learning) 분류 패러다임 적용.

9-2. 선형 모델 vs 앙상블 비교
- 로지스틱 회귀: Sigmoid 함수 기반 가중치 해석 제공.
- 랜덤 포레스트: 의사결정나무 앙상블로 비선형 패턴 학습.

9-4. 모델 평가 지표: Positive 재정의
'불량(NG)'을 Positive(1)로 설정. 제조업 특성상 미검(FN) 리스크 방지를 위해 재현율(Recall)을 최우선 평가하고 F1-Score로 산출.

9-5. 편향-분산 트레이드오프 통제
Overfitting과 Underfitting의 Bias-Variance Tradeoff를 통제하여 일반화 성능 확보.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 24,
        grounds: [
          '불량품 예측을 지도학습 분류 문제로 타당하게 정의함.',
          '제조 현장에서 미검(FN) 위험성을 파악해 Recall 지표의 중요성 도출.'
        ]
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 23,
        grounds: [
          '로지스틱 회귀 및 랜덤 포레스트 비교와 Positive=1 매핑 요구 작성.'
        ]
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 25,
        grounds: [
          '혼동행렬 평가지표 수식 및 Bias-Variance Tradeoff 서술 명확함.'
        ]
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 24,
        grounds: [
          '지도학습 정의 -> 알고리즘 비교 -> Recall/Positive 재정의 -> 편향-분산 통제로 구성함.'
        ]
      }
    },
    totalScore: 96,
    grade: 'S',
    isPassed: true,
    overallFeedback: '박찬호 응시자는 머신러닝 분류 이론과 혼동행렬 실무 재해석, 편향-분산 트레이드오프에 대해 높은 이해도를 보임.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-10',
    candidateName: '류현진',
    moduleNumber: 10,
    scenario: {
      moduleNumber: 10,
      title: '10. 머신러닝 : 탐색적 데이터분석 (EDA)',
      text: '모델링 전 데이터 탐색을 수행합니다. 데이터의 행과 열 크기, 기본 정보(데이터 윤곽)를 확인하고 상관관계를 시각화하세요. 결측치 대치, 정규화, 파생변수를 생성하세요.',
      files: ['eda_raw.csv', 'missing_values.xlsx', 'scaled_features.csv'],
      keywords: ['Data Profiling (info/describe)', '결측치 대치(Median)', 'Min-Max Scaling/One-Hot', '파생변수 생성(Feature Engineering)', '상관관계 Heatmap']
    },
    aiPrompt: `EDA 및 특성 공학 파이썬 코드를 작성해 줘.
1. info(), describe() 출력
2. 수치형 결측치 median 대치 및 원핫 인코딩
3. new_ratio_feature 파생변수 생성
4. MinMaxScaler 적용 및 상관관계 Heatmap 시각화`,
    aiAnswer: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler

df = pd.read_csv('eda_raw.csv')
df.info()
print(df.describe())

num_cols = df.select_dtypes(include=['float64', 'int64']).columns
df[num_cols] = df[num_cols].fillna(df[num_cols].median())
df = pd.get_dummies(df, drop_first=True)

if 'feature_A' in df.columns and 'feature_B' in df.columns:
    df['new_ratio_feature'] = df['feature_A'] / (df['feature_B'] + 1e-5)

scaler = MinMaxScaler()
df[num_cols] = scaler.fit_transform(df[num_cols])
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.show()`,
    candidateAnswer: `[AX 기획팀 머신러닝 예측 성능 극대화를 위한 탐색적 데이터 분석(EDA) 리포트]

10-1. Data Profiling
info() 및 describe()를 통해 전체 행/열 크기, 데이터 타입, 결측치 및 4분위수 요약.

10-3. 데이터 정제
온도 센서의 결측치를 중앙값(Median)으로 대치하여 왜곡 방지.

10-4. 데이터 스케일링과 인코딩
단위를 맞추기 위한 Min-Max Scaling 및 범주형 변수의 One-Hot Encoding 진행.

10-5. 파생 변수 생성
단위 시간당 냉각률 등 기존 변수를 조합하여 파생 변수 생성.

10-2. 상관관계 시각화
피어슨 상관계수 기반 Heatmap 시각화를 통해 타겟 변수와의 상관관계 검증.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 23,
        grounds: ['EDA 및 특성 공학의 목적을 잘 규정함.']
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 22,
        grounds: ['info/describe, median 대치, scaling, heatmap 지시 포함.']
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 24,
        grounds: ['Min-Max Scaling 및 Median 대치 수식 및 개념 정확함.']
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 23,
        grounds: ['Profiling -> Cleansing -> Scaling -> Feature Eng -> Heatmap 전개.']
      }
    },
    totalScore: 92,
    grade: 'A',
    isPassed: true,
    overallFeedback: '류현진 응시자는 탐색적 데이터 분석 및 파생변수 생성 과정의 핵심을 명확히 파악하고 깔끔하게 작성함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-11',
    candidateName: '황희찬',
    moduleNumber: 11,
    scenario: {
      moduleNumber: 11,
      title: '11. 머신러닝 : 모델링 및 강화',
      text: '훈련 데이터와 평가 데이터를 분리하여 과적합을 방지하고 K-Fold 교차 검증을 수행하세요. 부스팅 알고리즘 적용 및 하이퍼파라미터 최적화, 특성 중요도를 분석하세요.',
      files: ['modeling_dataset.csv', 'hyperparameters.xlsx', 'feature_importance.csv'],
      keywords: ['Train/Test Split (8:2)', 'K-Fold 교차 검증', 'XGBoost (부스팅)', 'GridSearchCV 튜닝', 'Feature Importance']
    },
    aiPrompt: `머신러닝 예측 모델링 및 성능 고도화 파이썬 코드를 작성해 줘.
1. Train/Test Set 8:2 분리
2. XGBoost 모델 5-Fold 교차검증 정확도 출력
3. GridSearchCV로 max_depth, learning_rate 튜닝
4. Feature Importance 수평 막대그래프 시각화`,
    aiAnswer: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from xgboost import XGBClassifier

df = pd.read_csv('modeling_dataset.csv')
X = df.drop('Status', axis=1)
y = df['Status']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

xgb = XGBClassifier(random_state=42)
cv_scores = cross_val_score(xgb, X_train, y_train, cv=5)
print(f"5-Fold CV Mean Acc: {cv_scores.mean():.4f}")

param_grid = {'max_depth': [3, 5, 7], 'learning_rate': [0.01, 0.1]}
grid = GridSearchCV(XGBClassifier(random_state=42), param_grid, cv=5)
grid.fit(X_train, y_train)

importances = pd.Series(grid.best_estimator_.feature_importances_, index=X.columns)
sns.barplot(x=importances, y=importances.index)
plt.show()`,
    candidateAnswer: `[AX 기획팀 머신러닝 예측 성능 극대화 및 하이퍼파라미터 최적화 리포트]

11-1. 데이터 분할과 베이스라인 구축
8:2 데이터 분할을 통해 과적합 방지 및 베이스라인 모델 구축.

11-2. K-Fold 교차 검증 (Cross-Validation)
5-Fold 교차 검증을 적용해 편중 현상을 통제하고 모델의 범용적 신뢰성 향상.

11-4. 부스팅 앙상블 기법 적용
XGBoost 알고리즘을 핵심 모델로 채택해 오답(잔차)을 순차 보완하며 복잡한 비선형 상호작용 학습.

11-3. 하이퍼파라미터 튜닝
GridSearch 방식을 활용해 max_depth, learning_rate 최적 설정값 산출.

11-5. 특성 중요도(Feature Importance) 분석
건조 구간 온도 편차가 불량 예측에 가장 결정적인 변수임을 판명함.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 24,
        grounds: ['과적합 통제 및 K-Fold 신뢰성 확보 필요성을 명확 정의함.']
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 23,
        grounds: ['XGBoost, 5-Fold, GridSearchCV 지시 포함.']
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 24,
        grounds: ['K-Fold 교차검증 및 XGBoost 잔차 학습 수식 정확함.']
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 24,
        grounds: ['분할 -> K-Fold -> 부스팅 -> 튜닝 -> 중요도 시각화로 깔끔 전개.']
      }
    },
    totalScore: 95,
    grade: 'S',
    isPassed: true,
    overallFeedback: '황희찬 응시자는 XGBoost 앙상블 모델링과 교차검증, 하이퍼파라미터 튜닝까지 완성도 높게 구성함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-12',
    candidateName: '김하성',
    moduleNumber: 12,
    scenario: {
      moduleNumber: 12,
      title: '12. AI Automation',
      text: '원시 데이터 수집부터 예측 결과 출력까지의 전 과정(End-to-End)을 설계합니다. 외부 API 연동, 스케줄링 배치 작업, 메신저 알림 발송 및 Data Drift 모니터링을 수행하세요.',
      files: ['pipeline_config.json', 'api_response_log.csv', 'drift_metrics.xlsx'],
      keywords: ['End-to-End 파이프라인', 'OpenAPI/requests 연동', 'Cron/Task Scheduler 배치', 'Webhook 메신저 알림', 'Data Drift 모니터링']
    },
    aiPrompt: `AI 자동화 파이프라인 스크립트를 작성해 줘.
1. pipeline_config.json에서 Threshold 및 Webhook URL 로드
2. requests 모듈로 외부 날씨 API 호출
3. 예측 불량률 > Threshold 시 사내 메신저 알림 발송 함수 작성
4. Data Drift 모니터링 및 에러 로그 출력`,
    aiAnswer: `import json
import requests
import pandas as pd

with open('pipeline_config.json', 'r') as f:
    config = json.load(f)

threshold = config.get('defect_threshold', 5.0)
webhook_url = config.get('webhook_url', 'http://example.com/webhook')

def send_alert(rate):
    msg = {"text": f"[경고] 예측 불량률({rate}%)이 임계치 초과!"}
    requests.post(webhook_url, json=msg)

current_rate = 6.2
if current_rate > threshold:
    send_alert(current_rate)

df_drift = pd.read_excel('drift_metrics.xlsx')
if abs(df_drift['Temperature'].mean() - 25.0) > 5:
    print("[유지보수] Data Drift 발생 감지. 재학습 필요.")`,
    candidateAnswer: `[AX 기획팀 End-to-End AI 파이프라인 자동화 및 모니터링 체계 구축 리포트]

12-1. End-to-End 파이프라인 설계
pipeline_config.json 기반 임계치(Threshold) 및 접속 정보 외부 관리 구축.

12-2. 외부 OpenAPI 데이터 연동
requests 라이브러리로 실시간 기상 데이터를 JSON 호출하여 변수 확장.

12-3. 스케줄링 배치 작업화
Windows Task Scheduler / Cron을 활용해 매일 지정 시간 배치 자동 실행.

12-4. 자동화 알림 시스템 (Webhook)
불량률 임계치 초과 시 사내 메신저 Webhook 연동 자동 통보.

12-5. Data Drift 모니터링
Data Drift 발생 시 에러 로그 기록 및 모델 재학습 경고 프로세스 정립.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 22,
        grounds: ['자동화 파이프라인 및 Data Drift 모니터링 필요성 정의함.']
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 22,
        grounds: ['requests, Webhook, Data Drift 요구 포함.']
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 22,
        grounds: ['requests OpenAPI 및 Webhook 연동 원리 정확함.']
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 22,
        grounds: ['설계 -> 데이터 연동 -> 스케줄링 -> 알림 -> 모니터링으로 전개.']
      }
    },
    totalScore: 88,
    grade: 'B',
    isPassed: true,
    overallFeedback: '김하성 응시자는 파이프라인 자동화 및 메신저 알림, Data Drift 모니터링 구조를 잘 설계함.',
    evaluatedAt: '2026-08-09 10:15'
  },
  {
    id: 'cand-13',
    candidateName: '김민재',
    moduleNumber: 13,
    scenario: {
      moduleNumber: 13,
      title: '13. 시각화 - Tableau와 Power BI',
      text: '사내 데이터베이스에 연결하여 대시보드를 구축합니다. 스타 스키마 구조 형성, 시각화 매핑, DAX/LOD 표현식 계산 및 상호작용 대시보드를 완성하세요.',
      files: ['bi_fact_table.csv', 'bi_dim_tables.xlsx', 'dashboard_layout.json'],
      keywords: ['데이터 원본 (Data Source)', '스타 스키마 (Star Schema)', '시각화 매핑 (Visual Mapping)', 'DAX 및 LOD 표현식', '상호작용 (Interactivity)']
    },
    aiPrompt: `BI 도구 데이터 모델링 및 인터랙티브 시각화 파이썬 코드를 작성해 줘.
1. 팩트 테이블 중심으로 디멘전 테이블 병합 (스타 스키마)
2. GroupBy 및 cumsum으로 지역별 누적 매출 계산 (DAX/LOD 대체)
3. Plotly 인터랙티브 막대그래프 생성 및 HTML 저장`,
    aiAnswer: `import pandas as pd
import json
import plotly.express as px

df_fact = pd.read_csv('bi_fact_table.csv')
xls_dim = pd.ExcelFile('bi_dim_tables.xlsx')

df_dim_p = pd.read_excel(xls_dim, 'Product')
df_dim_r = pd.read_excel(xls_dim, 'Region')

df_merged = pd.merge(df_fact, df_dim_p, on='product_id').merge(df_dim_r, on='region_id')
df_merged['cumulative_sales'] = df_merged.groupby('region_name')['sales'].cumsum()

fig = px.bar(df_merged, x='region_name', y='cumulative_sales', color='product_category')
fig.write_html('interactive_dashboard.html')`,
    candidateAnswer: `[AX 기획팀 전사 데이터 기반 인터랙티브 시각화 대시보드 구축 리포트]

13-1. BI 도구의 이해와 데이터 연결
bi_fact_table.csv를 중앙 데이터 원본으로 연결하여 동적 대시보드 기반 마련.

13-2. 스타 스키마 (Star Schema) 관계 모델링
팩트 테이블과 디멘전 테이블(bi_dim_tables.xlsx)을 관계 맺어 쿼리 최적화 뼈대 완성.

13-3. 시각화 매핑 (Visual Mapping)
비교/추이/구성비 목적에 맞춘 차트 할당 및 인지적 visual hierarchy 구현.

13-4. DAX 및 LOD 표현식
Power BI DAX 함수 및 Tableau FIXED LOD 표현식 활용 고급 계산식 작성.

13-5. 상호작용 (Interactivity)
클릭 시 동적 필터/하이라이트/드릴다운 연동으로 스토리텔링 대시보드 완성.`,
    criteria: {
      problemDefinition: {
        id: 'crit-1',
        name: '1. 문제 정의 및 분석력',
        maxScore: 25,
        score: 24,
        grounds: ['스타 스키마 및 인터랙티브 대시보드 요구 분석 명확함.']
      },
      aiPrompting: {
        id: 'crit-2',
        name: '2. AI 활용 및 프롬프트 구성력',
        maxScore: 25,
        score: 23,
        grounds: ['Plotly, cumulative_sales, HTML 저장 지정.']
      },
      accuracy: {
        id: 'crit-3',
        name: '3. 답변의 정확성',
        maxScore: 25,
        score: 24,
        grounds: ['스타 스키마, DAX/LOD, 상호작용 개념 서술 정확함.']
      },
      structure: {
        id: 'crit-4',
        name: '4. 답변의 구조화',
        maxScore: 25,
        score: 24,
        grounds: ['Data Source -> Star Schema -> Mapping -> DAX/LOD -> Interactivity 전개.']
      }
    },
    totalScore: 95,
    grade: 'S',
    isPassed: true,
    overallFeedback: '김민재 응시자는 스타 스키마 데이터 모델링과 DAX/LOD 계산식, 상호작용 대시보드 구축 능력이 탁월함.',
    evaluatedAt: '2026-08-09 10:15'
  }
];

// Helper to recalculate total, grade, pass status
function updateCandidateCalculations(cand: CandidateEvaluation): CandidateEvaluation {
  const total =
    cand.criteria.problemDefinition.score +
    cand.criteria.aiPrompting.score +
    cand.criteria.accuracy.score +
    cand.criteria.structure.score;

  let grade: 'S' | 'A' | 'B' | 'C' | 'F' = 'F';
  if (total >= 95) grade = 'S';
  else if (total >= 90) grade = 'A';
  else if (total >= 80) grade = 'B';
  else if (total >= 70) grade = 'C';
  else grade = 'F';

  const isPassed = total >= 70;

  return {
    ...cand,
    totalScore: total,
    grade,
    isPassed
  };
}

// ==========================================
// 스파이더 차트 (Radar Chart) 컴포넌트
// ==========================================
interface SpiderChartProps {
  scores: {
    problemDefinition: number;
    aiPrompting: number;
    accuracy: number;
    structure: number;
  };
}

function SpiderChart({ scores }: SpiderChartProps) {
  const cx = 160;
  const cy = 130;
  const R = 80;

  const s0 = scores.problemDefinition;
  const s1 = scores.aiPrompting;
  const s2 = scores.accuracy;
  const s3 = scores.structure;

  // 25점 만점 기준 반지름 계산
  const r0 = (Math.min(25, Math.max(0, s0)) / 25) * R;
  const r1 = (Math.min(25, Math.max(0, s1)) / 25) * R;
  const r2 = (Math.min(25, Math.max(0, s2)) / 25) * R;
  const r3 = (Math.min(25, Math.max(0, s3)) / 25) * R;

  // 데이터 꼭짓점 좌표 (상, 우, 하, 좌)
  const p0 = { x: cx, y: cy - r0 };
  const p1 = { x: cx + r1, y: cy };
  const p2 = { x: cx, y: cy + r2 };
  const p3 = { x: cx - r3, y: cy };

  const dataPath = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;

  // 5단계 등고선 (5, 10, 15, 20, 25점)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-300">
      <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
        📊 평가 기준 별 득점 시각화 (스파이더 차트)
      </h4>
      <svg width="320" height="260" viewBox="0 0 320 260" className="max-w-full">
        {/* 등고선 다각형 (Diamond Grid) */}
        {levels.map((lvl, idx) => {
          const r = R * lvl;
          const points = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
          return (
            <g key={idx}>
              <polygon
                points={points}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth={lvl === 1.0 ? "1.5" : "1"}
                strokeDasharray={lvl === 1.0 ? "none" : "3,3"}
              />
              <text
                x={cx + 3}
                y={cy - r + 10}
                fontSize="8"
                fill="#64748b"
                fontWeight="500"
              >
                {Math.round(25 * lvl)}
              </text>
            </g>
          );
        })}

        {/* 축 축선 (Axis Lines) */}
        <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke="#94a3b8" strokeWidth="1" />
        <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="#94a3b8" strokeWidth="1" />
        <line x1={cx} y1={cy} x2={cx} y2={cy + R} stroke="#94a3b8" strokeWidth="1" />
        <line x1={cx} y1={cy} x2={cx - R} y2={cy} stroke="#94a3b8" strokeWidth="1" />

        {/* 취득 점수 채우기 다각형 (Filled Radar) */}
        <polygon
          points={dataPath}
          fill="rgba(79, 70, 229, 0.25)"
          stroke="#4f46e5"
          strokeWidth="2.5"
        />

        {/* 데이터 포인트 점 (Vertex Dots) */}
        <circle cx={p0.x} cy={p0.y} r="4" fill="#4f46e5" />
        <circle cx={p1.x} cy={p1.y} r="4" fill="#10b981" />
        <circle cx={p2.x} cy={p2.y} r="4" fill="#f59e0b" />
        <circle cx={p3.x} cy={p3.y} r="4" fill="#0284c7" />

        {/* 항목 라벨 & 취득 점수 표시 */}
        {/* Top: 문제 정의 및 분석력 */}
        <text x={cx} y={cy - R - 14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">
          1. 문제 정의 및 분석력
        </text>
        <text x={cx} y={cy - R - 3} textAnchor="middle" fontSize="10" fontWeight="extrabold" fill="#4f46e5">
          {s0} / 25점
        </text>

        {/* Right: AI 활용 및 프롬프트 */}
        <text x={cx + R + 10} y={cy - 5} textAnchor="start" fontSize="10" fontWeight="bold" fill="#1e293b">
          2. AI 활용 및 프롬프트
        </text>
        <text x={cx + R + 10} y={cy + 8} textAnchor="start" fontSize="10" fontWeight="extrabold" fill="#059669">
          {s1} / 25점
        </text>

        {/* Bottom: 답변의 정확성 */}
        <text x={cx} y={cy + R + 14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">
          3. 답변의 정확성
        </text>
        <text x={cx} y={cy + R + 25} textAnchor="middle" fontSize="10" fontWeight="extrabold" fill="#d97706">
          {s2} / 25점
        </text>

        {/* Left: 답변의 구조화 */}
        <text x={cx - R - 10} y={cy - 5} textAnchor="end" fontSize="10" fontWeight="bold" fill="#1e293b">
          4. 답변의 구조화
        </text>
        <text x={cx - R - 10} y={cy + 8} textAnchor="end" fontSize="10" fontWeight="extrabold" fill="#0284c7">
          {s3} / 25점
        </text>
      </svg>
    </div>
  );
}

// ==========================================
// 메인 App 컴포넌트
// ==========================================
export default function App() {
  const [candidates, setCandidates] = useState<CandidateEvaluation[]>(INITIAL_CANDIDATES_DATA);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  
  // 보완 모달 상태
  const [revisionModalState, setRevisionModalState] = useState<{
    isOpen: boolean;
    criterionKey: keyof CandidateEvaluation['criteria'] | null;
    criterionName: string;
    currentScore: number;
    message: string;
  }>({
    isOpen: false,
    criterionKey: null,
    criterionName: '',
    currentScore: 0,
    message: ''
  });

  // 성적서 팝업 모달 상태
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);

  // 피드백 이메일 발송 팝업 모달 상태
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);

  // 복사 알림 상태
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // 접속시 무작위 1명 자동 선정
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * INITIAL_CANDIDATES_DATA.length);
    setSelectedCandidateId(INITIAL_CANDIDATES_DATA[randomIndex].id);
  }, []);

  // 무작위 응시자 새로고침
  const handleRandomSelect = () => {
    const remaining = candidates.filter(c => c.id !== selectedCandidateId);
    if (remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      setSelectedCandidateId(remaining[randomIndex].id);
    }
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  // 보완 모달 열기
  const handleOpenRevisionModal = (key: keyof CandidateEvaluation['criteria']) => {
    if (!selectedCandidate) return;
    const item = selectedCandidate.criteria[key];
    setRevisionModalState({
      isOpen: true,
      criterionKey: key,
      criterionName: item.name,
      currentScore: item.score,
      message: item.revisionMessage || ''
    });
  };

  // 보완 저장 및 닫기
  const handleSaveRevision = () => {
    if (!revisionModalState.criterionKey || !selectedCandidate) return;

    setCandidates(prev =>
      prev.map(cand => {
        if (cand.id !== selectedCandidate.id) return cand;

        const key = revisionModalState.criterionKey!;
        const updatedCriteria = {
          ...cand.criteria,
          [key]: {
            ...cand.criteria[key],
            score: Math.min(25, Math.max(0, revisionModalState.currentScore)),
            revisionMessage: revisionModalState.message
          }
        };

        const tempCand = { ...cand, criteria: updatedCriteria };
        return updateCandidateCalculations(tempCand);
      })
    );

    setRevisionModalState({
      isOpen: false,
      criterionKey: null,
      criterionName: '',
      currentScore: 0,
      message: ''
    });
  };

  const handleCopy = (text: string, secName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(secName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (!selectedCandidate) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER AREA */}
        <header className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                AXAGE Verification System
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Award className="w-8 h-8 text-amber-400" />
              AI Agent 기반 AXAGE 문제해결 역량 평가
            </h1>
          </div>

          {/* TOP RANDOM CANDIDATE BUTTON */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRandomSelect}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 border border-indigo-400/30"
              title="클릭 시 13명 중 응시자가 무작위로 변경됩니다"
            >
              <RotateCw className="w-4 h-4 text-indigo-200" />
              <span>응시자 : {selectedCandidate.candidateName}</span>
            </button>
          </div>
        </header>

        {/* 2-COLUMN SECTION FOR CANDIDATE SUBMITTED ANSWERS & AI PROMPT/RESPONSE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* LEFT COLUMN: AI PROMPT & AI CODE ANSWER */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700">
                <h2 className="text-base font-bold text-sky-300 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-sky-400" />
                  <span>생성형 AI 프롬프트 및 답변 코드</span>
                </h2>
                <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
                  모듈 {selectedCandidate.moduleNumber}
                </span>
              </div>

              {/* Prompt Box */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    💬 입력된 프롬프트 (질의 내용)
                  </span>
                  <button
                    onClick={() => handleCopy(selectedCandidate.aiPrompt, 'prompt')}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
                  >
                    {copiedSection === 'prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'prompt' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-sans">
                  {selectedCandidate.aiPrompt}
                </div>
              </div>

              {/* AI Code Response Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Terminal className="w-4 h-4" /> Generative AI 생성 파이썬 코드
                  </span>
                  <button
                    onClick={() => handleCopy(selectedCandidate.aiAnswer, 'code')}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
                  >
                    {copiedSection === 'code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'code' ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="bg-black/80 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-60 overflow-y-auto leading-relaxed">
                  <code>{selectedCandidate.aiAnswer}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CANDIDATE SUBMITTED ANSWER & ATTACHMENTS */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700">
                <h2 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <span>{selectedCandidate.candidateName} 응시자 작성 답안 및 첨부파일</span>
                </h2>
                <button
                  onClick={() => handleCopy(selectedCandidate.candidateAnswer, 'candAnswer')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded border border-slate-700 cursor-pointer"
                >
                  {copiedSection === 'candAnswer' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'candAnswer' ? '복사됨' : '답안 복사'}</span>
                </button>
              </div>

              {/* Scenario Context & File Attachment */}
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 mb-4">
                <span className="text-[11px] font-bold text-indigo-300 block mb-1">
                  📌 출제 시나리오: {selectedCandidate.scenario.title}
                </span>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2">
                  {selectedCandidate.scenario.text}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Paperclip className="w-3 h-3 text-slate-400" /> 첨부파일:
                  </span>
                  {selectedCandidate.scenario.files.map((f, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono"
                    >
                      <Download className="w-3 h-3 text-indigo-400" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Candidate Written Report */}
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1.5">
                  📝 제출된 최종 분석 보고서 (직접 작성)
                </span>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {selectedCandidate.candidateAnswer}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* EVALUATION CRITERIA GRID WITH REVISION BUTTONS */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              기준 별 평가 결과
            </h2>
            <span className="text-xs text-slate-400">
              각 항목당 25점 만점 (총 100점) | 하단 보완 버튼으로 점수 및 의견 조정 가능
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 문제 정의 및 분석력 */}
            <div className="bg-slate-900/90 rounded-xl border border-indigo-500/30 p-4 flex flex-col justify-between hover:border-indigo-500/60 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-indigo-200">1. 문제 정의 및 분석력</h3>
                      <span className="text-[10px] text-slate-400">핵심 문제 도출 능력</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-700 font-extrabold text-sm rounded-lg">
                    {selectedCandidate.criteria.problemDefinition.score} / 25점
                  </span>
                </div>

                {/* Score bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${(selectedCandidate.criteria.problemDefinition.score / 25) * 100}%` }}
                  />
                </div>

                {/* Grounds */}
                <ul className="space-y-1.5 text-xs text-slate-300 mb-3">
                  {selectedCandidate.criteria.problemDefinition.grounds.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-slate-950 p-2 rounded border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>

                {/* Revision message note if exists */}
                {selectedCandidate.criteria.problemDefinition.revisionMessage && (
                  <div className="bg-amber-950/40 border border-amber-500/40 p-2 rounded text-[11px] text-amber-200 mb-3 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>보완 의견:</strong> {selectedCandidate.criteria.problemDefinition.revisionMessage}
                    </div>
                  </div>
                )}
              </div>

              {/* REVISION BUTTON */}
              <button
                onClick={() => handleOpenRevisionModal('problemDefinition')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>문제 정의 및 분석력 보완</span>
              </button>
            </div>

            {/* AI 활용 및 프롬프트 구성력 */}
            <div className="bg-slate-900/90 rounded-xl border border-emerald-500/30 p-4 flex flex-col justify-between hover:border-emerald-500/60 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-emerald-200">2. AI 활용 및 프롬프트 구성력</h3>
                      <span className="text-[10px] text-slate-400">구체적/논리적 질의 구성</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 font-extrabold text-sm rounded-lg">
                    {selectedCandidate.criteria.aiPrompting.score} / 25점
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${(selectedCandidate.criteria.aiPrompting.score / 25) * 100}%` }}
                  />
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 mb-3">
                  {selectedCandidate.criteria.aiPrompting.grounds.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-slate-950 p-2 rounded border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>

                {selectedCandidate.criteria.aiPrompting.revisionMessage && (
                  <div className="bg-amber-950/40 border border-amber-500/40 p-2 rounded text-[11px] text-amber-200 mb-3 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>보완 의견:</strong> {selectedCandidate.criteria.aiPrompting.revisionMessage}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenRevisionModal('aiPrompting')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white text-xs font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>AI 활용 및 프롬프트 보완</span>
              </button>
            </div>

            {/* 답변의 정확성 */}
            <div className="bg-slate-900/90 rounded-xl border border-amber-500/30 p-4 flex flex-col justify-between hover:border-amber-500/60 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-amber-200">3. 답변의 정확성</h3>
                      <span className="text-[10px] text-slate-400">핵심 키워드 반영 여부</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-700 font-extrabold text-sm rounded-lg">
                    {selectedCandidate.criteria.accuracy.score} / 25점
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${(selectedCandidate.criteria.accuracy.score / 25) * 100}%` }}
                  />
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 mb-3">
                  {selectedCandidate.criteria.accuracy.grounds.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-slate-950 p-2 rounded border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>

                {selectedCandidate.criteria.accuracy.revisionMessage && (
                  <div className="bg-amber-950/40 border border-amber-500/40 p-2 rounded text-[11px] text-amber-200 mb-3 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>보완 의견:</strong> {selectedCandidate.criteria.accuracy.revisionMessage}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenRevisionModal('accuracy')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white text-xs font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>답변의 정확성 보완</span>
              </button>
            </div>

            {/* 답변의 구조화 */}
            <div className="bg-slate-900/90 rounded-xl border border-sky-500/30 p-4 flex flex-col justify-between hover:border-sky-500/60 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-sky-200">4. 답변의 구조화</h3>
                      <span className="text-[10px] text-slate-400">출제 의도 부합 재구성</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-700 font-extrabold text-sm rounded-lg">
                    {selectedCandidate.criteria.structure.score} / 25점
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${(selectedCandidate.criteria.structure.score / 25) * 100}%` }}
                  />
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 mb-3">
                  {selectedCandidate.criteria.structure.grounds.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-slate-950 p-2 rounded border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>

                {selectedCandidate.criteria.structure.revisionMessage && (
                  <div className="bg-amber-950/40 border border-amber-500/40 p-2 rounded text-[11px] text-amber-200 mb-3 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>보완 의견:</strong> {selectedCandidate.criteria.structure.revisionMessage}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleOpenRevisionModal('structure')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>답변의 구조화 보완</span>
              </button>
            </div>

          </div>
        </div>

        {/* BOTTOM TOTAL EVALUATION SUMMARY BOX */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-slate-700">

            {/* TOTAL SCORE & GRADE & PASS STATUS */}
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-950 p-0.5 shadow-lg border border-indigo-400/30 flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[10px] font-bold text-indigo-300 tracking-wider">TOTAL SCORE</span>
                <span className="text-3xl font-black text-amber-300 tracking-tight leading-none mt-1">
                  {selectedCandidate.totalScore}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">/ 100점</span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    최종 평가 결과
                  </span>
                  
                  {/* PASS / FAIL BADGE (70점 기준) */}
                  {selectedCandidate.isPassed ? (
                    <span className="text-xs font-extrabold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      합격 (Passed)
                    </span>
                  ) : (
                    <span className="text-xs font-extrabold text-red-300 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      불합격 (Failed)
                    </span>
                  )}

                  {/* GRADE BADGE (S:>=95, A:>=90, B:>=80, C:>=70, F:<70) */}
                  <span className="text-xs font-black text-white bg-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-400 shadow-sm">
                    {selectedCandidate.grade} 등급
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {selectedCandidate.candidateName} 응시자 — 모듈 {selectedCandidate.moduleNumber} 종합 성적 결과
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  평가 일시: {selectedCandidate.evaluatedAt} | 검증 시나리오: {selectedCandidate.scenario.title}
                </p>
              </div>
            </div>

            {/* BREAKDOWN MINI VISUALIZER */}
            <div className="flex-1 max-w-md bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  항목별 점수 취합 비율
                </span>
                <span className="text-amber-300 font-bold">{selectedCandidate.totalScore}점 (100점 만점)</span>
              </div>

              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 p-0.5 gap-0.5 mb-2">
                <div
                  title={`문제정의: ${selectedCandidate.criteria.problemDefinition.score}점`}
                  className="h-full bg-indigo-500 rounded-l-full"
                  style={{ width: `${(selectedCandidate.criteria.problemDefinition.score / 100) * 100}%` }}
                />
                <div
                  title={`AI프롬프트: ${selectedCandidate.criteria.aiPrompting.score}점`}
                  className="h-full bg-emerald-500"
                  style={{ width: `${(selectedCandidate.criteria.aiPrompting.score / 100) * 100}%` }}
                />
                <div
                  title={`답변정확성: ${selectedCandidate.criteria.accuracy.score}점`}
                  className="h-full bg-amber-500"
                  style={{ width: `${(selectedCandidate.criteria.accuracy.score / 100) * 100}%` }}
                />
                <div
                  title={`답변구조화: ${selectedCandidate.criteria.structure.score}점`}
                  className="h-full bg-sky-500 rounded-r-full"
                  style={{ width: `${(selectedCandidate.criteria.structure.score / 100) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                <div>• 문제정의: <strong className="text-slate-200">{selectedCandidate.criteria.problemDefinition.score}점</strong></div>
                <div>• AI프롬프트: <strong className="text-slate-200">{selectedCandidate.criteria.aiPrompting.score}점</strong></div>
                <div>• 답변정확성: <strong className="text-slate-200">{selectedCandidate.criteria.accuracy.score}점</strong></div>
                <div>• 답변구조화: <strong className="text-slate-200">{selectedCandidate.criteria.structure.score}점</strong></div>
              </div>
            </div>

            {/* SAVE & PRINT CERTIFICATE POPUP BUTTON */}
            <div className="shrink-0">
              <button
                onClick={() => setIsCertificateModalOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 border border-white/20"
              >
                <FileCheck className="w-5 h-5 text-amber-300" />
                <span>평가결과 저장 및 성적서 발급</span>
              </button>
            </div>

          </div>

          {/* OVERALL FEEDBACK */}
          <div className="flex items-start gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-0.5">종합 평가 총평</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedCandidate.overallFeedback}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ==========================================
          REVISION POPUP MODAL (보완 팝업창)
         ========================================== */}
      {revisionModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 text-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="font-bold text-base flex items-center gap-2 text-indigo-300">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <span>[{revisionModalState.criterionName}] 채점 보완</span>
              </h3>
              <button
                onClick={() => setRevisionModalState({ isOpen: false, criterionKey: null, criterionName: '', currentScore: 0, message: '' })}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Score Adjuster */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  채점 점수 조정 (0 ~ 25점 만점)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={revisionModalState.currentScore}
                    onChange={(e) => setRevisionModalState({ ...revisionModalState, currentScore: parseInt(e.target.value) || 0 })}
                    className="flex-1 accent-indigo-500 cursor-pointer"
                  />
                  <div className="w-16 text-center bg-slate-800 py-1.5 rounded-lg border border-slate-700 font-mono font-bold text-base text-amber-300">
                    {revisionModalState.currentScore} 점
                  </div>
                </div>
              </div>

              {/* Revision Message Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  보완 의견 및 사유 입력
                </label>
                <textarea
                  rows={4}
                  value={revisionModalState.message}
                  onChange={(e) => setRevisionModalState({ ...revisionModalState, message: e.target.value })}
                  placeholder="점수 조정 사유 및 추가 보완 지시사항을 작성해 주세요..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
              <button
                onClick={() => setRevisionModalState({ isOpen: false, criterionKey: null, criterionName: '', currentScore: 0, message: '' })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSaveRevision}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                저장 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          CERTIFICATE POPUP MODAL (성적서 발급 팝업)
         ========================================== */}
      {isCertificateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">
                  AXAGE 문제해결 역량 검증 성적서 발급
                </h3>
              </div>
              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Certificate Document Body */}
            <div className="p-6 overflow-y-auto bg-white text-slate-900 font-sans leading-relaxed space-y-6 printable-area">
              
              {/* Certificate Border Header */}
              <div className="text-center border-b-2 border-slate-900 pb-5">
                <div className="text-xs font-bold text-indigo-800 tracking-widest uppercase mb-1">
                  KOLON INDUSTRIES AX INNOVATION CENTER
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  AI Agent 기반 AXAGE 문제해결 역량 검증 성적서
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  발급 번호: KOLON-AXAGE-2026-0809-{selectedCandidate.moduleNumber}
                </p>
              </div>

              {/* Candidate Info Table & Spider Chart */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-300 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">성 명: </span>
                    <strong className="text-sm font-bold text-slate-900">{selectedCandidate.candidateName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">검증 모듈: </span>
                    <strong className="text-sm font-bold text-slate-900">{selectedCandidate.scenario.title}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">평가 일시: </span>
                    <span className="font-semibold text-slate-800">{selectedCandidate.evaluatedAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">최종 판정: </span>
                    <strong className={selectedCandidate.isPassed ? "text-emerald-700 font-black" : "text-red-700 font-black"}>
                      {selectedCandidate.isPassed ? "합격 (PASSED)" : "불합격 (FAILED)"} ({selectedCandidate.grade} 등급)
                    </strong>
                  </div>
                </div>

                <div className="md:col-span-1 flex justify-center">
                  <SpiderChart
                    scores={{
                      problemDefinition: selectedCandidate.criteria.problemDefinition.score,
                      aiPrompting: selectedCandidate.criteria.aiPrompting.score,
                      accuracy: selectedCandidate.criteria.accuracy.score,
                      structure: selectedCandidate.criteria.structure.score
                    }}
                  />
                </div>
              </div>

              {/* 4 Evaluation Criteria Scores Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 border-l-4 border-indigo-600 pl-2">
                  1. 세부 평가 기준별 득점 내역
                </h4>
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className="border border-slate-300 p-2 font-bold">평가 항목</th>
                      <th className="border border-slate-300 p-2 font-bold text-center">배점</th>
                      <th className="border border-slate-300 p-2 font-bold text-center">취득 점수</th>
                      <th className="border border-slate-300 p-2 font-bold">평가 내용 및 근거</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold">1. 문제 정의 및 분석력</td>
                      <td className="border border-slate-300 p-2 text-center">25점</td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-indigo-700">{selectedCandidate.criteria.problemDefinition.score}점</td>
                      <td className="border border-slate-300 p-2 text-[11px] text-slate-700">{selectedCandidate.criteria.problemDefinition.grounds[0]}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold">2. AI 활용 및 프롬프트</td>
                      <td className="border border-slate-300 p-2 text-center">25점</td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">{selectedCandidate.criteria.aiPrompting.score}점</td>
                      <td className="border border-slate-300 p-2 text-[11px] text-slate-700">{selectedCandidate.criteria.aiPrompting.grounds[0]}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold">3. 답변의 정확성</td>
                      <td className="border border-slate-300 p-2 text-center">25점</td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-amber-700">{selectedCandidate.criteria.accuracy.score}점</td>
                      <td className="border border-slate-300 p-2 text-[11px] text-slate-700">{selectedCandidate.criteria.accuracy.grounds[0]}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold">4. 답변의 구조화</td>
                      <td className="border border-slate-300 p-2 text-center">25점</td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-sky-700">{selectedCandidate.criteria.structure.score}점</td>
                      <td className="border border-slate-300 p-2 text-[11px] text-slate-700">{selectedCandidate.criteria.structure.grounds[0]}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold">
                    <tr>
                      <td className="border border-slate-300 p-2 text-slate-900">총 점</td>
                      <td className="border border-slate-300 p-2 text-center">100점</td>
                      <td className="border border-slate-300 p-2 text-center text-sm font-black text-indigo-900">{selectedCandidate.totalScore}점</td>
                      <td className="border border-slate-300 p-2 text-slate-900">
                        등급: {selectedCandidate.grade} | {selectedCandidate.isPassed ? "합격 (70점 이상)" : "불합격 (70점 미만)"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Comprehensive Assessment */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1 border-l-4 border-indigo-600 pl-2">
                  2. 종합 평가 의견
                </h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 text-xs text-slate-800 leading-relaxed">
                  {selectedCandidate.overallFeedback}
                </div>
              </div>

              {/* Official Issuer Signature Box */}
              <div className="text-center pt-6 border-t border-slate-300">
                <p className="text-xs font-medium text-slate-600 mb-3">
                  위 사람은 코오롱인더스트리 AXAGE 과정의 성과 검증 기준에 따라 위와 같이 평가결과를 입증함.
                </p>
                <div className="text-lg font-black tracking-tight text-slate-900 flex items-center justify-center gap-3">
                  <span>코오롱인더스트리 AX Innovation 센터장</span>
                  <span className="text-xs text-red-600 border border-red-600 px-1.5 py-0.5 rounded font-serif font-normal">
                    (직인생략)
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer with Print Button & Feedback Dispatch Button */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-400">
                성적서를 출력하거나 응시자에게 피드백 메일을 발송할 수 있습니다.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  닫기
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>성적서 인쇄 / PDF 저장</span>
                </button>
                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 border border-emerald-400/30 transition-all"
                >
                  <Mail className="w-4 h-4 text-emerald-100" />
                  <span>피드백 발송하기</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          FEEDBACK EMAIL POPUP MODAL (피드백 발송 팝업)
         ========================================== */}
      <FeedbackEmailModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        candidate={selectedCandidate}
      />

    </div>
  );
}

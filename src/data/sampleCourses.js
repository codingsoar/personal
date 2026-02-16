// 샘플 과목 데이터 - 교사가 LXP에서 추가/수정 가능
export const sampleCourses = [
    {
        id: 'course-1',
        title: '건축 도면 해석과 제도',
        description: '건축 도면의 기본부터 작도까지',
        icon: '📐',
        theme: {
            primaryColor: '#3F72AF',
            accentColor: '#DBE2EF',
            bgPattern: 'blueprint',
        },
        stages: [
            {
                id: 'c1-stage-1',
                courseId: 'course-1',
                title: '건축 도면의 기본',
                description: '건축 도면에 사용되는 기본 기호와 표기법을 학습합니다.',
                order: 1,
                missions: {
                    easy: {
                        id: 'c1-s1-easy',
                        type: 'video',
                        title: '기본 기호와 표기법',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        quizQuestions: [
                            { id: 'q1', question: '건축 도면에서 벽체를 나타내는 선의 종류는?', options: ['실선', '점선', '일점쇄선', '파선'], answer: 0 },
                            { id: 'q2', question: '축척 1:100의 의미는?', options: ['실제 크기의 100배', '실제 크기의 1/100', '100mm를 1mm로', '1mm를 100mm로'], answer: 1 },
                            { id: 'q3', question: '평면도에서 창문을 표시하는 기호는?', options: ['세 줄 평행선', '단일 실선', '이중선에 호', '점선'], answer: 2 },
                        ],
                    },
                    normal: {
                        id: 'c1-s1-normal',
                        type: 'tutorial',
                        title: '제도 용구 사용법',
                        tutorialSteps: [
                            { step: 1, title: '제도판 준비', description: 'T자와 삼각자를 제도판에 올려놓으세요.', image: '📏' },
                            { step: 2, title: '용지 고정', description: '도면 용지를 테이프로 제도판에 고정합니다.', image: '📋' },
                            { step: 3, title: '기본선 긋기', description: 'T자를 이용해 수평선을 그어보세요.', image: '✏️' },
                            { step: 4, title: '수직선 긋기', description: '삼각자를 T자에 맞대고 수직선을 그어보세요.', image: '📐' },
                            { step: 5, title: '완료!', description: '기본 제도 도구 사용법을 익혔습니다! 🎉', image: '⭐' },
                        ],
                    },
                    hard: {
                        id: 'c1-s1-hard',
                        type: 'practice',
                        title: '기본 도면 기호 그리기',
                        taskDescription: '아래 도면 기호들을 A4 용지에 정확하게 작도하여 사진으로 제출하세요.\n\n📋 과제 내용:\n1. 벽체 기호 (실선, 이중선)\n2. 창문 기호 (호 포함)\n3. 문 기호 (90도 호)\n4. 기둥 기호 (채워진 사각형)\n\n⚠️ 주의사항:\n- 축척에 맞게 작도할 것\n- 선의 굵기를 구분할 것',
                        requiredFileTypes: ['.jpg', '.png', '.pdf'],
                    },
                },
            },
            {
                id: 'c1-stage-2',
                courseId: 'course-1',
                title: '평면도 이해',
                description: '건축 평면도를 읽고 이해하는 방법을 학습합니다.',
                order: 2,
                missions: {
                    easy: {
                        id: 'c1-s2-easy',
                        type: 'video',
                        title: '평면도 읽는 법',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        quizQuestions: [
                            { id: 'q1', question: '평면도에서 절단면의 높이는 보통 몇 m인가?', options: ['0.5m', '1.0m', '1.2m', '1.5m'], answer: 2 },
                            { id: 'q2', question: '평면도에서 점선으로 표시되는 것은?', options: ['벽체', '보이는 선', '숨은 선', '중심선'], answer: 2 },
                            { id: 'q3', question: '동선이란?', options: ['동쪽 방향선', '사람의 이동 경로', '전기 배선', '배수 방향'], answer: 1 },
                        ],
                    },
                    normal: {
                        id: 'c1-s2-normal',
                        type: 'tutorial',
                        title: '간단한 방 평면 그리기',
                        tutorialSteps: [
                            { step: 1, title: '외벽 그리기', description: '4m x 3m 크기의 직사각형 외벽을 그립니다.', image: '🏗️' },
                            { step: 2, title: '벽 두께 표현', description: '외벽의 두께를 200mm로 이중선으로 표현합니다.', image: '📏' },
                            { step: 3, title: '출입문 배치', description: '남쪽 벽에 900mm 폭의 출입문을 배치합니다.', image: '🚪' },
                            { step: 4, title: '창문 배치', description: '동쪽 벽에 1200mm 폭의 창문을 배치합니다.', image: '🪟' },
                            { step: 5, title: '치수선 기입', description: '각 벽의 길이를 치수선으로 표시합니다.', image: '📐' },
                            { step: 6, title: '완료!', description: '간단한 방 평면도를 완성했습니다! 🎉', image: '⭐' },
                        ],
                    },
                    hard: {
                        id: 'c1-s2-hard',
                        type: 'practice',
                        title: '원룸 평면도 작도',
                        taskDescription: '원룸 아파트의 평면도를 작도하여 제출하세요.\n\n📋 과제 내용:\n1. 전체 크기: 6m x 4m\n2. 현관 / 거실 / 주방 / 욕실 구분\n3. 출입문 2개 이상\n4. 창문 2개 이상\n5. 치수선 기입\n\n⚠️ 축척: 1:50',
                        requiredFileTypes: ['.jpg', '.png', '.pdf', '.dwg'],
                    },
                },
            },
            {
                id: 'c1-stage-3',
                courseId: 'course-1',
                title: '입면도와 단면도',
                description: '건물의 외관(입면)과 내부 구조(단면)를 표현하는 방법을 학습합니다.',
                order: 3,
                missions: {
                    easy: {
                        id: 'c1-s3-easy',
                        type: 'video',
                        title: '입면도·단면도 원리',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        quizQuestions: [
                            { id: 'q1', question: '입면도는 건물의 어느 부분을 표현하나?', options: ['내부 구조', '외관', '지붕만', '기초만'], answer: 1 },
                            { id: 'q2', question: '단면도의 절단 방향을 나타내는 선은?', options: ['실선', '파선', '절단선(일점쇄선)', '중심선'], answer: 2 },
                            { id: 'q3', question: 'GL은 무엇의 약자인가?', options: ['Glass Line', 'Ground Level', 'Grid Line', 'Grade Level'], answer: 1 },
                        ],
                    },
                    normal: {
                        id: 'c1-s3-normal',
                        type: 'tutorial',
                        title: '입면도 분석하기',
                        tutorialSteps: [
                            { step: 1, title: '방향 확인', description: '정면도(남쪽 입면)를 기준으로 분석을 시작합니다.', image: '🧭' },
                            { step: 2, title: 'GL 확인', description: '지반선(GL)의 위치를 확인하고 기준으로 삼습니다.', image: '📏' },
                            { step: 3, title: '층고 확인', description: '각 층의 높이(층고)를 치수에서 읽어봅니다.', image: '📐' },
                            { step: 4, title: '마감재 파악', description: '외벽 마감재의 종류(벽돌, 타일 등)를 파악합니다.', image: '🧱' },
                            { step: 5, title: '완료!', description: '입면도를 분석하는 방법을 익혔습니다! 🎉', image: '⭐' },
                        ],
                    },
                    hard: {
                        id: 'c1-s3-hard',
                        type: 'practice',
                        title: '입면도 작도',
                        taskDescription: '2층 건물의 정면 입면도를 작도하여 제출하세요.\n\n📋 과제 내용:\n1. 2층 규모 건물\n2. GL, 1FL, 2FL, 지붕 높이 표시\n3. 창문 및 출입문 표현\n4. 외벽 마감 패턴\n5. 치수선 기입\n\n⚠️ 축척: 1:100',
                        requiredFileTypes: ['.jpg', '.png', '.pdf', '.dwg'],
                    },
                },
            },
        ],
    },
    {
        id: 'course-2',
        title: '건축캐드',
        description: 'CAD를 활용한 건축 도면 작성',
        icon: '🖥️',
        theme: {
            primaryColor: '#3F72AF',
            accentColor: '#DBE2EF',
            bgPattern: 'blueprint',
        },
        stages: [
            {
                id: 'c2-stage-1',
                courseId: 'course-2',
                title: 'CAD 기초',
                description: 'CAD 프로그램의 기본 인터페이스와 명령어를 학습합니다.',
                order: 1,
                missions: {
                    easy: {
                        id: 'c2-s1-easy',
                        type: 'video',
                        title: 'CAD 인터페이스 소개',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        quizQuestions: [
                            { id: 'q1', question: 'CAD의 기본 화면 구성 요소가 아닌 것은?', options: ['명령행', '도구막대', '도면 영역', '웹 브라우저'], answer: 3 },
                            { id: 'q2', question: 'LINE 명령의 단축키는?', options: ['L', 'LI', 'LN', 'LE'], answer: 0 },
                            { id: 'q3', question: '좌표 입력 시 "@"의 의미는?', options: ['절대좌표', '상대좌표', '극좌표', '없음'], answer: 1 },
                        ],
                    },
                    normal: {
                        id: 'c2-s1-normal',
                        type: 'tutorial',
                        title: '기본 명령어 익히기',
                        tutorialSteps: [
                            { step: 1, title: 'LINE 명령', description: 'L을 입력하고 Enter, 시작점 클릭 후 끝점을 클릭하세요.', image: '📏' },
                            { step: 2, title: 'CIRCLE 명령', description: 'C를 입력하고 Enter, 중심점 클릭 후 반지름을 입력하세요.', image: '⭕' },
                            { step: 3, title: 'RECTANGLE 명령', description: 'REC를 입력하고 Enter, 두 꼭지점을 클릭하세요.', image: '⬜' },
                            { step: 4, title: 'ERASE 명령', description: 'E를 입력하고 삭제할 객체를 선택 후 Enter.', image: '🗑️' },
                            { step: 5, title: '완료!', description: '기본 CAD 명령어를 익혔습니다! 🎉', image: '⭐' },
                        ],
                    },
                    hard: {
                        id: 'c2-s1-hard',
                        type: 'practice',
                        title: '선과 원 그리기 과제',
                        taskDescription: 'CAD로 다음 도형을 그려 DWG 파일로 제출하세요.\n\n📋 과제 내용:\n1. 가로 100mm, 세로 50mm 직사각형\n2. 반지름 25mm 원 (직사각형 중앙)\n3. 대각선 2개\n\n⚠️ 정확한 치수를 입력하세요.',
                        requiredFileTypes: ['.dwg', '.dxf', '.pdf'],
                    },
                },
            },
            {
                id: 'c2-stage-2',
                courseId: 'course-2',
                title: '벽체 작도',
                description: 'CAD로 건축 벽체를 작도하는 방법을 학습합니다.',
                order: 2,
                missions: {
                    easy: {
                        id: 'c2-s2-easy',
                        type: 'video',
                        title: '벽체 그리기 원리',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        quizQuestions: [
                            { id: 'q1', question: '일반적인 내벽의 두께는?', options: ['100mm', '150mm', '200mm', '300mm'], answer: 1 },
                            { id: 'q2', question: 'OFFSET 명령의 용도는?', options: ['객체 삭제', '평행 복사', '회전', '크기 변경'], answer: 1 },
                            { id: 'q3', question: '벽체의 중심선을 그릴 때 사용하는 선종류는?', options: ['실선', '점선', '일점쇄선', '이점쇄선'], answer: 2 },
                        ],
                    },
                    normal: {
                        id: 'c2-s2-normal',
                        type: 'tutorial',
                        title: '벽체 그리기 따라하기',
                        tutorialSteps: [
                            { step: 1, title: '중심선 그리기', description: '일점쇄선 레이어에서 벽의 중심선을 먼저 그립니다.', image: '📏' },
                            { step: 2, title: 'OFFSET으로 벽 두께', description: 'OFFSET 75mm로 중심선 양쪽에 외곽선을 만듭니다.', image: '↔️' },
                            { step: 3, title: '모서리 처리', description: 'FILLET 또는 TRIM으로 벽 교차 부분을 정리합니다.', image: '✂️' },
                            { step: 4, title: '해칭', description: '벽체 내부를 콘크리트 해칭 패턴으로 채웁니다.', image: '🧱' },
                            { step: 5, title: '완료!', description: 'CAD로 벽체를 작도하는 법을 배웠습니다! 🎉', image: '⭐' },
                        ],
                    },
                    hard: {
                        id: 'c2-s2-hard',
                        type: 'practice',
                        title: '벽체 도면 제출',
                        taskDescription: '4m x 5m 방의 벽체를 CAD로 작도하여 제출하세요.\n\n📋 과제 내용:\n1. 외벽 두께 200mm\n2. 내벽 두께 150mm\n3. 중심선 포함\n4. 적절한 레이어 구분\n\n⚠️ 축척: 1:50',
                        requiredFileTypes: ['.dwg', '.dxf', '.pdf'],
                    },
                },
            },
            {
                id: 'c2-stage-3',
                courseId: 'course-2',
                title: '창호 배치',
                description: 'CAD로 창문과 문을 배치하는 방법을 학습합니다.',
                order: 3,
                missions: {
                    easy: {
                        id: 'c2-s3-easy',
                        type: 'video',
                        title: '창호 기호와 규격',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        quizQuestions: [
                            { id: 'q1', question: '평면도에서 문의 개폐 방향을 나타내는 것은?', options: ['직선', '호(arc)', '점선', '화살표'], answer: 1 },
                            { id: 'q2', question: '미서기창의 표현 방법은?', options: ['단선에 호', '이중선에 호', '이중선에 화살표', '이중선'], answer: 3 },
                            { id: 'q3', question: '창호 규격 "W1200 x H1500"에서 W는?', options: ['벽(Wall)', '너비(Width)', '무게(Weight)', '재질(Wood)'], answer: 1 },
                        ],
                    },
                    normal: {
                        id: 'c2-s3-normal',
                        type: 'tutorial',
                        title: '창호 삽입 따라하기',
                        tutorialSteps: [
                            { step: 1, title: '벽 열기', description: 'BREAK 명령으로 창호 위치의 벽을 잘라냅니다.', image: '✂️' },
                            { step: 2, title: '문 그리기', description: '900mm 폭의 여닫이문을 그리고 호로 개폐방향을 표시합니다.', image: '🚪' },
                            { step: 3, title: '창 그리기', description: '1200mm 폭의 미서기창을 이중선으로 그립니다.', image: '🪟' },
                            { step: 4, title: '기호 정리', description: '창호 번호와 규격을 도면에 표기합니다.', image: '🏷️' },
                            { step: 5, title: '완료!', description: 'CAD에서 창호를 배치하는 법을 배웠습니다! 🎉', image: '⭐' },
                        ],
                    },
                    hard: {
                        id: 'c2-s3-hard',
                        type: 'practice',
                        title: '창호 배치 과제',
                        taskDescription: '벽체가 완성된 도면에 창호를 배치하여 제출하세요.\n\n📋 과제 내용:\n1. 여닫이문 2개소\n2. 미서기창 3개소\n3. 창호 번호 표기\n4. 창호 일람표 작성\n\n⚠️ 규격에 맞게 정확히 그릴 것',
                        requiredFileTypes: ['.dwg', '.dxf', '.pdf'],
                    },
                },
            },
        ],
    },
];

// 기본 테마 프리셋
export const themePresets = {
    blueprint: { name: '건축 블루프린트', primaryColor: '#3F72AF', accentColor: '#DBE2EF', bgPattern: 'blueprint' },
    circuit: { name: '전기·전자', primaryColor: '#112D4E', accentColor: '#3F72AF', bgPattern: 'circuit' },
    mechanical: { name: '기계', primaryColor: '#112D4E', accentColor: '#DBE2EF', bgPattern: 'mechanical' },
    minimal: { name: '미니멀', primaryColor: '#112D4E', accentColor: '#F9F7F7', bgPattern: 'minimal' },
};

// 기본 학생 데이터
export const defaultStudents = [
    { studentId: '20101', name: '김민수' },
    { studentId: '20102', name: '이서연' },
    { studentId: '20103', name: '박지호' },
    { studentId: '20104', name: '최유진' },
    { studentId: '20105', name: '정하늘' },
];

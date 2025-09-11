// Test data cho form đăng ký học tiếng Nhật
// Test data for Japanese language school application form

export const testData = {
  // Thông tin cá nhân / Personal Information
  lastNameRomaji: "Tanaka",
  firstNameRomaji: "Yuki",
  lastNameKanji: "田中",
  firstNameKanji: "由紀",
  nationality: "Vietnamese / ベトナム人",
  gender: "Female",
  maritalStatus: "Single",
  course: "Japanese Language Course / 日本語コース",
  dob: "1995-03-15",
  age: 29,
  permanentAddress: "123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam\n123 グエン・フエ通り、1区、ホーチミン市、ベトナム",
  currentAddress: "456 Le Loi Street, District 3, Ho Chi Minh City, Vietnam\n456 レ・ロイ通り、3区、ホーチミン市、ベトナム",
  phone: "+84-90-123-4567",
  email: "yuki.tanaka@example.com",
  
  // Thông tin hộ chiếu / Passport Information
  passportNumber: "N1234567",
  passportIssueDate: "2020-01-15",
  passportIssuePlace: "Ho Chi Minh City, Vietnam",
  passportExpirationDate: "2030-01-15",
  occupation: "Student / 学生",
  
  // Lịch sử COE / COE History
  coeHistory: {
    yesNo: "No",
    count: 0,
    deniedCount: 0
  },
  
  // Lịch sử đến Nhật / Visits to Japan
  visits: {
    yesNo: "Yes",
    count: 2,
    recent: "2023/06 to 2023/08"
  },
  
  // Học vấn / Education
  education: [
    {
      label: "Elementary School",
      startYm: "2001/04",
      endYm: "2007/03",
      yearsAttended: "6 years",
      location: "Ho Chi Minh City, Vietnam"
    },
    {
      label: "Middle School",
      startYm: "2007/04",
      endYm: "2010/03",
      yearsAttended: "3 years",
      location: "Ho Chi Minh City, Vietnam"
    },
    {
      label: "High School",
      startYm: "2010/04",
      endYm: "2013/03",
      yearsAttended: "3 years",
      location: "Ho Chi Minh City, Vietnam"
    },
    {
      label: "University",
      startYm: "2013/09",
      endYm: "2017/06",
      yearsAttended: "4 years",
      location: "Ho Chi Minh City, Vietnam"
    }
  ],
  lastSchoolSummary: "Bachelor of Business Administration, University of Economics Ho Chi Minh City",
  lastSchoolCategory: "University",
  yearsFromElementary: 16,
  
  // Kinh nghiệm làm việc / Employment
  employmentYesNo: "Yes",
  employment: [
    {
      label: "Marketing Assistant",
      startYm: "2017/07",
      endYm: "2019/12",
      jobTitle: "Marketing Assistant",
      location: "Ho Chi Minh City, Vietnam"
    },
    {
      label: "Sales Representative",
      startYm: "2020/01",
      endYm: "2022/06",
      jobTitle: "Sales Representative",
      location: "Ho Chi Minh City, Vietnam"
    }
  ],
  
  // Học tiếng Nhật / Japanese Learning
  hasStudiedAtLanguageSchool: "Yes",
  jpLearningHours: 480,
  jpSchools: [
    {
      label: "Sakura Japanese Language School",
      startYm: "2022/07",
      endYm: "2023/06"
    },
    {
      label: "Tokyo Japanese Academy",
      startYm: "2023/09",
      endYm: "2024/03"
    }
  ],
  
  // Năng lực tiếng Nhật / Japanese Proficiency
  proficiency: [
    {
      label: "JLPT",
      year: "2023",
      level: "N3",
      score: "145/180",
      result: "Passed"
    },
    {
      label: "J.Test",
      year: "2023",
      level: "C",
      score: "650/1000",
      result: "Passed"
    },
    {
      label: "JPT",
      year: "2024",
      level: "Level 3",
      score: "720/990",
      result: "Passed"
    },
    {
      label: "NAT",
      year: "2024",
      level: "Level 3",
      score: "85/100",
      result: "Passed"
    },
    {
      label: "Others",
      year: "",
      level: "",
      score: "",
      result: ""
    }
  ],
  otherProficiencyNote: "TOPIK Level 3 (Korean Language Test) - 2022",
  
  // Người bảo trợ tài chính / Financial Sponsor
  sponsor: {
    fullName: "Tanaka Ichiro / 田中一郎",
    relationship: "Father / 父",
    currentAddress: "789 Tran Hung Dao Street, District 5, Ho Chi Minh City, Vietnam\n789 チャン・フン・ダオ通り、5区、ホーチミン市、ベトナム",
    email: "ichiro.tanaka@example.com",
    phone: "+84-90-987-6543",
    company: "Tanaka Trading Co., Ltd. / 田中貿易株式会社",
    position: "General Manager / 総支配人",
    workAddress: "101 Nguyen Trai Street, District 1, Ho Chi Minh City, Vietnam",
    workPhone: "+84-28-1234-5678",
    annualIncomeJpy: 8000000,
    exchangeRate: 150
  },
  
  // Gia đình / Family
  family: [
    {
      relation: "Father / 父",
      name: "Tanaka Ichiro / 田中一郎",
      dob: "1965/05/20",
      nationality: "Vietnamese / ベトナム人",
      occupation: "Business Owner / 経営者",
      address: "789 Tran Hung Dao Street, District 5, Ho Chi Minh City, Vietnam"
    },
    {
      relation: "Mother / 母",
      name: "Tanaka Hanako / 田中花子",
      dob: "1970/08/15",
      nationality: "Vietnamese / ベトナム人",
      occupation: "Housewife / 主婦",
      address: "789 Tran Hung Dao Street, District 5, Ho Chi Minh City, Vietnam"
    },
    {
      relation: "Brother / 兄",
      name: "Tanaka Taro / 田中太郎",
      dob: "1992/12/10",
      nationality: "Vietnamese / ベトナム人",
      occupation: "Engineer / エンジニア",
      address: "321 Dong Khoi Street, District 1, Ho Chi Minh City, Vietnam"
    }
  ],
  
  // Gia đình ở Nhật / Family in Japan
  familyInJapanYesNo: "No",
  familyInJapan: [],
  
  // Kế hoạch sau tốt nghiệp / Post-graduation Plan
  motivation: "I want to study Japanese language intensively in Japan to improve my language skills and cultural understanding. After completing the course, I plan to work for a Japanese company in Vietnam to utilize my language skills and contribute to the business relationship between Vietnam and Japan.\n\n日本で日本語を集中的に勉強して、言語スキルと文化的理解を向上させたいです。コース修了後は、ベトナムの日系企業で働き、言語スキルを活用してベトナムと日本のビジネス関係に貢献する予定です。",
  
  // Thông tin trường học / School Information
  schoolType: "Japanese Language School / 日本語学校",
  schoolName: "Tokyo International Japanese Academy / 東京国際日本語アカデミー",
  major: "Japanese Language and Culture / 日本語・日本文化",
  desiredJob: "Marketing Manager at Japanese Company / 日系企業のマーケティングマネージャー",
  returnHomeYyyyMm: "2026/03",
  notes: "Planning to take JLPT N2 exam during the course period",
  
  // Lý do đăng ký / Reasons for applying
  reasonsForApplying: "I am applying to this Japanese language school because I have a strong passion for Japanese culture and language. I believe that studying in Japan will provide me with the best environment to master the language and understand the culture deeply. My goal is to become fluent in Japanese and use this skill to build a career that bridges Vietnam and Japan.\n\n日本の文化と言語に対する強い情熱があるため、この日本語学校に応募しています。日本で勉強することで、言語を習得し、文化を深く理解するための最良の環境が得られると信じています。日本語に堪能になり、このスキルを使ってベトナムと日本を結ぶキャリアを築くことが目標です。",
  
  // File đính kèm / Attachments
  attachments: []
}

// Hàm để tạo test data với các file mẫu
export const createTestDataWithFiles = () => {
  return {
    ...testData,
    // Các file đính kèm sẽ được thêm vào khi test
    attachments: [
      {
        key: 'passport',
        name: 'passport_sample.pdf',
        type: 'application/pdf',
        size: 1024000
      },
      {
        key: 'certificate',
        name: 'graduation_certificate.pdf',
        type: 'application/pdf',
        size: 512000
      },
      {
        key: 'other',
        name: 'jlpt_certificate.pdf',
        type: 'application/pdf',
        size: 256000
      }
    ]
  }
}

// Hàm để tạo dữ liệu test với thông tin khác nhau
export const createAlternativeTestData = () => {
  return {
    ...testData,
    lastNameRomaji: "Suzuki",
    firstNameRomaji: "Hiroshi",
    lastNameKanji: "鈴木",
    firstNameKanji: "博志",
    gender: "Male",
    age: 25,
    course: "Business Japanese Course / ビジネス日本語コース",
    occupation: "Recent Graduate / 新卒",
    employmentYesNo: "No",
    employment: [],
    hasStudiedAtLanguageSchool: "No",
    jpSchools: [],
    jpLearningHours: 120,
    familyInJapanYesNo: "Yes",
    familyInJapan: [
      {
        relation: "Uncle / 叔父",
        name: "Suzuki Kenji / 鈴木健二",
        dob: "1970/03/25",
        nationality: "Japanese / 日本人",
        phone: "+81-3-1234-5678",
        school: "N/A",
        status: "Permanent Resident / 永住者",
        address: "1-2-3 Shibuya, Shibuya-ku, Tokyo, Japan"
      }
    ]
  }
}

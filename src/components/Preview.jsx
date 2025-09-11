// import { formText } from '../constants/formText.js' // Không sử dụng trong component mới

// Application Form styled components
function FormHeader() {
  return (
    <div className="application-form-header">
      <h1 className="form-title">入学願書 / Application Form</h1>
      <p className="form-instruction">
        日本語または英語でご記入ください。<br/>
        Please fill out the application form in Japanese or in English.
      </p>
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <h3 className="section-title">{title}</h3>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null
  
  // Split Japanese and English parts if contains ' / '
  const hasSeparator = label.includes(' / ')
  if (hasSeparator) {
    const parts = label.split(' / ')
    const japaneseLabel = parts[0]
    const englishLabel = parts[1]
    
    // Process the value data for names
    const nameData = processNameData(value)
    
    return (
      <div className="info-row-jp-en">
        <div className="info-label-jp-en">
          <div className="label-japanese">{japaneseLabel}:</div>
          <div className="label-english">{englishLabel}</div>
        </div>
        <div className="info-value">
          {nameData && nameData.japanese && (
            <div className="name-japanese">{nameData.japanese}</div>
          )}
          {nameData && nameData.english && (
            <div className="name-english">{nameData.english}</div>
          )}
        </div>
      </div>
    )
  }
  
  // Default display for labels without separator
  return (
    <div className="info-row">
      <span className="info-label">{label}:</span>
      <span className="info-value">{value}</span>
    </div>
  )
}

function InfoTable({ data, columns = 2 }) {
  const gridClass = columns === 3 ? 'info-grid-3' : 'info-grid-2'
  return (
    <div className={`info-table ${gridClass}`}>
      {data.map((item, index) => (
        <InfoRow key={index} label={item.label} value={item.value} />
      ))}
    </div>
  )
}

// Helper function to process address data with Japanese/English order
function processAddressData(value) {
  if (!value) return { japanese: '', english: '' }
  
  // Check if the value contains both Japanese and English parts
  // Pattern: English text followed by Japanese text
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/
  
  // If contains Japanese characters, try to separate
  if (japanesePattern.test(value)) {
    // Try to find the boundary between English and Japanese
    const match = value.match(/([A-Za-z\s,.-]+)\s*([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s・]+)/)
    if (match) {
      const englishPart = match[1].trim()
      const japanesePart = match[2].trim()
      return {
        japanese: japanesePart,
        english: englishPart
      }
    }
  }
  
  // If no clear separation, return as is
  return {
    japanese: value,
    english: ''
  }
}

// Helper function to process name data with Japanese/English order
function processNameData(value) {
  if (!value) return { japanese: '', english: '' }
  
  // Check if the value contains both Japanese and English parts
  // Pattern: English text followed by Japanese text
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/
  
  // If contains Japanese characters, try to separate
  if (japanesePattern.test(value)) {
    // Try to find the boundary between English and Japanese
    const match = value.match(/([A-Za-z\s]+)\s*([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s・]+)/)
    if (match) {
      const englishPart = match[1].trim()
      const japanesePart = match[2].trim()
      return {
        japanese: japanesePart,
        english: englishPart
      }
    }
  }
  
  // If no clear separation, return as is
  return {
    japanese: value,
    english: ''
  }
}

// Helper function to process long text content with Japanese/English order
function processTextContent(value) {
  if (!value) return { japanese: '', english: '' }
  
  // Check if the value contains both Japanese and English parts
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/
  
  // If contains Japanese characters, try to separate
  if (japanesePattern.test(value)) {
    // Try multiple patterns to separate Japanese and English
    
    // Pattern 1: English text followed by Japanese text (current format)
    let match = value.match(/([A-Za-z\s.,!?;:'"-]+)\s*\/\s*([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s・。、！？：；「」『』（）]+)/)
    if (match) {
      const englishPart = match[1].trim()
      const japanesePart = match[2].trim()
      return {
        japanese: japanesePart,
        english: englishPart
      }
    }
    
    // Pattern 2: Japanese text followed by English text
    match = value.match(/([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s・。、！？：；「」『』（）]+)\s*\/\s*([A-Za-z\s.,!?;:'"-]+)/)
    if (match) {
      const japanesePart = match[1].trim()
      const englishPart = match[2].trim()
      return {
        japanese: japanesePart,
        english: englishPart
      }
    }
    
    // Pattern 3: Mixed content without separator - try to separate by character type
    const japaneseChars = value.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s・。、！？：；「」『』（）]+/g)
    const englishChars = value.match(/[A-Za-z\s.,!?;:'"-]+/g)
    
    if (japaneseChars && englishChars) {
      const japanesePart = japaneseChars.join(' ').trim()
      const englishPart = englishChars.join(' ').trim()
      return {
        japanese: japanesePart,
        english: englishPart
      }
    }
  }
  
  // If no clear separation, check if it's purely Japanese or English
  if (japanesePattern.test(value)) {
    return {
      japanese: value,
      english: ''
    }
  } else {
    return {
      japanese: '',
      english: value
    }
  }
}

function AddressDisplay({ label, value }) {
  if (!value) return null
  
  // Split Japanese and English parts
  const parts = label.split(' / ')
  const japaneseLabel = parts[0]
  const englishLabel = parts[1]
  
  // Process the address data
  const addressData = processAddressData(value)
  
  return (
    <div className="address-row">
      <div className="address-label">
        <div className="label-japanese">{japaneseLabel}:</div>
        <div className="label-english">{englishLabel}</div>
      </div>
      <div className="address-value">
        <div className="value-content">
          {addressData && addressData.japanese && (
            <div className="address-japanese">{addressData.japanese}</div>
          )}
          {addressData && addressData.english && (
            <div className="address-english">{addressData.english}</div>
          )}
        </div>
      </div>
    </div>
  )
}

function TextContentDisplay({ label, value }) {
  if (!value) return null
  
  // Split Japanese and English parts
  const parts = label.split(' / ')
  const japaneseLabel = parts[0]
  const englishLabel = parts[1]
  
  // Process the text content
  const textData = processTextContent(value)
  
  return (
    <div className="text-content-row">
      <div className="text-content-label">
        <div className="label-japanese">{japaneseLabel}:</div>
        <div className="label-english">{englishLabel}</div>
      </div>
      <div className="text-content-value">
        {textData && textData.japanese && (
          <div className="text-japanese">{textData.japanese}</div>
        )}
        {textData && textData.english && (
          <div className="text-english">{textData.english}</div>
        )}
      </div>
    </div>
  )
}

function DataTable({ headers, rows, className = '' }) {
  return (
    <div className={`data-table ${className}`}>
      <div className="table-header">
        {headers.map((header, index) => (
          <div key={index} className="table-cell header-cell">{header}</div>
        ))}
      </div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="table-row">
          {row.map((cell, cellIndex) => {
            // Process text data to ensure Japanese comes first
            const textData = processTextContent(cell)
            return (
              <div key={cellIndex} className="table-cell">
                {cell ? (
                  <div className="text-content">
                    {textData.japanese && (
                      <div className="text-japanese">{textData.japanese}</div>
                    )}
                    {textData.english && (
                      <div className="text-english">{textData.english}</div>
                    )}
                  </div>
                ) : '-'}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function PhotoSection({ imageUrl }) {
  if (!imageUrl) return null
  
  return (
    <div className="photo-section">
      <div className="photo-label">顔写真 / Photo (H:4cm × W:3cm)</div>
      <div className="photo-container">
        <img src={imageUrl} alt="portrait" className="portrait-photo" />
      </div>
    </div>
  )
}

function Preview({ data, imageUrl }) {
  const d = data || {}
  
  return (
    <div id="preview-root" className="application-form">
      <FormHeader />
      
      {/* Personal Information Section */}
      <div className="form-section">
        <SectionHeader title="個人情報 / Personal Information" />
        
        {/* Personal Information with Photo Layout */}
        <div className="personal-info-with-photo-preview">
          <div className="personal-info-fields-preview">
            <h4 className="subsection-title">基本情報 / Basic Information</h4>
            <div className="name-fields-grid-preview">
              <InfoRow label="氏(ローマ字) / Last Name (Romaji)" value={d.lastNameRomaji} />
              <InfoRow label="名(ローマ字) / First Name (Romaji)" value={d.firstNameRomaji} />
              <InfoRow label="氏(漢字) / Last Name (Kanji)" value={d.lastNameKanji} />
              <InfoRow label="名(漢字) / First Name (Kanji)" value={d.firstNameKanji} />
            </div>
          </div>
          
          <div className="photo-section-preview">
            <h4 className="subsection-title">顔写真 / Photo</h4>
            <div className="photo-frame-preview">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="portrait" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    borderRadius: 4 
                  }} 
                />
              ) : (
                <div className="photo-placeholder">
                  <div>Photo</div>
                  <div>4cm x 3cm</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Personal Information - 2 Column Layout */}
        <div className="personal-info-grid">
          <div className="personal-info-column">
            {/* Personal Details */}
            <div className="personal-info-details">
              <h4 className="subsection-title">個人詳細 / Personal Details</h4>
              <div className="info-grid-2">
                <InfoTable data={[
                  { label: "国籍 / Nationality", value: d.nationality },
                  { label: "性別 / Gender", value: d.gender },
                  { label: "婚姻状況 / Marital Status", value: d.maritalStatus },
                  { label: "生年月日 / Date of Birth", value: d.dob },
                  { label: "年齢 / Age", value: d.age },
                  { label: "職業 / Occupation", value: d.occupation }
                ]} />
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="personal-info-contact">
              <h4 className="subsection-title">連絡先情報 / Contact Information</h4>
              <div className="info-grid-2">
                <InfoTable data={[
                  { label: "電話番号 / Phone", value: d.phone },
                  { label: "Eメール / E-mail", value: d.email },
                  { label: "コース名 / Course", value: d.course }
                ]} />
              </div>
            </div>
          </div>
          
          <div className="personal-info-column">
            {/* Passport Information */}
            <div className="personal-info-passport">
              <h4 className="subsection-title">パスポート情報 / Passport Information</h4>
              <div className="info-grid-2">
                <InfoTable data={[
                  { label: "パスポート番号 / Passport No.", value: d.passportNumber },
                  { label: "発行日 / Issue Date", value: d.passportIssueDate },
                  { label: "発行地 / Issue Place", value: d.passportIssuePlace },
                  { label: "有効期限 / Expiration", value: d.passportExpirationDate }
                ]} />
              </div>
            </div>
            
            {/* Address Information */}
            <div className="address-section">
              <h4 className="subsection-title">住所情報 / Address Information</h4>
              <div className="address-table">
                <AddressDisplay label="永住地住所 / Permanent Address" value={d.permanentAddress} />
                <AddressDisplay label="現住所 / Current Address" value={d.currentAddress} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COE History Section */}
      <div className="form-section">
        <SectionHeader title="過去の在留資格認定証明書交付申請状況 / Applications for issuance of COE" />
        <InfoTable data={[
          { label: "有無 / Yes/No", value: d.coeHistory?.yesNo },
          { label: "回数 / How many times", value: d.coeHistory?.count },
          { label: "不交付回数 / Denied Count", value: d.coeHistory?.deniedCount }
        ]} />
      </div>

      {/* Previous Visits Section */}
      <div className="form-section">
        <SectionHeader title="来日歴 / Previous visits to Japan" />
        <InfoTable data={[
          { label: "有無 / Yes/No", value: d.visits?.yesNo },
          { label: "回数 / How many times", value: d.visits?.count },
          { label: "直近の出入国 / Most Recent Entry/Exit", value: d.visits?.recent }
        ]} />
      </div>

      {/* Education Section */}
      <div className="form-section">
        <SectionHeader title="学歴 / Education" />
        {(d.education && d.education.length > 0) ? (
          <DataTable 
            headers={["学校名 / School Name", "入学年月 / Start Year", "卒業年月 / End Year", "在籍年数 / Years Attended", "所在地 / Location"]}
            rows={d.education.map(edu => [edu.label || 'School', edu.startYm, edu.endYm, edu.yearsAttended, edu.location])}
          />
        ) : (
          <div className="no-data">No education history provided</div>
        )}
        
        <InfoTable data={[
          { label: "最終学歴 / Last School Attended", value: d.lastSchoolSummary },
          { label: "区分 / Category", value: d.lastSchoolCategory },
          { label: "就学年数 / Years from elementary", value: d.yearsFromElementary }
        ]} />
      </div>

      {/* Employment Section */}
      <div className="form-section">
        <SectionHeader title="職歴 / Employment" />
        <div className="employment-question">
          <strong>有無 / Yes/No:</strong> {d.employmentYesNo || '-'}
        </div>
        {d.employmentYesNo === 'Yes' && d.employment && d.employment.length > 0 && (
          <DataTable 
            headers={["会社名 / Company Name", "入社年月 / Start Year", "退職年月 / End Year", "職種 / Job Title", "所在地 / Location"]}
            rows={d.employment.map(emp => [emp.companyName, emp.startYm, emp.endYm, emp.jobTitle, emp.location])}
          />
        )}
      </div>

      {/* Japanese Learning Section */}
      <div className="form-section">
        <SectionHeader title="日本語学習歴 / Japanese Learning Hours" />
        <InfoTable data={[
          { label: "日本語学校での学習経験 / Have you ever learnt Japanese in the language school? Yes/No", value: d.hasStudiedAtLanguageSchool },
          { label: "日本語学習時間 / Total learning hours", value: d.jpLearningHours }
        ]} />
        
        {d.hasStudiedAtLanguageSchool === 'Yes' && d.jpSchools && d.jpSchools.length > 0 && (
          <DataTable 
            headers={["学校名 / School Name", "開始年月 / Start Year", "修了年月 / End Year"]}
            rows={d.jpSchools.map(school => [school.label || 'JP School', school.startYm, school.endYm])}
          />
        )}
      </div>

      {/* Japanese Proficiency Section */}
      <div className="form-section">
        <SectionHeader title="日本語能力 / Japanese Language Proficiency" />
        {['JLPT','J.Test','JPT','NAT-Test','Others'].map((name) => {
          const rows = (d.proficiency || []).filter(p => p.testName === name)
          if (rows.length === 0) return null
          return (
            <div key={name} className="proficiency-test">
              <h4 className="test-name">{name}</h4>
              <DataTable 
                headers={["取得年 / Test Year", "レベル / Level", "点数 / Score", "結果 / Result"]}
                rows={rows.map(r => [r.year, r.level, r.score, r.result])}
              />
            </div>
          )
        })}
        <div className="other-proficiency">
          <strong>その他の場合、テスト名を記入ください / Please put test name if applicant takes "Others" above:</strong> {d.otherProficiencyNote || '-'}
        </div>
      </div>

      {/* Financial Sponsor Section */}
      <div className="form-section">
        <SectionHeader title="経費支弁者 / Financial Sponsor(s)" />
        
        {/* Sponsor Basic Information */}
        <div className="sponsor-basic-info">
          <h4 className="subsection-title">基本情報 / Basic Information</h4>
          <div className="info-grid-2">
            <InfoTable data={[
              { label: "氏名 / Full Name", value: d.sponsor?.fullName },
              { label: "本人との関係 / Relationship", value: d.sponsor?.relationship }
            ]} />
          </div>
        </div>
        
        {/* Sponsor Address */}
        <div className="sponsor-address-section">
          <h4 className="subsection-title">住所情報 / Address Information</h4>
          <div className="address-table">
            <AddressDisplay label="現住所 / Current Address" value={d.sponsor?.currentAddress} />
          </div>
        </div>
        
        {/* Sponsor Contact Information */}
        <div className="sponsor-contact-info">
          <h4 className="subsection-title">連絡先情報 / Contact Information</h4>
          <div className="info-grid-2">
            <InfoTable data={[
              { label: "Eメール / E-mail", value: d.sponsor?.email },
              { label: "電話番号 / Phone", value: d.sponsor?.phone }
            ]} />
          </div>
        </div>
        
        {/* Sponsor Employment Information */}
        <div className="sponsor-employment-info">
          <h4 className="subsection-title">勤務先情報 / Employment Information</h4>
          <div className="info-grid-2">
            <InfoTable data={[
              { label: "勤務先 / Company", value: d.sponsor?.company },
              { label: "職種・役職 / Occupation - Position", value: d.sponsor?.position }
            ]} />
          </div>
          
          <div className="address-table">
            <AddressDisplay label="勤務先住所 / Work Address" value={d.sponsor?.workAddress} />
          </div>
          
          <div className="info-grid-2">
            <InfoTable data={[
              { label: "勤務先電話 / Work Phone", value: d.sponsor?.workPhone }
            ]} />
          </div>
        </div>
        
        {/* Sponsor Financial Information */}
        <div className="sponsor-financial-info">
          <h4 className="subsection-title">収入情報 / Financial Information</h4>
          <div className="info-grid-2">
            <InfoTable data={[
              { label: "年収(JPY) / Annual Income", value: d.sponsor?.annualIncomeJpy },
              { label: "為替レート / Exchange Rate", value: d.sponsor?.exchangeRate }
            ]} />
          </div>
        </div>
      </div>

      {/* Family Members Section */}
      <div className="form-section">
        <SectionHeader title="家族構成 / Family Members" />
        {d.family && d.family.length > 0 ? (
          <DataTable 
            headers={["関係 / Relation", "氏名 / Name", "生年月日 / DoB", "国籍 / Nationality", "職業 / Occupation", "住所 / Address"]}
            rows={d.family.map(member => [member.relation, member.name, member.dob, member.nationality, member.occupation, member.address])}
          />
        ) : (
          <div className="no-data">No family members provided</div>
        )}
      </div>

      {/* Family in Japan Section */}
      <div className="form-section">
        <SectionHeader title="在日親族 / Family in Japan" />
        <div className="family-japan-question">
          <strong>日本に家族はいますか？ / Do you have any family members in Japan?</strong> {d.familyInJapanYesNo || '-'}
        </div>
        {d.familyInJapanYesNo === 'Yes' && d.familyInJapan && d.familyInJapan.length > 0 && (
          <DataTable 
            headers={["関係 / Relation", "氏名 / Name", "生年月日 / DoB", "国籍 / Nationality", "電話 / Phone", "学校 / School", "在留資格 / Status", "住所 / Address"]}
            rows={d.familyInJapan.map(member => [member.relation, member.name, member.dob, member.nationality, member.phone, member.school, member.status, member.address])}
          />
        )}
      </div>

      {/* Academic Plan Section */}
      <div className="form-section">
        <SectionHeader title="卒業後の進路 / Academic or Career Plan" />
        
        {/* Plan Description */}
        <div className="plan-description">
          <h4 className="subsection-title">進路計画 / Career Plan</h4>
          <div className="plan-content">
            <TextContentDisplay label="卒業後の進路 / Plan" value={d.motivation} />
          </div>
        </div>
        
        {/* Educational Plan */}
        <div className="educational-plan">
          <h4 className="subsection-title">進学計画 / Educational Plan</h4>
          <div className="info-grid-2">
            <InfoTable data={[
              { label: "学校種別 / School Type", value: d.schoolType },
              { label: "学校名 / School Name", value: d.schoolName }
            ]} />
          </div>
          
          <div className="info-grid-2">
            <InfoTable data={[
              { label: "専攻 / Major or Specialty", value: d.major }
            ]} />
          </div>
        </div>
        
        {/* Career Plan */}
        <div className="career-plan">
          <h4 className="subsection-title">就職計画 / Career Plan</h4>
          <div className="info-grid-2">
            <InfoTable data={[
              { label: "就職・希望職種 / Company or Job", value: d.desiredJob },
              { label: "帰国予定 / Return Home (YYYY/MM)", value: d.returnHomeYyyyMm }
            ]} />
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="plan-additional">
          <h4 className="subsection-title">その他 / Additional Information</h4>
          <div className="plan-content">
            <TextContentDisplay label="その他 / Others" value={d.notes} />
          </div>
        </div>
      </div>

      {/* Reasons for Applying Section */}
      <div className="form-section">
        <SectionHeader title="志望理由 / Reasons for applying" />
        <div className="reasons-content">
          <TextContentDisplay label="志望理由 / Reasons for applying" value={d.reasonsForApplying} />
        </div>
      </div>
    </div>
  )
}

export default Preview

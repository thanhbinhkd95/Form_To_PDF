import { useMemo, useRef } from 'react'
import { formText } from '../constants/formText.js'
import { useForm } from '../hooks/useForm.js'
import { useImage } from '../hooks/useImage.js'
import { useFormContext } from '../context/useFormContext.js'

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

function Label({ children }) {
  return <label style={{ 
    display: 'block', 
    fontSize: 15, 
    marginBottom: 8, 
    color: '#1e3a8a', 
    fontWeight: 700,
    letterSpacing: '0.3px',
    textTransform: 'none'
  }}>{children}</label>
}

function ErrorMessage({ error }) {
  if (!error) return null
  return <div className="error-message" style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{error}</div>
}
function Input({ type = 'text', value, onChange, placeholder, ...rest }) {
  return (
    <input 
      type={type} 
      value={value ?? ''} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder}
      className="form-control" 
      {...rest} 
    />
  )
}
function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea 
      value={value ?? ''} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      className="form-control" 
      style={{ minHeight: 96 }} 
    />
  )
}
function YesNo({ value, onChange }) {
  return (
    <div className="yesno-line">
      <button type="button" className={value === 'Yes' ? 'active' : ''} onClick={() => onChange('Yes')}>Yes</button>
      <button type="button" className={value === 'No' ? 'active' : ''} onClick={() => onChange('No')}>No</button>
    </div>
  )
}
function Section({ title }) {
  return <h3 className="section-title">{title}</h3>
}

function Row({ children, cols = 2 }) {
  return <div className="grid-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>{children}</div>
}

function Table({ columns, rows, onChange, addLabel = 'Add', onAdd }) {
  const handleCellChange = (rowIndex, columnKey, value) => {
    const updatedRows = rows.map((row, idx) => 
      idx === rowIndex ? { ...row, [columnKey]: value } : row
    )
    onChange(updatedRows)
  }

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table className="table-styled">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} style={{ 
                  textAlign: 'left', 
                  border: '1px solid var(--color-border)', 
                  padding: 8, 
                  background: 'var(--color-background-tertiary)' 
                }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex} style={{ 
                    border: '1px solid var(--color-border)', 
                    padding: 6 
                  }}>
                    {column.isStatic ? (
                      <strong>{row.label}</strong>
                    ) : (
                      <Input 
                        value={row[column.key]}
                        onChange={(value) => handleCellChange(rowIndex, column.key, value)}
                        placeholder={column.placeholder}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onAdd && (
        <div style={{ marginTop: 8 }}>
          <button type="button" className="btn btn-secondary" onClick={onAdd}>
            {addLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export default function FormInput({ initialValues }) {
  const { updateForm, submitForm, validationErrors, clearValidationErrors } = useForm()
  const { imageUrl, setImage } = useImage()
  const { state, dispatch } = useFormContext()
  const d = initialValues
  const photoInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    clearValidationErrors()
    submitForm()
  }

  const educationCols = useMemo(() => ([
    { key: 'label', label: '', isStatic: true },
    { key: 'startYm', label: '入学年月/Start Year', placeholder: 'YYYY/MM' },
    { key: 'endYm', label: '卒業年月/End Year', placeholder: 'YYYY/MM' },
    { key: 'yearsAttended', label: '在籍年数/Years Attended' },
    { key: 'location', label: '所在地/Location' },
  ]), [])

  const employmentCols = useMemo(() => ([
    { key: 'label', label: '', isStatic: true },
    { key: 'companyName', label: '会社名/Company Name' },
    { key: 'startYm', label: '入社年/Start Year', placeholder: 'YYYY/MM' },
    { key: 'endYm', label: '退社年/End Year', placeholder: 'YYYY/MM' },
    { key: 'jobTitle', label: '職種/Job' },
    { key: 'location', label: '所在地/Location' },
  ]), [])

  const jpSchoolCols = useMemo(() => ([
    { key: 'label', label: '', isStatic: true },
    { key: 'startYm', label: '開始年月/Start Year', placeholder: 'YYYY/MM' },
    { key: 'endYm', label: '修了年月/End Year', placeholder: 'YYYY/MM' },
  ]), [])

  const proficiencyCols = useMemo(() => ([
    { key: 'label', label: '', isStatic: true },
    { key: 'year', label: '受験年/Test Year' },
    { key: 'level', label: 'レベル/Level' },
    { key: 'score', label: '得点/Score' },
    { key: 'result', label: '結果/Result' },
  ]), [])

  const familyCols = useMemo(() => ([
    { key: 'relation', label: '続柄/Relation' },
    { key: 'name', label: '氏名/Name' },
    { key: 'dob', label: '生年月日/DoB' },
    { key: 'nationality', label: '国籍/Nationality' },
    { key: 'occupation', label: '職業/Occupation' },
    { key: 'address', label: '住所/Address' },
  ]), [])

  const familyJpCols = useMemo(() => ([
    { key: 'relation', label: '続柄/Relation' },
    { key: 'name', label: '氏名/Name' },
    { key: 'dob', label: '生年月日/DoB' },
    { key: 'nationality', label: '国籍/Nationality' },
    { key: 'phone', label: '電話/Phone' },
    { key: 'school', label: '学校/School' },
    { key: 'status', label: '在留資格/Status' },
    { key: 'address', label: '住所/Address' },
  ]), [])

  return (
    <form className="grid-1 form-print-wrapper" onSubmit={handleSubmit}>
      <div className="form-header">
        <h1 className="form-title">{formText.title}</h1>
        <div className="form-divider"></div>
        <div className="form-instruction">
          <p className="form-instruction-jp">{formText.instruction.split('.')[0]}.</p>
          <p className="form-instruction-en">{formText.instruction.split('.')[1]}</p>
        </div>
      </div>

      <Section title="個人情報/ Personal Information" />
      
      <Row cols={2}>
        <div>
          <Label>氏(ローマ字)/Last Name (Romaji)</Label>
          <Input value={d.lastNameRomaji} onChange={(v) => updateForm({ lastNameRomaji: v })} />
          <ErrorMessage error={validationErrors.lastNameRomaji} />
        </div>
        <div>
          <Label>名(ローマ字)/First Name (Romaji)</Label>
          <Input value={d.firstNameRomaji} onChange={(v) => updateForm({ firstNameRomaji: v })} />
          <ErrorMessage error={validationErrors.firstNameRomaji} />
        </div>
        <div>
          <Label>氏(漢字)/Last Name (Kanji)</Label>
          <Input value={d.lastNameKanji} onChange={(v) => updateForm({ lastNameKanji: v })} />
        </div>
        <div>
          <Label>名(漢字)/First Name (Kanji)</Label>
          <Input value={d.firstNameKanji} onChange={(v) => updateForm({ firstNameKanji: v })} />
        </div>
      </Row>
      <Row cols={3}>
        <div>
          <Label>国籍/Nationality</Label>
          <Input value={d.nationality} onChange={(v) => updateForm({ nationality: v })} />
          <ErrorMessage error={validationErrors.nationality} />
        </div>
        <div>
          <Label>性別/Gender</Label>
          <Input value={d.gender} onChange={(v) => updateForm({ gender: v })} placeholder="Male/Female" />
          <ErrorMessage error={validationErrors.gender} />
        </div>
        <div>
          <Label>婚姻状況/Marital Status</Label>
          <Input value={d.maritalStatus} onChange={(v) => updateForm({ maritalStatus: v })} />
          <ErrorMessage error={validationErrors.maritalStatus} />
        </div>
      </Row>
      <Row cols={3}>
        <div>
          <Label>コース名/Course</Label>
          <Input value={d.course} onChange={(v) => updateForm({ course: v })} />
          <ErrorMessage error={validationErrors.course} />
        </div>
        <div>
          <Label>生年月日/Date of Birth</Label>
          <Input type="date" value={d.dob} onChange={(v) => updateForm({ dob: v })} />
          <ErrorMessage error={validationErrors.dob} />
        </div>
        <div>
          <Label>年齢/Age</Label>
          <Input type="number" value={d.age} onChange={(v) => updateForm({ age: v })} />
          <ErrorMessage error={validationErrors.age} />
        </div>
      </Row>
      <Row cols={1}>
        <div>
          <Label>永住地住所/Permanent Address</Label>
          <Textarea value={d.permanentAddress} onChange={(v) => updateForm({ permanentAddress: v })} />
          <ErrorMessage error={validationErrors.permanentAddress} />
        </div>
      </Row>
      <Row cols={1}>
        <div>
          <Label>現住所/Current Address</Label>
          <Textarea value={d.currentAddress} onChange={(v) => updateForm({ currentAddress: v })} />
          <ErrorMessage error={validationErrors.currentAddress} />
        </div>
      </Row>
      <Row cols={2}>
        <div>
          <Label>電話番号/Phone</Label>
          <Input value={d.phone} onChange={(v) => updateForm({ phone: v })} placeholder="Country Code should be included" />
          <ErrorMessage error={validationErrors.phone} />
        </div>
        <div>
          <Label>Eメール/E-mail</Label>
          <Input type="email" value={d.email} onChange={(v) => updateForm({ email: v })} placeholder="e.g. example@example.com" />
          <ErrorMessage error={validationErrors.email} />
        </div>
      </Row>
      <Row cols={3}>
        <div>
          <Label>パスポート番号/Passport no.</Label>
          <Input value={d.passportNumber} onChange={(v) => updateForm({ passportNumber: v })} />
        </div>
        <div>
          <Label>発行日/Issue Date</Label>
          <Input type="date" value={d.passportIssueDate} onChange={(v) => updateForm({ passportIssueDate: v })} />
        </div>
        <div>
          <Label>発行地/Issue Place</Label>
          <Input value={d.passportIssuePlace} onChange={(v) => updateForm({ passportIssuePlace: v })} />
        </div>
      </Row>
      <Row cols={2}>
        <div>
          <Label>有効期限/Expiration</Label>
          <Input type="date" value={d.passportExpirationDate} onChange={(v) => updateForm({ passportExpirationDate: v })} />
        </div>
        <div>
          <Label>職業/Occupation</Label>
          <Input value={d.occupation} onChange={(v) => updateForm({ occupation: v })} />
        </div>
      </Row>

      <Section title="過去の在留資格認定証明書交付申請状況/ Applications for issuance of COE" />
      <Row cols={3}>
        <div>
          <Label>Yes/No</Label>
          <YesNo value={d.coeHistory?.yesNo} onChange={(v) => updateForm({ coeHistory: { ...d.coeHistory, yesNo: v } })} />
        </div>
        <div>
          <Label>回数/How many times</Label>
          <Input type="number" value={d.coeHistory?.count} onChange={(v) => updateForm({ coeHistory: { ...d.coeHistory, count: v } })} />
        </div>
        <div>
          <Label>不交付回数/Denied Count</Label>
          <Input type="number" value={d.coeHistory?.deniedCount} onChange={(v) => updateForm({ coeHistory: { ...d.coeHistory, deniedCount: v } })} />
        </div>
      </Row>

      <Section title="来日歴/ Previous visits to Japan" />
      <Row cols={3}>
        <div>
          <Label>Yes/No</Label>
          <YesNo value={d.visits?.yesNo} onChange={(v) => updateForm({ visits: { ...d.visits, yesNo: v } })} />
        </div>
        <div>
          <Label>回数/How many times</Label>
          <Input type="number" value={d.visits?.count} onChange={(v) => updateForm({ visits: { ...d.visits, count: v } })} />
        </div>
        <div>
          <Label>直近の出入国/Most Recent Entry/Exit</Label>
          <Input value={d.visits?.recent} onChange={(v) => updateForm({ visits: { ...d.visits, recent: v } })} placeholder="YYYY/MM to YYYY/MM" />
        </div>
      </Row>

      <Section title="学歴/ Education" />
      <Table columns={educationCols} rows={(d.education && d.education.length ? d.education : [
        { label: 'School 1', startYm: '', endYm: '', yearsAttended: '', location: '' }, 
        { label: 'School 2', startYm: '', endYm: '', yearsAttended: '', location: '' }, 
        { label: 'School 3', startYm: '', endYm: '', yearsAttended: '', location: '' }
      ])}
        onChange={(rows) => updateForm({ education: rows })}
      />
      <Row cols={3}>
        <div>
          <Label>最終学歴/Last School Attended</Label>
          <Input value={d.lastSchoolSummary} onChange={(v) => updateForm({ lastSchoolSummary: v })} />
        </div>
        <div>
          <Label>区分/Category</Label>
          <Input value={d.lastSchoolCategory} onChange={(v) => updateForm({ lastSchoolCategory: v })} />
        </div>
        <div>
          <Label>就学年数/Years from elementary</Label>
          <Input type="number" value={d.yearsFromElementary} onChange={(v) => updateForm({ yearsFromElementary: v })} />
        </div>
      </Row>

      <Section title="職歴/ Occupation" />
      <div style={{ marginBottom: 8 }}>
        <Label>Yes/No</Label>
        <YesNo value={d.employmentYesNo} onChange={(v) => updateForm({ employmentYesNo: v })} />
      </div>
      {d.employmentYesNo === 'Yes' && (
        <Table columns={employmentCols} rows={(d.employment && d.employment.length ? d.employment : [
          { label: 'Company 1', companyName: '', startYm: '', endYm: '', jobTitle: '', location: '' }, 
          { label: 'Company 2', companyName: '', startYm: '', endYm: '', jobTitle: '', location: '' }, 
          { label: 'Company 3', companyName: '', startYm: '', endYm: '', jobTitle: '', location: '' }
        ])}
          onChange={(rows) => updateForm({ employment: rows })}
        />
      )}

      <Section title="日本語学習歴/ Japanese Learning Hours" />
      <Row cols={2}>
        <div>
          <Label>Have you ever learnt Japanese in the language school? Yes/No</Label>
          <YesNo value={d.hasStudiedAtLanguageSchool} onChange={(v) => updateForm({ hasStudiedAtLanguageSchool: v })} />
        </div>
        <div>
          <Label>日本語学習時間/Total learning hours</Label>
          <Input type="number" value={d.jpLearningHours} onChange={(v) => updateForm({ jpLearningHours: v })} />
        </div>
      </Row>
      {d.hasStudiedAtLanguageSchool === 'Yes' && (
        <Table columns={jpSchoolCols} rows={(d.jpSchools && d.jpSchools.length ? d.jpSchools : [
          { label: 'JP School 1', startYm: '', endYm: '' }, 
          { label: 'JP School 2', startYm: '', endYm: '' }, 
          { label: 'JP School 3', startYm: '', endYm: '' }
        ])}
          onChange={(rows) => updateForm({ jpSchools: rows })}
        />
      )}

      <Section title="日本語能力/ Japanese Language Proficiency" />
      <Table columns={proficiencyCols} rows={(d.proficiency && d.proficiency.length ? d.proficiency : [
        { label: 'JLPT' }, { label: 'J.Test' }, { label: 'JPT' }, { label: 'NAT-Test' }, { label: 'Others' }
      ])}
        onChange={(rows) => updateForm({ proficiency: rows })}
      />
      <Row cols={1}>
        <div>
          <Label>その他の場合、テスト名を記入ください/Please put test name if applicant takes "Others" above</Label>
          <Input value={d.otherProficiencyNote} onChange={(v) => updateForm({ otherProficiencyNote: v })} />
        </div>
      </Row>

      <Section title="経費支弁者/ Financial Sponsor(s)" />
      <Row cols={2}>
        <div>
          <Label>氏名/Full Name</Label>
          <Input value={d.sponsor?.fullName} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, fullName: v } })} />
        </div>
        <div>
          <Label>本人との関係/Relationship</Label>
          <Input value={d.sponsor?.relationship} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, relationship: v } })} />
        </div>
      </Row>
      <Row cols={2}>
        <div>
          <Label>現住所/Current Address</Label>
          <Textarea value={d.sponsor?.currentAddress} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, currentAddress: v } })} />
        </div>
        <div>
          <Label>Eメール/E-mail</Label>
          <Input type="email" value={d.sponsor?.email} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, email: v } })} />
        </div>
      </Row>
      <Row cols={3}>
        <div>
          <Label>電話番号/Phone</Label>
          <Input value={d.sponsor?.phone} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, phone: v } })} />
        </div>
        <div>
          <Label>勤務先/Company</Label>
          <Input value={d.sponsor?.company} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, company: v } })} />
        </div>
        <div>
          <Label>職種・役職/Occupation - Position</Label>
          <Input value={d.sponsor?.position} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, position: v } })} />
        </div>
      </Row>
      <Row cols={3}>
        <div>
          <Label>勤務先住所/Work Address</Label>
          <Input value={d.sponsor?.workAddress} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, workAddress: v } })} />
        </div>
        <div>
          <Label>勤務先電話/Work Phone</Label>
          <Input value={d.sponsor?.workPhone} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, workPhone: v } })} />
        </div>
        <div>
          <Label>年収(JPY)/Annual Income</Label>
          <Input type="number" value={d.sponsor?.annualIncomeJpy} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, annualIncomeJpy: v } })} />
        </div>
      </Row>
      <Row cols={1}>
        <div>
          <Label>為替レート/Exchange Rate</Label>
          <Input type="number" value={d.sponsor?.exchangeRate} onChange={(v) => updateForm({ sponsor: { ...d.sponsor, exchangeRate: v } })} placeholder="1USD = xxx JPY" />
        </div>
      </Row>

      <Section title="家族構成/ Family Members" />
      <Table columns={familyCols} rows={d.family || []}
        onChange={(rows) => updateForm({ family: rows })}
        onAdd={() => updateForm({ family: [...(d.family || []), {}] })}
        addLabel="Add Member"
      />

      <Section title="在日親族/ Family in Japan" />
      <div style={{ marginBottom: 8 }}>
        <Label>日本に家族はいますか？/Do you have any family members in Japan?</Label>
        <YesNo value={d.familyInJapanYesNo} onChange={(v) => updateForm({ familyInJapanYesNo: v })} />
      </div>
      {d.familyInJapanYesNo === 'Yes' && (
        <Table columns={familyJpCols} rows={d.familyInJapan || []}
          onChange={(rows) => updateForm({ familyInJapan: rows })}
          onAdd={() => updateForm({ familyInJapan: [...(d.familyInJapan || []), {}] })}
          addLabel="Add Member"
        />
      )}

      <Section title="卒業後の進路/ Academic or Career Plan" />
      <Textarea value={d.motivation} onChange={(v) => updateForm({ motivation: v })} />

      <Section title="学校種別/ School Type" />
      <Row cols={2}>
        <div>
          <Label>学校種別/School Type</Label>
          <Input value={d.schoolType} onChange={(v) => updateForm({ schoolType: v })} />
        </div>
        <div>
          <Label>学校名/School Name</Label>
          <Input value={d.schoolName} onChange={(v) => updateForm({ schoolName: v })} />
        </div>
      </Row>
      <Row cols={3}>
        <div>
          <Label>専攻/Major or Specialty</Label>
          <Input value={d.major} onChange={(v) => updateForm({ major: v })} />
        </div>
        <div>
          <Label>就職・希望職種/Company or Job</Label>
          <Input value={d.desiredJob} onChange={(v) => updateForm({ desiredJob: v })} />
        </div>
        <div>
          <Label>帰国予定/Return Home (YYYY/MM)</Label>
          <Input value={d.returnHomeYyyyMm} onChange={(v) => updateForm({ returnHomeYyyyMm: v })} placeholder="YYYY/MM" />
        </div>
      </Row>
      <Row cols={1}>
        <div>
          <Label>その他/Others</Label>
          <Input value={d.notes} onChange={(v) => updateForm({ notes: v })} />
        </div>
      </Row>

      <Section title="志望理由/Reasons for applying" />
      <Row cols={1}>
        <div>
          <Label>志望理由/Reasons for applying</Label>
          <Textarea value={d.reasonsForApplying} onChange={(v) => updateForm({ reasonsForApplying: v })} placeholder="Please describe your reasons for applying..." />
        </div>
      </Row>

      <Section title="顔写真/Photo (H:4cm × W:3cm)" />
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div 
          className="photo-upload-frame" 
          onClick={() => photoInputRef.current?.click()}
          style={{
            width: '200px',
            height: '267px', // 4:3 ratio for 4cm x 3cm
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            margin: '0 auto'
          }}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="portrait" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: 6 
              }} 
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 8px', color: '#6b7280' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.7 }}>📷</div>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#1e3a8a' }}>Browse Files</div>
              <div style={{ fontSize: '10px', marginBottom: '4px', opacity: 0.8 }}>Drag and drop files here</div>
              <div style={{ fontSize: '10px', fontWeight: '500', color: '#1e3a8a', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>4cm x 3cm</div>
            </div>
          )}
          <input 
            ref={photoInputRef} 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setImage(file)
            }} 
          />
        </div>
        <ErrorMessage error={validationErrors.imageUrl} />
      </div>

      <Section title="添付資料/ Attached files" />
      <Row cols={3}>
        {[
          { label: 'Passport Upload', key: 'passport' },
          { label: 'Certificate Upload', key: 'certificate' },
          { label: 'Other Upload', key: 'other' }
        ].map(({ label, key }, index) => {
          const currentAttachment = state.attachments?.find(att => att.key === key)
          
          const handleFileChange = async (e) => {
            const file = e.target.files?.[0]
            if (file) {
              try {
                // Convert file to base64 for storage
                const base64 = await fileToBase64(file)
                const newAttachment = { 
                  name: file.name, 
                  size: file.size, 
                  type: file.type, 
                  key: key,
                  base64: base64,
                  file: file // Keep original file for immediate use
                }
                // Lưu attachment vào state level thay vì formData
                dispatch({ type: 'ADD_ATTACHMENT', payload: newAttachment })
              } catch (error) {
                console.error('Error processing file:', error)
                alert('Lỗi khi xử lý file. Vui lòng thử lại.')
              }
            }
          }

          return (
            <div key={index}>
              <Label>{label}</Label>
              <label className="upload-dashed" style={{ display: 'block', cursor: 'pointer' }}>
                <input 
                  type="file" 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange} 
                />
                <div>
                  <div style={{ fontSize: 24, color: '#94a3b8' }}>⬆️</div>
                  <div style={{ color: '#64748b', marginTop: 6 }}>Browse Files</div>
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>Drag and drop files here</div>
                  {currentAttachment && (
                    <div style={{ 
                      color: '#1e3a8a', 
                      fontSize: 12, 
                      marginTop: 4, 
                      fontWeight: 500 
                    }}>
                      ✓ {currentAttachment.name}
                    </div>
                  )}
                </div>
              </label>
            </div>
          )
        })}
      </Row>


      <div style={{ 
        marginTop: 32, 
        textAlign: 'center', 
        padding: '24px 0' 
      }}>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ 
            padding: '16px 48px', 
            fontSize: '18px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(30, 58, 138, 0.3)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 25px rgba(30, 58, 138, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(30, 58, 138, 0.3)';
          }}
        >
          Submit
        </button>
      </div>

      <button type="button" className="go-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="go-to-top-icon">↑</div>
        <div className="go-to-top-text">Go to top</div>
      </button>
    </form>
  )
}



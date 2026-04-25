'use client';
import type { PartyInput } from '@/types/enrollment';

interface PartyFormProps {
  value: PartyInput;
  onChange: (data: Partial<PartyInput>) => void;
  placeholder?: Partial<PartyInput>;
  readOnly?: boolean;
}

export default function PartyForm({ value, onChange, placeholder, readOnly }: PartyFormProps) {
  const handleSsn = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const formatted = digits.length > 6 ? `${digits.slice(0, 6)}-${digits.slice(6, 13)}` : digits;
    onChange({ ssn: formatted });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">이름</label>
        <input
          type="text"
          readOnly={readOnly}
          className={`w-full border rounded-lg p-3 text-sm ${readOnly ? 'bg-gray-50 text-gray-700' : ''}`}
          placeholder={placeholder?.name || '이름'}
          value={value.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">주민등록번호</label>
        <input
          type="text"
          readOnly={readOnly}
          maxLength={14}
          className={`w-full border rounded-lg p-3 text-sm ${readOnly ? 'bg-gray-50 text-gray-700' : ''}`}
          placeholder="000000-0000000"
          value={value.ssn}
          onChange={(e) => handleSsn(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">휴대폰 번호</label>
        <input
          type="tel"
          readOnly={readOnly}
          className={`w-full border rounded-lg p-3 text-sm ${readOnly ? 'bg-gray-50 text-gray-700' : ''}`}
          placeholder={placeholder?.phone || '010-0000-0000'}
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
      </div>
    </div>
  );
}

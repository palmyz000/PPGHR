import React, { useState, useEffect } from 'react';
import EmployeeNavigation from '../../components/EmployeeNavigation';


const Calendar = ({ selectedDate, onSelect, holidays, workSchedules }) => {
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [workHours, setWorkHours] = useState([]);

  useEffect(() => {
    // จำลองข้อมูลการทำงาน
    const mockWorkHours = [
      { date: '2025-01-15', checkIn: '09:00', checkOut: '18:00', status: 'onTime' },
      { date: '2025-01-16', checkIn: '09:15', checkOut: '18:00', status: 'late' },
      // เพิ่มข้อมูลตามต้องการ
    ];
    setWorkHours(mockWorkHours);
  }, []);

  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const changeMonth = (increment) => {
    const newMonth = selectedMonth + increment;
    if (newMonth < 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else if (newMonth > 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(newMonth);
    }
  };

  const isWeekend = (date) => {
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getWorkStatus = (date) => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return workHours.find(wh => wh.date === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'onTime': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const isHoliday = (date) => {
    if (!date) return false;
    return holidays.some(holiday => holiday.date === date.toISOString().split('T')[0]);
  };

  const getHolidayName = (date) => {
    const holiday = holidays.find(h => h.date === date.toISOString().split('T')[0]);
    return holiday ? holiday.name : '';
  };

  // คำนวณสถิติการทำงาน
  const getMonthlyStats = () => {
    const totalDays = days.filter(date => date !== null).length;
    const totalWorkdays = days.filter(date => date && !isWeekend(date) && !isHoliday(date)).length;
    const workRecords = workHours.filter(wh => {
      const date = new Date(wh.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    return {
      totalDays,
      totalWorkdays,
      onTime: workRecords.filter(wr => wr.status === 'onTime').length,
      late: workRecords.filter(wr => wr.status === 'late').length,
      absent: totalWorkdays - workRecords.length
    };
  };

  return (
    <div className="space-y-6">
      <div className="w-full border border-gray-300 rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ◀
          </button>
          <h2 className="text-lg font-semibold">
            {months[selectedMonth]} {selectedYear + 543}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium py-2 bg-gray-50">
              {day}
            </div>
          ))}

          {days.map((date, index) => {
            const workStatus = getWorkStatus(date);
            return (
              <div
                key={index}
                onClick={() => date && onSelect(date)}
                className={`
                  p-2 text-center cursor-pointer relative min-h-[60px]
                  ${date ? 'hover:bg-blue-50 border rounded-lg' : ''}
                  ${date && isWeekend(date) ? 'bg-gray-50' : ''}
                  ${date && isHoliday(date) ? 'bg-red-50 text-red-600' : ''}
                  ${workStatus ? getStatusColor(workStatus.status) : ''}
                  ${date && selectedDate && date.toDateString() === selectedDate.toDateString() ? 'ring-2 ring-blue-500' : ''}
                `}
                title={date && isHoliday(date) ? getHolidayName(date) : ''}
              >
                {date && (
                  <>
                    <div className="font-medium">{date.getDate()}</div>
                    {workStatus && (
                      <div className="text-xs mt-1">
                        <div>{workStatus.checkIn}</div>
                        <div>{workStatus.checkOut}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* สถิติการทำงานประจำเดือน */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(getMonthlyStats()).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
          </div>
        ))}
      </div>

      {/* รายละเอียดวันที่เลือก */}
      {selectedDate && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-medium mb-2">รายละเอียดวันที่เลือก</h3>
          <div className="space-y-2">
            <p>วันที่: {selectedDate.toLocaleDateString('th-TH', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            {isHoliday(selectedDate) && (
              <p className="text-red-600">
                วันหยุด: {getHolidayName(selectedDate)}
              </p>
            )}
            {getWorkStatus(selectedDate) && (
              <>
                <p>เวลาเข้างาน: {getWorkStatus(selectedDate).checkIn}</p>
                <p>เวลาออกงาน: {getWorkStatus(selectedDate).checkOut}</p>
                <p className={`font-medium ${getStatusColor(getWorkStatus(selectedDate).status)}`}>
                  สถานะ: {getWorkStatus(selectedDate).status === 'onTime' ? 'ตรงเวลา' : 'มาสาย'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeeLayout = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const holidays = [
    { date: '2025-04-13', name: 'สงกรานต์' },
    { date: '2025-04-14', name: 'สงกรานต์' },
    { date: '2025-04-15', name: 'สงกรานต์' },
    // เพิ่มวันหยุดตามต้องการ
  ];

  return (
    <div>
      <EmployeeNavigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">ปฏิทินการทำงาน</h1>
            <p className="text-gray-600 mt-1">ดูข้อมูลการทำงาน การลา และวันหยุดต่างๆ</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              + ขอลางาน
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              ดูรายงาน
            </button>
          </div>
        </div>
        
        <Calendar 
          selectedDate={selectedDate} 
          onSelect={setSelectedDate} 
          holidays={holidays}
        />
      </div>
    </div>
  );
};

export default EmployeeLayout;
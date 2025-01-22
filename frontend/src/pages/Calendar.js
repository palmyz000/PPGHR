// Calendar.js component
const Calendar = ({ selectedDate, onSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
    // ฟังก์ชันสำหรับสร้างวันในเดือน
    const getDaysInMonth = (month, year) => {
      const date = new Date(year, month, 1);
      const days = [];
      const firstDay = new Date(year, month, 1).getDay();
      
      // เพิ่มวันว่างก่อนวันที่ 1
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }
      
      // เพิ่มวันในเดือน
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      
      return days;
    };
  
    // ฟังก์ชันสำหรับเปลี่ยนเดือน
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
  
    const days = getDaysInMonth(selectedMonth, selectedYear);
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  
    // ฟังก์ชันตรวจสอบว่าเป็นวันหยุดหรือไม่
    const isHoliday = (date) => {
      if (!date) return false;
      return holidays.some(holiday => 
        holiday.date === date.toISOString().split('T')[0]
      );
    };
  
    return (
      <div className="w-full">
        {/* ส่วนหัวปฏิทิน */}
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
  
        {/* ตารางปฏิทิน */}
        <div className="grid grid-cols-7 gap-1">
          {/* หัวตาราง (วัน) */}
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium py-2">
              {day}
            </div>
          ))}
          
          {/* วันที่ */}
          {days.map((date, index) => (
            <div
              key={index}
              onClick={() => date && onSelect(date)}
              className={`
                p-2 text-center cursor-pointer rounded-lg
                ${date ? 'hover:bg-blue-50' : ''}
                ${date && isHoliday(date) ? 'bg-red-50 text-red-600' : ''}
                ${
                  date && selectedDate && 
                  date.toDateString() === selectedDate.toDateString()
                    ? 'bg-blue-100'
                    : ''
                }
              `}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Calendar;
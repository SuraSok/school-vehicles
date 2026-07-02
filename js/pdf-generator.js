const logoBase64 = "data:image/png;base64,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";
// PDF Generation Module for School Vehicle Booking System
// Uses html2pdf.js CDN to generate clean, print-ready formal PDF documents

const pdfGenerator = {
    generateBookingPDF: function(bookingId) {
        // Fetch booking data
        const booking = db.getBookingById(bookingId);
        if (!booking) {
            alert('ไม่พบข้อมูลคำขอใช้รถยนต์');
            return;
        }

        // Fetch assignment if any
        const assignments = db.getAssignments();
        const assignment = assignments.find(a => a.booking_id === booking.id);
        
        let isSchoolCar = false;
        let isHiredCar = false;
        let vehicleLicense = '................................................';
        let driverName = '................................................';
        
        if (assignment) {
            const vehicle = db.getVehicles().find(v => v.id === assignment.vehicle_id);
            const driver = db.getDrivers().find(d => d.id === assignment.driver_id);
            
            if (vehicle) {
                vehicleLicense = vehicle.license_plate;
                if (vehicle.type === 'other' || vehicle.id === 6) {
                    isHiredCar = true;
                } else {
                    isSchoolCar = true;
                }
            }
            if (driver) {
                driverName = driver.full_name;
            }
        }

        // Fetch department
        const departments = db.getDepartments();
        const dept = departments.find(d => d.id === booking.department_id);
        const deptName = dept ? dept.name : '................................................';

        // Format dates
        const months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        const formatThaiDate = (dateStr) => {
            if (!dateStr) return '........................';
            const date = new Date(dateStr);
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear() + 543;
            return `${day} ${month} พ.ศ. ${year}`;
        };

        const startDate = new Date(booking.start_date_time);
        const endDate = new Date(booking.end_date_time);
        
        const startDay = startDate.getDate();
        const startMonth = months[startDate.getMonth()];
        const startYear = startDate.getFullYear() + 543;
        const startHour = String(startDate.getHours()).padStart(2, '0');
        const startMin = String(startDate.getMinutes()).padStart(2, '0');

        const endDay = endDate.getDate();
        const endMonth = months[endDate.getMonth()];
        const endYear = endDate.getFullYear() + 543;
        const endHour = String(endDate.getHours()).padStart(2, '0');
        const endMin = String(endDate.getMinutes()).padStart(2, '0');

        const startDayFormatted = `${startDay}`;
        const endDayFormatted = `${endDay}`;
        const startHourFormatted = `${startHour}.${startMin}`;
        const endHourFormatted = `${endHour}.${endMin}`;

        const isSameDay = startDate.toDateString() === endDate.toDateString();

        // Determine purpose type
        const objText = booking.objective.toLowerCase();
        let isCoord = false;
        let isMeeting = false;
        let isSeminar = false;
        let isOther = false;
        let otherText = '';

        if (objText.includes('ติดต่อ') || objText.includes('ประสานงาน')) {
            isCoord = true;
        } else if (objText.includes('ประชุม')) {
            isMeeting = true;
        } else if (objText.includes('อบรม') || objText.includes('สัมมนา')) {
            isSeminar = true;
        } else {
            isOther = true;
            otherText = booking.objective;
        }

        // Try to parse teachers and students robustly
        let teacherCount = 0;
        let studentCount = 0;
        const details = booking.passenger_details || '';
        
        // 1. Look for explicit mentions in passenger details
        const teacherExpMatch = details.match(/(?:ครู|ครูผู้ควบคุม|ครูผู้ดูแล|ครูผู้ประสานงาน|อาจารย์)\s*(?:จำนวน)?\s*(\d+)\s*(?:คน|ท่าน)/i);
        const studentExpMatch = details.match(/(?:นักเรียน|เด็ก|ผู้เรียน)\s*(?:จำนวน)?\s*(\d+)\s*คน/i);
        
        if (teacherExpMatch) {
            teacherCount = parseInt(teacherExpMatch[1]);
        }
        if (studentExpMatch) {
            studentCount = parseInt(studentExpMatch[1]);
        }
        
        // 2. Line-by-line fallback parsing if counts are still 0
        if (teacherCount === 0 || studentCount === 0) {
            const lines = details.split('\n');
            let lineTeacherCount = 0;
            let lineStudentCount = 0;
            
            lines.forEach(line => {
                const cleanLine = line.trim();
                if (!cleanLine) return;
                
                if (cleanLine.includes('ครู') || cleanLine.includes('อาจารย์')) {
                    lineTeacherCount++;
                } else if (cleanLine.includes('ด.ช.') || cleanLine.includes('ด.ญ.') || cleanLine.includes('เด็กชาย') || cleanLine.includes('เด็กหญิง') || cleanLine.includes('นักเรียน')) {
                    lineStudentCount++;
                }
            });
            
            if (teacherCount === 0 && lineTeacherCount > 0) {
                teacherCount = lineTeacherCount;
            }
            if (studentCount === 0 && lineStudentCount > 0) {
                studentCount = lineStudentCount;
            }
        }
        
        // 3. Fallback to total count if still 0
        if (teacherCount === 0 && studentCount === 0) {
            const total = parseInt(booking.passenger_count) || 0;
            if (total > 0) {
                if (details.includes('ครู') || details.includes('ท่าน')) {
                    teacherCount = total;
                    studentCount = 0;
                } else {
                    teacherCount = 1; // Requester
                    studentCount = Math.max(0, total - 1);
                }
            }
        }

        // Define status and position variables
        const position = booking.requester_position || '................................';
        const isApproved = booking.status === 'approved' || booking.status === 'completed';
        const isRejected = booking.status === 'rejected';

        // Create HTML element to print
        const element = document.createElement('div');
        element.style.padding = '0';
        element.style.fontFamily = "'TH Sarabun PSK', 'THSarabunNew', 'Sarabun', sans-serif";
        element.style.color = '#000';
        element.style.backgroundColor = '#fff';
        element.style.fontSize = '13.5px';
        element.style.lineHeight = '1.75';
        element.style.width = '700px'; // Standard A4 width in px for pdf rendering
        element.style.boxSizing = 'border-box';

        // Inline stylesheet for custom print rendering
        element.innerHTML = `
            <style>
                .memo-header {
                    position: relative;
                    text-align: center;
                    margin-bottom: 5px;
                    height: 50px;
                }
                .memo-logo {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 45px;
                    height: 45px;
                    object-fit: contain;
                }
                .memo-title {
                    font-size: 22px;
                    font-weight: bold;
                    margin: 0;
                    line-height: 50px;
                }
                .underlined-text {
                    font-weight: bold;
                    border-bottom: 1px solid #666;
                    padding: 0 4px 1px 4px;
                    margin: 0 2px;
                    display: inline;
                    white-space: pre-wrap;
                }
                .pdf-body-p {
                    text-indent: 40px;
                    margin-bottom: 3px;
                    text-align: left;
                    line-height: 2.0;
                    font-size: 13.5px;
                }
                .pdf-line {
                    margin-bottom: 3px;
                    text-align: left;
                    line-height: 2.0;
                    font-size: 13.5px;
                }
                .pdf-checkboxes {
                    margin-left: 40px;
                    margin-bottom: 3px;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    line-height: 2.0;
                    font-size: 13.5px;
                }
            </style>
            
            <!-- Memo Header Section -->
            <div class="memo-header">
                <img src="${logoBase64}" class="memo-logo" alt="School Logo">
                <h1 class="memo-title">บันทึกข้อความ</h1>
            </div>
            
            <!-- Metadata Section -->
            <div style="margin-bottom: 3px; font-size: 13.5px;">
                <span style="font-weight: bold; width: 80px; display: inline-block;">ส่วนราชการ</span>
                <span>โรงเรียนมัธยมวชิราลงกรณวราราม สพม.นครราชสีมา</span>
            </div>
            
            <div style="margin-bottom: 3px; font-size: 13.5px; display: flex; justify-content: space-between;">
                <div style="flex-grow: 1; display: flex;">
                    <span style="font-weight: bold; width: 30px;">ที่</span>
                    <span style="flex-grow: 1; border-bottom: 1px dotted #000; padding-left: 5px; padding-bottom: 2px; font-weight: bold; min-width: 150px;">${booking.booking_reference}</span>
                </div>
                <div style="width: 350px; display: flex; margin-left: 20px;">
                    <span style="font-weight: bold; width: 50px; text-align: center;">วันที่</span>
                    <span style="flex-grow: 1; border-bottom: 1px dotted #000; padding-left: 5px; padding-bottom: 2px; font-weight: bold;">${formatThaiDate(booking.created_at)}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 5px; font-size: 13.5px; padding-bottom: 2px; border-bottom: 2px solid #000;">
                <span style="font-weight: bold; width: 50px; display: inline-block;">เรื่อง</span>
                <span style="font-weight: bold;">ขออนุญาตใช้รถยนต์ส่วนกลางของโรงเรียนไปราชการ</span>
            </div>
 
            <div style="margin-bottom: 5px; font-size: 13.5px;">
                <span style="font-weight: bold; margin-right: 8px;">เรียน</span> ผู้อำนวยการโรงเรียนมัธยมวชิราลงกรณวราราม
            </div>
 
            <!-- Body Section -->
            <div class="pdf-body-p">
                ด้วยข้าพเจ้า (นาย / นาง /นางสาว /ยศ) <span class="underlined-text">${booking.requester_name}</span>
                ตำแหน่ง <span class="underlined-text">${position}</span> กลุ่มสาระการเรียนรู้ / กลุ่มงาน <span class="underlined-text">${deptName}</span>
                มีความประสงค์ขอใช้รถยนต์ส่วนกลางของโรงเรียน เพื่อ &nbsp;<span class="underlined-text">&nbsp;${booking.objective}&nbsp;</span>
            </div>
 
            <div class="pdf-checkboxes">
                <div>
                    <span>${isCoord ? '(✓)' : '( &nbsp; )'}</span> ไปติดต่อประสานงานราชการ
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>${isMeeting ? '(✓)' : '( &nbsp; )'}</span> ประชุม
                </div>
                <div>
                    <span>${isSeminar ? '(✓)' : '( &nbsp; )'}</span> อบรม / สัมมนา
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>${isOther ? '(✓)' : '( &nbsp; )'}</span> อื่นๆ (โปรดระบุ) &nbsp;<span class="underlined-text">&nbsp;${otherText || '....................................................................'}&nbsp;</span>
                </div>
            </div>
 
            <div class="pdf-body-p">
                จำนวนผู้โดยสาร ครู <span class="underlined-text">${teacherCount}</span> คน 
                นักเรียน <span class="underlined-text">${studentCount}</span> คน 
                ณ (โปรดระบุสถานที่) <span class="underlined-text">${booking.destination}</span>
            </div>
 
            <div class="pdf-line">
                ในวันที่ <span class="underlined-text">${startDayFormatted}</span> 
                เดือน <span class="underlined-text">${startMonth}</span> 
                พ.ศ. <span class="underlined-text">${startYear}</span> 
                เวลา <span class="underlined-text">${startHourFormatted}</span> น.
            </div>
            
            <div class="pdf-line">
                ถึงวันที่ <span class="underlined-text">${endDayFormatted}</span> 
                เดือน <span class="underlined-text">${endMonth}</span> 
                พ.ศ. <span class="underlined-text">${endYear}</span> 
                เวลา <span class="underlined-text">${endHourFormatted}</span> น.
            </div>
 
            <div class="pdf-line" style="margin-bottom: 5px;">
                โดยใช้น้ำมันเชื้อเพลิงจาก &nbsp;&nbsp;
                <span>(✓)</span> ส่วนกลาง &nbsp;&nbsp;
                <span>( &nbsp; )</span> ส่วนตัว &nbsp;&nbsp;
                <span>( &nbsp; )</span> อื่นๆ (โปรดระบุ) ........................................
            </div>
 
            <div class="pdf-body-p">
                จึงเรียนมาเพื่อโปรดพิจารณา
            </div>
 
            <!-- Requester Signature -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 5px; padding-right: 20px;">
                <div style="text-align: center; width: 250px; font-size: 13.5px; line-height: 1.4;">
                    <br>ลงชื่อ ..........................................<br>
                    ( <span style="font-weight: bold;">${booking.requester_name}</span> )<br>
                    ผู้ขอใช้รถ
                </div>
            </div>
 
            <!-- Section 2: Vehicle Head Opinion -->
            <div style="padding: 3px 0; margin-bottom: 5px; border-top: 1px solid #000; padding-top: 3px;">
                <h4 style="font-size: 13.5px; font-weight: bold; margin: 0 0 2px 0;">ความคิดเห็นของหัวหน้างานยานพาหนะและบริการสาธารณะ</h4>
                <div style="margin-bottom: 2px; font-size: 13px; line-height: 1.8;">
                    <span>${isSchoolCar ? '(✓)' : '( &nbsp; )'}</span> มอบหมายหน้าที่ให้ &nbsp;<span class="underlined-text">&nbsp;${isSchoolCar ? driverName : '................................................'}&nbsp;</span>&nbsp; เป็นพนักงานขับรถ <br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; และใช้รถยนต์หมายเลขทะเบียน &nbsp;<span class="underlined-text">&nbsp;${isSchoolCar ? vehicleLicense : '................................................'}&nbsp;</span>
                </div>
                <div style="margin-bottom: 3px; font-size: 13px; line-height: 1.6;">
                    <span>${isHiredCar ? '(✓)' : '( &nbsp; )'}</span> รถโรงเรียนไม่ว่าง ให้ไปรถรับจ้างตามระเบียบสำนักนายกฯ
                </div>
                <div style="display: flex; justify-content: flex-end; padding-right: 20px;">
                    <div style="text-align: center; width: 250px; font-size: 13px; line-height: 1.4;">
                        <br>ลงชื่อ ..........................................<br>
                        ( นายสิรวิชญ์ หล้าพันธ์ )<br>
                        หัวหน้างานยานพาหนะ
                    </div>
                </div>
            </div>
 
            <!-- Section 3: Approver & Director Order side-by-side -->
            <div style="display: flex; justify-content: space-between; gap: 20px; border-top: 1px solid #000; padding-top: 3px;">
                <!-- Left Box: Deputy Director -->
                <div style="width: 50%; display: flex; flex-direction: column; justify-content: space-between; min-height: 95px;">
                    <div>
                        <h4 style="font-size: 13.5px; font-weight: bold; margin: 0 0 2px 0;">ความคิดเห็นของรองผู้อำนวยการกลุ่มบริหารทั่วไป</h4>
                        <div style="font-size: 12.5px; line-height: 1.5; display: flex; flex-direction: column; gap: 1px;">
                            <div><span>${isApproved ? '(✓)' : '( &nbsp; )'}</span> เสนอเพื่อโปรดพิจารณา</div>
                            <div><span>${isApproved ? '(✓)' : '( &nbsp; )'}</span> เห็นสมควรอนุญาต</div>
                            <div><span>${isRejected ? '(✓)' : '( &nbsp; )'}</span> ไม่อนุญาต เนื่องจาก <span style="font-weight: bold; border-bottom: 1px dotted #000; padding: 0 4px 1px 4px; display: inline;">${isRejected ? booking.rejection_reason : '................................'}</span></div>
                        </div>
                    </div>
                    <div style="text-align: center; font-size: 13px; margin-top: 5px; line-height: 1.4;">
                        <br>ลงชื่อ ..........................................<br>
                        ( นายสุรวุฒิ ซอกรัมย์ )<br>
                        รองผู้อำนวยการกลุ่มบริหารทั่วไป
                    </div>
                </div>
 
                <!-- Right Box: Director -->
                <div style="width: 50%; display: flex; flex-direction: column; justify-content: space-between; min-height: 95px;">
                    <div>
                        <h4 style="font-size: 13.5px; font-weight: bold; margin: 0 0 2px 0;">คำสั่งของผู้อำนวยการโรงเรียน</h4>
                        <div style="font-size: 12.5px; line-height: 1.5; display: flex; flex-direction: column; gap: 1px;">
                            <div><span>${isApproved ? '(✓)' : '( &nbsp; )'}</span> ทราบ</div>
                            <div><span>${isApproved ? '(✓)' : '( &nbsp; )'}</span> อนุญาต</div>
                            <div><span>${isRejected ? '(✓)' : '( &nbsp; )'}</span> ไม่อนุญาต เนื่องจาก <span style="font-weight: bold; border-bottom: 1px dotted #000; padding: 0 4px 1px 4px; display: inline;">${isRejected ? booking.rejection_reason : '................................'}</span></div>
                        </div>
                    </div>
                    <div style="text-align: center; font-size: 13px; margin-top: 5px; line-height: 1.4;">
                        <br>ลงชื่อ ..........................................<br>
                        ( นายอิสรา รักชาติ )<br>
                        ผู้อำนวยการโรงเรียนมัธยมวชิราลงกรณวราราม
                    </div>
                </div>
            </div>
        `;

        // Configure PDF rendering options
        const opt = {
            margin:       [15, 12, 10, 12], // 15mm top margin to shift header down, 10mm bottom, 12mm left/right
            filename:     `ใบขอใช้รถ_${booking.booking_reference}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Render as PDF
        document.body.appendChild(element);
        
        // Dynamically scale font sizes, line heights, and margins to guarantee fitting on a single A4 page
        let maxLoops = 12;
        let baseFontSize = 13.5;
        let baseLineHeight = 2.0;
        
        while (element.offsetHeight > 920 && maxLoops > 0) {
            baseFontSize -= 0.3;
            baseLineHeight = Math.max(1.3, baseLineHeight - 0.05);
            
            element.style.fontSize = `${baseFontSize}px`;
            element.style.lineHeight = `${baseLineHeight}`;
            
            // Adjust body classes
            const pdfPs = element.querySelectorAll('.pdf-body-p, .pdf-line, .pdf-checkboxes');
            pdfPs.forEach(p => {
                p.style.fontSize = `${baseFontSize}px`;
                p.style.lineHeight = `${baseLineHeight}`;
                const currentMb = parseFloat(p.style.marginBottom) || 3;
                p.style.marginBottom = `${Math.max(1, currentMb - 0.5)}px`;
            });
            
            // Adjust elements with custom inline font-sizes
            const customFontElems = element.querySelectorAll('[style*="font-size"]');
            customFontElems.forEach(el => {
                const currentFs = parseFloat(el.style.fontSize);
                if (!isNaN(currentFs)) {
                    el.style.fontSize = `${Math.max(10.5, currentFs - 0.25)}px`;
                }
            });
            
            // Adjust elements with custom inline line-heights
            const customLhElems = element.querySelectorAll('[style*="line-height"]');
            customLhElems.forEach(el => {
                const currentLh = parseFloat(el.style.lineHeight);
                if (!isNaN(currentLh)) {
                    el.style.lineHeight = `${Math.max(1.2, currentLh - 0.05)}`;
                }
            });
            
            // Adjust elements with custom inline margin-bottoms
            const customMbElems = element.querySelectorAll('[style*="margin-bottom"]');
            customMbElems.forEach(el => {
                const currentMb = parseFloat(el.style.marginBottom);
                if (!isNaN(currentMb)) {
                    el.style.marginBottom = `${Math.max(1, currentMb - 0.5)}px`;
                }
            });
            
            // Adjust headings
            const headings = element.querySelectorAll('h1, h4');
            headings.forEach(h => {
                const currentFs = parseFloat(window.getComputedStyle(h).fontSize) || 15;
                h.style.fontSize = `${Math.max(11, currentFs - 0.3)}px`;
            });
            
            maxLoops--;
        }
        
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save().then(() => {
                document.body.removeChild(element);
            }).catch(err => {
                console.error(err);
                document.body.removeChild(element);
                alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่อีกครั้ง');
            });
        } else {
            const printWin = window.open('', '_blank');
            printWin.document.write('<html><head><title>Print Request</title>');
            printWin.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">');
            printWin.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-th-sarabun-new@1.0.0/css/th-sarabun-new.min.css">');
            printWin.document.write('<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">');
            printWin.document.write('<style>body { font-family: "TH Sarabun PSK", "THSarabunNew", "Sarabun", sans-serif; padding: 20px; }</style>');
            printWin.document.write('</head><body>');
            printWin.document.write(element.innerHTML);
            printWin.document.close();
            printWin.print();
        }
    },
    generatePassengerListPDF(bookingId) {
        const booking = db.getBookings().find(b => b.id === bookingId);
        if (!booking) {
            alert('ไม่พบข้อมูลการขอใช้รถ');
            return;
        }

        const depts = db.getDepartments();
        const drivers = db.getDrivers();
        const vehicles = db.getVehicles();
        const assignments = db.getAssignments();

        const dept = depts.find(d => d.id === booking.department_id);
        const deptName = dept ? dept.name : 'ทั่วไป';
        
        // Find vehicle and driver details
        const assignment = assignments.find(a => a.booking_id === booking.id);
        const vehicle = assignment ? vehicles.find(v => v.id === assignment.vehicle_id) : null;
        const driver = assignment ? drivers.find(d => d.id === assignment.driver_id) : null;
        
        const vehicleInfo = vehicle ? `${vehicle.type === 'new_van' ? 'รถตู้ใหม่' : vehicle.type === 'old_van' ? 'รถตู้เก่า' : vehicle.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'รถยนต์ส่วนกลาง'} ทะเบียน ${vehicle.license_plate}` : 'ยังไม่ได้จัดสรรรถยนต์';
        const driverName = driver ? driver.full_name : 'ยังไม่ได้จัดสรรพนักงานขับรถ';

        // Parse date values
        const months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        
        const startDate = new Date(booking.start_date_time);
        const endDate = new Date(booking.end_date_time);
        
        const startDayFormatted = startDate.getDate();
        const startMonth = months[startDate.getMonth()];
        const startYear = startDate.getFullYear() + 543;
        const startHourFormatted = String(startDate.getHours()).padStart(2, '0') + '.' + String(startDate.getMinutes()).padStart(2, '0');

        const endDayFormatted = endDate.getDate();
        const endMonth = months[endDate.getMonth()];
        const endYear = endDate.getFullYear() + 543;
        const endHourFormatted = String(endDate.getHours()).padStart(2, '0') + '.' + String(endDate.getMinutes()).padStart(2, '0');

        // Parse passengers list
        const rawPassengers = booking.passenger_details || '';
        const passengers = rawPassengers.split(/[\n,;/]|\s*และ\s*|\s*\d+[\.\)]\s*/)
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.includes('รวมนักเรียน') && !line.includes('ครูผู้ควบคุม'))
            .map(line => {
                // Remove numbering prefixes
                return line.replace(/^\d+[\.\)\s-]*|^[-\*\u2022]\s*/, '').trim();
            })
            .filter(name => name.length > 0);

        // Create PDF element
        const element = document.createElement('div');
        element.style.padding = '0';
        element.style.fontFamily = "'TH Sarabun PSK', 'THSarabunNew', 'Sarabun', sans-serif";
        element.style.color = '#000';
        element.style.backgroundColor = '#fff';
        element.style.fontSize = '13px';
        element.style.lineHeight = '1.5';
        element.style.width = '700px';
        element.style.boxSizing = 'border-box';

        element.innerHTML = `
            <style>
                .pl-header {
                    text-align: center;
                    margin-bottom: 10px;
                }
                .pl-title {
                    font-size: 17px;
                    font-weight: bold;
                    margin: 0;
                    line-height: 1.3;
                }
                .pl-subtitle {
                    font-size: 13.5px;
                    font-weight: bold;
                    margin: 0 0 5px 0;
                }
                .pl-details-box {
                    border: 1px solid #ccc;
                    padding: 8px 12px;
                    border-radius: 4px;
                    margin-bottom: 12px;
                    line-height: 1.4;
                }
                .pl-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }
                .pl-table th, .pl-table td {
                    border: 1px solid #000;
                    padding: 4px 8px;
                    font-size: 12.5px;
                }
                .pl-table th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                    text-align: center;
                }
                .pl-table td.center {
                    text-align: center;
                }
                .pl-sign-container {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 15px;
                }
                .pl-sign-box {
                    text-align: center;
                    width: 280px;
                    line-height: 1.4;
                    font-size: 13px;
                }
            </style>
            
            <div class="pl-header">
                <img src="${logoBase64}" style="width: 55px; height: 55px; object-fit: contain; margin-bottom: 5px;" alt="Logo">
                <h1 class="pl-title">บัญชีรายชื่อผู้เดินทางแนบท้ายใบขอใช้รถยนต์ส่วนกลาง</h1>
                <h2 class="pl-subtitle">โรงเรียนมัธยมวชิราลงกรณวราราม</h2>
            </div>
            
            <div class="pl-details-box">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div><strong>อ้างอิงใบขอใช้รถเลขที่:</strong> ${booking.booking_reference}</div>
                    <div><strong>ผู้เสนอขอใช้รถ:</strong> ${booking.requester_name} (ตำแหน่ง: ${booking.requester_position || 'ครู'})</div>
                    <div><strong>กลุ่มสาระฯ / กลุ่มงาน:</strong> ${deptName}</div>
                    <div><strong>ยานพาหนะที่จัดสรร:</strong> ${vehicleInfo}</div>
                    <div><strong>พนักงานขับรถ:</strong> ${driverName}</div>
                    <div><strong>ปลายทางปฏิบัติราชการ:</strong> ${booking.destination}</div>
                </div>
                <div style="margin-top: 6px; border-top: 1px dashed #ccc; padding-top: 6px;">
                    <strong>วันเวลาออกเดินทาง:</strong> วันที่ ${startDayFormatted} ${startMonth} พ.ศ. ${startYear} เวลา ${startHourFormatted} น.
                </div>
                <div>
                    <strong>วันเวลาเดินทางกลับ:</strong> วันที่ ${endDayFormatted} ${endMonth} พ.ศ. ${endYear} เวลา ${endHourFormatted} น.
                </div>
                <div style="margin-top: 4px;">
                    <strong>วัตถุประสงค์:</strong> ${booking.objective}
                </div>
            </div>

            <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">รายชื่อผู้เดินทางร่วมเดินทางทั้งหมด จำนวน ${passengers.length} คน</h3>
            <table class="pl-table">
                <thead>
                    <tr>
                        <th style="width: 80px;">ลำดับที่</th>
                        <th>ชื่อ-นามสกุล / สังกัด / รายละเอียด</th>
                    </tr>
                </thead>
                <tbody>
                    ${passengers.length === 0 ? '<tr><td colspan="2" style="text-align: center;">ไม่มีรายชื่อผู้เดินทางร่วมระบุในระบบ</td></tr>' : passengers.map((p, idx) => `
                        <tr>
                            <td class="center">${idx + 1}</td>
                            <td>${p}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="pl-sign-container">
                <div class="pl-sign-box">
                    ลงชื่อ ........................................................... ผู้เสนอขอและแนบรายชื่อ<br>
                    ( <span style="font-weight: bold;">${booking.requester_name}</span> )<br>
                    ตำแหน่ง ${booking.requester_position || 'ครู'}
                </div>
            </div>
        `;

        const opt = {
            margin:       [10, 15, 10, 15],
            filename:     `รายชื่อผู้เดินทางแนบท้าย_${booking.booking_reference}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        document.body.appendChild(element);
        
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save().then(() => {
                document.body.removeChild(element);
            }).catch(err => {
                console.error(err);
                document.body.removeChild(element);
                alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่อีกครั้ง');
            });
        } else {
            const printWin = window.open('', '_blank');
            printWin.document.write('<html><head><title>Print Passengers List</title>');
            printWin.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">');
            printWin.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-th-sarabun-new@1.0.0/css/th-sarabun-new.min.css">');
            printWin.document.write('<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">');
            printWin.document.write('<style>body { font-family: "TH Sarabun PSK", "THSarabunNew", "Sarabun", sans-serif; padding: 20px; }</style>');
            printWin.document.write('</head><body>');
            printWin.document.write(element.innerHTML);
            printWin.document.close();
            printWin.print();
            document.body.removeChild(element);
        }
    }
};

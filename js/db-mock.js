// Mock Database Layer for VK School Vehicle Booking System
// Stored in localStorage for persistent client-side data

const DB_KEYS = {
    DEPARTMENTS: 'school_vehicle_departments',
    USERS: 'school_vehicle_users',
    VEHICLES: 'school_vehicle_vehicles',
    DRIVERS: 'school_vehicle_drivers',
    BOOKINGS: 'school_vehicle_bookings',
    ASSIGNMENTS: 'school_vehicle_assignments',
    POST_TRIP_LOGS: 'school_vehicle_post_trip_logs',
    MAINTENANCE_LOGS: 'school_vehicle_maintenance_logs'
};

// Seed initial data if not present
function initializeMockDatabase() {
    // Force clean old cache if departments are incorrect or deprecated
    const currentDepts = JSON.parse(localStorage.getItem(DB_KEYS.DEPARTMENTS)) || [];
    const currentVehicles = JSON.parse(localStorage.getItem(DB_KEYS.VEHICLES)) || [];
    const currentDrivers = JSON.parse(localStorage.getItem(DB_KEYS.DRIVERS)) || [];
    
    const currentUsers = JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
    const hasHeaderUser = currentUsers.some(u => u.username === 'header');
    const adminIsSuper = currentUsers.some(u => u.username === 'admin' && u.role === 'superadmin');
    
    const needsMigration = currentDepts.length === 0 || 
                          currentDepts.length !== 12 || 
                          currentDepts.some(d => d.name.includes('กลุ่มสาระการเรียนรู้')) ||
                          currentVehicles.length < 6 ||
                          currentDrivers.length < 4 ||
                          !hasHeaderUser ||
                          !adminIsSuper;
                          
    if (needsMigration) {
        localStorage.removeItem(DB_KEYS.DEPARTMENTS);
        localStorage.removeItem(DB_KEYS.USERS);
        localStorage.removeItem(DB_KEYS.VEHICLES);
        localStorage.removeItem(DB_KEYS.DRIVERS);
        localStorage.removeItem(DB_KEYS.BOOKINGS);
        localStorage.removeItem(DB_KEYS.ASSIGNMENTS);
        localStorage.removeItem(DB_KEYS.POST_TRIP_LOGS);
        localStorage.removeItem(DB_KEYS.MAINTENANCE_LOGS);
    }

    // 1. Departments (Updated with 12 main school departments)
    if (!localStorage.getItem(DB_KEYS.DEPARTMENTS)) {
        const initialDepartments = [
            { id: 1, name: 'ภาษาไทย' },
            { id: 2, name: 'คณิตศาสตร์' },
            { id: 3, name: 'วิทยาศาสตร์และเทคโนโลยี' },
            { id: 4, name: 'สังคมศึกษาฯ' },
            { id: 5, name: 'สุขศึกษาและพลศึกษา' },
            { id: 6, name: 'ศิลปะ' },
            { id: 7, name: 'การงานอาชีพ' },
            { id: 8, name: 'ภาษาต่างประเทศ' },
            { id: 9, name: 'กลุ่มบริหารงานวิชาการ' },
            { id: 10, name: 'กลุ่มบริหารงบประมาณ' },
            { id: 11, name: 'กลุ่มบริหารงานบุคคล' },
            { id: 12, name: 'กลุ่มบริหารงานทั่วไป' }
        ];
        localStorage.setItem(DB_KEYS.DEPARTMENTS, JSON.stringify(initialDepartments));
    }

    // 2. Users (Role: admin, approver, driver, executive)
    if (!localStorage.getItem(DB_KEYS.USERS)) {
        const initialUsers = [
            { id: 1, username: 'admin', password: 'password', full_name: 'นายสมเจตน์ จัดการดี', role: 'superadmin', email: 'admin@vkschool.ac.th', phone: '081-111-2222', status: 'active', department_id: 12 },
            { id: 2, username: 'approver', password: 'password', full_name: 'นางวิภา วัฒนบริหาร', role: 'approver', email: 'wipa.w@vkschool.ac.th', phone: '082-222-3333', status: 'active', department_id: 12 },
            { id: 3, username: 'driver1', password: 'password', full_name: 'นายสมชาย ใจดี', role: 'driver', email: 'somchai.d@vkschool.ac.th', phone: '083-333-4444', status: 'active', department_id: 12 },
            { id: 4, username: 'driver2', password: 'password', full_name: 'นายสมศักดิ์ รักดี', role: 'driver', email: 'somsak.r@vkschool.ac.th', phone: '084-444-5555', status: 'active', department_id: 12 },
            { id: 5, username: 'director', password: 'password', full_name: 'ดร.มานะ รักโรงเรียน', role: 'executive', email: 'mana.dir@vkschool.ac.th', phone: '085-555-6666', status: 'active', department_id: 12 },
            { id: 6, username: 'header', password: 'password', full_name: 'นายหัวหน้า ยานพาหนะ', role: 'admin', email: 'header@vkschool.ac.th', phone: '086-666-7777', status: 'active', department_id: 12 }
        ];
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(initialUsers));
    }

    // 3. Vehicles
    if (!localStorage.getItem(DB_KEYS.VEHICLES)) {
        const initialVehicles = [
            { id: 1, license_plate: 'นข-9988 นครราชสีมา', brand: 'Toyota', model: 'Commuter 2024', type: 'new_van', capacity: 13, status: 'available', current_mileage: 15400, standard_fuel_consumption: 11.5, purchase_date: '2024-02-10', purchase_cost: 1350000 },
            { id: 2, license_plate: 'นข-9999 นครราชสีมา', brand: 'Toyota', model: 'Commuter 2023', type: 'new_van', capacity: 13, status: 'available', current_mileage: 28200, standard_fuel_consumption: 11.0, purchase_date: '2023-05-15', purchase_cost: 1350000 },
            { id: 3, license_plate: 'ฮง-1234 นครราชสีมา', brand: 'Toyota', model: 'Commuter 2015', type: 'old_van', capacity: 13, status: 'available', current_mileage: 184500, standard_fuel_consumption: 8.5, purchase_date: '2015-08-20', purchase_cost: 1100000 },
            { id: 4, license_plate: 'ฮง-5678 นครราชสีมา', brand: 'Toyota', model: 'Commuter 2013', type: 'old_van', capacity: 13, status: 'maintenance', current_mileage: 245000, standard_fuel_consumption: 7.8, purchase_date: '2013-11-01', purchase_cost: 1100000 },
            { id: 5, license_plate: 'สข-6666 นครราชสีมา', brand: 'Isuzu', model: 'Elf 6-Wheeler 2018', type: 'six_wheeler_truck', capacity: 24, status: 'available', current_mileage: 82100, standard_fuel_consumption: 6.2, purchase_date: '2018-04-12', purchase_cost: 1550000 },
            { id: 6, license_plate: 'จ้างเหมาบริการภายนอก', brand: 'รถบัส/รถตู้', model: 'จ้างเหมา', type: 'other', capacity: 50, status: 'available', current_mileage: 0, standard_fuel_consumption: 10.0, purchase_date: '2026-01-01', purchase_cost: 0 }
        ];
        localStorage.setItem(DB_KEYS.VEHICLES, JSON.stringify(initialVehicles));
    }

    // 4. Drivers
    if (!localStorage.getItem(DB_KEYS.DRIVERS)) {
        const initialDrivers = [
            { id: 1, user_id: 3, full_name: 'นายสมชาย ใจดี', license_number: 'ท.2-00123/60', phone: '083-333-4444', status: 'available' },
            { id: 2, user_id: 4, full_name: 'นายสมศักดิ์ รักดี', license_number: 'ท.2-00567/62', phone: '084-444-5555', status: 'available' },
            { id: 3, user_id: null, full_name: 'นายอุดม พากเพียร', license_number: 'ท.3-00999/58', phone: '089-999-8888', status: 'available' },
            { id: 4, user_id: null, full_name: 'คนขับรถจ้างเหมาบริการภายนอก/พนักงานขับภายนอก', license_number: 'ทั่วไป', phone: '-', status: 'available' }
        ];
        localStorage.setItem(DB_KEYS.DRIVERS, JSON.stringify(initialDrivers));
    }

    // 5. Bookings
    if (!localStorage.getItem(DB_KEYS.BOOKINGS)) {
        const initialBookings = [
            { 
                id: 1, 
                booking_reference: 'SV-202605-0001', 
                requester_name: 'ครูสมศรี นารีทอง', 
                requester_phone: '086-123-4567', 
                requester_position: 'ครู', 
                department_id: 2, // คณิตศาสตร์
                objective: 'นำนักเรียนเข้าร่วมแข่งขันคณิตศาสตร์โอลิมปิกระดับจังหวัด', 
                destination: 'โรงเรียนนครปฐมวิทยาลัย จ.นครปฐม', 
                passenger_count: 8, 
                passenger_details: '1. ด.ช. ก ไก่\n2. ด.ช. ข ไข่\n3. ครูสมศรี นารีทอง\n4. ครูสมเกียรติ รักเรียน\n(รวมนักเรียน 6 คน ครูผู้ควบคุม 2 คน)', 
                start_date_time: '2026-05-15T07:30', 
                end_date_time: '2026-05-15T16:30', 
                requested_vehicle_type: 'new_van', 
                status: 'completed', 
                approver_id: 2, 
                approved_at: '2026-05-12T09:15:22Z', 
                rejection_reason: null, 
                created_at: '2026-05-10T08:00:00Z' 
            },
            { 
                id: 2, 
                booking_reference: 'SV-202605-0002', 
                requester_name: 'ครูปัญญา ฉลาดล้ำ', 
                requester_phone: '087-765-4321', 
                requester_position: 'ครู', 
                department_id: 3, // วิทยาศาสตร์ฯ
                objective: 'นำนักเรียนโครงงานวิทยาศาสตร์แสดงงานนวัตกรรม', 
                destination: 'ศูนย์แสดงสินค้าและการประชุม อิมแพ็ค เมืองทองธานี จ.นนทบุรี', 
                passenger_count: 10, 
                passenger_details: '1. ด.ช. หนึ่ง\n2. ด.ญ. สอง\n3. ด.ญ. สาม\n4. ครูปัญญา ฉลาดล้ำ', 
                start_date_time: '2026-05-18T06:00', 
                end_date_time: '2026-05-20T18:00', 
                requested_vehicle_type: 'new_van', 
                status: 'completed', 
                approver_id: 2, 
                approved_at: '2026-05-14T14:30:10Z', 
                rejection_reason: null, 
                created_at: '2026-05-13T10:11:00Z' 
            },
            { 
                id: 3, 
                booking_reference: 'SV-202606-0001', 
                requester_name: 'ครูสมปอง ใฝ่รู้', 
                requester_phone: '085-321-7890', 
                requester_position: 'ครู', 
                department_id: 12, // กลุ่มบริหารงานทั่วไป
                objective: 'พานักเรียนค่ายคุณธรรมศึกษาอบรม ณ วัดพุทธาวาส', 
                destination: 'วัดพุทธาวาส จ.สุพรรณบุรี', 
                passenger_count: 22, 
                passenger_details: 'รายชื่อนักเรียนกลุ่มแกนนำสภานักเรียน จำนวน 20 คน และครูผู้ดูแล 2 คน', 
                start_date_time: '2026-06-14T07:00', 
                end_date_time: '2026-06-14T17:00', 
                requested_vehicle_type: 'six_wheeler_truck', 
                status: 'approved', 
                approver_id: 2, 
                approved_at: '2026-06-11T10:00:00Z', 
                rejection_reason: null, 
                created_at: '2026-06-08T09:30:00Z' 
            },
            { 
                id: 4, 
                booking_reference: 'SV-202606-0002', 
                requester_name: 'ครูมาลี รักการอ่าน', 
                requester_phone: '082-999-4444', 
                requester_position: 'ครู', 
                department_id: 1, // ภาษาไทย
                objective: 'เข้าร่วมอบรมสัมมนาภาษาไทยก้าวไกลสู่สากล', 
                destination: 'มหาวิทยาลัยเกษตรศาสตร์ บางเขน กรุงเทพฯ', 
                passenger_count: 5, 
                passenger_details: 'คณะครูกลุ่มสาระฯ ภาษาไทย 5 ท่าน', 
                start_date_time: '2026-06-15T08:00', 
                end_date_time: '2026-06-15T16:00', 
                requested_vehicle_type: 'old_van', 
                status: 'pending', 
                approver_id: null, 
                approved_at: null, 
                rejection_reason: null, 
                created_at: '2026-06-12T14:20:00Z' 
            }
        ];
        localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(initialBookings));
    }

    // 6. Assignments
    if (!localStorage.getItem(DB_KEYS.ASSIGNMENTS)) {
        const initialAssignments = [
            { id: 1, booking_id: 1, vehicle_id: 1, driver_id: 1, assigned_by: 1, assigned_at: '2026-05-12T09:20:00Z' },
            { id: 2, booking_id: 2, vehicle_id: 2, driver_id: 2, assigned_by: 1, assigned_at: '2026-05-14T14:40:00Z' },
            { id: 3, booking_id: 3, vehicle_id: 5, driver_id: 3, assigned_by: 1, assigned_at: '2026-06-11T10:15:00Z' }
        ];
        localStorage.setItem(DB_KEYS.ASSIGNMENTS, JSON.stringify(initialAssignments));
    }

    // 7. Post-Trip Logs
    if (!localStorage.getItem(DB_KEYS.POST_TRIP_LOGS)) {
        const initialPostTripLogs = [
            { 
                id: 1, 
                booking_assignment_id: 1, 
                start_mileage: 15150, 
                end_mileage: 15380, 
                distance_travelled: 230, 
                fuel_liters: 20.5, 
                fuel_cost: 780.0, 
                maintenance_cost: 150.0, 
                incident_reports: 'ไม่มีปัญหา การจราจรคล่องตัว', 
                satisfaction_score: 5, 
                satisfaction_feedback: 'คนขับสุภาพ ตรงเวลา รถใหม่นั่งสบายมาก', 
                logger_id: 3, 
                logged_at: '2026-05-15T17:00:00Z' 
            },
            { 
                id: 2, 
                booking_assignment_id: 2, 
                start_mileage: 27800, 
                end_mileage: 28180, 
                distance_travelled: 380, 
                fuel_liters: 34.5, 
                fuel_cost: 1310.0, 
                maintenance_cost: 240.0, 
                incident_reports: 'มีปัญหารถติดขัดชั่วโมงเร่งด่วนช่วงเย็น ขากลับช้ากว่ากำหนด 30 นาที', 
                satisfaction_score: 4, 
                satisfaction_feedback: 'คนขับใจเย็น ขับรถปลอดภัย', 
                logger_id: 4, 
                logged_at: '2026-05-20T19:00:00Z' 
            }
        ];
        localStorage.setItem(DB_KEYS.POST_TRIP_LOGS, JSON.stringify(initialPostTripLogs));
    }

    // 8. Maintenance Logs
    if (!localStorage.getItem(DB_KEYS.MAINTENANCE_LOGS)) {
        const initialMaintenanceLogs = [
            { id: 1, vehicle_id: 1, maintenance_date: '2026-04-05', type: 'routine', cost: 1200.0, details: 'เช็กระยะ 10,000 กม. เปลี่ยนน้ำมันเครื่องและไส้กรอง', current_mileage: 10200, created_at: '2026-04-05T10:00:00Z' },
            { id: 2, vehicle_id: 3, maintenance_date: '2026-03-20', type: 'repair', cost: 8500.0, details: 'เปลี่ยนยางล้อหน้า 2 เส้น และตั้งศูนย์ถ่วงล้อ', current_mileage: 181200, created_at: '2026-03-20T14:30:00Z' },
            { id: 3, vehicle_id: 4, maintenance_date: '2026-05-02', type: 'repair', cost: 12400.0, details: 'เปลี่ยนชุดคลัตช์ เจียรจานเบรก และเปลี่ยนผ้าเบรกหลัง', current_mileage: 244500, created_at: '2026-05-02T09:00:00Z' },
            { id: 4, vehicle_id: 3, maintenance_date: '2026-05-18', type: 'accident', cost: 4500.0, details: 'ซ่อมกระจกมองข้างด้านซ้าย ชนกิ่งไม้ระหว่างถอยรถ (จ่ายค่าเสียหายส่วนแรกประกัน)', current_mileage: 184900, created_at: '2026-05-18T16:00:00Z' }
        ];
        localStorage.setItem(DB_KEYS.MAINTENANCE_LOGS, JSON.stringify(initialMaintenanceLogs));
    }

    // Migrate old bookings (convert requester_email to requester_position)
    const currentBookings = JSON.parse(localStorage.getItem(DB_KEYS.BOOKINGS)) || [];
    let bookingsUpdated = false;
    currentBookings.forEach(b => {
        if (!b.hasOwnProperty('requester_position')) {
            if (b.hasOwnProperty('requester_email')) {
                if (b.requester_name.includes('ผู้อำนวยการ')) {
                    b.requester_position = 'ผู้อำนวยการโรงเรียน';
                } else if (b.requester_name.includes('รองผู้อำนวยการ')) {
                    b.requester_position = 'รองผู้อำนวยการโรงเรียน';
                } else if (b.requester_name.includes('ครู')) {
                    b.requester_position = 'ครู';
                } else {
                    b.requester_position = 'ครู';
                }
                delete b.requester_email;
                bookingsUpdated = true;
            } else {
                b.requester_position = 'ครู';
                bookingsUpdated = true;
            }
        }
    });
    if (bookingsUpdated) {
        localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(currentBookings));
    }
}

// Sync functions to connect with Cloudflare D1
async function syncTableToServer(key, items) {
    try {
        await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: key, items: items })
        });
    } catch (err) {
        console.error(`Failed to sync table ${key} to D1:`, err);
    }
}

async function initDBSync() {
    try {
        const res = await fetch('/api/db');
        if (res.ok) {
            const data = await res.json();
            let hasServerData = false;
            for (const key in data) {
                if (data[key] && data[key].length > 0) {
                    hasServerData = true;
                    break;
                }
            }
            if (hasServerData) {
                for (const key in data) {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                }
                console.log('Database synced from Cloudflare D1 successfully!');
                window.dispatchEvent(new Event('db-synced'));
            } else {
                console.log('Cloudflare D1 is empty. Uploading local seed data...');
                for (const key of Object.values(DB_KEYS)) {
                    const items = JSON.parse(localStorage.getItem(key)) || [];
                    if (items.length > 0) {
                        await syncTableToServer(key, items);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Failed to connect to Cloudflare D1:', err);
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(initDBSync, 500); // Allow initial seeding to complete
    });
}

// Data helper functions
const db = {
    getItems: (key) => JSON.parse(localStorage.getItem(key)) || [],
    saveItems: (key, items) => {
        localStorage.setItem(key, JSON.stringify(items));
        syncTableToServer(key, items);
    },

    // Bookings CRUD
    getBookings: () => db.getItems(DB_KEYS.BOOKINGS),
    getBookingById: (id) => db.getBookings().find(b => b.id === parseInt(id)),
    getBookingByReference: (ref) => db.getBookings().find(b => b.booking_reference.toUpperCase() === ref.toUpperCase().trim()),
    
    createBooking: (bookingData) => {
        const bookings = db.getBookings();
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const count = String(bookings.length + 1).padStart(4, '0');
        const booking_reference = `SV-${year}${month}-${count}`;
        
        let requested_vehicle_type = bookingData.requested_vehicle_type;
        let requested_vehicle_id = null;
        if (requested_vehicle_type !== 'other' && !isNaN(requested_vehicle_type)) {
            requested_vehicle_id = parseInt(requested_vehicle_type);
            const vehicles = db.getVehicles();
            const vehicle = vehicles.find(v => v.id === requested_vehicle_id);
            if (vehicle) {
                requested_vehicle_type = vehicle.type;
            } else {
                requested_vehicle_type = 'other';
            }
        }
        
        const newBooking = {
            id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
            booking_reference,
            requester_name: bookingData.requester_name,
            requester_phone: bookingData.requester_phone,
            requester_position: bookingData.requester_position,
            department_id: parseInt(bookingData.department_id),
            objective: bookingData.objective,
            destination: bookingData.destination,
            passenger_count: parseInt(bookingData.passenger_count),
            passenger_details: bookingData.passenger_details || '',
            start_date_time: bookingData.start_date_time,
            end_date_time: bookingData.end_date_time,
            requested_vehicle_type: requested_vehicle_type,
            requested_vehicle_id: requested_vehicle_id,
            status: 'pending',
            approver_id: null,
            approved_at: null,
            rejection_reason: null,
            created_at: new Date().toISOString()
        };
        
        bookings.push(newBooking);
        db.saveItems(DB_KEYS.BOOKINGS, bookings);
        return newBooking;
    },
    
    approveBooking: (bookingId, approverId) => {
        const bookings = db.getBookings();
        const index = bookings.findIndex(b => b.id === parseInt(bookingId));
        if (index !== -1) {
            bookings[index].status = 'approved';
            bookings[index].approver_id = parseInt(approverId);
            bookings[index].approved_at = new Date().toISOString();
            db.saveItems(DB_KEYS.BOOKINGS, bookings);
            return bookings[index];
        }
        return null;
    },
    
    rejectBooking: (bookingId, approverId, reason) => {
        const bookings = db.getBookings();
        const index = bookings.findIndex(b => b.id === parseInt(bookingId));
        if (index !== -1) {
            bookings[index].status = 'rejected';
            bookings[index].approver_id = parseInt(approverId);
            bookings[index].approved_at = new Date().toISOString();
            bookings[index].rejection_reason = reason;
            db.saveItems(DB_KEYS.BOOKINGS, bookings);
            return bookings[index];
        }
        return null;
    },

    // --- Users CRUD (For admin management) ---
    getUsers: () => db.getItems(DB_KEYS.USERS),
    createUser: (userData) => {
        const users = db.getUsers();
        
        // Validation for uniqueness
        if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase().trim())) {
            throw new Error('ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว');
        }
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase().trim())) {
            throw new Error('อีเมลนี้มีอยู่ในระบบแล้ว');
        }

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username: userData.username.trim(),
            password: userData.password,
            full_name: userData.full_name.trim(),
            role: userData.role,
            email: userData.email.trim(),
            phone: userData.phone.trim(),
            status: userData.status || 'active',
            department_id: parseInt(userData.department_id) || null,
            created_at: new Date().toISOString()
        };

        users.push(newUser);
        db.saveItems(DB_KEYS.USERS, users);
        
        // If role is driver, also create driver record automatically
        if (newUser.role === 'driver') {
            const drivers = db.getDrivers();
            if (!drivers.some(d => d.user_id === newUser.id)) {
                drivers.push({
                    id: drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1,
                    user_id: newUser.id,
                    full_name: newUser.full_name,
                    license_number: 'ทั่วไป',
                    phone: newUser.phone,
                    status: 'available',
                    created_at: new Date().toISOString()
                });
                db.saveItems(DB_KEYS.DRIVERS, drivers);
            }
        }

        return newUser;
    },
    updateUser: (userId, userData) => {
        const users = db.getUsers();
        const index = users.findIndex(u => u.id === parseInt(userId));
        if (index === -1) throw new Error('ไม่พบข้อมูลผู้ใช้');

        // Check unique fields excluding self
        if (users.some(u => u.id !== parseInt(userId) && u.username.toLowerCase() === userData.username.toLowerCase().trim())) {
            throw new Error('ชื่อผู้ใช้นี้มีในระบบแล้ว');
        }
        if (users.some(u => u.id !== parseInt(userId) && u.email.toLowerCase() === userData.email.toLowerCase().trim())) {
            throw new Error('อีเมลนี้มีในระบบแล้ว');
        }

        users[index].username = userData.username.trim();
        if (userData.password) {
            users[index].password = userData.password;
        }
        users[index].full_name = userData.full_name.trim();
        users[index].role = userData.role;
        users[index].email = userData.email.trim();
        users[index].phone = userData.phone.trim();
        users[index].status = userData.status;
        users[index].department_id = parseInt(userData.department_id) || null;

        db.saveItems(DB_KEYS.USERS, users);
        
        // Synchronize driver record if role is driver
        const drivers = db.getDrivers();
        const dIndex = drivers.findIndex(d => d.user_id === parseInt(userId));
        if (userData.role === 'driver') {
            if (dIndex !== -1) {
                drivers[dIndex].full_name = userData.full_name;
                drivers[dIndex].phone = userData.phone;
                db.saveItems(DB_KEYS.DRIVERS, drivers);
            } else {
                drivers.push({
                    id: drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1,
                    user_id: parseInt(userId),
                    full_name: userData.full_name,
                    license_number: 'ทั่วไป',
                    phone: userData.phone,
                    status: 'available',
                    created_at: new Date().toISOString()
                });
                db.saveItems(DB_KEYS.DRIVERS, drivers);
            }
        } else if (dIndex !== -1) {
            // If role changed from driver to something else, remove driver profile or deactivate
            drivers.splice(dIndex, 1);
            db.saveItems(DB_KEYS.DRIVERS, drivers);
        }

        return users[index];
    },
    deleteUser: (userId) => {
        const users = db.getUsers();
        const filtered = users.filter(u => u.id !== parseInt(userId));
        if (filtered.length === users.length) throw new Error('ไม่พบผู้ใช้ที่ต้องการลบ');
        
        db.saveItems(DB_KEYS.USERS, filtered);
        
        // Also remove from drivers if exists
        const drivers = db.getDrivers();
        const filteredDrivers = drivers.filter(d => d.user_id !== parseInt(userId));
        db.saveItems(DB_KEYS.DRIVERS, filteredDrivers);
        return true;
    },

    // --- Vehicles CRUD (For admin management) ---
    getVehicles: () => db.getItems(DB_KEYS.VEHICLES),
    createVehicle: (vehicleData) => {
        const vehicles = db.getVehicles();
        if (vehicles.some(v => v.license_plate.trim() === vehicleData.license_plate.trim())) {
            throw new Error('ยานพาหนะทะเบียนนี้มีอยู่ในระบบแล้ว');
        }

        const newVehicle = {
            id: vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1,
            license_plate: vehicleData.license_plate.trim(),
            brand: vehicleData.brand.trim(),
            model: vehicleData.model.trim(),
            type: vehicleData.type,
            capacity: parseInt(vehicleData.capacity),
            status: vehicleData.status || 'available',
            current_mileage: parseInt(vehicleData.current_mileage || 0),
            standard_fuel_consumption: parseFloat(vehicleData.standard_fuel_consumption || 10.0),
            purchase_date: vehicleData.purchase_date || null,
            purchase_cost: parseFloat(vehicleData.purchase_cost || 0)
        };

        vehicles.push(newVehicle);
        db.saveItems(DB_KEYS.VEHICLES, vehicles);
        return newVehicle;
    },
    updateVehicle: (vehicleId, vehicleData) => {
        const vehicles = db.getVehicles();
        const index = vehicles.findIndex(v => v.id === parseInt(vehicleId));
        if (index === -1) throw new Error('ไม่พบข้อมูลยานพาหนะ');

        if (vehicles.some(v => v.id !== parseInt(vehicleId) && v.license_plate.trim() === vehicleData.license_plate.trim())) {
            throw new Error('ทะเบียนยานพาหนะนี้ซ้ำกับคันอื่นในระบบ');
        }

        vehicles[index].license_plate = vehicleData.license_plate.trim();
        vehicles[index].brand = vehicleData.brand.trim();
        vehicles[index].model = vehicleData.model.trim();
        vehicles[index].type = vehicleData.type;
        vehicles[index].capacity = parseInt(vehicleData.capacity);
        vehicles[index].status = vehicleData.status;
        vehicles[index].current_mileage = parseInt(vehicleData.current_mileage);
        vehicles[index].standard_fuel_consumption = parseFloat(vehicleData.standard_fuel_consumption);
        vehicles[index].purchase_date = vehicleData.purchase_date;
        vehicles[index].purchase_cost = parseFloat(vehicleData.purchase_cost);

        db.saveItems(DB_KEYS.VEHICLES, vehicles);
        return vehicles[index];
    },
    deleteVehicle: (vehicleId) => {
        const vehicles = db.getVehicles();
        const filtered = vehicles.filter(v => v.id !== parseInt(vehicleId));
        if (filtered.length === vehicles.length) throw new Error('ไม่พบยานพาหนะที่ต้องการลบ');
        
        db.saveItems(DB_KEYS.VEHICLES, filtered);
        return true;
    },

    getDrivers: () => db.getItems(DB_KEYS.DRIVERS),
    getAssignments: () => db.getItems(DB_KEYS.ASSIGNMENTS),
    createAssignment: (bookingId, vehicleId, driverId, officerId) => {
        const assignments = db.getAssignments();
        const filtered = assignments.filter(a => a.booking_id !== parseInt(bookingId));
        
        const newAssignment = {
            id: filtered.length > 0 ? Math.max(...filtered.map(a => a.id)) + 1 : 1,
            booking_id: parseInt(bookingId),
            vehicle_id: parseInt(vehicleId),
            driver_id: parseInt(driverId),
            assigned_by: parseInt(officerId),
            assigned_at: new Date().toISOString()
        };
        
        filtered.push(newAssignment);
        db.saveItems(DB_KEYS.ASSIGNMENTS, filtered);
        return newAssignment;
    },
    
    // Post-Trip Logs
    getPostTripLogs: () => db.getItems(DB_KEYS.POST_TRIP_LOGS),
    createPostTripLog: (logData) => {
        const logs = db.getPostTripLogs();
        const assignmentId = parseInt(logData.booking_assignment_id);
        const startMileage = parseInt(logData.start_mileage);
        const endMileage = parseInt(logData.end_mileage);
        const distanceTravelled = endMileage - startMileage;
        
        const newLog = {
            id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
            booking_assignment_id: assignmentId,
            start_mileage: startMileage,
            end_mileage: endMileage,
            distance_travelled: distanceTravelled,
            fuel_liters: parseFloat(logData.fuel_liters || 0),
            fuel_cost: parseFloat(logData.fuel_cost || 0),
            maintenance_cost: parseFloat(logData.maintenance_cost || 0),
            incident_reports: logData.incident_reports || '',
            satisfaction_score: parseInt(logData.satisfaction_score || 5),
            satisfaction_feedback: logData.satisfaction_feedback || '',
            logger_id: parseInt(logData.logger_id),
            logged_at: new Date().toISOString()
        };
        
        const filteredLogs = logs.filter(l => l.booking_assignment_id !== assignmentId);
        filteredLogs.push(newLog);
        db.saveItems(DB_KEYS.POST_TRIP_LOGS, filteredLogs);
        
        const assignments = db.getAssignments();
        const assignment = assignments.find(a => a.id === assignmentId);
        if (assignment) {
            const vehicles = db.getVehicles();
            const vIndex = vehicles.findIndex(v => v.id === assignment.vehicle_id);
            if (vIndex !== -1) {
                vehicles[vIndex].current_mileage = endMileage;
                db.saveItems(DB_KEYS.VEHICLES, vehicles);
            }
            
            const bookings = db.getBookings();
            const bIndex = bookings.findIndex(b => b.id === assignment.booking_id);
            if (bIndex !== -1) {
                bookings[bIndex].status = 'completed';
                db.saveItems(DB_KEYS.BOOKINGS, bookings);
            }
        }
        
        return newLog;
    },

    getMaintenanceLogs: () => db.getItems(DB_KEYS.MAINTENANCE_LOGS),
    createMaintenanceLog: (data) => {
        const logs = db.getMaintenanceLogs();
        const newLog = {
            id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
            vehicle_id: parseInt(data.vehicle_id),
            maintenance_date: data.maintenance_date,
            type: data.type,
            cost: parseFloat(data.cost),
            details: data.details,
            current_mileage: parseInt(data.current_mileage || 0),
            created_at: new Date().toISOString()
        };
        logs.push(newLog);
        db.saveItems(DB_KEYS.MAINTENANCE_LOGS, logs);
        
        if (data.status_update === 'maintenance' || data.type === 'repair') {
            const vehicles = db.getVehicles();
            const vIndex = vehicles.findIndex(v => v.id === parseInt(data.vehicle_id));
            if (vIndex !== -1) {
                vehicles[vIndex].current_mileage = parseInt(data.current_mileage || vehicles[vIndex].current_mileage);
                db.saveItems(DB_KEYS.VEHICLES, vehicles);
            }
        }
        return newLog;
    },

    getDepartments: () => db.getItems(DB_KEYS.DEPARTMENTS),

    // Analytics Reports Calculation
    getBIStatistics: () => {
        const bookings = db.getBookings() || [];
        const assignments = db.getAssignments() || [];
        const logs = db.getPostTripLogs() || [];
        const vehicles = db.getVehicles() || [];
        const maintenance = db.getMaintenanceLogs() || [];
        const departments = db.getDepartments() || [];

        let totalDistance = 0;
        let totalFuelLiters = 0;
        let totalFuelCost = 0;
        let totalTripMaintenanceCost = 0;
        let satisfactionSum = 0;
        let satisfactionCount = 0;

        logs.forEach(log => {
            if (!log) return;
            const dist = parseFloat(log.distance_travelled);
            const liters = parseFloat(log.fuel_liters);
            const cost = parseFloat(log.fuel_cost);
            const maint = parseFloat(log.maintenance_cost);

            if (!isNaN(dist)) totalDistance += dist;
            if (!isNaN(liters)) totalFuelLiters += liters;
            if (!isNaN(cost)) totalFuelCost += cost;
            if (!isNaN(maint)) totalTripMaintenanceCost += maint;

            const score = parseInt(log.satisfaction_score);
            if (!isNaN(score) && score > 0) {
                satisfactionSum += score;
                satisfactionCount++;
            }
        });

        const totalRoutineMaintenanceCost = maintenance.reduce((sum, item) => {
            if (item && !isNaN(parseFloat(item.cost))) {
                return sum + parseFloat(item.cost);
            }
            return sum;
        }, 0);
        const totalExpenses = totalFuelCost + totalTripMaintenanceCost + totalRoutineMaintenanceCost;

        const averageSatisfaction = satisfactionCount > 0 ? (satisfactionSum / satisfactionCount).toFixed(1) : '5.0';
        const averageFuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(2) : '0.00';
        const averageCostPerKm = totalDistance > 0 ? (totalExpenses / totalDistance).toFixed(2) : '0.00';

        const deptStats = {};
        departments.forEach(d => {
            if (d && d.id) {
                deptStats[d.id] = { id: d.id, name: d.name || 'ไม่ระบุชื่อ', distance: 0, cost: 0, bookingCount: 0 };
            }
        });

        bookings.forEach(b => {
            if (b && b.status === 'completed') {
                const bookingAssignment = assignments.find(a => a && parseInt(a.booking_id) === parseInt(b.id));
                if (bookingAssignment) {
                    const log = logs.find(l => l && parseInt(l.booking_assignment_id) === parseInt(bookingAssignment.id));
                    if (log && deptStats[b.department_id]) {
                        const dist = parseFloat(log.distance_travelled) || 0;
                        const cost = (parseFloat(log.fuel_cost) || 0) + (parseFloat(log.maintenance_cost) || 0);
                        
                        deptStats[b.department_id].distance += dist;
                        deptStats[b.department_id].cost += cost;
                        deptStats[b.department_id].bookingCount++;
                    }
                }
            }
        });

        const vehicleStats = vehicles.map(v => {
            if (!v) return null;
            const vAssignments = assignments.filter(a => a && parseInt(a.vehicle_id) === parseInt(v.id));
            let vDistance = 0;
            let vFuelLiters = 0;
            let vFuelCost = 0;
            let vTripMainCost = 0;
            let tripCount = vAssignments.length;

            vAssignments.forEach(a => {
                if (!a) return;
                const log = logs.find(l => l && parseInt(l.booking_assignment_id) === parseInt(a.id));
                if (log) {
                    vDistance += parseFloat(log.distance_travelled) || 0;
                    vFuelLiters += parseFloat(log.fuel_liters) || 0;
                    vFuelCost += parseFloat(log.fuel_cost) || 0;
                    vTripMainCost += parseFloat(log.maintenance_cost) || 0;
                }
            });

            const vRoutineMainCost = maintenance.filter(m => m && parseInt(m.vehicle_id) === parseInt(v.id)).reduce((sum, item) => {
                if (item && !isNaN(parseFloat(item.cost))) {
                    return sum + parseFloat(item.cost);
                }
                return sum;
            }, 0);
            const vTotalCost = vFuelCost + vTripMainCost + vRoutineMainCost;

            const fuelEfficiency = vFuelLiters > 0 ? (vDistance / vFuelLiters).toFixed(2) : '0.00';
            const costPerKm = vDistance > 0 ? (vTotalCost / vDistance).toFixed(2) : '0.00';
            const purchaseCost = parseFloat(v.purchase_cost) || 0;
            const totalMaintCost = vRoutineMainCost + vTripMainCost;

            return {
                id: v.id,
                license_plate: v.license_plate || 'ไม่ระบุทะเบียน',
                type: v.type || 'other',
                type_display: v.type === 'new_van' ? 'รถตู้ใหม่' : v.type === 'old_van' ? 'รถตู้เก่า' : v.type === 'six_wheeler_truck' ? 'รถหกล้อ' : v.type === 'other' ? 'รถอื่นๆ(จ้างเหมา)' : 'อื่นๆ',
                brand_model: `${v.brand || ''} ${v.model || ''}`,
                distance: vDistance,
                fuel_cost: vFuelCost,
                maintenance_cost: totalMaintCost,
                total_cost: vTotalCost,
                fuel_efficiency,
                standard_fuel_efficiency: parseFloat(v.standard_fuel_consumption) || 0,
                cost_per_km: costPerKm,
                purchase_cost: purchaseCost,
                maintenance_ratio: purchaseCost > 0 ? (totalMaintCost / purchaseCost * 100).toFixed(1) : '0.0',
                trip_count: tripCount
            };
        }).filter(Boolean);

        return {
            totalDistance,
            totalFuelLiters,
            totalFuelCost,
            totalRoutineMaintenanceCost,
            totalTripMaintenanceCost,
            totalExpenses,
            averageSatisfaction,
            averageFuelEfficiency,
            averageCostPerKm,
            deptStats: Object.values(deptStats).filter(d => d.bookingCount > 0),
            vehicleStats
        };
    }
};

// Initialize DB immediately
initializeMockDatabase();

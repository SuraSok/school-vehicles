// Application Logic and SPA Routing Controller - VK School Vehicle Booking System

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Local Cache Database
    initializeLocalDatabase();
    
    // Core Application State
    const appState = {
        currentView: 'booking-form-view',
        currentUser: JSON.parse(localStorage.getItem('logged_in_user')) || null,
        activeTabAdmin: 'pending-bookings-tab',
        activeTabBI: 'overview-tab',
        charts: {},
        passengerCount: 1,
        calendarDate: new Date()
    };

    // DOM Elements
    const elements = {
        body: document.body,
        themeSwitch: document.getElementById('theme-switch-btn'),
        themeIcon: document.getElementById('theme-icon'),
        navItems: document.querySelectorAll('.nav-item'),
        viewSections: document.querySelectorAll('.view-section'),
        userRoleDisplay: document.getElementById('user-role-display'),
        userNameDisplay: document.getElementById('user-name-display'),
        logoutBtn: document.getElementById('header-logout-btn'),
        loginSection: document.getElementById('login-section'),
        profileWidget: document.getElementById('user-profile-widget'),
        
        // Header Auth Controls
        headerLoginBtn: document.getElementById('header-login-btn'),
        headerLogoutBtn: document.getElementById('header-logout-btn'),
        headerUserWidget: document.getElementById('header-user-widget'),
        headerUserName: document.getElementById('header-user-name'),

        // Calendar View
        calPrevMonthBtn: document.getElementById('cal-prev-month-btn'),
        calNextMonthBtn: document.getElementById('cal-next-month-btn'),
        calTodayBtn: document.getElementById('cal-today-btn'),
        calendarMonthYearLabel: document.getElementById('calendar-month-year-label'),
        calendarDaysGrid: document.getElementById('calendar-days-grid'),

        // Booking Form
        bookingForm: document.getElementById('vehicle-booking-form'),
        addPassengerBtn: document.getElementById('add-passenger-btn'),
        passengerInputs: document.getElementById('passenger-inputs'),
        bookingSuccessModal: document.getElementById('booking-success-modal'),
        successRefCode: document.getElementById('success-ref-code'),
        closeSuccessModal: document.getElementById('close-success-modal-btn'),
        
        // Status Tracking
        trackingSearchForm: document.getElementById('tracking-search-form'),
        trackingInput: document.getElementById('tracking-input'),
        trackingResult: document.getElementById('tracking-result'),
        trackingTableBody: document.getElementById('tracking-table-body'),
        
        // Admin View
        adminTabBtns: document.querySelectorAll('.admin-tab-btn'),
        adminTabPanes: document.querySelectorAll('.admin-tab-pane'),
        pendingTableBody: document.getElementById('pending-table-body'),
        approvedTableBody: document.getElementById('approved-table-body'),
        completedTableBody: document.getElementById('completed-table-body'),
        
        // Admin CRUD views (New)
        adminUsersTabBtn: document.getElementById('admin-users-tab-btn'),
        adminVehiclesTabBtn: document.getElementById('admin-vehicles-tab-btn'),
        adminUsersTableBody: document.getElementById('admin-users-table-body'),
        adminVehiclesTableBody: document.getElementById('admin-vehicles-table-body'),
        btnAddUser: document.getElementById('btn-add-user'),
        btnAddVehicle: document.getElementById('btn-add-vehicle'),
        
        // Modals
        approvalModal: document.getElementById('approval-modal'),
        assignmentModal: document.getElementById('assignment-modal'),
        postTripModal: document.getElementById('post-trip-modal'),
        userFormModal: document.getElementById('user-form-modal'),
        vehicleFormModal: document.getElementById('vehicle-form-modal'),
        
        // BI Dashboard
        biTabBtns: document.querySelectorAll('.bi-tab-btn'),
        biTabPanes: document.querySelectorAll('.bi-tab-pane')
    };

    // --- 1. Theme Controller ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        elements.body.classList.add('dark-theme');
        elements.themeIcon.className = 'fas fa-sun';
    } else {
        elements.body.classList.remove('dark-theme');
        elements.themeIcon.className = 'fas fa-moon';
    }

    elements.themeSwitch.addEventListener('click', () => {
        elements.body.classList.toggle('dark-theme');
        const isDark = elements.body.classList.contains('dark-theme');
        elements.themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Redraw charts if in BI view to adjust grid colors
        if (appState.currentView === 'bi-dashboard-view') {
            renderBICharts();
        }
    });

    // --- 2. SPA Router ---
    function navigateToView(viewId) {
        elements.viewSections.forEach(view => {
            if (view.id === viewId) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        elements.navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        appState.currentView = viewId;
        
        // Initialize specific view modules
        if (viewId === 'admin-dashboard-view') {
            renderAdminDashboard();
        } else if (viewId === 'bi-dashboard-view') {
            renderBIDashboard();
        } else if (viewId === 'booking-form-view') {
            populateDepartmentsDropdown('booking-department');
            populateVehiclesDropdown();
        } else if (viewId === 'calendar-view') {
            renderCalendar();
        } else if (viewId === 'driver-schedule-view') {
            renderDriverSchedule();
        } else if (viewId === 'tracking-view') {
            renderTrackingView();
        }
    }

    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = item.getAttribute('data-view');
            
            // Authorization guard for Admin and BI panels
            if (viewId === 'admin-dashboard-view' || viewId === 'bi-dashboard-view') {
                if (!appState.currentUser) {
                    showLoginModal(viewId);
                    return;
                }
                
                // Executive Dashboard is only for Admin, Approver, Executive, Superadmin
                if (viewId === 'bi-dashboard-view' && !['admin', 'executive', 'approver', 'superadmin'].includes(appState.currentUser.role)) {
                    alert('ท่านไม่มีสิทธิ์การเข้าใช้งานในระบบแดชบอร์ดบริหาร');
                    return;
                }
            }
            
            navigateToView(viewId);
        });
    });

    // --- 3. Login/Auth Simulator ---
    function showLoginModal(targetView) {
        const modal = document.getElementById('login-modal');
        modal.classList.add('active');
        
        const form = document.getElementById('login-form');
        
        // Remove old listeners to avoid multiple binding
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = newForm.querySelector('#login-username');
            const passwordInput = newForm.querySelector('#login-password');
            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            
            const users = db.getItems(DB_KEYS.USERS);
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                appState.currentUser = user;
                localStorage.setItem('logged_in_user', JSON.stringify(user));
                
                modal.classList.remove('active');
                newForm.reset();
                
                updateAuthUI();
                navigateToView(targetView);
            } else {
                alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        });

        document.getElementById('close-login-modal').onclick = () => {
            modal.classList.remove('active');
        };
    }

    function updateAuthUI() {
        if (appState.currentUser) {
            if (elements.userNameDisplay) {
                elements.userNameDisplay.textContent = appState.currentUser.full_name;
            }
            const rolesMap = {
                superadmin: 'ผู้ดูแลระบบ',
                admin: 'หัวหน้างานยานพาหนะ',
                approver: 'รองผู้อำนวยการ ฝ่ายบริหารทั่วไป',
                driver: 'พนักงานขับรถ',
                executive: 'ผู้อำนวยการโรงเรียน'
            };
            if (elements.userRoleDisplay) {
                elements.userRoleDisplay.textContent = rolesMap[appState.currentUser.role] || 'บุคลากร';
            }
            if (elements.profileWidget) {
                elements.profileWidget.style.display = 'flex';
            }
            if (elements.logoutBtn) {
                elements.logoutBtn.style.display = 'block';
            }

            // Sync Header Auth
            if (elements.headerLoginBtn && elements.headerUserWidget && elements.headerUserName) {
                elements.headerLoginBtn.style.display = 'none';
                elements.headerUserWidget.style.display = 'flex';
                elements.headerUserName.textContent = `สวัสดี, ${appState.currentUser.full_name}`;
            }

            // Show admin tabs only if user is admin
            if (appState.currentUser.role === 'admin' || appState.currentUser.role === 'superadmin') {
                elements.adminUsersTabBtn.style.display = 'inline-block';
                elements.adminVehiclesTabBtn.style.display = 'inline-block';
            } else {
                elements.adminUsersTabBtn.style.display = 'none';
                elements.adminVehiclesTabBtn.style.display = 'none';
                
                // If currently active tab is one of admin tabs, revert to pending
                if (appState.activeTabAdmin === 'manage-users-tab' || appState.activeTabAdmin === 'manage-vehicles-tab') {
                    appState.activeTabAdmin = 'pending-bookings-tab';
                    
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelector('[data-tab="pending-bookings-tab"]').classList.add('active');
                    
                    document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
                    document.getElementById('pending-bookings-tab').classList.add('active');
                }
            }
        } else {
            if (elements.profileWidget) {
                elements.profileWidget.style.display = 'none';
            }
            if (elements.logoutBtn) {
                elements.logoutBtn.style.display = 'none';
            }
            elements.adminUsersTabBtn.style.display = 'none';
            elements.adminVehiclesTabBtn.style.display = 'none';

            // Sync Header Auth
            if (elements.headerLoginBtn && elements.headerUserWidget) {
                elements.headerLoginBtn.style.display = 'block';
                elements.headerUserWidget.style.display = 'none';
            }
        }
    }

    // Header Auth event listeners
    if (elements.headerLoginBtn) {
        elements.headerLoginBtn.addEventListener('click', () => {
            showLoginModal(appState.currentView);
        });
    }

    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', () => {
            appState.currentUser = null;
            localStorage.removeItem('logged_in_user');
            updateAuthUI();
            navigateToView('booking-form-view');
        });
    }

    // Run Auth UI init
    updateAuthUI();

    // --- 4. Booking Form Module ---
    function populateDepartmentsDropdown(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '<option value="">-- กรุณาเลือกกลุ่มสาระ/ฝ่าย --</option>';
        const depts = db.getDepartments();
        depts.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = d.name;
            select.appendChild(opt);
        });
    }

    function populateVehiclesDropdown() {
        const select = document.getElementById('booking-vehicle-type');
        if (!select) return;
        
        select.innerHTML = '<option value="">-- เลือกประเภทรถยนต์และทะเบียนรถยนต์ --</option>';
        const vehicles = db.getVehicles();
        
        vehicles.forEach(v => {
            const typeDisp = v.type === 'new_van' ? 'รถตู้ใหม่' : v.type === 'old_van' ? 'รถตู้เก่า' : v.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ';
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.textContent = `${typeDisp}-${v.license_plate} (${v.brand} ${v.model})`;
            select.appendChild(opt);
        });
        
        const otherOpt = document.createElement('option');
        otherOpt.value = 'other';
        otherOpt.textContent = 'รถอื่นๆ(จ้างเหมา) - (ระบุรายละเอียดในหมายเหตุ/วัตถุประสงค์)';
        select.appendChild(otherOpt);
    }

    // Initialize dropdowns
    populateDepartmentsDropdown('booking-department');
    populateVehiclesDropdown();

    // Add passenger input fields dynamically
    elements.addPassengerBtn.addEventListener('click', () => {
        appState.passengerCount++;
        const row = document.createElement('div');
        row.className = 'passenger-input-row';
        row.id = `passenger-row-${appState.passengerCount}`;
        row.innerHTML = `
            <input type="text" placeholder="${appState.passengerCount}. ชื่อ-นามสกุล ผู้เดินทาง" class="form-control passenger-name-input" required>
            <button type="button" class="btn btn-secondary btn-icon-only remove-passenger-btn" data-row-id="passenger-row-${appState.passengerCount}">
                <i class="fas fa-trash-alt text-danger"></i>
            </button>
        `;
        elements.passengerInputs.appendChild(row);
        
        // Bind delete event
        row.querySelector('.remove-passenger-btn').addEventListener('click', (e) => {
            const rowId = e.currentTarget.getAttribute('data-row-id');
            const targetRow = document.getElementById(rowId);
            if (targetRow) {
                targetRow.remove();
            }
        });
    });

    // Handle Form Submit
    elements.bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather passenger list from dynamic inputs
        const passengerNameInputs = document.querySelectorAll('.passenger-name-input');
        let passengerListText = '';
        passengerNameInputs.forEach((input, index) => {
            passengerListText += `${index + 1}. ${input.value.trim()}\n`;
        });

        const startDate = document.getElementById('booking-start-date').value;
        const startTime = document.getElementById('booking-start-time').value;
        const endDate = document.getElementById('booking-end-date').value;
        const endTime = document.getElementById('booking-end-time').value;

        const startDateTimeStr = `${startDate}T${startTime}`;
        const endDateTimeStr = `${endDate}T${endTime}`;
        const requestedVehicleVal = document.getElementById('booking-vehicle-type').value;

        // Resolve requested vehicle ID and type
        let reqVehicleId = null;
        let reqVehicleType = 'other';
        if (requestedVehicleVal !== 'other' && !isNaN(requestedVehicleVal)) {
            reqVehicleId = parseInt(requestedVehicleVal);
            const vehiclesList = db.getVehicles();
            const vehicle = vehiclesList.find(v => v.id === reqVehicleId);
            if (vehicle) {
                reqVehicleType = vehicle.type;
            }
        } else {
            reqVehicleType = requestedVehicleVal;
        }

        // Check for overlaps
        const startNew = new Date(startDateTimeStr);
        const endNew = new Date(endDateTimeStr);

        const bookings = db.getBookings();
        const assignments = db.getAssignments();
        const vehicles = db.getVehicles();

        let overlapBookings = [];

        bookings.forEach(b => {
            if (b.status === 'rejected') return;

            const startExist = new Date(b.start_date_time);
            const endExist = new Date(b.end_date_time);

            // Overlap check
            if (startNew < endExist && endNew > startExist) {
                // Determine vehicle ID or type for the existing booking
                let existVehicleId = null;
                let existVehicleType = b.requested_vehicle_type;

                const assignment = assignments.find(a => a.booking_id === b.id);
                if (assignment) {
                    existVehicleId = assignment.vehicle_id;
                    const v = vehicles.find(veh => veh.id === existVehicleId);
                    if (v) {
                        existVehicleType = v.type;
                    }
                } else if (b.requested_vehicle_id) {
                    existVehicleId = b.requested_vehicle_id;
                }

                // Check if vehicle matches or type matches
                let matches = false;
                if (reqVehicleId && existVehicleId) {
                    if (reqVehicleId === existVehicleId) {
                        matches = true;
                    }
                } else if (reqVehicleType === existVehicleType) {
                    matches = true;
                }

                if (matches) {
                    overlapBookings.push(b);
                }
            }
        });

        if (overlapBookings.length > 0) {
            let warnMsg = 'คำแจ้งเตือน: ยานพาหนะหรือประเภทรถยนต์นี้มีรายการจองแล้วในช่วงเวลาดังกล่าว:\n';
            overlapBookings.forEach(ob => {
                warnMsg += `- [${ob.booking_reference}] ${ob.requester_name} ไป ${ob.destination} (${ob.start_date_time.replace('T', ' ')} ถึง ${ob.end_date_time.replace('T', ' ')})\n`;
            });
            warnMsg += '\nคุณยังคงต้องการทำการจองต่อไปหรือไม่?';
            
            if (!confirm(warnMsg)) {
                return; // Stop form submission
            }
        }

        const formData = {
            requester_name: document.getElementById('booking-name').value.trim(),
            requester_phone: document.getElementById('booking-phone').value.trim(),
            requester_position: document.getElementById('booking-position').value,
            department_id: document.getElementById('booking-department').value,
            objective: document.getElementById('booking-objective').value.trim(),
            destination: document.getElementById('booking-destination').value.trim(),
            passenger_count: document.getElementById('booking-passengers-count').value,
            passenger_details: passengerListText,
            start_date_time: startDateTimeStr,
            end_date_time: endDateTimeStr,
            requested_vehicle_type: requestedVehicleVal,
            document_url: document.getElementById('booking-doc-url').value.trim(),
            gps_distance: document.getElementById('booking-gps-distance').value.trim()
        };

        const newBooking = db.createBooking(formData);
        
        if (newBooking) {
            // Display success modal
            elements.successRefCode.textContent = newBooking.booking_reference;
            elements.bookingSuccessModal.classList.add('active');
            
            // Reset form
            elements.bookingForm.reset();
            elements.passengerInputs.innerHTML = `
                <div class="passenger-input-row" id="passenger-row-1">
                    <input type="text" placeholder="1. ชื่อ-นามสกุล ผู้เดินทาง" class="form-control passenger-name-input" required>
                </div>
            `;
            appState.passengerCount = 1;
        }
    });

    elements.closeSuccessModal.addEventListener('click', () => {
        elements.bookingSuccessModal.classList.remove('active');
        navigateToView('tracking-view');
        elements.trackingInput.value = elements.successRefCode.textContent;
        handleTrackingSearch(elements.successRefCode.textContent);
    });

    // --- 5. Status Tracking Module ---
    function renderTrackingView(query = '') {
        const bookings = db.getBookings();
        const assignments = db.getAssignments();
        const vehicles = db.getVehicles();
        const drivers = db.getDrivers();
        const depts = db.getDepartments();
        
        let filteredBookings = bookings;
        if (query && query.trim() !== '') {
            const q = query.trim().toUpperCase();
            filteredBookings = bookings.filter(b => 
                b.booking_reference.toUpperCase().includes(q) || 
                b.requester_name.toUpperCase().includes(q) ||
                b.requester_phone.includes(q) || 
                (b.requester_position && b.requester_position.toUpperCase().includes(q)) ||
                b.destination.toUpperCase().includes(q)
            );
        }

        elements.trackingTableBody.innerHTML = '';

        if (filteredBookings.length === 0) {
            elements.trackingTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted);">ไม่พบรายการจองใด ๆ ในระบบ</td>
                </tr>
            `;
        } else {
            // Sort by creation date descending (newest first)
            filteredBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            filteredBookings.forEach(b => {
                const tr = document.createElement('tr');
                const dept = depts.find(d => d.id === b.department_id);
                const assignment = assignments.find(a => a.booking_id === b.id);
                let assignedDetails = '<span style="color: var(--text-muted);">รอกรรมการจัดรถ</span>';
                
                if (assignment) {
                    const vehicle = vehicles.find(v => v.id === assignment.vehicle_id);
                    const driver = drivers.find(d => d.id === assignment.driver_id);
                    if (vehicle && driver) {
                        const typeDisp = vehicle.type === 'new_van' ? 'รถตู้ใหม่' : vehicle.type === 'old_van' ? 'รถตู้เก่า' : vehicle.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ';
                        assignedDetails = `<div><i class="fas fa-bus-alt text-primary"></i> ${typeDisp} (${vehicle.license_plate})</div>
                                           <div style="font-size: 12px; color: var(--text-muted);"><i class="fas fa-user-tie"></i> ${driver.full_name}</div>`;
                    }
                }

                const statusBadges = {
                    pending: '<span class="badge badge-pending"><i class="fas fa-clock"></i> ขั้นตอนที่ 1: ตรวจสอบ (หัวหน้างานยานพาหนะ)</span>',
                    reviewed: '<span class="badge badge-warning"><i class="fas fa-check"></i> ขั้นตอนที่ 2: เห็นชอบ (รอง ผอ. บริหารทั่วไป)</span>',
                    verified: '<span class="badge badge-info"><i class="fas fa-check-double"></i> ขั้นตอนที่ 3: อนุมัติ (ผู้อำนวยการโรงเรียน)</span>',
                    approved: '<span class="badge badge-approved"><i class="fas fa-check-double"></i> อนุมัติแล้ว</span>',
                    rejected: '<span class="badge badge-rejected"><i class="fas fa-times-circle"></i> ปฏิเสธคำขอ</span>',
                    completed: '<span class="badge badge-completed"><i class="fas fa-flag-checkered"></i> เสร็จสิ้นภารกิจ</span>',
                    cancelled: '<span class="badge badge-cancelled"><i class="fas fa-ban"></i> ยกเลิก</span>'
                };

                const startFormatted = new Date(b.start_date_time).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
                
                tr.innerHTML = `
                    <td style="font-weight: 700;">${b.booking_reference}</td>
                    <td>
                        <div><strong>${b.requester_name}</strong></div>
                        <div style="font-size: 12px; color: var(--text-muted);">${dept ? dept.name : ''}</div>
                    </td>
                    <td>
                        <div><strong>${b.destination}</strong></div>
                        <div style="font-size: 12px; color: var(--text-muted); text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 200px;">${b.objective}</div>
                    </td>
                    <td>${startFormatted} น.</td>
                    <td>${statusBadges[b.status] || b.status}</td>
                    <td>${assignedDetails}</td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <button type="button" class="btn btn-secondary btn-icon-only view-detail-btn" data-booking-id="${b.id}" title="ดูรายละเอียด">
                                <i class="fas fa-eye text-primary"></i>
                            </button>
                            <button type="button" class="btn btn-secondary btn-icon-only pdf-btn" data-booking-id="${b.id}" title="ดาวน์โหลด PDF ใบขอใช้รถ">
                                <i class="fas fa-file-pdf text-danger"></i>
                            </button>
                        </div>
                    </td>
                `;
                elements.trackingTableBody.appendChild(tr);
            });

            // Bind Detail Buttons
            elements.trackingTableBody.querySelectorAll('.view-detail-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-booking-id');
                    showBookingDetailModal(id);
                });
            });

            // Bind PDF Buttons
            elements.trackingTableBody.querySelectorAll('.pdf-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-booking-id');
                    pdfGenerator.generateBookingPDF(id);
                });
            });
        }

        elements.trackingResult.style.display = 'block';
    }

    elements.trackingSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        renderTrackingView(elements.trackingInput.value);
    });

    function getVehicleChangeNote(booking, selectedVehicleId) {
        if (!selectedVehicleId) return '';
        const vehicles = db.getVehicles();
        const selectedVehicle = vehicles.find(v => v.id === parseInt(selectedVehicleId));
        if (!selectedVehicle) return '';

        // Compare
        let requestedName = '';
        if (booking.requested_vehicle_id) {
            const reqV = vehicles.find(v => v.id === booking.requested_vehicle_id);
            if (reqV) {
                const typeDisp = reqV.type === 'new_van' ? 'รถตู้ใหม่' : reqV.type === 'old_van' ? 'รถตู้เก่า' : reqV.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ';
                requestedName = `${typeDisp} (${reqV.license_plate})`;
            }
        } else {
            const typeDisp = booking.requested_vehicle_type === 'new_van' ? 'รถตู้ใหม่' : booking.requested_vehicle_type === 'old_van' ? 'รถตู้เก่า' : booking.requested_vehicle_type === 'six_wheeler_truck' ? 'รถหกล้อ' : booking.requested_vehicle_type === 'other' ? 'รถอื่นๆ(จ้างเหมา)' : 'อื่นๆ';
            requestedName = typeDisp;
        }

        const selectedTypeDisp = selectedVehicle.type === 'new_van' ? 'รถตู้ใหม่' : selectedVehicle.type === 'old_van' ? 'รถตู้เก่า' : selectedVehicle.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ';
        const selectedName = `${selectedTypeDisp} (${selectedVehicle.license_plate})`;

        // Check if they are different
        const isDifferent = (booking.requested_vehicle_id && booking.requested_vehicle_id !== selectedVehicle.id) ||
                             (!booking.requested_vehicle_id && booking.requested_vehicle_type !== selectedVehicle.type);

        if (isDifferent) {
            return `เปลี่ยนรถจาก "${requestedName}" เป็น "${selectedName}"`;
        }
        return '';
    }

    function showBookingDetailModal(bookingId) {
        const booking = db.getBookingById(bookingId);
        if (!booking) return;

        const modal = document.getElementById('detail-modal');
        const dept = db.getDepartments().find(d => d.id === booking.department_id);
        const assignment = db.getAssignments().find(a => a.booking_id === booking.id);
        const start = new Date(booking.start_date_time).toLocaleString('th-TH');
        const end = new Date(booking.end_date_time).toLocaleString('th-TH');

        let resourceText = 'ยังไม่ได้จัดสรร';
        if (assignment) {
            const vehicle = db.getVehicles().find(v => v.id === assignment.vehicle_id);
            const driver = db.getDrivers().find(d => d.id === assignment.driver_id);
            if (vehicle && driver) {
                resourceText = `<strong>ยานพาหนะ:</strong> ${vehicle.brand} ${vehicle.model} ทะเบียน ${vehicle.license_plate}<br>
                                <strong>พนักงานขับรถ:</strong> ${driver.full_name} (${driver.phone})`;
            }
        }

        let licensePlateText = '<span style="color: var(--text-muted);">ยังไม่ได้จัดสรรยานพาหนะ</span>';
        if (assignment) {
            const vehicle = db.getVehicles().find(v => v.id === assignment.vehicle_id);
            if (vehicle) {
                licensePlateText = `<strong style="color: var(--primary); font-size: 15px;">${vehicle.license_plate}</strong> (${vehicle.brand} ${vehicle.model})`;
            }
        }

        document.getElementById('detail-content').innerHTML = `
            <table class="custom-table" style="border: none;">
                <tr><td style="width: 150px; font-weight: bold;">รหัสอ้างอิง</td><td>${booking.booking_reference}</td></tr>
                <tr><td style="font-weight: bold;">ผู้ขอใช้รถ</td><td>${booking.requester_name} (กลุ่มงาน: ${dept ? dept.name : 'ทั่วไป'})</td></tr>
                <tr><td style="font-weight: bold;">การติดต่อ</td><td>โทร. ${booking.requester_phone} | ตำแหน่ง: ${booking.requester_position || 'ไม่ระบุ'}</td></tr>
                <tr><td style="font-weight: bold;">วัตถุประสงค์</td><td>${booking.objective}</td></tr>
                <tr><td style="font-weight: bold;">สถานที่ปลายทาง</td><td>${booking.destination}</td></tr>
                <tr><td style="font-weight: bold;">ระยะทางตาม GPS</td><td>${booking.gps_distance ? `${booking.gps_distance} กม.` : '<span style="color: var(--text-muted);">ไม่ได้ระบุ</span>'}</td></tr>
                <tr><td style="font-weight: bold;">จำนวนผู้เดินทาง</td><td>${booking.passenger_count} คน</td></tr>
                <tr><td style="font-weight: bold;">รายชื่อผู้เดินทาง</td><td><pre style="font-family: inherit; font-size: 13px; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 4px; white-space: pre-wrap;">${booking.passenger_details || 'ไม่มี'}</pre></td></tr>
                <tr><td style="font-weight: bold;">เวลาไป-กลับ</td><td>เริ่ม: ${start} น.<br>ถึง: ${end} น.</td></tr>
                <tr><td style="font-weight: bold;">ประเภทรถที่ขอ</td><td>${(() => {
                    if (booking.requested_vehicle_id) {
                        const reqV = db.getVehicles().find(v => v.id === booking.requested_vehicle_id);
                        if (reqV) {
                            const typeDisp = reqV.type === 'new_van' ? 'รถตู้ใหม่' : reqV.type === 'old_van' ? 'รถตู้เก่า' : reqV.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ';
                            return `${typeDisp} (ทะเบียน: ${reqV.license_plate})`;
                        }
                    }
                    return booking.requested_vehicle_type === 'new_van' ? 'รถตู้ใหม่' : booking.requested_vehicle_type === 'old_van' ? 'รถตู้เก่า' : booking.requested_vehicle_type === 'six_wheeler_truck' ? 'รถหกล้อ' : booking.requested_vehicle_type === 'other' ? 'รถอื่นๆ(จ้างเหมา)' : 'อื่นๆ';
                })()}</td></tr>
                <tr><td style="font-weight: bold;">สถานะคำขอ</td><td>
                    <span class="badge ${
                        booking.status === 'pending' ? 'badge-pending' :
                        booking.status === 'reviewed' ? 'badge-warning' :
                        booking.status === 'verified' ? 'badge-info' :
                        booking.status === 'approved' ? 'badge-approved' :
                        booking.status === 'rejected' ? 'badge-rejected' : 'badge-completed'
                    }">
                        ${
                            booking.status === 'pending' ? 'รอตรวจสอบ (หัวหน้างานยานพาหนะ)' :
                            booking.status === 'reviewed' ? 'ผ่านการตรวจสอบ (รอ รอง ผอ.)' :
                            booking.status === 'verified' ? 'เห็นควรอนุมัติ (รอ ผอ.)' :
                            booking.status === 'approved' ? 'อนุมัติแล้ว' :
                            booking.status === 'rejected' ? 'ปฏิเสธคำขอ' : 'เสร็จสิ้นภารกิจ'
                        }
                    </span>
                </td></tr>
                ${booking.rejection_reason ? `<tr><td style="font-weight: bold; color: var(--color-rejected);">เหตุผลที่ปฏิเสธ</td><td style="color: var(--color-rejected); font-weight: bold;">${booking.rejection_reason}</td></tr>` : ''}
                ${booking.vehicle_change_note ? `<tr><td style="font-weight: bold; color: var(--color-rejected);">หมายเหตุการจัดรถ</td><td style="color: var(--color-rejected); font-weight: bold;"><i class="fas fa-info-circle"></i> ${booking.vehicle_change_note}</td></tr>` : ''}
                <tr><td style="font-weight: bold;">หมายเลขทะเบียนรถ</td><td>${licensePlateText}</td></tr>
                <tr><td style="font-weight: bold;">การจัดสรรคนขับ</td><td>${resourceText}</td></tr>
                ${booking.document_url ? `<tr><td style="font-weight: bold;">เอกสารแนบที่เกี่ยวข้อง</td><td><a href="${booking.document_url}" target="_blank" class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px; display: inline-flex; align-items: center; gap: 5px; text-decoration: none;"><i class="fas fa-external-link-alt"></i> เปิดดูเอกสารแนบ (คำสั่ง/หนังสือ)</a></td></tr>` : ''}
            </table>
        `;
        
        modal.classList.add('active');
        document.getElementById('close-detail-modal').onclick = () => {
            modal.classList.remove('active');
        };
    }

    // --- 6. Admin Control Panel Module ---
    // Handle tab switching in Admin panel
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            appState.activeTabAdmin = tabId;
            renderAdminDashboard();
        });
    });

    function renderAdminDashboard() {
        if (!appState.currentUser) return;
        
        const bookings = db.getBookings();
        const assignments = db.getAssignments();
        const vehicles = db.getVehicles();
        const depts = db.getDepartments();

        // Check if currently requested view is User Management or Vehicle Management
        if (appState.activeTabAdmin === 'manage-users-tab') {
            renderUsersTable();
            return;
        } else if (appState.activeTabAdmin === 'manage-vehicles-tab') {
            renderVehiclesTable();
            return;
        } else if (appState.activeTabAdmin === 'rejected-bookings-tab') {
            renderRejectedBookingsTable();
            return;
        }

        // 1. Pending Bookings Table
        elements.pendingTableBody.innerHTML = '';
        
        let pendingList = [];
        let sectionTitle = 'คำขอเดินทางที่รอพิจารณา';
        
        if (appState.currentUser.role === 'admin') {
            pendingList = bookings.filter(b => b.status === 'pending');
            sectionTitle = 'รายการคำขอเดินทางที่รอการตรวจสอบ (หัวหน้างานยานพาหนะ)';
        } else if (appState.currentUser.role === 'approver') {
            pendingList = bookings.filter(b => b.status === 'reviewed');
            sectionTitle = 'รายการคำขอเดินทางที่ผ่านการตรวจสอบแล้ว รอการพิจารณา (รองผู้อำนวยการ ฝ่ายบริหารทั่วไป)';
        } else if (appState.currentUser.role === 'executive') {
            pendingList = bookings.filter(b => b.status === 'verified');
            sectionTitle = 'รายการคำขอเดินทางที่เห็นควรอนุมัติแล้ว รอการอนุมัติ (ผู้อำนวยการโรงเรียน)';
        } else if (appState.currentUser.role === 'superadmin') {
            pendingList = bookings.filter(b => ['pending', 'reviewed', 'verified'].includes(b.status));
            sectionTitle = 'รายการคำขอเดินทางที่อยู่ระหว่างรอการดำเนินการพิจารณา (ผู้ดูแลระบบ)';
        }
        
        const pendingTabPane = document.getElementById('pending-bookings-tab');
        if (pendingTabPane) {
            const h3 = pendingTabPane.querySelector('h3');
            if (h3) h3.textContent = sectionTitle;
        }
        
        if (pendingList.length === 0) {
            elements.pendingTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">ไม่มีคำขอใช้รถค้างพิจารณาในขณะนี้</td></tr>';
        } else {
            const vehicles = db.getVehicles();
            const drivers = db.getDrivers();

            pendingList.forEach(b => {
                const tr = document.createElement('tr');
                const dept = depts.find(d => d.id === b.department_id);
                const start = new Date(b.start_date_time).toLocaleDateString('th-TH');
                
                const hasOverlap = bookings.some(other => 
                    other.id !== b.id && 
                    ['approved', 'completed'].includes(other.status) &&
                    other.destination.trim() === b.destination.trim() &&
                    Math.abs(new Date(other.start_date_time) - new Date(b.start_date_time)) < 24 * 60 * 60 * 1000 // same day
                );

                let resourceAllocationHTML = '';
                const isStep1 = appState.currentUser.role === 'admin' || (appState.currentUser.role === 'superadmin' && b.status === 'pending');
                
                if (isStep1) {
                    // Pre-determine default vehicle selection
                    let defaultVehicleId = '';
                    if (b.requested_vehicle_id) {
                        defaultVehicleId = b.requested_vehicle_id;
                    } else if (b.requested_vehicle_type && b.requested_vehicle_type !== 'other') {
                        const matchedV = vehicles.find(v => v.type === b.requested_vehicle_type && v.status === 'available');
                        if (matchedV) {
                            defaultVehicleId = matchedV.id;
                        } else {
                            const anyV = vehicles.find(v => v.type === b.requested_vehicle_type);
                            if (anyV) defaultVehicleId = anyV.id;
                        }
                    }

                    let vehicleOptionsHTML = '<option value="">-- เลือกยานพาหนะ --</option>';
                    vehicles.forEach(v => {
                        const typeDisp = v.type === 'new_van' ? 'รถตู้ใหม่' : v.type === 'old_van' ? 'รถตู้เก่า' : v.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ';
                        const statusLabel = v.status === 'available' ? 'พร้อมใช้งาน' : v.status === 'maintenance' ? 'ซ่อมบำรุง' : v.status;
                        const isSelected = v.id === defaultVehicleId ? 'selected' : '';
                        
                        let suffix = '';
                        if (v.type === b.requested_vehicle_type) {
                            suffix = ' [ตรงความต้องการ]';
                        }
                        
                        vehicleOptionsHTML += `<option value="${v.id}" ${isSelected}>${typeDisp} - ${v.license_plate} (${v.brand} ${v.model} | ${statusLabel})${suffix}</option>`;
                    });

                    // Generate drivers selection
                    let defaultDriverId = '';
                    const availableDriver = drivers.find(d => d.status === 'available');
                    if (availableDriver) {
                        defaultDriverId = availableDriver.id;
                    } else if (drivers.length > 0) {
                        defaultDriverId = drivers[0].id;
                    }

                    let driverOptionsHTML = '<option value="">-- เลือกคนขับ --</option>';
                    drivers.forEach(d => {
                        const statusLabel = d.status === 'available' ? 'พร้อมใช้งาน' : d.status;
                        const isSelected = d.id === defaultDriverId ? 'selected' : '';
                        driverOptionsHTML += `<option value="${d.id}" ${isSelected}>${d.full_name} (${d.phone} | ${statusLabel})</option>`;
                    });

                    const initialNote = getVehicleChangeNote(b, defaultVehicleId);

                    resourceAllocationHTML = `
                        <div style="display:flex; flex-direction:column; gap:5px; min-width: 220px;">
                            <select class="form-control pending-vehicle-select" id="pending-vehicle-${b.id}" style="font-size:12px; padding:4px 8px; height:auto; width: 100%;">
                                ${vehicleOptionsHTML}
                            </select>
                            <select class="form-control pending-driver-select" id="pending-driver-${b.id}" style="font-size:12px; padding:4px 8px; height:auto; width: 100%;">
                                ${driverOptionsHTML}
                            </select>
                            <div class="vehicle-change-note" id="change-note-${b.id}" style="font-size: 11px; color: var(--color-rejected); font-weight: 600; display: ${initialNote ? 'block' : 'none'};">
                                ⚠️ หมายเหตุ: ${initialNote}
                            </div>
                        </div>
                    `;
                } else {
                    // Display static text of assignment for approver and executive
                    const assignment = assignments.find(a => a.booking_id === b.id);
                    const vehicle = assignment ? vehicles.find(v => v.id === assignment.vehicle_id) : null;
                    const driver = assignment ? drivers.find(d => d.id === assignment.driver_id) : null;
                    
                    const typeDisp = vehicle ? (vehicle.type === 'new_van' ? 'รถตู้ใหม่' : vehicle.type === 'old_van' ? 'รถตู้เก่า' : vehicle.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ') : '';
                    const vehicleText = vehicle ? `${typeDisp} - ${vehicle.license_plate} (${vehicle.brand} ${vehicle.model})` : '<span style="color:var(--color-rejected);">ไม่ได้ระบุ</span>';
                    const driverText = driver ? `${driver.full_name} (${driver.phone})` : '<span style="color:var(--color-rejected);">ไม่ได้ระบุ</span>';
                    
                    resourceAllocationHTML = `
                        <div style="font-size:12px; display:flex; flex-direction:column; gap:4px; min-width: 200px;">
                            <div><strong>ยานพาหนะ:</strong> ${vehicleText}</div>
                            <div><strong>พนักงานขับรถ:</strong> ${driverText}</div>
                            ${b.vehicle_change_note ? `<div style="font-size: 11px; color: var(--color-rejected); font-weight: 600;">⚠️ หมายเหตุ: ${b.vehicle_change_note}</div>` : ''}
                        </div>
                    `;
                }

                let approveText = 'อนุมัติ';
                let rejectText = 'ปฏิเสธ';
                const effectiveRole = appState.currentUser.role === 'superadmin' 
                    ? (b.status === 'pending' ? 'admin' : b.status === 'reviewed' ? 'approver' : 'executive') 
                    : appState.currentUser.role;

                if (effectiveRole === 'admin') {
                    approveText = 'ผ่านการตรวจสอบ';
                    rejectText = 'ไม่ผ่านการตรวจสอบ';
                } else if (effectiveRole === 'approver') {
                    approveText = 'เห็นควรอนุมัติ';
                    rejectText = 'ไม่เห็นควรอนุมัติ';
                } else if (effectiveRole === 'executive') {
                    approveText = 'อนุมัติ';
                    rejectText = 'ไม้อนุมัติ';
                }

                let stepBadge = '';
                if (appState.currentUser.role === 'superadmin') {
                    if (b.status === 'pending') {
                        stepBadge = '<div style="margin-bottom: 5px;"><span class="badge badge-pending" style="font-size:11px;">ขั้นตอนที่ 1: รอตรวจสอบ (หัวหน้างาน)</span></div>';
                    } else if (b.status === 'reviewed') {
                        stepBadge = '<div style="margin-bottom: 5px;"><span class="badge" style="background-color:#ffeeba; color:#856404; font-size:11px; display:inline-block; padding: 2px 6px; border-radius: 4px;">ขั้นตอนที่ 2: รอเห็นชอบ (รอง ผอ.)</span></div>';
                    } else if (b.status === 'verified') {
                        stepBadge = '<div style="margin-bottom: 5px;"><span class="badge" style="background-color:#b8daff; color:#004085; font-size:11px; display:inline-block; padding: 2px 6px; border-radius: 4px;">ขั้นตอนที่ 3: รออนุมัติ (ผอ.)</span></div>';
                    }
                }

                tr.innerHTML = `
                    <td style="font-weight:bold;">${b.booking_reference}</td>
                    <td><strong>${b.requester_name}</strong><br><small style="color:var(--text-muted);">${dept ? dept.name : ''}</small></td>
                    <td><strong>${b.destination}</strong><br><small style="color:var(--text-muted);">${b.objective}</small></td>
                    <td>${start}</td>
                    <td>${resourceAllocationHTML}</td>
                    <td>
                        ${stepBadge}
                        ${hasOverlap ? '<span style="color: var(--color-pending); font-weight:600;"><i class="fas fa-exclamation-triangle"></i> เส้นทางทับซ้อน (จองวันเดียวกัน)</span>' : '<span style="color: var(--color-approved);"><i class="fas fa-check-circle"></i> ปกติ (เส้นทางไม่ซ้ำ)</span>'}
                    </td>
                    <td>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <button type="button" class="btn btn-secondary btn-icon-only view-detail-btn" data-booking-id="${b.id}" title="ดูรายละเอียด">
                                <i class="fas fa-eye text-primary"></i>
                            </button>
                            <button type="button" class="btn btn-secondary btn-icon-only pdf-btn" data-booking-id="${b.id}" title="ดาวน์โหลด PDF ใบขอใช้รถ">
                                <i class="fas fa-file-pdf text-danger"></i>
                            </button>
                            <button type="button" class="btn btn-success approve-action-btn" data-booking-id="${b.id}" style="padding: 4px 8px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;" title="${approveText}">
                                <i class="fas fa-check"></i> <span>${approveText}</span>
                            </button>
                            <button type="button" class="btn btn-danger reject-action-btn" data-booking-id="${b.id}" style="padding: 4px 8px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;" title="${rejectText}">
                                <i class="fas fa-times"></i> <span>${rejectText}</span>
                            </button>
                        </div>
                    </td>
                `;
                elements.pendingTableBody.appendChild(tr);

                // Bind change note live update
                const vehicleSelect = tr.querySelector('.pending-vehicle-select');
                if (vehicleSelect) {
                    vehicleSelect.addEventListener('change', () => {
                        const note = getVehicleChangeNote(b, vehicleSelect.value);
                        const noteDiv = tr.querySelector(`#change-note-${b.id}`);
                        if (noteDiv) {
                            if (note) {
                                noteDiv.textContent = `⚠️ หมายเหตุ: ${note}`;
                                noteDiv.style.display = 'block';
                            } else {
                                noteDiv.style.display = 'none';
                            }
                        }
                    });
                }
            });
        }

        // 2. Approved Bookings (Pending Vehicle/Driver Assignment)
        elements.approvedTableBody.innerHTML = '';
        const approvedList = bookings.filter(b => b.status === 'approved');
        
        if (approvedList.length === 0) {
            elements.approvedTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">ไม่มีรายการรถที่อนุมัติและรอการจัดสรร</td></tr>';
        } else {
            approvedList.forEach(b => {
                const tr = document.createElement('tr');
                const dept = depts.find(d => d.id === b.department_id);
                const start = new Date(b.start_date_time).toLocaleDateString('th-TH');
                const assignment = assignments.find(a => a.booking_id === b.id);
                
                let assignStatus = '<span class="badge badge-pending"><i class="fas fa-clock"></i> รอระบุรถ/คนขับ</span>';
                if (assignment) {
                    const vehicle = vehicles.find(v => v.id === assignment.vehicle_id);
                    if (vehicle) {
                        const typeDisp = vehicle.type === 'new_van' ? 'รถตู้ใหม่' : vehicle.type === 'old_van' ? 'รถตู้เก่า' : vehicle.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ';
                        assignStatus = `<span class="badge badge-approved"><i class="fas fa-check"></i> จัดแล้ว: ${typeDisp} (${vehicle.license_plate})</span>`;
                    }
                }

                tr.innerHTML = `
                    <td style="font-weight:bold;">${b.booking_reference}</td>
                    <td><strong>${b.requester_name}</strong><br><small style="color:var(--text-muted);">${dept ? dept.name : ''}</small></td>
                    <td>${b.destination}</td>
                    <td>${start}</td>
                    <td>${assignStatus}</td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="btn btn-secondary btn-icon-only view-detail-btn" data-booking-id="${b.id}" title="ดูรายละเอียด">
                                <i class="fas fa-eye text-primary"></i>
                            </button>
                            <button type="button" class="btn btn-secondary btn-icon-only pdf-btn" data-booking-id="${b.id}" title="ดาวน์โหลด PDF ใบขอใช้รถ">
                                <i class="fas fa-file-pdf text-danger"></i>
                            </button>
                            <button type="button" class="btn btn-primary btn-icon-only assign-action-btn" data-booking-id="${b.id}" title="จัดรถและคนขับ">
                                <i class="fas fa-bus-alt"></i>
                            </button>
                            ${assignment ? `
                            <button type="button" class="btn btn-success btn-icon-only post-trip-action-btn" data-assignment-id="${assignment.id}" data-booking-id="${b.id}" title="บันทึกหลังเดินทาง (Post-Trip Log)">
                                <i class="fas fa-clipboard-list"></i>
                            </button>` : ''}
                        </div>
                    </td>
                `;
                elements.approvedTableBody.appendChild(tr);
            });
        }

        // 3. Completed Bookings
        elements.completedTableBody.innerHTML = '';
        const completedList = bookings.filter(b => b.status === 'completed');
        
        if (completedList.length === 0) {
            elements.completedTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">ไม่มีรายการเดินทางที่เสร็จสมบูรณ์ในระบบ</td></tr>';
        } else {
            completedList.forEach(b => {
                const tr = document.createElement('tr');
                const dept = depts.find(d => d.id === b.department_id);
                const start = new Date(b.start_date_time).toLocaleDateString('th-TH');
                const assignment = assignments.find(a => a.booking_id === b.id);
                let vehicleText = '-';
                if (assignment) {
                    const vehicle = vehicles.find(v => v.id === assignment.vehicle_id);
                    if (vehicle) vehicleText = `${vehicle.brand} (${vehicle.license_plate})`;
                }

                tr.innerHTML = `
                    <td style="font-weight:bold;">${b.booking_reference}</td>
                    <td><strong>${b.requester_name}</strong><br><small style="color:var(--text-muted);">${dept ? dept.name : ''}</small></td>
                    <td>${b.destination}</td>
                    <td>${start}</td>
                    <td>${vehicleText}</td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="btn btn-secondary btn-icon-only view-detail-btn" data-booking-id="${b.id}" title="ดูรายละเอียด">
                                <i class="fas fa-eye text-primary"></i>
                            </button>
                            <button type="button" class="btn btn-secondary btn-icon-only pdf-btn" data-booking-id="${b.id}" title="ดาวน์โหลด PDF">
                                <i class="fas fa-file-pdf text-danger"></i>
                            </button>
                        </div>
                    </td>
                `;
                elements.completedTableBody.appendChild(tr);
            });
        }

        const bindCardEvents = (tableBody) => {
            tableBody.querySelectorAll('.view-detail-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    showBookingDetailModal(btn.getAttribute('data-booking-id'));
                });
            });
            tableBody.querySelectorAll('.pdf-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    pdfGenerator.generateBookingPDF(btn.getAttribute('data-booking-id'));
                });
            });
        };

        bindCardEvents(elements.pendingTableBody);
        bindCardEvents(elements.approvedTableBody);
        bindCardEvents(elements.completedTableBody);

        // Bind Approval actions
        elements.pendingTableBody.querySelectorAll('.approve-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-booking-id');
                const booking = db.getBookingById(id);
                if (!booking) return;

                const role = appState.currentUser.role;
                const effectiveRole = role === 'superadmin' 
                    ? (booking.status === 'pending' ? 'admin' : booking.status === 'reviewed' ? 'approver' : 'executive') 
                    : role;

                if (effectiveRole === 'admin') {
                    // Step 1: Head of Vehicles
                    const row = e.currentTarget.closest('tr');
                    const vehicleSelect = row.querySelector('.pending-vehicle-select');
                    const driverSelect = row.querySelector('.pending-driver-select');
                    
                    const vehicleId = vehicleSelect.value;
                    const driverId = driverSelect.value;

                    if (!vehicleId || !driverId) {
                        alert('กรุณาเลือกยานพาหนะและพนักงานขับรถก่อนกดผ่านการตรวจสอบ');
                        return;
                    }

                    const confirmMsg = role === 'superadmin'
                        ? 'คุณยืนยันคำขอเดินทางนี้ "ผ่านการตรวจสอบ (แทนหัวหน้างานยานพาหนะ)" และได้จัดสรรยานพาหนะตามนี้ใช่หรือไม่?'
                        : 'คุณยืนยันว่าคำขอเดินทางนี้ "ผ่านการตรวจสอบ" และได้จัดสรรยานพาหนะตามนี้ใช่หรือไม่?';

                    if (confirm(confirmMsg)) {
                        const note = getVehicleChangeNote(booking, vehicleId);
                        booking.vehicle_change_note = note ? note : null;
                        booking.status = 'reviewed'; // Transition to reviewed
                        
                        const bookings = db.getBookings();
                        const idx = bookings.findIndex(bk => bk.id === booking.id);
                        if (idx !== -1) {
                            bookings[idx] = booking;
                            db.saveItems(DB_KEYS.BOOKINGS, bookings);
                        }

                        // Create assignment
                        db.createAssignment(id, vehicleId, driverId, appState.currentUser.id);
                        
                        renderAdminDashboard();
                        alert('ดำเนินการบันทึกผ่านการตรวจสอบและจัดสรรรถ/คนขับเรียบร้อยแล้ว');
                    }
                } else if (effectiveRole === 'approver') {
                    // Step 2: Deputy Director of General Administration
                    const confirmMsg = role === 'superadmin'
                        ? 'คุณยืนยันคำขอเดินทางนี้ "เห็นควรอนุมัติ (แทนรองผู้อำนวยการ ฝ่ายบริหารทั่วไป)" ใช่หรือไม่?'
                        : 'คุณยืนยันคำขอเดินทางนี้ "เห็นควรอนุมัติ" ใช่หรือไม่?';

                    if (confirm(confirmMsg)) {
                        booking.status = 'verified'; // Transition to verified
                        
                        const bookings = db.getBookings();
                        const idx = bookings.findIndex(bk => bk.id === booking.id);
                        if (idx !== -1) {
                            bookings[idx] = booking;
                            db.saveItems(DB_KEYS.BOOKINGS, bookings);
                        }
                        
                        renderAdminDashboard();
                        alert('บันทึกเห็นควรอนุมัติเรียบร้อยแล้ว');
                    }
                } else if (effectiveRole === 'executive') {
                    // Step 3: School Director
                    const confirmMsg = role === 'superadmin'
                        ? 'คุณยืนยันที่จะ "อนุมัติ (แทนผู้อำนวยการโรงเรียน)" คำขอเดินทางนี้ใช่หรือไม่?'
                        : 'คุณยืนยันที่จะ "อนุมัติ" คำขอเดินทางนี้ใช่หรือไม่?';

                    if (confirm(confirmMsg)) {
                        booking.status = 'approved'; // Transition to approved
                        booking.approver_id = parseInt(appState.currentUser.id);
                        booking.approved_at = new Date().toISOString();
                        
                        const bookings = db.getBookings();
                        const idx = bookings.findIndex(bk => bk.id === booking.id);
                        if (idx !== -1) {
                            bookings[idx] = booking;
                            db.saveItems(DB_KEYS.BOOKINGS, bookings);
                        }
                        
                        renderAdminDashboard();
                        alert('อนุมัติคำขอใช้รถเรียบร้อยแล้ว');
                    }
                }
            });
        });

        elements.pendingTableBody.querySelectorAll('.reject-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-booking-id');
                const booking = db.getBookingById(id);
                if (!booking) return;

                const role = appState.currentUser.role;
                const effectiveRole = role === 'superadmin' 
                    ? (booking.status === 'pending' ? 'admin' : booking.status === 'reviewed' ? 'approver' : 'executive') 
                    : role;
                
                let promptMsg = 'กรุณากรอกเหตุผลในการปฏิเสธการขอใช้รถ:';
                let reasonPrefix = '';
                let successMsg = 'ปฏิเสธการใช้รถเรียบร้อยแล้ว';

                if (effectiveRole === 'admin') {
                    promptMsg = role === 'superadmin'
                        ? 'กรุณากรอกเหตุผลที่ "ไม่ผ่านการตรวจสอบ (แทนหัวหน้างานยานพาหนะ)":'
                        : 'กรุณากรอกเหตุผลที่ "ไม่ผ่านการตรวจสอบ":';
                    reasonPrefix = role === 'superadmin' ? '[ผู้ดูแลระบบแทนหัวหน้างาน: ไม่ผ่านการตรวจสอบ] ' : '[ไม่ผ่านการตรวจสอบ] ';
                    successMsg = 'บันทึกไม่ผ่านการตรวจสอบเรียบร้อยแล้ว';
                } else if (effectiveRole === 'approver') {
                    promptMsg = role === 'superadmin'
                        ? 'กรุณากรอกเหตุผลที่ "ไม่เห็นควรอนุมัติ (แทนรองผู้อำนวยการ ฝ่ายบริหารทั่วไป)":'
                        : 'กรุณากรอกเหตุผลที่ "ไม่เห็นควรอนุมัติ":';
                    reasonPrefix = role === 'superadmin' ? '[ผู้ดูแลระบบแทนรอง ผอ.: ไม่เห็นควรอนุมัติ] ' : '[ไม่เห็นควรอนุมัติ] ';
                    successMsg = 'บันทึกไม่เห็นควรอนุมัติเรียบร้อยแล้ว';
                } else if (effectiveRole === 'executive') {
                    promptMsg = role === 'superadmin'
                        ? 'กรุณากรอกเหตุผลที่ "ไม้อนุมัติ (แทนผู้อำนวยการโรงเรียน)":'
                        : 'กรุณากรอกเหตุผลที่ "ไม้อนุมัติ":';
                    reasonPrefix = role === 'superadmin' ? '[ผู้ดูแลระบบแทน ผอ.: ไม้อนุมัติ] ' : '[ไม้อนุมัติ] ';
                    successMsg = 'บันทึกไม้อนุมัติเรียบร้อยแล้ว';
                }

                const reason = prompt(promptMsg);
                if (reason !== null) {
                    if (reason.trim() === '') {
                        alert('คุณต้องระบุเหตุผลด้วย');
                    } else {
                        db.rejectBooking(id, appState.currentUser.id, reasonPrefix + reason.trim());
                        renderAdminDashboard();
                        alert(successMsg);
                    }
                }
            });
        });

        // Bind Assign vehicle/driver action
        elements.approvedTableBody.querySelectorAll('.assign-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-booking-id');
                showAssignmentModal(id);
            });
        });

        // Bind Post-Trip Log action
        elements.approvedTableBody.querySelectorAll('.post-trip-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const assignId = e.currentTarget.getAttribute('data-assignment-id');
                const bookingId = e.currentTarget.getAttribute('data-booking-id');
                showPostTripModal(assignId, bookingId);
            });
        });
    }

    // Render Rejected Bookings Table (New Feature)
    function renderRejectedBookingsTable() {
        const bookings = db.getBookings();
        const depts = db.getDepartments();
        const tbody = document.getElementById('rejected-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        const rejectedList = bookings.filter(b => b.status === 'rejected');

        if (rejectedList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">ไม่มีคำขอที่ไม่อนุมัติ / ปฏิเสธการขอใช้รถในขณะนี้</td></tr>';
            return;
        }

        rejectedList.forEach(b => {
            const tr = document.createElement('tr');
            const dept = depts.find(d => d.id === b.department_id);
            const start = new Date(b.start_date_time).toLocaleDateString('th-TH');

            tr.innerHTML = `
                <td style="font-weight:bold;">${b.booking_reference}</td>
                <td><strong>${b.requester_name}</strong><br><small style="color:var(--text-muted);">${dept ? dept.name : ''}</small></td>
                <td>${b.destination}</td>
                <td>${start}</td>
                <td style="color:var(--color-rejected); font-weight:600;"><i class="fas fa-exclamation-circle"></i> ${b.rejection_reason || 'ไม่ได้ระบุเหตุผล'}</td>
                <td>
                    <div style="display:flex; gap:8px;">
                        <button type="button" class="btn btn-secondary btn-icon-only view-detail-btn" data-booking-id="${b.id}" title="ดูรายละเอียด">
                            <i class="fas fa-eye text-primary"></i>
                        </button>
                        <button type="button" class="btn btn-secondary btn-icon-only pdf-btn" data-booking-id="${b.id}" title="ดาวน์โหลด PDF ใบขอใช้รถ">
                            <i class="fas fa-file-pdf text-danger"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showBookingDetailModal(btn.getAttribute('data-booking-id'));
            });
        });
        tbody.querySelectorAll('.pdf-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pdfGenerator.generateBookingPDF(btn.getAttribute('data-booking-id'));
            });
        });
    }

    // Modal Assignment logic
    function showAssignmentModal(bookingId) {
        const booking = db.getBookingById(bookingId);
        if (!booking) return;

        const modal = elements.assignmentModal;
        const vehicles = db.getVehicles();
        const drivers = db.getDrivers();
        const assignments = db.getAssignments();
        
        // Find existing assignment for this booking
        const existingAssignment = assignments.find(a => a.booking_id === parseInt(bookingId));

        const vehicleSelect = document.getElementById('assign-vehicle');
        const driverSelect = document.getElementById('assign-driver');

        // Populate Vehicles Select
        vehicleSelect.innerHTML = '<option value="">-- กรุณาเลือกยานพาหนะ --</option>';
        vehicles.forEach(v => {
            const typeDisp = v.type === 'new_van' ? 'รถตู้ใหม่' : v.type === 'old_van' ? 'รถตู้เก่า' : v.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ';
            const statusLabel = v.status === 'available' ? 'พร้อมใช้งาน' : v.status === 'maintenance' ? 'ซ่อมบำรุง' : v.status;
            
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.textContent = `${typeDisp} - ${v.license_plate} (${v.brand} ${v.model} | สถานะ: ${statusLabel})`;
            
            if (v.type === booking.requested_vehicle_type) {
                opt.textContent += ' [ตรงความต้องการ]';
            }
            vehicleSelect.appendChild(opt);
        });

        // Populate Drivers Select
        driverSelect.innerHTML = '<option value="">-- กรุณาเลือกคนขับ --</option>';
        drivers.forEach(d => {
            const statusLabel = d.status === 'available' ? 'พร้อมใช้งาน' : d.status;
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = `${d.full_name} (${d.phone} | สถานะ: ${statusLabel})`;
            driverSelect.appendChild(opt);
        });

        // Pre-select existing assignment values
        if (existingAssignment) {
            vehicleSelect.value = existingAssignment.vehicle_id;
            driverSelect.value = existingAssignment.driver_id;
        } else {
            vehicleSelect.value = '';
            driverSelect.value = '';
        }

        modal.classList.add('active');

        // Form Submit
        const form = document.getElementById('assignment-form');
        
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const vehicleId = newForm.querySelector('#assign-vehicle').value;
            const driverId = newForm.querySelector('#assign-driver').value;

            if (!vehicleId || !driverId) {
                alert('กรุณาเลือกทั้งยานพาหนะและพนักงานขับรถ');
                return;
            }

            db.createAssignment(bookingId, vehicleId, driverId, appState.currentUser.id);
            modal.classList.remove('active');
            renderAdminDashboard();
            alert('จัดสรรทรัพยากรเรียบร้อยแล้ว');
        });

        document.getElementById('close-assignment-modal').onclick = () => {
            modal.classList.remove('active');
        };
    }

    // Modal Post-Trip Log logic
    function showPostTripModal(assignmentId, bookingId) {
        const modal = elements.postTripModal;
        const booking = db.getBookingById(bookingId);
        if (!booking) return;

        const assignment = db.getAssignments().find(a => a.id === parseInt(assignmentId));
        if (!assignment) return;

        const vehicle = db.getVehicles().find(v => v.id === assignment.vehicle_id);
        const startMileageInput = document.getElementById('log-start-mileage');
        
        if (vehicle) {
            startMileageInput.value = vehicle.current_mileage;
            startMileageInput.readOnly = true;
        }

        modal.classList.add('active');

        // Form Submit
        const form = document.getElementById('post-trip-form');
        
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const startMil = parseInt(newForm.elements['log-start-mileage'].value);
            const endMil = parseInt(newForm.elements['log-end-mileage'].value);

            if (endMil <= startMil) {
                alert('เลขไมล์กลับถึงโรงเรียนต้องมีค่ามากกว่าเลขไมล์เมื่อเริ่มต้นเดินทาง');
                return;
            }

            const logData = {
                booking_assignment_id: assignmentId,
                start_mileage: startMil,
                end_mileage: endMil,
                fuel_liters: parseFloat(newForm.elements['log-fuel-liters'].value || 0),
                fuel_cost: parseFloat(newForm.elements['log-fuel-cost'].value || 0),
                maintenance_cost: parseFloat(newForm.elements['log-maintenance-cost'].value || 0),
                incident_reports: newForm.elements['log-incident'].value.trim(),
                satisfaction_score: newForm.elements['log-satisfaction'].value,
                satisfaction_feedback: newForm.elements['log-feedback'].value.trim(),
                logger_id: appState.currentUser.id
            };

            db.createPostTripLog(logData);
            modal.classList.remove('active');
            newForm.reset();
            renderAdminDashboard();
            alert('บันทึกข้อมูลหลังการเดินทางเสร็จสิ้น ทริปนี้ปิดตัวสมบูรณ์แล้วครับ');
        });

        document.getElementById('close-post-trip-modal').onclick = () => {
            modal.classList.remove('active');
        };
    }

    // --- 7. Admin CRUD: Users Management Logic (New) ---
    function renderUsersTable() {
        const users = db.getUsers();
        const depts = db.getDepartments();
        const tbody = elements.adminUsersTableBody;
        
        tbody.innerHTML = '';
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">ไม่พบผู้ใช้ในระบบ</td></tr>';
            return;
        }

        users.forEach(u => {
            const tr = document.createElement('tr');
            const dept = depts.find(d => d.id === u.department_id);
            const deptName = dept ? dept.name : '-';
            
            const rolesMap = {
                superadmin: 'ผู้ดูแลระบบ',
                admin: 'หัวหน้างานยานพาหนะ',
                approver: 'รองผู้อำนวยการ ฝ่ายบริหารทั่วไป',
                driver: 'พนักงานขับรถ',
                executive: 'ผู้อำนวยการโรงเรียน'
            };

            const statusBadge = u.status === 'active' 
                ? '<span class="badge badge-approved">Active</span>' 
                : '<span class="badge badge-cancelled">Inactive</span>';

            tr.innerHTML = `
                <td>${u.id}</td>
                <td style="font-weight: 700;">${u.username}</td>
                <td>${u.full_name}</td>
                <td>${u.email}</td>
                <td>${rolesMap[u.role] || u.role}</td>
                <td>${deptName}</td>
                <td>${statusBadge}</td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button type="button" class="btn btn-secondary btn-icon-only edit-user-btn" data-user-id="${u.id}" title="แก้ไขข้อมูล">
                            <i class="fas fa-edit text-primary"></i>
                        </button>
                        <button type="button" class="btn btn-secondary btn-icon-only delete-user-btn" data-user-id="${u.id}" title="ลบผู้ใช้" ${u.id === appState.currentUser.id ? 'disabled style="opacity: 0.5;"' : ''}>
                            <i class="fas fa-trash-alt text-danger"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Bind Edit buttons
        tbody.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-user-id');
                showUserCRUDModal(id);
            });
        });

        // Bind Delete buttons
        tbody.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-user-id');
                if (confirm('คุณแน่ใจว่าต้องการลบบัญชีผู้ใช้งานระบบรายนี้หรือไม่? การลบจะมีผลต่อประวัติจัดสรรพนักงานขับรถด้วย')) {
                    try {
                        db.deleteUser(id);
                        renderUsersTable();
                        alert('ลบบัญชีผู้ใช้เรียบร้อยแล้ว');
                    } catch (err) {
                        alert(err.message);
                    }
                }
            });
        });
    }

    function showUserCRUDModal(userId = null) {
        populateDepartmentsDropdown('user-crud-dept');
        const modal = elements.userFormModal;
        const form = document.getElementById('user-crud-form');
        
        const title = document.getElementById('user-modal-title');
        const pwReq = document.getElementById('user-pw-req');
        const pwHelp = document.getElementById('user-pw-help');
        const usernameInput = document.getElementById('user-crud-username');
        const passwordInput = document.getElementById('user-crud-password');

        form.reset();

        if (userId) {
            // Edit User Mode
            const users = db.getUsers();
            const user = users.find(u => u.id === parseInt(userId));
            if (!user) return;

            document.getElementById('user-crud-id').value = user.id;
            usernameInput.value = user.username;
            document.getElementById('user-crud-fullname').value = user.full_name;
            document.getElementById('user-crud-email').value = user.email;
            document.getElementById('user-crud-phone').value = user.phone;
            document.getElementById('user-crud-role').value = user.role;
            document.getElementById('user-crud-dept').value = user.department_id || '';
            document.getElementById('user-crud-status').value = user.status || 'active';

            title.innerHTML = '<i class="fas fa-user-edit"></i> แก้ไขบัญชีผู้ใช้งาน';
            pwReq.style.display = 'none';
            passwordInput.removeAttribute('required');
            pwHelp.style.display = 'block';
        } else {
            // Add New User Mode
            document.getElementById('user-crud-id').value = '';
            title.innerHTML = '<i class="fas fa-user-plus"></i> เพิ่มบัญชีผู้ใช้งานใหม่';
            pwReq.style.display = 'inline';
            passwordInput.setAttribute('required', 'required');
            pwHelp.style.display = 'none';
        }

        modal.classList.add('active');

        // Form Submit
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = newForm.elements['user-crud-id'].value;
            
            const userData = {
                username: newForm.elements['user-crud-username'].value,
                password: newForm.elements['user-crud-password'].value,
                full_name: newForm.elements['user-crud-fullname'].value,
                email: newForm.elements['user-crud-email'].value,
                phone: newForm.elements['user-crud-phone'].value,
                role: newForm.elements['user-crud-role'].value,
                department_id: newForm.elements['user-crud-dept'].value,
                status: newForm.elements['user-crud-status'].value
            };

            try {
                if (id) {
                    db.updateUser(id, userData);
                    alert('อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว');
                } else {
                    db.createUser(userData);
                    alert('สร้างบัญชีผู้ใช้งานสำเร็จ');
                }
                modal.classList.remove('active');
                renderUsersTable();
            } catch (err) {
                alert(err.message);
            }
        });

        document.getElementById('close-user-modal').onclick = () => {
            modal.classList.remove('active');
        };
    }

    elements.btnAddUser.addEventListener('click', () => {
        showUserCRUDModal();
    });


    // --- 8. Admin CRUD: Vehicles Management Logic (New) ---
    function renderVehiclesTable() {
        const vehicles = db.getVehicles();
        const tbody = elements.adminVehiclesTableBody;

        tbody.innerHTML = '';
        if (vehicles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">ไม่พบยานพาหนะในระบบ</td></tr>';
            return;
        }

        vehicles.forEach(v => {
            const tr = document.createElement('tr');
            
            const typeMap = {
                new_van: 'รถตู้ใหม่',
                old_van: 'รถตู้เก่า',
                six_wheeler_truck: 'รถหกล้อ',
                other: 'อื่นๆ'
            };

            const statusBadges = {
                available: '<span class="badge badge-approved">ว่าง / พร้อมใช้</span>',
                maintenance: '<span class="badge badge-pending">ซ่อมบำรุง</span>',
                inactive: '<span class="badge badge-cancelled">งดใช้งาน</span>'
            };

            tr.innerHTML = `
                <td>${v.id}</td>
                <td style="font-weight:700;">${v.license_plate}</td>
                <td>${v.brand} ${v.model}</td>
                <td>${typeMap[v.type] || v.type}</td>
                <td>${v.capacity} ที่นั่ง</td>
                <td>${v.current_mileage.toLocaleString()} กม.</td>
                <td>${v.standard_fuel_consumption} กม./ลิตร</td>
                <td>${statusBadges[v.status] || v.status}</td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button type="button" class="btn btn-secondary btn-icon-only edit-vehicle-btn" data-vehicle-id="${v.id}" title="แก้ไขข้อมูล">
                            <i class="fas fa-edit text-primary"></i>
                        </button>
                        <button type="button" class="btn btn-secondary btn-icon-only delete-vehicle-btn" data-vehicle-id="${v.id}" title="ลบข้อมูลรถ">
                            <i class="fas fa-trash-alt text-danger"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Bind Edit buttons
        tbody.querySelectorAll('.edit-vehicle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-vehicle-id');
                showVehicleCRUDModal(id);
            });
        });

        // Bind Delete buttons
        tbody.querySelectorAll('.delete-vehicle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-vehicle-id');
                if (confirm('คุณแน่ใจว่าต้องการลบยานพาหนะคันนี้ออกจากระบบหรือไม่? ข้อมูลการเดินทางที่อ้างอิงรถคันนี้จะคงอยู่แต่จะไม่เชื่อมโยง')) {
                    try {
                        db.deleteVehicle(id);
                        renderVehiclesTable();
                        alert('ลบข้อมูลรถยนต์เรียบร้อยแล้ว');
                    } catch (err) {
                        alert(err.message);
                    }
                }
            });
        });
    }

    function showVehicleCRUDModal(vehicleId = null) {
        const modal = elements.vehicleFormModal;
        const form = document.getElementById('vehicle-crud-form');
        const title = document.getElementById('vehicle-modal-title');

        form.reset();

        if (vehicleId) {
            // Edit Vehicle Mode
            const vehicles = db.getVehicles();
            const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
            if (!vehicle) return;

            document.getElementById('vehicle-crud-id').value = vehicle.id;
            document.getElementById('vehicle-crud-plate').value = vehicle.license_plate;
            document.getElementById('vehicle-crud-brand').value = vehicle.brand;
            document.getElementById('vehicle-crud-model').value = vehicle.model;
            document.getElementById('vehicle-crud-type').value = vehicle.type;
            document.getElementById('vehicle-crud-capacity').value = vehicle.capacity;
            document.getElementById('vehicle-crud-mileage').value = vehicle.current_mileage;
            document.getElementById('vehicle-crud-consumption').value = vehicle.standard_fuel_consumption;
            document.getElementById('vehicle-crud-date').value = vehicle.purchase_date || '';
            document.getElementById('vehicle-crud-cost').value = vehicle.purchase_cost || 0;
            document.getElementById('vehicle-crud-status').value = vehicle.status || 'available';

            title.innerHTML = '<i class="fas fa-edit"></i> แก้ไขข้อมูลยานพาหนะโรงเรียน';
        } else {
            // Add New Vehicle Mode
            document.getElementById('vehicle-crud-id').value = '';
            title.innerHTML = '<i class="fas fa-plus"></i> เพิ่มยานพาหนะคันใหม่';
        }

        modal.classList.add('active');

        // Form Submit
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = newForm.elements['vehicle-crud-id'].value;

            const vehicleData = {
                license_plate: newForm.elements['vehicle-crud-plate'].value,
                brand: newForm.elements['vehicle-crud-brand'].value,
                model: newForm.elements['vehicle-crud-model'].value,
                type: newForm.elements['vehicle-crud-type'].value,
                capacity: newForm.elements['vehicle-crud-capacity'].value,
                current_mileage: newForm.elements['vehicle-crud-mileage'].value,
                standard_fuel_consumption: newForm.elements['vehicle-crud-consumption'].value,
                purchase_date: newForm.elements['vehicle-crud-date'].value,
                purchase_cost: newForm.elements['vehicle-crud-cost'].value,
                status: newForm.elements['vehicle-crud-status'].value
            };

            try {
                if (id) {
                    db.updateVehicle(id, vehicleData);
                    alert('อัปเดตข้อมูลยานพาหนะสำเร็จ');
                } else {
                    db.createVehicle(vehicleData);
                    alert('เพิ่มยานพาหนะคันใหม่เข้ากองรถยนต์สำเร็จ');
                }
                modal.classList.remove('active');
                renderVehiclesTable();
            } catch (err) {
                alert(err.message);
            }
        });

        document.getElementById('close-vehicle-modal').onclick = () => {
            modal.classList.remove('active');
        };
    }

    elements.btnAddVehicle.addEventListener('click', () => {
        showVehicleCRUDModal();
    });


    // --- 9. Executive BI Dashboard Module ---
    elements.biTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.biTabBtns.forEach(b => b.classList.remove('active'));
            elements.biTabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            appState.activeTabBI = tabId;
            renderBIDashboard();
        });
    });

    // Refresh button listener
    const btnBiRefresh = document.getElementById('btn-bi-refresh');
    if (btnBiRefresh) {
        btnBiRefresh.addEventListener('click', async () => {
            btnBiRefresh.disabled = true;
            const originalHTML = btnBiRefresh.innerHTML;
            btnBiRefresh.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังรีเฟรช...';
            await initDBSync();
            renderBIDashboard();
            btnBiRefresh.disabled = false;
            btnBiRefresh.innerHTML = originalHTML;
        });
    }

    // Sync listener to auto-refresh active views when database completes sync from D1
    window.addEventListener('db-synced', () => {
        if (appState.currentView === 'bi-dashboard-view') {
            renderBIDashboard();
        } else if (appState.currentView === 'driver-schedule-view') {
            renderDriverSchedule();
        } else if (appState.currentView === 'calendar-view') {
            renderCalendar();
        } else if (appState.currentView === 'admin-dashboard-view') {
            renderAdminDashboard();
        }
    });

    function renderBIDashboard() {
        const stats = db.getBIStatistics();
        
        // 1. Update KPIs
        const tripsCount = stats.vehicleStats.reduce((sum, v) => sum + v.trip_count, 0);
        const kpiTrips = document.getElementById('bi-kpi-trips');
        const kpiDistance = document.getElementById('bi-kpi-distance');
        const kpiExpenses = document.getElementById('bi-kpi-expenses');
        const kpiSatisfaction = document.getElementById('bi-kpi-satisfaction');

        if (kpiTrips) kpiTrips.textContent = tripsCount;
        if (kpiDistance) kpiDistance.textContent = Math.round(stats.totalDistance).toLocaleString();
        if (kpiExpenses) kpiExpenses.textContent = Math.round(stats.totalExpenses).toLocaleString();
        if (kpiSatisfaction) kpiSatisfaction.textContent = stats.averageSatisfaction;

        // 2. Render Tables
        renderBIReportsTable(stats);

        // 3. Render Charts
        renderBICharts(stats);
    }

    function renderBICharts(stats) {
        const isDark = document.body.classList.contains('dark-theme');
        const textColor = isDark ? '#9ca3af' : '#4b5563';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        const primaryColor = '#15803d'; // Forest Green
        const accentColor = '#facc15';  // Yellow Gold

        // Chart 1: Daily Usage
        const ctxDaily = document.getElementById('chart-daily-usage');
        if (ctxDaily && stats.dailyStats) {
            if (appState.charts.daily) appState.charts.daily.destroy();
            appState.charts.daily = new Chart(ctxDaily, {
                type: 'line',
                data: {
                    labels: stats.dailyStats.map(d => d.label),
                    datasets: [
                        {
                            label: 'จำนวนทริป (ครั้ง)',
                            data: stats.dailyStats.map(d => d.trips),
                            borderColor: primaryColor,
                            backgroundColor: 'rgba(21, 128, 61, 0.1)',
                            yAxisID: 'yTrips',
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'ระยะทางวิ่ง (กม.)',
                            data: stats.dailyStats.map(d => d.distance),
                            borderColor: '#0284c7',
                            backgroundColor: 'rgba(2, 132, 199, 0.1)',
                            yAxisID: 'yDist',
                            tension: 0.3,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: textColor, font: { family: 'Sarabun' } } }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'Sarabun', size: 9 } }
                        },
                        yTrips: {
                            type: 'linear',
                            position: 'left',
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'Sarabun' } },
                            title: { display: true, text: 'จำนวนครั้ง (ครั้ง)', color: textColor }
                        },
                        yDist: {
                            type: 'linear',
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: { color: textColor, font: { family: 'Sarabun' } },
                            title: { display: true, text: 'ระยะทาง (กม.)', color: textColor }
                        }
                    }
                }
            });
        }

        // Chart 2: Monthly Usage (Stacked Bar)
        const ctxMonthly = document.getElementById('chart-monthly-usage');
        if (ctxMonthly && stats.monthlyStats) {
            if (appState.charts.monthly) appState.charts.monthly.destroy();
            appState.charts.monthly = new Chart(ctxMonthly, {
                type: 'bar',
                data: {
                    labels: stats.monthlyStats.map(m => m.label),
                    datasets: [
                        {
                            label: 'เสร็จสิ้นภารกิจ',
                            data: stats.monthlyStats.map(m => m.completed),
                            backgroundColor: '#0284c7',
                        },
                        {
                            label: 'อนุมัติ/กำลังเดินรถ',
                            data: stats.monthlyStats.map(m => m.approved),
                            backgroundColor: '#16a34a',
                        },
                        {
                            label: 'รออนุมัติ',
                            data: stats.monthlyStats.map(m => m.pending),
                            backgroundColor: '#d97706',
                        },
                        {
                            label: 'ไม่อนุมัติ/ยกเลิก',
                            data: stats.monthlyStats.map(m => m.rejected),
                            backgroundColor: '#dc2626',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: textColor, font: { family: 'Sarabun' } } }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'Sarabun' } }
                        },
                        y: {
                            stacked: true,
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'Sarabun' } }
                        }
                    }
                }
            });
        }

        // Chart 3: Vehicle Distance & Usage
        const ctxVehicle = document.getElementById('chart-vehicle-distance');
        if (ctxVehicle) {
            if (appState.charts.vehicle) appState.charts.vehicle.destroy();
            appState.charts.vehicle = new Chart(ctxVehicle, {
                type: 'bar',
                data: {
                    labels: stats.vehicleStats.map(v => `${v.brand_model} (${v.license_plate.split(' ')[0]})`),
                    datasets: [
                        {
                            label: 'ระยะทางวิ่งสะสม (กม.)',
                            data: stats.vehicleStats.map(v => v.distance),
                            backgroundColor: 'rgba(21, 128, 61, 0.85)',
                            yAxisID: 'yD',
                        },
                        {
                            label: 'จำนวนทริปที่วิ่ง (ครั้ง)',
                            data: stats.vehicleStats.map(v => v.trip_count),
                            backgroundColor: 'rgba(250, 204, 21, 0.85)',
                            yAxisID: 'yT',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: textColor, font: { family: 'Sarabun' } } }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'Sarabun', size: 9 } }
                        },
                        yD: {
                            type: 'linear',
                            position: 'left',
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'Sarabun' } },
                            title: { display: true, text: 'ระยะทาง (กม.)', color: textColor }
                        },
                        yT: {
                            type: 'linear',
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: { color: textColor, font: { family: 'Sarabun' } },
                            title: { display: true, text: 'จำนวนครั้ง (ครั้ง)', color: textColor }
                        }
                    }
                }
            });
        }

        // Chart 4: Department Share
        const ctxDept = document.getElementById('chart-department-share');
        if (ctxDept && stats.deptStats) {
            if (appState.charts.dept) appState.charts.dept.destroy();
            const deptColors = [
                '#15803d', '#facc15', '#0284c7', '#d97706', '#dc2626',
                '#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#f97316',
                '#a855f7', '#6b7280'
            ];
            appState.charts.dept = new Chart(ctxDept, {
                type: 'doughnut',
                data: {
                    labels: stats.deptStats.map(d => d.name),
                    datasets: [
                        {
                            data: stats.deptStats.map(d => d.bookingCount),
                            backgroundColor: deptColors.slice(0, stats.deptStats.length),
                            borderWidth: isDark ? 2 : 1,
                            borderColor: isDark ? '#142319' : '#ffffff'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: textColor, font: { family: 'Sarabun', size: 9 } }
                        }
                    }
                }
            });
        }
    }

    function renderBIReportsTable(stats) {
        const vTableBody = document.getElementById('bi-vehicles-table-body');
        if (vTableBody) {
            vTableBody.innerHTML = '';
            if (stats.vehicleStats.length === 0) {
                vTableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:var(--text-muted);">ไม่มีข้อมูลสถิติรถยนต์</td></tr>';
            } else {
                stats.vehicleStats.forEach(v => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="font-weight:600;">${v.brand_model}<br><small style="color:var(--text-muted); font-weight:normal;">${v.license_plate}</small></td>
                        <td>${v.type_display}</td>
                        <td style="text-align:right; font-weight:600;">${v.trip_count}</td>
                        <td style="text-align:right;">${v.distance.toLocaleString()} กม.</td>
                        <td style="text-align:right;">${Math.round(v.fuel_cost).toLocaleString()} ฿</td>
                        <td style="text-align:right;">${Math.round(v.maintenance_cost).toLocaleString()} ฿</td>
                        <td style="text-align:right; font-weight:600; color:var(--primary);">${Math.round(v.total_cost).toLocaleString()} ฿</td>
                        <td style="text-align:right; color:var(--color-completed); font-weight:500;">${v.fuel_efficiency} กม./ลิตร</td>
                        <td style="text-align:right;">${v.cost_per_km} ฿/กม.</td>
                    `;
                    vTableBody.appendChild(tr);
                });
            }
        }

        const dTableBody = document.getElementById('bi-departments-table-body');
        if (dTableBody) {
            dTableBody.innerHTML = '';
            if (stats.deptStats.length === 0) {
                dTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">ไม่มีข้อมูลสถิติรายแผนก</td></tr>';
            } else {
                stats.deptStats.forEach(d => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="font-weight:600;">${d.name}</td>
                        <td style="text-align:right; font-weight:600;">${d.bookingCount} ครั้ง</td>
                        <td style="text-align:right;">${d.distance.toLocaleString()} กม.</td>
                        <td style="text-align:right; font-weight:600; color:var(--primary);">${Math.round(d.cost).toLocaleString()} ฿</td>
                    `;
                    dTableBody.appendChild(tr);
                });
            }
        }
    }

    // --- 7. Calendar View Module ---
    function isBookingOnDate(booking, date) {
        const cellStart = new Date(date);
        cellStart.setHours(0, 0, 0, 0);
        const cellEnd = new Date(date);
        cellEnd.setHours(23, 59, 59, 999);
        
        const bStart = new Date(booking.start_date_time);
        const bEnd = new Date(booking.end_date_time);
        
        return bStart <= cellEnd && bEnd >= cellStart;
    }

    function renderCalendar() {
        const calDate = appState.calendarDate;
        const year = calDate.getFullYear();
        const month = calDate.getMonth();

        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        
        if (elements.calendarMonthYearLabel) {
            elements.calendarMonthYearLabel.textContent = `${thaiMonths[month]} ${year + 543}`;
        }

        const bookings = db.getBookings();
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();

        const grid = elements.calendarDaysGrid;
        if (!grid) return;
        grid.innerHTML = '';

        // Render previous month's trailing days
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = prevMonthTotalDays - i;
            const prevMonthDate = new Date(year, month - 1, dayNum);
            createDayCell(prevMonthDate, dayNum, true);
        }

        // Render current month's days
        const today = new Date();
        for (let i = 1; i <= totalDays; i++) {
            const currentDate = new Date(year, month, i);
            const isToday = currentDate.toDateString() === today.toDateString();
            createDayCell(currentDate, i, false, isToday);
        }

        // Render next month's leading days to make 42 cells total (6 rows)
        const totalCells = firstDayIndex + totalDays;
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            const nextMonthDate = new Date(year, month + 1, i);
            createDayCell(nextMonthDate, i, true);
        }

        function createDayCell(date, dayNum, isOtherMonth, isToday = false) {
            const dayBox = document.createElement('div');
            dayBox.className = 'calendar-day-box';
            if (isOtherMonth) dayBox.classList.add('other-month');
            if (isToday) dayBox.classList.add('today');

            const numDisp = document.createElement('div');
            numDisp.className = 'calendar-day-number';
            numDisp.textContent = dayNum;
            dayBox.appendChild(numDisp);

            // Quick Add button
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'calendar-day-add-btn';
            addBtn.innerHTML = '<i class="fas fa-plus"></i>';
            addBtn.title = 'จองรถสำหรับวันนี้';
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${yyyy}-${mm}-${dd}`;

                navigateToView('booking-form-view');
                document.getElementById('booking-start-date').value = formattedDate;
                document.getElementById('booking-start-time').value = '08:00';
                document.getElementById('booking-end-date').value = formattedDate;
                document.getElementById('booking-end-time').value = '17:00';
            });
            dayBox.appendChild(addBtn);

            const dayBookings = bookings.filter(b => isBookingOnDate(b, date));
            const listContainer = document.createElement('div');
            listContainer.className = 'calendar-booking-list';

            dayBookings.forEach(b => {
                const item = document.createElement('div');
                item.className = `calendar-booking-item ${b.status}`;
                
                let dest = b.destination;
                if (dest.length > 18) dest = dest.substring(0, 16) + '...';
                item.textContent = `${b.booking_reference}: ${dest}`;
                item.title = `${b.booking_reference} - ${b.requester_name}\nปลายทาง: ${b.destination}\nวัตถุประสงค์: ${b.objective}\nสถานะ: ${b.status}`;
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showBookingDetailModal(b.id);
                });
                
                listContainer.appendChild(item);
            });

            dayBox.appendChild(listContainer);
            grid.appendChild(dayBox);
        }
    }

    // Bind calendar controls
    if (elements.calPrevMonthBtn) {
        elements.calPrevMonthBtn.addEventListener('click', () => {
            appState.calendarDate.setMonth(appState.calendarDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (elements.calNextMonthBtn) {
        elements.calNextMonthBtn.addEventListener('click', () => {
            appState.calendarDate.setMonth(appState.calendarDate.getMonth() + 1);
            renderCalendar();
        });
    }

    if (elements.calTodayBtn) {
        elements.calTodayBtn.addEventListener('click', () => {
            appState.calendarDate = new Date();
            renderCalendar();
        });
    }

    // --- 8. Driver Schedule View Module ---
    let currentDisplayedScheduleData = [];

    function renderDriverSchedule() {
        const currentUser = appState.currentUser;

        const drivers = db.getDrivers();
        const depts = db.getDepartments();
        const bookings = db.getBookings();
        const assignments = db.getAssignments();
        const vehicles = db.getVehicles();

        const selectorContainer = document.getElementById('driver-selector-container');
        const driverSelect = document.getElementById('schedule-driver-select');
        const nameHeaderLabel = document.getElementById('driver-name-header-label');
        const tableBody = document.getElementById('driver-schedule-table-body');

        if (!tableBody) return;

        // Build list of assignments with expanded info
        function getAssignmentsForDriver(driverId) {
            let filtered = assignments;
            if (driverId !== 'all') {
                filtered = assignments.filter(a => a.driver_id === parseInt(driverId));
            }

            return filtered.map(a => {
                const booking = bookings.find(b => b.id === a.booking_id);
                const vehicle = vehicles.find(v => v.id === a.vehicle_id);
                const driver = drivers.find(d => d.id === a.driver_id);
                const dept = depts.find(d => d.id === booking?.department_id);
                return {
                    assignment: a,
                    booking,
                    vehicle,
                    driver,
                    deptName: dept ? dept.name : 'ทั่วไป'
                };
            }).filter(item => item.booking !== undefined && item.booking.status !== 'cancelled' && item.booking.status !== 'rejected');
        }

        // If logged in as driver, lock to self. Otherwise (admin, approver, executive, guest), show selector.
        if (currentUser && currentUser.role === 'driver') {
            // Driver view: lock to self
            selectorContainer.style.display = 'none';
            
            const matchedDriver = drivers.find(d => d.user_id === currentUser.id);
            if (!matchedDriver) {
                nameHeaderLabel.textContent = `ตารางงานของ: ${currentUser.full_name} (ไม่พบรหัสคนขับในฐานข้อมูล)`;
                tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: var(--text-muted);">ไม่พบข้อมูลคนขับของคุณในระบบ กรุณาติดต่อแอดมิน</td></tr>';
                currentDisplayedScheduleData = [];
                return;
            }

            nameHeaderLabel.textContent = `ตารางงานของ: ${matchedDriver.full_name} (โทร: ${matchedDriver.phone})`;
            const initialData = getAssignmentsForDriver(matchedDriver.id);
            currentDisplayedScheduleData = initialData;
            populateScheduleTable(initialData);
        } else {
            // Admin, Approver, Executive, Guest view: show selector
            selectorContainer.style.display = 'flex';
            
            // Populate select dropdown
            driverSelect.innerHTML = '<option value="all">-- แสดงคนขับรถทั้งหมด --</option>';
            drivers.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = `${d.full_name} (${d.phone})`;
                driverSelect.appendChild(opt);
            });

            // Restore selection or default to all
            driverSelect.value = 'all';
            
            // Bind selector change
            driverSelect.onchange = () => {
                const selectedVal = driverSelect.value;
                const selectedDriver = drivers.find(d => d.id === parseInt(selectedVal));
                const labelText = selectedVal === 'all' 
                    ? 'ตารางงานของ: พนักงานขับรถทั้งหมด' 
                    : `ตารางงานของ: ${selectedDriver ? selectedDriver.full_name : ''} (โทร: ${selectedDriver ? selectedDriver.phone : ''})`;
                nameHeaderLabel.textContent = labelText;
                
                const data = getAssignmentsForDriver(selectedVal);
                currentDisplayedScheduleData = data;
                populateScheduleTable(data);
            };

            nameHeaderLabel.textContent = 'ตารางงานของ: พนักงานขับรถทั้งหมด';
            const initialData = getAssignmentsForDriver('all');
            currentDisplayedScheduleData = initialData;
            populateScheduleTable(initialData);
        }

        function populateScheduleTable(data) {
            tableBody.innerHTML = '';
            
            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: var(--text-muted);">ไม่มีรายการตารางงานเดินทางในช่วงนี้</td></tr>';
                return;
            }

            // Sort by departure time ascending
            data.sort((a, b) => new Date(a.booking.start_date_time) - new Date(b.booking.start_date_time));

            data.forEach(item => {
                const b = item.booking;
                const v = item.vehicle;
                
                const tr = document.createElement('tr');
                
                const startFormatted = new Date(b.start_date_time).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
                const endFormatted = new Date(b.end_date_time).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
                
                const statusBadges = {
                    pending: '<span class="badge badge-pending">รออนุมัติ</span>',
                    reviewed: '<span class="badge badge-warning">รอ รอง ผอ.</span>',
                    verified: '<span class="badge badge-info">รอ ผอ.</span>',
                    approved: '<span class="badge badge-approved">อนุมัติแล้ว</span>',
                    completed: '<span class="badge badge-completed">เสร็จสิ้นภารกิจ</span>',
                };

                const typeDisp = v ? (v.type === 'new_van' ? 'รถตู้ใหม่' : v.type === 'old_van' ? 'รถตู้เก่า' : v.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ') : '';
                const vehicleInfo = v ? `<strong>${typeDisp}</strong><br><small style="color:var(--text-muted);">${v.license_plate}</small>` : '-';

                const rawDetails = b.passenger_details || '';
                
                // Estimate passenger count robustly (by newline, comma, slash, semicolon, 'และ', or numbers)
                const items = rawDetails.split(/[\n,;/]|\s*และ\s*|\s*\d+[\.\)]\s*/)
                    .map(l => l.trim())
                    .filter(l => l.length > 0 && !l.includes('รวมนักเรียน') && !l.includes('ครูผู้ควบคุม'));
                const countMatch = rawDetails.match(/(\d+)\s*(?:คน|ท่าน)/);
                const parsedCount = countMatch ? parseInt(countMatch[1]) : 0;
                const estimatedCount = Math.max(items.length, parsedCount, parseInt(b.passenger_count) || 0);

                const hasManyPassengers = estimatedCount > 2;
                
                let passengerCellHTML = '';
                if (hasManyPassengers) {
                    passengerCellHTML = `
                        <div style="text-align: center;">
                            <button type="button" class="btn btn-primary btn-sm view-passengers-btn" data-booking-id="${b.id}" style="padding: 4px 8px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-users"></i> ดูรายชื่อ (${estimatedCount} คน)
                            </button>
                        </div>
                    `;
                } else {
                    passengerCellHTML = `
                        <pre style="font-family: inherit; font-size: 12px; margin:0; white-space: pre-wrap; background: rgba(0,0,0,0.01); padding: 5px; border-radius: 4px;">${b.passenger_details || '-'}</pre>
                    `;
                }

                tr.innerHTML = `
                    <td style="font-weight: 700;">${b.booking_reference}</td>
                    <td>${startFormatted} น.</td>
                    <td>${endFormatted} น.</td>
                    <td>${vehicleInfo}</td>
                    <td>
                        <strong>${b.requester_name}</strong><br>
                        <small style="color:var(--text-muted);">${item.deptName}</small>
                    </td>
                    <td><strong>${b.destination}</strong></td>
                    <td style="font-size: 13px;">${b.objective}</td>
                    <td>
                        ${passengerCellHTML}
                    </td>
                    <td>${statusBadges[b.status] || b.status}</td>
                `;
                tableBody.appendChild(tr);
            });

            // Bind click events for passenger view buttons
            tableBody.querySelectorAll('.view-passengers-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const bookingId = parseInt(btn.getAttribute('data-booking-id'));
                    openPassengerModal(bookingId);
                });
            });
        }
    }

    function exportDriverScheduleCSV(assignmentsFiltered) {
        if (assignmentsFiltered.length === 0) {
            alert('ไม่มีข้อมูลสำหรับส่งออก CSV');
            return;
        }

        // CSV headers
        let csvContent = '\uFEFF'; // Add UTF-8 BOM for Excel
        csvContent += '"รหัสใบขอ","วันเวลาออกเดินทาง","วันเวลาเดินทางกลับ","รถยนต์ที่ใช้/ทะเบียน","ผู้ขอใช้รถ","สังกัด","สถานที่ปลายทาง","วัตถุประสงค์","รายชื่อผู้เดินทาง","สถานะ"\r\n';

        assignmentsFiltered.forEach(item => {
            const row = [
                item.booking.booking_reference,
                new Date(item.booking.start_date_time).toLocaleString('th-TH'),
                new Date(item.booking.end_date_time).toLocaleString('th-TH'),
                `${item.vehicle ? (item.vehicle.type === 'new_van' ? 'รถตู้ใหม่' : item.vehicle.type === 'old_van' ? 'รถตู้เก่า' : item.vehicle.type === 'six_wheeler_truck' ? 'รถหกล้อ' : 'อื่นๆ') : 'ไม่ระบุ'}-${item.vehicle ? item.vehicle.license_plate : 'ไม่ระบุ'}`,
                item.booking.requester_name,
                item.deptName,
                item.booking.destination,
                item.booking.objective,
                (item.booking.passenger_details || '').replace(/\n/g, ' '),
                item.booking.status === 'approved' ? 'อนุมัติแล้ว' : item.booking.status === 'completed' ? 'เสร็จสิ้น' : item.booking.status
            ];
            
            const rowString = row.map(val => `"${val.replace(/"/g, '""')}"`).join(',');
            csvContent += rowString + '\r\n';
        });

        // Trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `driver_schedule_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportDriverSchedulePDF(driverNameLabel) {
        const element = document.getElementById('driver-schedule-table-container');
        if (!element) return;

        // Clone element to apply print-specific styling without ruining UI
        const printArea = element.cloneNode(true);
        
        // Add a nice header
        const headerDiv = document.createElement('div');
        headerDiv.style.fontFamily = 'Sarabun, sans-serif';
        headerDiv.style.padding = '10px';
        headerDiv.style.marginBottom = '20px';
        headerDiv.style.textAlign = 'center';
        headerDiv.innerHTML = `
            <h2 style="margin: 0; color: #15803d; font-size: 20px;">ตารางงานและเส้นทางปฏิบัติราชการพนักงานขับรถ</h2>
            <h3 style="margin: 5px 0 0 0; font-size: 16px;">โรงเรียนมัธยมวชิราลงกรณวราราม (VK School)</h3>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold;">${driverNameLabel}</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">ข้อมูล ณ วันที่: ${new Date().toLocaleString('th-TH')}</p>
        `;
        
        // Wrap the table inside a container with some margins
        const container = document.createElement('div');
        container.appendChild(headerDiv);
        container.appendChild(printArea);
        
        // Set standard options
        const opt = {
            margin:       10,
            filename:     `driver_schedule_${new Date().toISOString().slice(0,10)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        // Run html2pdf
        html2pdf().from(container).set(opt).save();
    }

    // Bind export button events
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            exportDriverScheduleCSV(currentDisplayedScheduleData);
        });
    }

    const btnExportPDF = document.getElementById('btn-export-pdf');
    if (btnExportPDF) {
        btnExportPDF.addEventListener('click', () => {
            const label = document.getElementById('driver-name-header-label').textContent;
            exportDriverSchedulePDF(label);
        });
    }

    // --- Passenger Modal Setup ---
    function openPassengerModal(bookingId) {
        const booking = db.getBookings().find(b => parseInt(b.id) === parseInt(bookingId));
        if (!booking) return;

        const pmBookingRef = document.getElementById('pm-booking-ref');
        const pmRequester = document.getElementById('pm-requester');
        const pmStartTime = document.getElementById('pm-start-time');
        const pmEndTime = document.getElementById('pm-end-time');
        const pmVehicle = document.getElementById('pm-vehicle');
        const pmDestination = document.getElementById('pm-destination');
        const pmObjective = document.getElementById('pm-objective');
        const modalTableBody = document.getElementById('passenger-list-table-body');
        const btnDownload = document.getElementById('btn-download-passengers-pdf');
        const pm = document.getElementById('passenger-modal');

        // Check if modal element exists in the DOM first (safeguard against browser cache)
        if (!pm) {
            console.error('passenger-modal element not found in DOM.');
            alert('บราวเซอร์ของคุณกำลังใช้งานหน้าเว็บเวอร์ชันเก่า (แคชเก่า) กรุณากดปุ่ม Refresh หรือ Ctrl + F5 เพื่อโหลดหน้าเว็บเวอร์ชันล่าสุด');
            return;
        }

        const depts = db.getDepartments();
        const drivers = db.getDrivers();
        const vehicles = db.getVehicles();
        const assignments = db.getAssignments();

        const dept = depts.find(d => parseInt(d.id) === parseInt(booking.department_id));
        const deptName = dept ? dept.name : 'ทั่วไป';
        
        const assignment = assignments.find(a => parseInt(a.booking_id) === parseInt(booking.id));
        const vehicle = assignment ? vehicles.find(v => parseInt(v.id) === parseInt(assignment.vehicle_id)) : null;
        const driver = assignment ? drivers.find(d => parseInt(d.id) === parseInt(assignment.driver_id)) : null;
        
        const vehicleInfo = vehicle ? `${vehicle.brand} ${vehicle.model} (ทะเบียน: ${vehicle.license_plate})` : 'ยังไม่ได้จัดสรร';
        const start = new Date(booking.start_date_time).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
        const end = new Date(booking.end_date_time).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });

        // Set text content safely
        if (pmBookingRef) pmBookingRef.textContent = booking.booking_reference;
        if (pmRequester) pmRequester.textContent = `${booking.requester_name} (${deptName})`;
        if (pmStartTime) pmStartTime.textContent = `${start} น.`;
        if (pmEndTime) pmEndTime.textContent = `${end} น.`;
        if (pmVehicle) pmVehicle.textContent = vehicleInfo;
        if (pmDestination) pmDestination.textContent = booking.destination;
        if (pmObjective) pmObjective.textContent = booking.objective;

        // Parse passenger list
        if (modalTableBody) {
            modalTableBody.innerHTML = '';
            const rawPassengers = booking.passenger_details || '';
            const passengers = rawPassengers.split(/[\n,;/]|\s*และ\s*|\s*\d+[\.\)]\s*/)
                .map(line => line.trim())
                .filter(line => line.length > 0 && !line.includes('รวมนักเรียน') && !line.includes('ครูผู้ควบคุม'))
                .map(line => {
                    return line.replace(/^\d+[\.\)\s-]*|^[-\*\u2022]\s*/, '').trim();
                })
                .filter(name => name.length > 0);

            if (passengers.length === 0) {
                modalTableBody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">ไม่มีข้อมูลรายชื่อผู้เดินทาง</td></tr>';
            } else {
                passengers.forEach((p, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                        <td>${p}</td>
                    `;
                    modalTableBody.appendChild(tr);
                });
            }
        }

        // Set dataset on download PDF button safely
        if (btnDownload) {
            btnDownload.setAttribute('data-booking-id', booking.id);
        }

        // Open modal
        pm.classList.add('active');
    }

    // Bind passenger modal close events
    const closePmBtn = document.getElementById('close-passenger-modal');
    if (closePmBtn) {
        closePmBtn.addEventListener('click', () => {
            document.getElementById('passenger-modal').classList.remove('active');
        });
    }

    const btnClosePm = document.getElementById('btn-close-pm');
    if (btnClosePm) {
        btnClosePm.addEventListener('click', () => {
            document.getElementById('passenger-modal').classList.remove('active');
        });
    }

    // Bind download passenger list PDF button click
    const btnDownloadPassengersPdf = document.getElementById('btn-download-passengers-pdf');
    if (btnDownloadPassengersPdf) {
        btnDownloadPassengersPdf.addEventListener('click', () => {
            const bookingId = parseInt(btnDownloadPassengersPdf.getAttribute('data-booking-id'));
            if (window.pdfGenerator && typeof window.pdfGenerator.generatePassengerListPDF === 'function') {
                window.pdfGenerator.generatePassengerListPDF(bookingId);
            } else {
                alert('ไม่พบฟังก์ชันสำหรับสร้าง PDF');
            }
        });
    }

});

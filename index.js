        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
                        surface: '#ffffff',
                    }
                }
            }
        }
    </script>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useContext, createContext, useMemo, useRef, useCallback } = React;

        const DEPARTMENTS = [
            { id: 'd1', name: 'Roads', description: 'Road maintenance and repair' },
            { id: 'd2', name: 'Sanitation', description: 'Waste management and street cleaning' },
            { id: 'd3', name: 'Water Supply', description: 'Water pipelines and drainage' },
            { id: 'd4', name: 'Electricity', description: 'Streetlights and power issues' },
            { id: 'd5', name: 'Public Safety', description: 'Hazards and safety concerns' },
            { id: 'd6', name: 'Parks', description: 'Public parks and greenery' }
        ];

        const CATEGORIES = [
            'Pothole', 'Garbage', 'Broken Streetlight', 'Water Leakage', 
            'Damaged Road', 'Drainage', 'Illegal Dumping', 'Traffic Signal', 
            'Public Safety', 'Other'
        ];

        const STATUSES = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
        const PRIORITIES = ['P3', 'P2', 'P1', 'P0']; // P0 is critical

        const INITIAL_USERS = [
            { id: 'u1', full_name: 'Jane Citizen', email: 'citizen@demo.com', role: 'CITIZEN' },
            { id: 'u2', full_name: 'Admin User', email: 'admin@demo.com', role: 'ADMIN' },
            { id: 'u3', full_name: 'Officer Bob', email: 'officer@demo.com', role: 'OFFICER', department_id: 'd1' }
        ];

        const INITIAL_ISSUES = [
            {
                id: 'ISS-001', user_id: 'u1', title: 'Deep pothole on Main St', description: 'Large pothole causing traffic issues and vehicle damage.', category: 'Pothole', severity: 'HIGH', priority: 'P1', status: 'In Progress', latitude: 18.5204, longitude: 73.8567, address: 'Main Street, Downtown', image_url: 'https://placehold.co/600x400/e2e8f0/475569?text=Pothole+Image', assigned_department_id: 'd1', assigned_officer_id: 'u3', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), updates: [ { id: 'up1', status: 'Reported', message: 'Issue reported by citizen.', created_at: new Date(Date.now() - 86400000 * 2).toISOString() }, { id: 'up2', status: 'Assigned', message: 'Assigned to Roads department.', created_at: new Date(Date.now() - 86400000 * 1.5).toISOString() }, { id: 'up3', status: 'In Progress', message: 'Crew dispatched to location.', created_at: new Date(Date.now() - 86400000 * 0.5).toISOString() } ]
            },
            {
                id: 'ISS-002', user_id: 'u1', title: 'Streetlight out near Park', description: 'Streetlight has been out for 3 days making the area unsafe at night.', category: 'Broken Streetlight', severity: 'MEDIUM', priority: 'P2', status: 'Reported', latitude: 18.5254, longitude: 73.8617, address: 'Central Park West', image_url: 'https://placehold.co/600x400/e2e8f0/475569?text=Streetlight+Image', assigned_department_id: null, assigned_officer_id: null, created_at: new Date(Date.now() - 86400000).toISOString(), updates: [{ id: 'up4', status: 'Reported', message: 'Issue reported.', created_at: new Date(Date.now() - 86400000).toISOString() }]
            },
             {
                id: 'ISS-003', user_id: 'u4', title: 'Major Water Pipe Burst', description: 'Water gushing out onto the road, causing flooding.', category: 'Water Leakage', severity: 'CRITICAL', priority: 'P0', status: 'Resolved', latitude: 18.5104, longitude: 73.8467, address: 'Station Road', image_url: 'https://placehold.co/600x400/e2e8f0/475569?text=Water+Leak', assigned_department_id: 'd3', assigned_officer_id: null, created_at: new Date(Date.now() - 86400000 * 5).toISOString(), updates: [{ id: 'up5', status: 'Resolved', message: 'Pipe repaired and supply restored.', created_at: new Date(Date.now() - 86400000 * 4).toISOString() }]
            }
        ];

        const AuthContext = createContext(null);
        const DataContext = createContext(null);

        const AuthProvider = ({ children }) => {
            const [user, setUser] = useState(null);
            
            // Simple mock login
            const login = (email) => {
                const found = INITIAL_USERS.find(u => u.email === email);
                if (found) {
                    setUser(found);
                    // Route based on role
                    if (found.role === 'ADMIN') window.location.hash = '#/admin';
                    else if (found.role === 'OFFICER') window.location.hash = '#/officer';
                    else window.location.hash = '#/dashboard';
                    return true;
                }
                return false;
            };

            const logout = () => {
                setUser(null);
                window.location.hash = '#/login';
            };

            return (
                <AuthContext.Provider value={{ user, login, logout }}>
                    {children}
                </AuthContext.Provider>
            );
        };

        const DataProvider = ({ children }) => {
            const [issues, setIssues] = useState(INITIAL_ISSUES);
            const [notifications, setNotifications] = useState([]);

            const addIssue = (newIssue) => {
                const issue = {
                    ...newIssue,
                    id: `ISS-${Math.floor(Math.random() * 10000)}`,
                    created_at: new Date().toISOString(),
                    status: 'Reported',
                    updates: [{
                        id: `up-${Date.now()}`,
                        status: 'Reported',
                        message: 'Issue reported by citizen.',
                        created_at: new Date().toISOString()
                    }]
                };
                setIssues([issue, ...issues]);
                addNotification(issue.user_id, 'Report Received', `Your report "${issue.title}" has been received.`);
                return issue;
            };

            const updateIssueStatus = (issueId, newStatus, message, resolutionProof = null) => {
                setIssues(prev => prev.map(iss => {
                    if (iss.id === issueId) {
                        const newUpdate = {
                            id: `up-${Date.now()}`,
                            status: newStatus,
                            message: message || `Status updated to ${newStatus}`,
                            created_at: new Date().toISOString(),
                            proof_image_url: resolutionProof
                        };
                        
                        // Notify user
                        addNotification(iss.user_id, 'Status Update', `Your report "${iss.title}" is now ${newStatus}.`);

                        return {
                            ...iss,
                            status: newStatus,
                            updates: [...iss.updates, newUpdate],
                            resolved_at: newStatus === 'Resolved' ? new Date().toISOString() : iss.resolved_at
                        };
                    }
                    return iss;
                }));
            };

            const assignIssue = (issueId, deptId, officerId = null) => {
                 setIssues(prev => prev.map(iss => {
                    if (iss.id === issueId) {
                        const deptName = DEPARTMENTS.find(d => d.id === deptId)?.name;
                        const newUpdate = {
                            id: `up-${Date.now()}`,
                            status: 'Assigned',
                            message: `Assigned to ${deptName} department.`,
                            created_at: new Date().toISOString()
                        };
                        addNotification(iss.user_id, 'Issue Assigned', `Your report "${iss.title}" has been assigned to ${deptName}.`);
                        return {
                            ...iss,
                            assigned_department_id: deptId,
                            assigned_officer_id: officerId,
                            status: iss.status === 'Reported' ? 'Assigned' : iss.status,
                            updates: [...iss.updates, newUpdate]
                        };
                    }
                    return iss;
                 }));
            };

            const addNotification = (userId, title, message) => {
                setNotifications(prev => [{
                    id: `notif-${Date.now()}`,
                    userId, title, message, read: false, created_at: new Date().toISOString()
                }, ...prev]);
            };

            const markNotificationsRead = (userId) => {
                setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
            };

            return (
                <DataContext.Provider value={{ issues, departments: DEPARTMENTS, addIssue, updateIssueStatus, assignIssue, notifications, markNotificationsRead }}>
                    {children}
                </DataContext.Provider>
            );
        };

        const Button = ({ children, variant = 'primary', size = 'md', className = '', isLoading, ...props }) => {
            const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
            const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
            const variants = {
                primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
                secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500 shadow-sm",
                ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
                danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm"
            };
            
            return (
                <button className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
                    {isLoading && <i className="ph ph-spinner animate-spin mr-2"></i>}
                    {children}
                </button>
            );
        };

        const Card = ({ children, className = '' }) => (
            <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
                {children}
            </div>
        );

        const Input = ({ label, error, ...props }) => (
            <div className="space-y-1 w-full">
                {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
                <input className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-slate-300'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow`} {...props} />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );

        const Select = ({ label, options, error, ...props }) => (
            <div className="space-y-1 w-full">
                {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
                <select className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-slate-300'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`} {...props}>
                    {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
                </select>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );

        const Textarea = ({ label, error, ...props }) => (
            <div className="space-y-1 w-full">
                {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
                <textarea className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-slate-300'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]`} {...props}></textarea>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );

        const StatusBadge = ({ status }) => {
            const colors = {
                'Reported': 'bg-slate-100 text-slate-700',
                'Verified': 'bg-blue-100 text-blue-700',
                'Assigned': 'bg-indigo-100 text-indigo-700',
                'In Progress': 'bg-amber-100 text-amber-700',
                'Resolved': 'bg-emerald-100 text-emerald-700',
                'Rejected': 'bg-red-100 text-red-700',
            };
            return (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-100'}`}>
                    {status}
                </span>
            );
        };

        const PriorityBadge = ({ priority }) => {
            const colors = {
                'P0': 'bg-red-100 text-red-800 border border-red-200', // Critical
                'P1': 'bg-orange-100 text-orange-800 border border-orange-200', // High
                'P2': 'bg-yellow-100 text-yellow-800 border border-yellow-200', // Medium
                'P3': 'bg-green-100 text-green-800 border border-green-200', // Low
            };
            return (
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors[priority] || 'bg-slate-100'}`}>
                    {priority}
                </span>
            );
        };

        const Modal = ({ isOpen, onClose, title, children }) => {
            if (!isOpen) return null;
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-semibold text-lg">{title}</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="ph ph-x text-xl"></i></button>
                        </div>
                        <div className="p-4 max-h-[80vh] overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </div>
            );
        };

        // Simple Toast implementation
        const ToastManager = {
            listeners: [],
            add: (msg, type = 'success') => ToastManager.listeners.forEach(l => l(msg, type)),
            subscribe: (l) => ToastManager.listeners.push(l)
        };

        const ToastContainer = () => {
            const [toasts, setToasts] = useState([]);
            useEffect(() => {
                ToastManager.subscribe((msg, type) => {
                    const id = Date.now();
                    setToasts(prev => [...prev, { id, msg, type }]);
                    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
                });
            }, []);

            return (
                <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                    {toasts.map(t => (
                        <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 ${t.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
                            <i className={`ph ${t.type === 'success' ? 'ph-check-circle text-emerald-500' : 'ph-warning-circle text-red-500'} text-lg`}></i>
                            {t.msg}
                        </div>
                    ))}
                </div>
            );
        };

        const analyzeIssueWithAI = async (title, description, category) => {
            // MVP Fallback Logic (Deterministic AI mockup)
            return new Promise(resolve => {
                setTimeout(() => {
                    let severity = 'LOW';
                    let priority = 'P3';
                    let dept = 'd6'; // Other
                    let confidence = 75 + Math.floor(Math.random() * 20);

                    const text = `${title} ${description}`.toLowerCase();
                    
                    if (text.includes('water') || text.includes('pipe') || text.includes('leak')) {
                        severity = text.includes('major') || text.includes('burst') ? 'CRITICAL' : 'MEDIUM';
                        priority = severity === 'CRITICAL' ? 'P0' : 'P2';
                        dept = 'd3'; // Water
                    } else if (text.includes('pothole') || text.includes('road')) {
                        severity = text.includes('deep') || text.includes('major') ? 'HIGH' : 'MEDIUM';
                        priority = severity === 'HIGH' ? 'P1' : 'P2';
                        dept = 'd1'; // Roads
                    } else if (text.includes('light') || text.includes('electric') || text.includes('power')) {
                        severity = 'MEDIUM'; priority = 'P2'; dept = 'd4';
                    } else if (text.includes('garbage') || text.includes('trash') || text.includes('dump')) {
                        severity = 'LOW'; priority = 'P3'; dept = 'd2';
                    } else if (text.includes('accident') || text.includes('hazard') || text.includes('safe')) {
                        severity = 'HIGH'; priority = 'P1'; dept = 'd5';
                    }

                    resolve({
                        detected_category: category,
                        severity,
                        priority,
                        confidence,
                        recommended_department: dept,
                        suggested_action: `Dispatch inspection team to assess ${category.toLowerCase()} report.`
                    });
                }, 1500); // Simulate network delay
            });
        };

        const Navbar = () => {
            const { user, logout } = useContext(AuthContext);
            const { notifications, markNotificationsRead } = useContext(DataContext);
            const [showNotifs, setShowNotifs] = useState(false);

            const userNotifs = user ? notifications.filter(n => n.userId === user.id) : [];
            const unreadCount = userNotifs.filter(n => !n.read).length;

            return (
                <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = user ? (user.role==='ADMIN'?'#/admin':'#/dashboard') : '#/'}>
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                                <span className="font-bold text-xl tracking-tight text-slate-900">CivicFix <span className="text-blue-600">AI</span></span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <>
                                        <a href="#/issues" className="text-slate-600 hover:text-blue-600 font-medium text-sm hidden sm:block">Public Map</a>
                                        
                                        <div className="relative">
                                            <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                                                <i className="ph ph-bell text-xl"></i>
                                                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                                            </button>
                                            
                                            {showNotifs && (
                                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                                                    <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                                        <h4 className="font-semibold text-sm">Notifications</h4>
                                                        {unreadCount > 0 && <button onClick={() => markNotificationsRead(user.id)} className="text-xs text-blue-600 hover:underline">Mark all read</button>}
                                                    </div>
                                                    <div className="max-h-80 overflow-y-auto">
                                                        {userNotifs.length === 0 ? (
                                                            <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                                                        ) : (
                                                            userNotifs.map(n => (
                                                                <div key={n.id} className={`p-3 border-b border-slate-50 text-sm ${n.read ? 'opacity-60' : 'bg-blue-50/30'}`}>
                                                                    <div className="font-medium text-slate-900">{n.title}</div>
                                                                    <div className="text-slate-600 mt-1">{n.message}</div>
                                                                    <div className="text-xs text-slate-400 mt-2">{new Date(n.created_at).toLocaleDateString()}</div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                                            <div className="hidden sm:block text-right">
                                                <div className="text-sm font-semibold">{user.full_name}</div>
                                                <div className="text-xs text-slate-500">{user.role}</div>
                                            </div>
                                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                                {user.full_name.charAt(0)}
                                            </div>
                                            <button onClick={logout} className="text-slate-400 hover:text-red-500 ml-2" title="Logout">
                                                <i className="ph ph-sign-out text-xl"></i>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <a href="#/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm">Log in</a>
                                        <Button onClick={() => window.location.hash = '#/login'}>Sign Up</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            );
        };

        const MainLayout = ({ children }) => (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
                <ToastContainer />
            </div>
        );

        const HomePage = () => (
            <MainLayout>
                <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        AI-Powered Civic Maintenance
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 max-w-3xl">
                        Fixing our city, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">one report at a time.</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl">
                        CivicFix AI uses artificial intelligence to instantly categorize, prioritize, and route your civic issue reports to the right department, ensuring faster resolution.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" onClick={() => window.location.hash = '#/report'} className="gap-2">
                            Report an Issue <i className="ph ph-arrow-right"></i>
                        </Button>
                        <Button size="lg" variant="secondary" onClick={() => window.location.hash = '#/issues'}>
                            View Public Map
                        </Button>
                    </div>

                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-5xl">
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl mb-4">
                                <i className="ph ph-camera"></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Snap & Report</h3>
                            <p className="text-slate-600">Take a photo of the pothole, leak, or issue. Our system automatically captures location data.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-2xl mb-4">
                                <i className="ph ph-brain"></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                            <p className="text-slate-600">Gemini AI analyzes your report to determine severity, priority, and assigns it to the exact right team.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl mb-4">
                                <i className="ph ph-check-circle"></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Fast Resolution</h3>
                            <p className="text-slate-600">Track progress in real-time. Receive notifications when officers update status or resolve the issue.</p>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );

        const LoginPage = () => {
            const { login } = useContext(AuthContext);
            const handleDemoLogin = (email) => {
                login(email);
                ToastManager.add(`Logged in as ${email}`);
            };

            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                    <Card className="w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">C</div>
                            <h2 className="text-2xl font-bold text-slate-900">Welcome to CivicFix</h2>
                            <p className="text-slate-500 mt-2">Sign in to report or manage issues</p>
                        </div>
                        
                        <div className="space-y-4">
                            <Input label="Email" type="email" placeholder="you@example.com" defaultValue="citizen@demo.com" />
                            <Input label="Password" type="password" placeholder="••••••••" defaultValue="password" />
                            <Button className="w-full" onClick={() => handleDemoLogin('citizen@demo.com')}>Sign In</Button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-xs text-slate-500 font-medium mb-3 text-center uppercase tracking-wider">Demo Accounts (Click to login)</p>
                            <div className="grid grid-cols-1 gap-2">
                                <Button variant="secondary" size="sm" onClick={() => handleDemoLogin('citizen@demo.com')}>Login as Citizen</Button>
                                <Button variant="secondary" size="sm" onClick={() => handleDemoLogin('admin@demo.com')}>Login as Admin</Button>
                                <Button variant="secondary" size="sm" onClick={() => handleDemoLogin('officer@demo.com')}>Login as Officer (Roads)</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            );
        };

        const IssueMap = ({ issues, center = [18.5204, 73.8567], zoom = 13, height = "400px", readOnly = false, onLocationSelect }) => {
            const mapRef = useRef(null);
            const mapInstanceRef = useRef(null);
            const markersRef = useRef([]);

            useEffect(() => {
                if (!mapRef.current) return;
                
                if (!mapInstanceRef.current) {
                    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
                    
                    if (!readOnly && onLocationSelect) {
                        mapInstanceRef.current.on('click', (e) => {
                            onLocationSelect(e.latlng.lat, e.latlng.lng);
                        });
                    }
                }

                // Clear old markers
                markersRef.current.forEach(m => m.remove());
                markersRef.current = [];

                // Add new markers
                issues.forEach(issue => {
                    if (issue.latitude && issue.longitude) {
                        const color = issue.priority === 'P0' ? 'red' : issue.priority === 'P1' ? 'orange' : issue.priority === 'P2' ? 'blue' : 'green';
                        const markerHtml = `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-${color}-500"></div>`;
                        const icon = L.divIcon({ html: markerHtml, className: 'custom-div-icon', iconSize: [16, 16] });
                        
                        const marker = L.marker([issue.latitude, issue.longitude], { icon }).addTo(mapInstanceRef.current);
                        
                        if (readOnly) {
                            marker.bindPopup(`
                                <div class="p-2 min-w-[200px]">
                                    <div class="font-bold text-sm mb-1">${issue.title}</div>
                                    <div class="text-xs text-slate-500 mb-2">${issue.category} • ${issue.status}</div>
                                    <a href="#/issues/${issue.id}" class="text-xs text-blue-600 font-medium hover:underline">View Details →</a>
                                </div>
                            `);
                        }
                        markersRef.current.push(marker);
                    }
                });

                return () => {
                   // Cleanup handled via map instance ref check
                };
            }, [issues, center, zoom, readOnly]);

            return <div ref={mapRef} className="rounded-xl overflow-hidden border border-slate-200 shadow-inner" style={{ height, width: '100%', zIndex: 1 }} />;
        };

        const CitizenDashboard = () => {
            const { user } = useContext(AuthContext);
            const { issues } = useContext(DataContext);
            
            const myIssues = issues.filter(i => i.user_id === user.id);
            const activeCount = myIssues.filter(i => !['Resolved', 'Rejected'].includes(i.status)).length;
            const resolvedCount = myIssues.filter(i => i.status === 'Resolved').length;

            return (
                <MainLayout>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.full_name.split(' ')[0]}</h1>
                            <p className="text-slate-500">Track your reports and help improve your city.</p>
                        </div>
                        <Button onClick={() => window.location.hash = '#/report'} className="gap-2 shadow-md">
                            <i className="ph ph-plus-circle text-lg"></i> Report New Issue
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><i className="ph ph-file-text text-2xl"></i></div>
                            <div><p className="text-sm text-slate-500 font-medium">Total Reports</p><p className="text-2xl font-bold">{myIssues.length}</p></div>
                        </Card>
                        <Card className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><i className="ph ph-clock text-2xl"></i></div>
                            <div><p className="text-sm text-slate-500 font-medium">In Progress</p><p className="text-2xl font-bold">{activeCount}</p></div>
                        </Card>
                        <Card className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><i className="ph ph-check-circle text-2xl"></i></div>
                            <div><p className="text-sm text-slate-500 font-medium">Resolved</p><p className="text-2xl font-bold">{resolvedCount}</p></div>
                        </Card>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-4">Your Recent Reports</h2>
                    {myIssues.length === 0 ? (
                        <Card className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4"><i className="ph ph-files text-3xl"></i></div>
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No reports yet</h3>
                            <p className="text-slate-500 mb-6">You haven't reported any issues. Help keep the city clean and safe!</p>
                            <Button onClick={() => window.location.hash = '#/report'}>Report an Issue</Button>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {myIssues.map(issue => (
                                <Card key={issue.id} className="p-4 hover:border-blue-300 transition-colors cursor-pointer flex flex-col sm:flex-row gap-4 items-start sm:items-center" onClick={() => window.location.hash = `#/issues/${issue.id}`}>
                                    <img src={issue.image_url} alt="thumbnail" className="w-full sm:w-24 h-24 object-cover rounded-lg bg-slate-100" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-slate-900">{issue.title}</h3>
                                            <StatusBadge status={issue.status} />
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-1 mb-2">{issue.description}</p>
                                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 items-center">
                                            <span className="flex items-center gap-1"><i className="ph ph-map-pin"></i> {issue.address || 'Location provided'}</span>
                                            <span>•</span>
                                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </MainLayout>
            );
        };

        const ReportIssueForm = () => {
            const { user } = useContext(AuthContext);
            const { addIssue, departments } = useContext(DataContext);
            const [step, setStep] = useState(1);
            const [isAnalyzing, setIsAnalyzing] = useState(false);
            const [formData, setFormData] = useState({
                title: '', description: '', category: CATEGORIES[0], 
                latitude: 18.5204, longitude: 73.8567, address: '', image_url: 'https://placehold.co/800x600/e2e8f0/475569?text=Uploaded+Evidence'
            });
            const [analysis, setAnalysis] = useState(null);

            const handleNext = () => setStep(s => s + 1);
            const handleBack = () => setStep(s => s - 1);

            const handleAnalyze = async () => {
                setIsAnalyzing(true);
                const result = await analyzeIssueWithAI(formData.title, formData.description, formData.category);
                setAnalysis(result);
                setIsAnalyzing(false);
                handleNext();
            };

            const handleSubmit = () => {
                const newIssue = {
                    ...formData,
                    user_id: user.id,
                    severity: analysis.severity,
                    priority: analysis.priority,
                    ai_analysis: analysis,
                    assigned_department_id: null // Will be assigned by AI or Admin later, for demo let's say it stays reported until admin reviews
                };
                const created = addIssue(newIssue);
                ToastManager.add('Issue reported successfully!');
                window.location.hash = `#/issues/${created.id}`;
            };

            return (
                <MainLayout>
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">Report an Issue</h1>
                            <div className="flex gap-2 mt-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                                ))}
                            </div>
                        </div>

                        <Card className="p-6 sm:p-8 shadow-md">
                            {step === 1 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                                    <h2 className="text-lg font-semibold">1. Issue Details</h2>
                                    <Select label="Category" options={CATEGORIES} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                                    <Input label="Title (Brief summary)" placeholder="e.g. Deep pothole on Main St" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    <Textarea label="Description" placeholder="Provide more details to help officials locate and fix the issue..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                    <div className="pt-4 flex justify-end">
                                        <Button onClick={handleNext} disabled={!formData.title}>Next Step <i className="ph ph-arrow-right ml-2"></i></Button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                                    <h2 className="text-lg font-semibold">2. Evidence & Location</h2>
                                    <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({...formData, image_url: reader.result});
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3 shadow-sm"><i className="ph ph-upload-simple text-xl"></i></div>
                                        <p className="text-sm font-medium text-slate-700">Click to upload photo or PDF</p>
                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                                        <img src={formData.image_url} alt="Preview" className="mt-4 rounded-lg mx-auto max-h-40 object-cover border border-slate-200" />
                                    </label>
                                    
                                    <div className="pt-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Pin Location on Map</label>
                                        <IssueMap 
                                            issues={[{latitude: formData.latitude, longitude: formData.longitude, priority: 'P2'}]} 
                                            height="250px" 
                                            onLocationSelect={(lat, lng) => setFormData({...formData, latitude: lat, longitude: lng})}
                                        />
                                        <Input label="Approximate Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="e.g. Near Central Station" className="mt-4" />
                                    </div>

                                    <div className="pt-4 flex justify-between">
                                        <Button variant="ghost" onClick={handleBack}>Back</Button>
                                        <Button onClick={handleAnalyze} isLoading={isAnalyzing}>Analyze with AI <i className="ph ph-magic-wand ml-2"></i></Button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && analysis && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                                    <h2 className="text-lg font-semibold">3. AI Analysis Results</h2>
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                                        <div className="flex items-start gap-3 mb-4">
                                            <i className="ph ph-sparkle text-blue-600 text-xl mt-0.5"></i>
                                            <div>
                                                <h3 className="font-semibold text-blue-900">Gemini AI Analysis Complete</h3>
                                                <p className="text-sm text-blue-700 mt-1">The system has evaluated your report to expedite routing.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-blue-50">
                                            <div>
                                                <span className="text-xs text-slate-500 block">Severity</span>
                                                <span className="font-semibold text-slate-900">{analysis.severity}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500 block">Priority Route</span>
                                                <PriorityBadge priority={analysis.priority} />
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-xs text-slate-500 block">Recommended Action</span>
                                                <span className="text-sm font-medium text-slate-800">{analysis.suggested_action}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-between">
                                        <Button variant="ghost" onClick={handleBack}>Back</Button>
                                        <Button onClick={handleSubmit} variant="primary">Submit Report <i className="ph ph-check ml-2"></i></Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </MainLayout>
            );
        };

        const IssueDetail = ({ id }) => {
            const { issues, departments } = useContext(DataContext);
            const { user } = useContext(AuthContext);
            const issue = issues.find(i => i.id === id);

            if (!issue) return <MainLayout><div className="text-center py-20 text-slate-500">Issue not found.</div></MainLayout>;

            const assignedDept = departments.find(d => d.id === issue.assigned_department_id);

            return (
                <MainLayout>
                    <div className="mb-6 flex items-center justify-between">
                        <button onClick={() => window.history.back()} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
                            <i className="ph ph-arrow-left"></i> Back
                        </button>
                        <div className="flex gap-2">
                            <PriorityBadge priority={issue.priority} />
                            <StatusBadge status={issue.status} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="overflow-hidden">
                                <img src={issue.image_url} alt="Issue evidence" className="w-full h-64 object-cover" />
                                <div className="p-6 sm:p-8">
                                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{issue.title}</h1>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6 border-b border-slate-100 pb-6">
                                        <span className="flex items-center gap-1"><i className="ph ph-tag"></i> {issue.category}</span>
                                        <span className="flex items-center gap-1"><i className="ph ph-calendar"></i> {new Date(issue.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><i className="ph ph-map-pin"></i> {issue.address}</span>
                                    </div>
                                    
                                    <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                                    <p className="text-slate-700 whitespace-pre-wrap">{issue.description}</p>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="font-semibold text-slate-900 mb-6">Timeline & Updates</h3>
                                <div className="space-y-6">
                                    {issue.updates.map((update, idx) => (
                                        <div key={update.id} className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 last:border-0 pb-2">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-sm text-slate-900">{update.status}</span>
                                                <span className="text-xs text-slate-400">{new Date(update.created_at).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-600">{update.message}</p>
                                            {update.proof_image_url && (
                                                <img src={update.proof_image_url} alt="Proof" className="mt-3 rounded-lg max-w-xs border border-slate-200" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="p-1">
                                <IssueMap issues={[issue]} center={[issue.latitude, issue.longitude]} zoom={15} height="250px" readOnly />
                            </Card>

                            <Card className="p-6 bg-slate-50 border-none shadow-inner">
                                <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Metadata</h3>
                                <div className="space-y-4 text-sm">
                                    <div><span className="text-slate-500 block">Report ID</span><span className="font-medium font-mono">{issue.id}</span></div>
                                    <div><span className="text-slate-500 block">Department</span><span className="font-medium">{assignedDept ? assignedDept.name : 'Unassigned'}</span></div>
                                    <div><span className="text-slate-500 block">AI Severity Assessment</span><span className="font-medium">{issue.severity || 'N/A'}</span></div>
                                </div>
                            </Card>

                            {/* Show Admin/Officer controls based on role */}
                            {user && user.role === 'ADMIN' && <AdminIssueControls issue={issue} departments={departments} />}
                            {user && user.role === 'OFFICER' && <OfficerIssueControls issue={issue} />}
                        </div>
                    </div>
                </MainLayout>
            );
        };

        const AdminDashboard = () => {
             const { issues } = useContext(DataContext);
             
             // Setup chart only once
             useEffect(() => {
                 const ctx = document.getElementById('statusChart');
                 if(!ctx) return;
                 const statusCounts = STATUSES.map(s => issues.filter(i => i.status === s).length);
                 
                 const chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: STATUSES,
                        datasets: [{
                            data: statusCounts,
                            backgroundColor: ['#f1f5f9', '#dbeafe', '#e0e7ff', '#fef3c7', '#d1fae5', '#fee2e2'],
                            borderWidth: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } } }
                });
                return () => chart.destroy();
             }, [issues]);

             return (
                 <MainLayout>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">City Operations Center</h1>
                            <p className="text-slate-500">Overview of all civic issues and resolution metrics.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="p-5"><p className="text-sm text-slate-500">Total Issues</p><p className="text-3xl font-bold mt-1">{issues.length}</p></Card>
                        <Card className="p-5 border-l-4 border-l-red-500"><p className="text-sm text-slate-500">Critical (P0)</p><p className="text-3xl font-bold mt-1">{issues.filter(i=>i.priority==='P0').length}</p></Card>
                        <Card className="p-5 border-l-4 border-l-amber-500"><p className="text-sm text-slate-500">In Progress</p><p className="text-3xl font-bold mt-1">{issues.filter(i=>i.status==='In Progress').length}</p></Card>
                        <Card className="p-5 border-l-4 border-l-emerald-500"><p className="text-sm text-slate-500">Resolution Rate</p><p className="text-3xl font-bold mt-1">{Math.round((issues.filter(i=>i.status==='Resolved').length / issues.length) * 100 || 0)}%</p></Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <Card className="p-6 lg:col-span-1 h-[300px] flex flex-col">
                            <h3 className="font-semibold text-sm mb-4">Issues by Status</h3>
                            <div className="flex-1 relative w-full h-full"><canvas id="statusChart"></canvas></div>
                        </Card>
                        <Card className="p-0 lg:col-span-2 overflow-hidden flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                                <h3 className="font-semibold text-sm">Recent Reports requiring assignment</h3>
                                <a href="#/admin/issues" className="text-sm text-blue-600 hover:underline">View all</a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                        <tr><th className="px-4 py-3">Issue</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {issues.slice(0,5).map(issue => (
                                            <tr key={issue.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => window.location.hash = `#/issues/${issue.id}`}>
                                                <td className="px-4 py-3 font-medium text-slate-900">{issue.title}</td>
                                                <td className="px-4 py-3">{issue.category}</td>
                                                <td className="px-4 py-3"><PriorityBadge priority={issue.priority} /></td>
                                                <td className="px-4 py-3"><StatusBadge status={issue.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                 </MainLayout>
             )
        };

        const AdminIssuesList = () => {
            const { issues, departments } = useContext(DataContext);
            const [filterStatus, setFilterStatus] = useState('All');
            const [search, setSearch] = useState('');

            const filteredIssues = issues.filter(i => {
                const matchStatus = filterStatus === 'All' || i.status === filterStatus;
                const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase());
                return matchStatus && matchSearch;
            });

            return (
                <MainLayout>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-slate-900">Manage Issues</h1>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input type="text" placeholder="Search issues..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" value={search} onChange={e=>setSearch(e.target.value)} />
                            </div>
                            <Select options={['All', ...STATUSES]} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} />
                        </div>
                    </div>

                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                    <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Dept</th><th className="px-6 py-4">Priority</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredIssues.map(issue => (
                                        <tr key={issue.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => window.location.hash = `#/issues/${issue.id}`}>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{issue.id}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[200px]">{issue.title}</td>
                                            <td className="px-6 py-4">{issue.category}</td>
                                            <td className="px-6 py-4 text-slate-500">{departments.find(d=>d.id===issue.assigned_department_id)?.name || '-'}</td>
                                            <td className="px-6 py-4"><PriorityBadge priority={issue.priority} /></td>
                                            <td className="px-6 py-4"><StatusBadge status={issue.status} /></td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(issue.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredIssues.length === 0 && <div className="p-8 text-center text-slate-500">No issues found matching filters.</div>}
                        </div>
                    </Card>
                </MainLayout>
            );
        };

        const AdminIssueControls = ({ issue, departments }) => {
            const { assignIssue, updateIssueStatus } = useContext(DataContext);
            const [dept, setDept] = useState(issue.assigned_department_id || '');
            const [status, setStatus] = useState(issue.status);
            const [note, setNote] = useState('');

            const handleAssign = () => {
                if(dept) { assignIssue(issue.id, dept); ToastManager.add('Department assigned'); }
            };
            const handleUpdate = () => {
                updateIssueStatus(issue.id, status, note || `Admin updated status to ${status}`);
                setNote('');
                ToastManager.add('Status updated');
            };

            return (
                <Card className="p-5 border-blue-200 shadow-sm bg-blue-50/30">
                    <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2"><i className="ph ph-shield-check"></i> Admin Controls</h3>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-slate-200">
                            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Assignment</label>
                            <div className="flex gap-2">
                                <Select options={[{value:'', label:'Select Dept'}, ...departments.map(d=>({value:d.id, label:d.name}))]} value={dept} onChange={e=>setDept(e.target.value)} />
                                <Button onClick={handleAssign} disabled={!dept || dept === issue.assigned_department_id}>Assign</Button>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-slate-200">
                            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Status Override</label>
                            <Select options={STATUSES} value={status} onChange={e=>setStatus(e.target.value)} className="mb-2" />
                            <Textarea placeholder="Internal note or citizen message..." value={note} onChange={e=>setNote(e.target.value)} className="mb-2 min-h-[60px] text-sm" />
                            <Button onClick={handleUpdate} className="w-full" disabled={status === issue.status && !note}>Apply Update</Button>
                        </div>
                    </div>
                </Card>
            );
        };

        const OfficerDashboard = () => {
            const { user } = useContext(AuthContext);
            const { issues, departments } = useContext(DataContext);
            
            // In a real app, filter by assigned_officer_id OR department_id. Here we use department for demo.
            const assignedIssues = issues.filter(i => i.assigned_department_id === user.department_id && i.status !== 'Resolved');
            const myDept = departments.find(d => d.id === user.department_id);

            return (
                <MainLayout>
                    <div className="mb-8 border-b border-slate-200 pb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Officer Dashboard</h1>
                        <p className="text-slate-500">Department: {myDept?.name || 'Unknown'}</p>
                    </div>
                    
                    <h2 className="text-lg font-semibold mb-4">Active Tasks ({assignedIssues.length})</h2>
                    <div className="grid gap-4">
                        {assignedIssues.map(issue => (
                            <Card key={issue.id} className="p-5 border-l-4 flex flex-col md:flex-row gap-6 items-start" style={{borderLeftColor: issue.priority==='P0'?'#ef4444':issue.priority==='P1'?'#f97316':'#3b82f6'}}>
                                <div className="flex-1">
                                    <div className="flex gap-2 items-center mb-1">
                                        <h3 className="font-bold text-lg">{issue.title}</h3>
                                        <PriorityBadge priority={issue.priority} />
                                        <StatusBadge status={issue.status} />
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <i className="ph ph-map-pin"></i> {issue.address}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                    <Button onClick={() => window.location.hash = `#/issues/${issue.id}`}>Open Task</Button>
                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${issue.latitude},${issue.longitude}`} target="_blank" className="text-center text-sm text-blue-600 hover:underline">Get Directions</a>
                                </div>
                            </Card>
                        ))}
                        {assignedIssues.length === 0 && (
                            <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                                <i className="ph ph-check-circle text-4xl text-slate-300 mb-2 block"></i>
                                No active tasks assigned to your department.
                            </div>
                        )}
                    </div>
                </MainLayout>
            );
        };

        const OfficerIssueControls = ({ issue }) => {
            const { updateIssueStatus } = useContext(DataContext);
            const [note, setNote] = useState('');
            const [isResolving, setIsResolving] = useState(false);
            const [proofUrl, setProofUrl] = useState('https://placehold.co/600x400/10b981/ffffff?text=Resolution+Proof');

            const handleProgress = () => {
                updateIssueStatus(issue.id, 'In Progress', note || 'Work has started on this issue.');
                setNote('');
                ToastManager.add('Marked as In Progress');
            };

            const handleResolve = () => {
                if(!note) return ToastManager.add('Resolution note required', 'error');
                updateIssueStatus(issue.id, 'Resolved', note, proofUrl);
                setIsResolving(false);
                ToastManager.add('Issue Resolved successfully!');
            };

            if (issue.status === 'Resolved') return null;

            return (
                <Card className="p-5 border-indigo-200 shadow-sm bg-indigo-50/30">
                    <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2"><i className="ph ph-wrench"></i> Field Officer Actions</h3>
                    
                    <div className="space-y-3">
                        {issue.status !== 'In Progress' && (
                            <Button onClick={handleProgress} variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700">Acknowledge & Start Work</Button>
                        )}
                        
                        {issue.status === 'In Progress' && (
                            <Button onClick={() => setIsResolving(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500">Mark as Resolved <i className="ph ph-check-circle ml-2"></i></Button>
                        )}
                    </div>

                    <Modal isOpen={isResolving} onClose={() => setIsResolving(false)} title="Resolve Issue">
                        <div className="space-y-4 pt-2">
                            <p className="text-sm text-slate-600">Provide details about the resolution. This will be visible to the citizen.</p>
                            <Textarea label="Resolution Notes (Required)" placeholder="e.g. Pothole filled and sealed." value={note} onChange={e=>setNote(e.target.value)} />
                            <label className="block border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setProofUrl(reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                                <i className="ph ph-camera text-2xl text-slate-400 mb-1 block mx-auto"></i>
                                <p className="text-sm font-medium text-slate-600">Upload Proof Photo or PDF</p>
                                <img src={proofUrl} alt="Proof preview" className="mt-4 rounded-lg mx-auto max-h-32 object-cover border border-slate-200" />
                            </label>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="ghost" onClick={() => setIsResolving(false)}>Cancel</Button>
                                <Button onClick={handleResolve} className="bg-emerald-600 hover:bg-emerald-700">Confirm Resolution</Button>
                            </div>
                        </div>
                    </Modal>
                </Card>
            );
        };

        const PublicMapPage = () => {
            const { issues } = useContext(DataContext);
            return (
                <MainLayout>
                    <div className="mb-4 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">City Map</h1>
                            <p className="text-slate-500">View reported issues across the city.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Critical</span>
                            <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Medium</span>
                        </div>
                    </div>
                    <Card className="p-1 h-[70vh]">
                        <IssueMap issues={issues.filter(i=>!['Resolved', 'Rejected'].includes(i.status))} height="100%" readOnly />
                    </Card>
                </MainLayout>
            );
        };

        const AppRouter = () => {
            const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
            const { user } = useContext(AuthContext);

            useEffect(() => {
                const onHashChange = () => setCurrentPath(window.location.hash || '#/');
                window.addEventListener('hashchange', onHashChange);
                return () => window.removeEventListener('hashchange', onHashChange);
            }, []);

            // Protected Route Logic
            const requireAuth = (component, allowedRoles = null) => {
                if (!user) {
                    window.location.hash = '#/login';
                    return null;
                }
                if (allowedRoles && !allowedRoles.includes(user.role)) {
                     window.location.hash = user.role === 'ADMIN' ? '#/admin' : user.role === 'OFFICER' ? '#/officer' : '#/dashboard';
                     return null;
                }
                return component;
            };

            // Simple route matching
            if (currentPath === '#/') return <HomePage />;
            if (currentPath === '#/login') return <LoginPage />;
            if (currentPath === '#/issues') return <PublicMapPage />;
            
            if (currentPath.startsWith('#/issues/')) {
                const id = currentPath.split('/')[2];
                return <IssueDetail id={id} />;
            }

            if (currentPath === '#/dashboard') return requireAuth(<CitizenDashboard />, ['CITIZEN']);
            if (currentPath === '#/report') return requireAuth(<ReportIssueForm />, ['CITIZEN']);
            
            if (currentPath === '#/admin') return requireAuth(<AdminDashboard />, ['ADMIN']);
            if (currentPath === '#/admin/issues') return requireAuth(<AdminIssuesList />, ['ADMIN']);
            
            if (currentPath === '#/officer') return requireAuth(<OfficerDashboard />, ['OFFICER']);

            // 404 Fallback
            return (
                <MainLayout>
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <i className="ph ph-map-trifold text-6xl text-slate-300 mb-4"></i>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
                        <p className="text-slate-500 mb-6">The route you are looking for doesn't exist.</p>
                        <Button onClick={() => window.location.hash = '#/'}>Go Home</Button>
                    </div>
                </MainLayout>
            );
        };

        const App = () => (
            <AuthProvider>
                <DataProvider>
                    <AppRouter />
                </DataProvider>
            </AuthProvider>
        );

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);

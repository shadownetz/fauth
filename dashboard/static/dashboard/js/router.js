const routes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/dashboard/add-candidate',
        name: 'AddCandidate',
        component: AddCandidate
    },
    {
        path: '/dashboard/view-candidate',
        name: 'ViewCandidate',
        component: ViewCandidate
    },
    {
        path:'/dashboard/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path:'/dashboard/candidate-images/:id',
        name: 'ViewCandidateImages',
        component: candidateImages
    },
    {
        path:'/dashboard/admins',
        name: 'ViewAdmins',
        component: ViewAdmins
    },
    {
        path:'/dashboard/logs',
        name: 'ViewLogs',
        component: ViewLogs
    },
    {
        path:'/dashboard/settings',
        name: 'UserSettings',
        component: UserSettings
    },
];

const router = new VueRouter({
    mode: 'history',
    routes
});

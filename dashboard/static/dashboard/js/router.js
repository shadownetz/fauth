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
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

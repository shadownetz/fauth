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
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});
